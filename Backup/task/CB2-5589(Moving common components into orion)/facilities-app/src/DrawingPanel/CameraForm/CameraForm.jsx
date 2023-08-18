import React, { Fragment, useState, useEffect } from "react";
import { Button, Typography, List } from "@mui/material";
import { facilityService } from "client-app-core";
import { CollectionItem } from "orion-components/CBComponents";
import isEmpty from "lodash/isEmpty";
import { Translate } from "orion-components/i18n";
import { useDispatch, useSelector } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";
import { setMapTools, attachCameraToFloorPlan } from "./cameraFormActions";
import { selectedContextSelector } from "orion-components/ContextPanel/Selectors";
import { floorPlanSelector } from "orion-components/Map/Selectors";
import { withStyles } from "@mui/styles";

const muiWithStyles = {
	disabled: {
		color: "#fff!important",
		opacity: "0.3"
	}
};

const styles = {
	controls: {
		display: "flex",
		align: "center",
		alignItems: "center",
		padding: 16,
		backgroundColor: "#242426"
	},
	wrapper: {
		padding: "8px 16px",
		height: "calc(100vh - 120px)"
	}
};


const CameraForm = ({ classes }) => {
	const context = useSelector(state => selectedContextSelector(state));
	const { feature } = useSelector(state => state.mapState.mapTools);
	const { selectedFloor } = useSelector(state => floorPlanSelector(state));
	const dir = useSelector(state => getDir(state));	

	const [cameras, setCameras] = useState([]);
	const [selectedCamera, setSelectedCamera] = useState({});
	const dispatch = useDispatch();

	const handleSave = () => {
		dispatch(attachCameraToFloorPlan(selectedFloor, selectedCamera));
		dispatch(setMapTools({ type: null }));
	};
	const handleCancel = () => {
		dispatch(setMapTools({ type: null }));
	};
	useEffect(() => {
		facilityService.getCamerasForPlacing((err, res) => {
			if (err) {
				console.log(err);
			} else {
				setCameras(res.result);
			}
		});
	}, [selectedFloor]);
	return (
		<Fragment>
			<div
				style={{
					display: "flex",
					alignItems: "center"
				}}
			>
				<Typography variant="h6">
					<span><Translate value="drawingPanel.cameraForm.addCamera" />{selectedFloor.name}</span>
				</Typography>
				<Button style={{ marginLeft: "auto" }} onClick={handleCancel}>
					<Translate value="drawingPanel.cameraForm.cancel" />
				</Button>
				<Button
					classes={{ disabled: classes.disabled }}
					onClick={handleSave}
					disabled={!feature || isEmpty(selectedCamera)}
				>
					<Translate value="drawingPanel.cameraForm.save" />
				</Button>
			</div>
			<div
				style={{
					overflowX: "scroll",
					padding: "16px 0px",
					height: "calc(100% - 62px)",
					color: "#fff"
				}}
			>
				<Typography component="p" variant="h6">
					<Translate value="drawingPanel.cameraForm.cameras" />
				</Typography>
				{cameras.length && (
					<List sx={{ color: "#fff" }}>
						{cameras.sort((a, b) => {
							if (a.name < b.name) {
								return -1;
							}
							if (a.name > b.name) {
								return 1;
							}
							return 0;
						})
							.map(camera => (
								<CollectionItem key={camera.id}
									primaryText={camera.name || camera.id.toUpperCase()}
									secondaryText={""}
									item={camera}
									handleSelect={() => setSelectedCamera(camera)}
									selected={camera.id === selectedCamera.id}
									dir={dir}
								/>
							))}
					</List>
				)}
			</div>
			) : (
			<div
				style={{
					...styles.wrapper,
					display: "flex",
					alignItems: "center"
				}}
			>
				<Typography variant="caption" color="textSecondary" align="center">
					<Translate value="drawingPanel.cameraForm.noCamera" />
				</Typography>
			</div>
			<Typography variant="caption">
				<Translate value="drawingPanel.cameraForm.clickToPlaceCam" />
			</Typography>
		</Fragment>
	);
};

export default withStyles(muiWithStyles)(CameraForm);