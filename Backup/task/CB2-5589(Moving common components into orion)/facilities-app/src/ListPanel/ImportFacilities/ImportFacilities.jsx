import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { Button, TextField } from "@mui/material";
import { Dialog } from "orion-components/CBComponents";
import Dropzone from "react-dropzone";
import untar from "js-untar";
import { Translate, getTranslation } from "orion-components/i18n";
import { useDispatch, useSelector } from "react-redux";
import {
	createFacility,
	createFloorPlan,
	facilitiesImportDone
} from "./importFacilitiesActions";
import values from "lodash/values";
import orderBy from "lodash/orderBy";


const propTypes = {
	facilities: PropTypes.object,
	close: PropTypes.func.isRequired
};

const ImportFacilities = ({
	facilities,
	close
}) => {

	const facilitiesImportData = useSelector(state => state.facilitiesImportData);

	const [file, setFile] = useState(null);
	const [importDone, setImportDone] = useState(false);
	const setRerender = useState(0)[1];
	const importFacilitiesRef = useRef(null);
	const importIndexRef = useRef(0);
	const filesRef = useRef(null);
	const importStateRef = useRef({
		facilityName: null,
		facilityId: null,
		floorPlanName: null
	});
	const statusRef = useRef(null);
	const dispatch = useDispatch();


	const validateFacility = (facility) => {
		let errorMessage;
		if (!facility.entityData || !facility.entityData.properties) {
			errorMessage = getTranslation("listPanel.importFac.errorMessage.malformed");
		} else if (!facility.entityData.geometry || !facility.entityData.geometry.coordinates) {
			errorMessage = getTranslation("listPanel.importFac.errorMessage.missingGeo");
		} else if (!facility.entityData.properties.name) {
			errorMessage = getTranslation("listPanel.importFac.errorMessage.missingName");
		}
		return errorMessage;
	};

	const validateFloorPlan = (floorplan) => {
		let errorMessage;
		if (!floorplan.name) {
			errorMessage = getTranslation("listPanel.importFac.errorMessage.missingFloorPlanName");
		} else if (!floorplan.geometry || !floorplan.geometry.coordinates) {
			errorMessage = getTranslation("listPanel.importFac.errorMessage.missingFloorPlanGeo");
		} else if (!floorplan.order) {
			errorMessage = getTranslation("listPanel.importFac.errorMessage.missingFloorPlanOrder");
		} else if (!floorplan.image) {
			errorMessage = getTranslation("listPanel.importFac.errorMessage.missingFloorPlanImgName");
		} else if (!filesRef.current.find(containedFile =>
			containedFile.name.toLowerCase() === `images/${floorplan.image.toLowerCase()}`)) {
			errorMessage = getTranslation("listPanel.importFac.errorMessage.imageNotFound");
		}
		return errorMessage;
	};

	const importFacility = (facility) => {
		const facilityToAdd = {
			entityData: facility.entityData
		};
		facilityToAdd.entityData.properties.type = "Facility";
		dispatch(createFacility(facilityToAdd));
		importStateRef.current = {
			facility,
			facilityId: null,
			currentFloorPlanName: null
		};
	};

	const processFacility = () => {
		if (importIndexRef.current === importFacilitiesRef.current.length) {
			statusRef.current += "\nComplete!!!";
			setImportDone(true);
			dispatch(facilitiesImportDone());
			return;
		}

		const facilityToAdd = importFacilitiesRef.current[importIndexRef.current];
		const error = validateFacility(facilityToAdd);
		if (error) {
			statusRef.current = statusRef.current + `\n${error}`;
			setRerender(Math.random());

			importIndexRef.current++;
			processFacility();
			return;
		}
		let facilityStatus = `\nProcessing facility ${facilityToAdd.entityData.properties.name}...`;
		if (values(facilities).find(existingFacility =>
			existingFacility.entityData.properties.name.toLowerCase()
			=== facilityToAdd.entityData.properties.name.toLowerCase())) {
			facilityStatus += "\nFacility already exists. Skipping.";
			statusRef.current = statusRef.current + facilityStatus;
			setRerender(Math.random());

			importIndexRef.current++;
			processFacility();
		} else {
			statusRef.current = statusRef.current + facilityStatus;
			setRerender(Math.random());
			importFacility(facilityToAdd);
		}
	};

	const importFloorPlans = () => {
		const currentState = importStateRef.current;
		if (facilitiesImportData && facilitiesImportData.hasOwnProperty(currentState.facilityId) &&
			currentState.facility.floorPlans.length === facilitiesImportData[currentState.facilityId].length) {
			// Import complete. Load next facility
			importIndexRef.current++;
			processFacility();
			return;
		}

		const orderedFloorplans = orderBy(currentState.facility.floorPlans, "order", "asc");
		const index = facilitiesImportData && facilitiesImportData[currentState.facilityId]
			? facilitiesImportData[currentState.facilityId].length : 0;
		const floorPlan = orderedFloorplans[index];
		const error = validateFloorPlan(floorPlan);
		if (error) {
			statusRef.current = statusRef.current + `\n${error}\nSkipping remaining floor plans...`;
			setRerender(Math.random());

			importIndexRef.current++;
			processFacility();
			return;
		}

		currentState.currentFloorPlanName = floorPlan.name;

		const extractedFile = filesRef.current.find(containedFile =>
			containedFile.name.toLowerCase() === `images/${floorPlan.image.toLowerCase()}`);
		if (extractedFile) {
			const file = new File([extractedFile.blob], floorPlan.image, {
				type: "image/png"
			});
			delete floorPlan["image"];
			dispatch(createFloorPlan(currentState.facilityId, floorPlan, file));
		}
	};

	useEffect(() => {
		const currentState = importStateRef.current;
		if (facilities && currentState.facility && !currentState.facilityId) {
			const facility = values(facilities).find(existingFacility =>
				existingFacility.entityData.properties.name.toLowerCase()
				=== currentState.facility.entityData.properties.name.toLowerCase());
			if (facility) {
				statusRef.current += `\nFacility '${currentState.facility.entityData.properties.name}' Added. Importing floor plans...`;
				currentState.facilityId = facility.id;
				setRerender(Math.random());
				importFloorPlans();
			}
		}
	}, [facilities]);

	useEffect(() => {
		if (facilitiesImportData) {
			if (facilitiesImportData.error) {
				statusRef.current += `\nERROR: ${typeof (facilitiesImportData.error) === "string" ? facilitiesImportData.error : JSON.stringify(facilitiesImportData.error)}`;
				setRerender(Math.random());
			} else if (importStateRef.current && importStateRef.current.facilityId) {
				const facilityData = facilitiesImportData[importStateRef.current.facilityId];
				if (facilityData && facilityData.includes(importStateRef.current.currentFloorPlanName)) {
					// Floor plan has been created. We can move on to create the next floor plan
					statusRef.current += `\nFloor plan '${importStateRef.current.currentFloorPlanName}' Added`;
					setRerender(Math.random());
					importFloorPlans();
				}
			}
		}
	}, [facilitiesImportData]);

	const handleUpload = (file) => {
		setFile(file[0]);

		const reader = new FileReader();
		let binaryStr;
		reader.onabort = () => statusRef.current = "File reading was aborted";
		reader.onerror = () => statusRef.current = "File reading has failed";
		reader.onload = () => {
			binaryStr = reader.result;
			untar(binaryStr).then(async (extractedFiles) => { // onSuccess
				// Find the file 'Facilities.json' and load it
				const facilitiesConfig = extractedFiles.find(extractedFile =>
					extractedFile.name.toLowerCase() === "facilities.json");
				if (!facilitiesConfig) {
					statusRef.current = "Facilities.json not found in uploaded tar file. Cannot proceed.";
					setRerender(Math.random());
					return;
				}
				const facilitiesToAdd = facilitiesConfig.readAsJSON();
				statusRef.current = `${facilitiesToAdd.length} facilities to be loaded...`;
				setRerender(Math.random());

				importFacilitiesRef.current = facilitiesToAdd;
				importIndexRef.current = 0;
				filesRef.current = extractedFiles;
				setImportDone(false);

				processFacility();
			}, err => {
				statusRef.current = `Error: ${JSON.stringify(err)}`;
			});
		};
		reader.readAsArrayBuffer(file[0]);
	};

	return (
		<Dialog
			open={true}
			title={getTranslation("listPanel.importFac.dialog.title")}
			paperPropStyles={{ width: 500, height: `${file ? "400px" : "170px"}` }}
		>
			<div>
				{!file && (
					<Dropzone
						accept="application/x-tar"
						onDrop={acceptedFiles => handleUpload(acceptedFiles)}
					>
						{({ getRootProps, getInputProps }) => (
							<div {...getRootProps()}>
								<input {...getInputProps()} />
								<Button color="primary">
									<Translate value="listPanel.importFac.dialog.uploadFile" />
								</Button>
							</div>
						)}
					</Dropzone>
				)}
				{file &&
					<TextField
						id="importStatus"
						value={statusRef.current ? statusRef.current : ""}
						disabled={true}
						multiline={true}
						rows={15}
						rowsMax={15}
						variant="filled"
						fullWidth
					/>
				}
				<div
					style={{
						display: "flex",
						alignItems: "center",
						marginTop: 20
					}}
				>
					<Button style={{ marginLeft: "auto" }} onClick={close}>
						<Translate value="listPanel.importFac.dialog.cancel" />
					</Button>
					{importDone &&
						<Button color="primary" onClick={close}>
							<Translate value="listPanel.importFac.dialog.close" /></Button>
					}
				</div>
			</div>
		</Dialog >
	);
};

ImportFacilities.propTypes = propTypes;

export default ImportFacilities;
