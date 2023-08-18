import React, { Fragment, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Button, TextField, Typography, IconButton } from "@material-ui/core";
import { Cancel } from "@material-ui/icons";
import Dropzone from "react-dropzone";
import { FloorPlan } from "orion-components/Map/Layers";
import { Dialog } from "orion-components/CBComponents";
import { Translate } from "orion-components/i18n/I18nContainer";
import { renderToStaticMarkup } from "react-dom/server";

const propTypes = {
	setMapTools: PropTypes.func.isRequired,
	selectedFloorPlan: PropTypes.object,
	context: PropTypes.object,
	addImage: PropTypes.func.isRequired,
	clearFloorPlan: PropTypes.func.isRequired,
	saveFloorPlan: PropTypes.func.isRequired,
	coordinates: PropTypes.array,
	selectFloorPlan: PropTypes.func.isRequired,
	updateFloorPlan: PropTypes.func.isRequired,
	toggleCreate: PropTypes.func,
	creating: PropTypes.bool,
	openDialog: PropTypes.func,
	closeDialog: PropTypes.func,
	dialog: PropTypes.string,
	deleteFloorplan: PropTypes.func,
	clearImage: PropTypes.func
};

const defaultProps = {
	selectedFloorPlan: null,
	context: null,
	coordinates: null
};

const FloorPlanForm = ({
	setMapTools,
	dialog,
	closeDialog,
	openDialog,
	deleteFloorplan,
	addImage,
	saveFloorPlan,
	selectedFloorPlan,
	coordinates,
	creating,
	clearImage,
	toggleCreate,
	updateFloorPlan
}) => {
	const [file, setFile] = useState(
		selectedFloorPlan && !creating ? `/_download?handle=${selectedFloorPlan.handle}` : null
	);
	const [name, setName] = useState("");
	useEffect(() => {
		if (selectedFloorPlan && !creating) {
			setName(selectedFloorPlan.name);
		}
		return () => {
			setName("");
		};
	}, [selectedFloorPlan, creating]);
	const handleChange = e => {
		setName(e.target.value);
	};
	const handleSave = () => {
		if (selectedFloorPlan && !creating) {
			updateFloorPlan({ id: selectedFloorPlan.id, name });
		} else {
			saveFloorPlan({ name });
		}
		handleClose();
	};
	const handleClose = () => {
		setMapTools({ type: null });
		handleRemove();
	};
	const handleUpload = file => {
		setFile(file[0]);
		addImage(file[0]);
	};
	const handleRemove = () => {
		if (creating) {
			toggleCreate();
		}
		setFile(null);
	};
	const placeholderConverter = (value) => {
		const placeholderTxt = renderToStaticMarkup(<Translate value={value} />);
		let placeholderString = placeholderTxt.toString().replace(/<\/?[^>]+(>|$)/g, "");
		return placeholderString;
	};
	return (
		<Fragment>
			<div
				style={{
					display: "flex",
					alignItems: "center"
				}}
			>
				<Typography variant="h6">{selectedFloorPlan && !creating ? <Translate value="drawingPanel.floorPlanForm.editFloorPlan" /> : <Translate value="drawingPanel.floorPlanForm.createFloorPlan" />}</Typography>
				<Button style={{ marginLeft: "auto" }} onClick={handleClose}>
					<Translate value="drawingPanel.floorPlanForm.cancel" />
				</Button>
				<Button color="primary" onClick={handleSave} disabled={!name || !file}>
					<Translate value="drawingPanel.floorPlanForm.save" />
				</Button>
			</div>
			<TextField
				id="floor-plan-name"
				value={name}
				onChange={handleChange}
				placeholder={placeholderConverter("drawingPanel.floorPlanForm.fieldLabel.name")}
				required={true}
				variant="filled"
				fullWidth
				margin="normal"
			/>
			{!file && (
				<Dropzone
					accept="image/*"
					onDrop={acceptedFiles => handleUpload(acceptedFiles)}
				>
					{({ getRootProps, getInputProps }) => (
						<div {...getRootProps()}>
							<input {...getInputProps()} />
							<Button color="primary"><Translate value="drawingPanel.floorPlanForm.uploadFloorPlan" /></Button>
						</div>
					)}
				</Dropzone>
			)}
			{!!file && (
				<div
					style={{
						padding: "8px 0",
						display: "flex",
						alignItems: "center"
					}}
				>
					<img
						style={{ width: "75%", border: "1px solid #B5B9BE" }}
						src={typeof file === "string" ? file : URL.createObjectURL(file)}
					/>
					<IconButton onClick={handleRemove}>
						<Cancel />
					</IconButton>
					{selectedFloorPlan && !creating ? (
						<FloorPlan
							id={selectedFloorPlan.id}
							coordinates={
								coordinates || selectedFloorPlan.geometry.coordinates[0]
							}
						/>
					) : (
						<FloorPlan id="new-floorplan" />
					)}
				</div>
			)}
			{!creating && selectedFloorPlan && (
				<Button style={{ margin: "auto", width: "100%" }} color="secondary" onClick={() => openDialog("floorPlanDeletionDialog")} >
					<Translate value="drawingPanel.floorPlanForm.delete" />
				</Button>
			)}
			<Dialog
				open={dialog === "floorPlanDeletionDialog"}
				title={<Translate value="drawingPanel.floorPlanForm.dialog.title" />}
				textContent={
					<Translate value="drawingPanel.floorPlanForm.dialog.confirmationText" />
				}
				confirm={{
					action: () => {
						closeDialog("floorPlanDeletionDialog");
						handleClose();
						deleteFloorplan(selectedFloorPlan.facilityId, selectedFloorPlan.id);
					},
					label: <Translate value="drawingPanel.floorPlanForm.dialog.confirm" />
				}}
				abort={{
					action: () => {
						closeDialog("floorPlanDeletionDialog");
					},
					label: <Translate value="drawingPanel.floorPlanForm.dialog.cancel" />
				}}
			/>
		</Fragment>
	);
};

FloorPlanForm.propTypes = propTypes;
FloorPlanForm.defaultProps = defaultProps;

export default FloorPlanForm;
