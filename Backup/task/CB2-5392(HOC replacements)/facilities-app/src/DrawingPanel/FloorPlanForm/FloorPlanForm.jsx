import React, { Fragment, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Button, TextField, Typography, IconButton } from "@material-ui/core";
import { Cancel } from "@material-ui/icons";
import Dropzone from "react-dropzone";
import { FloorPlan } from "orion-components/Map/Layers";
import { Dialog } from "orion-components/CBComponents";
import { Translate, getTranslation } from "orion-components/i18n";
import { useDispatch, useSelector } from "react-redux";
import { floorPlanSelector } from "orion-components/Map/Selectors";
import {
	setMapTools,
	selectFloorPlan,
	openDialog, closeDialog,
	addImage,
	clearImage,
	removeFloorPlan,
	clearFloorPlan,
	addFloorPlan,
	toggleCreate,
	saveFloorPlan,
	updateFloorPlan,
	deleteFloorplan
} from "./floorPlanFormActions";


const FloorPlanForm = () => {
	const { appState } = useSelector(state => state);
	const { selectedFloor } = useSelector(state => floorPlanSelector(state));
	const { coordinates } = useSelector(state => floorPlanSelector(state));
	const { creating } = useSelector(state => floorPlanSelector(state));
	const selectedFloorPlan = selectedFloor;
	const dialog = appState.dialog.openDialog;
	const dispatch = useDispatch();

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
			dispatch(updateFloorPlan({ id: selectedFloorPlan.id, name }));
		} else {
			dispatch(saveFloorPlan({ name }));
		}
		handleClose();
	};
	const handleClose = () => {
		dispatch(setMapTools({ type: null }));
		handleRemove();
	};
	const handleUpload = file => {
		setFile(file[0]);
		dispatch(addImage(file[0]));
	};
	const handleRemove = () => {
		if (creating) {
			dispatch(toggleCreate());
		}
		setFile(null);
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
				placeholder={getTranslation("drawingPanel.floorPlanForm.fieldLabel.name")}
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
				<Button style={{ margin: "auto", width: "100%" }} color="secondary" onClick={() => dispatch(openDialog("floorPlanDeletionDialog"))} >
					<Translate value="drawingPanel.floorPlanForm.delete" />
				</Button>
			)}
			<Dialog
				open={dialog === "floorPlanDeletionDialog"}
				title={getTranslation("drawingPanel.floorPlanForm.dialog.title")}
				textContent={
					getTranslation("drawingPanel.floorPlanForm.dialog.confirmationText")
				}
				confirm={{
					action: () => {
						dispatch(closeDialog("floorPlanDeletionDialog"));
						handleClose();
						dispatch(deleteFloorplan(selectedFloorPlan.facilityId, selectedFloorPlan.id));
					},
					label: getTranslation("drawingPanel.floorPlanForm.dialog.confirm")
				}}
				abort={{
					action: () => {
						dispatch(closeDialog("floorPlanDeletionDialog"));
					},
					label: getTranslation("drawingPanel.floorPlanForm.dialog.cancel")
				}}
			/>
		</Fragment>
	);
};

export default FloorPlanForm;
