import React, { Fragment, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Button, Typography, List, ListItem } from "@material-ui/core";
import { facilityService } from "client-app-core";
import { CollectionItem } from "orion-components/CBComponents";
import _ from "lodash";
import { Translate } from "orion-components/i18n/I18nContainer";

const propTypes = {
	setMapTools: PropTypes.func.isRequired,
	feature: PropTypes.object,
	selectedFloor: PropTypes.object,
	attachCameraToFloorPlan: PropTypes.func.isRequired,
	dir: PropTypes.string
};

const defaultProps = {
	feature: null,
	context: null
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

const CameraForm = ({
	setMapTools,
	selectedFloor,
	attachCameraToFloorPlan,
	feature,
	dir
}) => {
	const [cameras, setCameras] = useState([]);
	const [selectedCamera, setSelectedCamera] = useState({});

	const handleSave = () => {
		attachCameraToFloorPlan(selectedFloor, selectedCamera);
		setMapTools({ type: null });
	};
	const handleCancel = () => {
		setMapTools({ type: null });
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
					color="primary"
					onClick={handleSave}
					disabled={!feature || _.isEmpty(selectedCamera)}
				>
					<Translate value="drawingPanel.cameraForm.save" />
				</Button>
			</div>
			<div
				style={{
					overflowX: "scroll",
					padding: "16px 0px",
					height: "calc(100% - 62px)"
				}}
			>
				<Typography component="p" variant="h6">
					<Translate value="drawingPanel.cameraForm.cameras" />
				</Typography>
				{cameras.length && (
					<List>
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

CameraForm.propTypes = propTypes;
CameraForm.defaultProps = defaultProps;

export default CameraForm;
