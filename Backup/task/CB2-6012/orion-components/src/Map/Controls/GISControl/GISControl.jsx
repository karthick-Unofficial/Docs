import React, { useState } from "react";
import PropTypes from "prop-types";
import { GISDialog, GISCollection } from "./components";
import { Typography, Button, List } from "@mui/material";
import { withStyles } from "@mui/styles";
import classNames from "classnames";
import map from "lodash/map";
import size from "lodash/size";
import { Translate } from "orion-components/i18n";
import { useDispatch } from "react-redux";

const styles = {
	text: {
		textTransform: "none",
		color: "#35b7f3",
		padding: 0,
		textAlign: "left",
		"&:hover": {
			backgroundColor: "transparent"
		}
	},
	label: {
		textTransform: "none"
	},
	textRTL: {
		textTransform: "none",
		color: "#35b7f3",
		padding: 0,
		textAlign: "right",
		"&:hover": {
			backgroundColor: "transparent"
		}
	}
};

const propTypes = {
	classes: PropTypes.object.isRequired,
	app: PropTypes.string.isRequired,
	gisData: PropTypes.object.isRequired,
	gisState: PropTypes.object,
	turnOffLayer: PropTypes.func,
	createService: PropTypes.func.isRequired,
	getLayers: PropTypes.func.isRequired,
	resetRequest: PropTypes.func.isRequired,
	updateVisibleGIS: PropTypes.func.isRequired,
	updateGISService: PropTypes.func.isRequired,
	deleteGISService: PropTypes.func.isRequired,
	dir: PropTypes.string,
	readOnly: PropTypes.bool
};

const defaultProps = {
	gisState: {},
	dir: "ltr",
	readOnly: false
};

const GISControl = ({
	gisData,
	getLayers,
	app,
	updateVisibleGIS,
	gisState,
	turnOffLayer,
	classes,
	createService,
	resetRequest,
	updateGISService,
	deleteGISService,
	dir,
	readOnly
}) => {
	const dispatch = useDispatch();

	const [open, setOpen] = useState(false);

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleLayerToggle = (serviceId, layerId, checked) => {
		dispatch(
			updateVisibleGIS(app, serviceId, {
				[`${serviceId}-${layerId}`]: checked
			})
		);

		if (checked) {
			dispatch(getLayers(serviceId, layerId));
		} else {
			turnOffLayer(serviceId, layerId);
		}
	};

	const { services, error, isFetching, success } = gisData;

	return (
		<div style={{ padding: 16 }}>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					marginBottom: 12
				}}
			>
				<Typography variant="subtitle1">
					<Translate value="global.map.controls.gisControl.main.title" />
				</Typography>
				{!readOnly && (
					<Button
						onClick={handleOpen}
						variant="text"
						className={classNames(classes.label, dir == "rtl" ? classes.textRTL : classes.text)}
						color="primary"
					>
						<Translate value="global.map.controls.gisControl.main.addNewService" />
					</Button>
				)}
			</div>
			{size(services) ? (
				<List>
					{map(services, (service) => (
						<GISCollection
							key={service.id}
							service={service}
							handleToggle={handleLayerToggle}
							serviceState={gisState[service.id]}
							updateGISService={updateGISService}
							deleteGISService={deleteGISService}
							dir={dir}
						/>
					))}
				</List>
			) : (
				<Typography style={{ color: "#828283", padding: 6 }} align="center">
					<Translate value="global.map.controls.gisControl.main.gisServices" />
				</Typography>
			)}
			<GISDialog
				open={open}
				error={error}
				success={success}
				isFetching={isFetching}
				createService={createService}
				resetRequest={resetRequest}
				handleClose={handleClose}
			/>
		</div>
	);
};

GISControl.propTypes = propTypes;
GISControl.defaultProps = defaultProps;

export default withStyles(styles)(GISControl);
