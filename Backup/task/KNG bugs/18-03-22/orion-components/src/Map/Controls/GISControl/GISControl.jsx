import React, { Component } from "react";
import PropTypes from "prop-types";
import { GISDialog, GISCollection } from "./components";
import { Typography, Button, List } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import _ from "lodash";
import { Translate } from "orion-components/i18n/I18nContainer";

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

class GISControl extends Component {
	constructor(props) {
		super(props);
		this.state = { open: false };
	}

	handleOpen = () => {
		this.setState({ open: true });
	};

	handleClose = () => {
		this.setState({ open: false });
	};

	handleLayerToggle = (serviceId, layerId) => {
		const { gisData, getLayers, app, updateVisibleGIS, gisState, turnOffLayer } = this.props;
		const { layers } = gisData;
		const sState = gisState[serviceId];
		/**
		 * Prevent duplicate layer IDs being added to state.
		 * IDs for any services' layers are numbered sequentially,
		 * therefore when a layer's data is saved to state, it is with
		 * a unique ID created from the service and layer ID
		 */
		const uniqueLayerId = `${serviceId}-${layerId}`;
		let update;
		if (
			!layers[uniqueLayerId] ||
			(!sState || (sState && !sState[uniqueLayerId]))
		) {
			getLayers(serviceId, layerId);
			update = { ...(sState || {}), [uniqueLayerId]: true };
		} else if (layers[uniqueLayerId] && sState && sState[uniqueLayerId]) {
			update = { ...sState, [uniqueLayerId]: false };
			turnOffLayer(serviceId, layerId);
		}
		if (app && update) updateVisibleGIS(app, serviceId, update);
	};

	render() {
		const {
			classes,
			gisData,
			gisState,
			createService,
			resetRequest,
			updateGISService,
			deleteGISService,
			dir,
			readOnly
		} = this.props;
		const { open } = this.state;
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
					<Typography variant="subtitle1"><Translate value="global.map.controls.gisControl.main.title"/></Typography>
					{!readOnly &&
						<Button
							onClick={this.handleOpen}
							variant="text"
							className={classNames(classes.label, dir == "rtl" ? classes.textRTL : classes.text)}
							color="primary"
						>
							<Translate value="global.map.controls.gisControl.main.addNewService"/>
						</Button>
					}
				</div>
				{_.size(services) ? (
					<List>
						{_.map(services, service => (
							<GISCollection
								key={service.id}
								service={service}
								handleToggle={this.handleLayerToggle}
								serviceState={gisState[service.id]}
								updateGISService={updateGISService}
								deleteGISService={deleteGISService}
								dir={dir}
							/>
						))}
					</List>
				) : (
					<Typography style={{ color: "#828283", padding: 6 }} align="center">
						<Translate value="global.map.controls.gisControl.main.gisServices"/>
					</Typography>
				)}
				<GISDialog
					open={open}
					error={error}
					success={success}
					isFetching={isFetching}
					createService={createService}
					resetRequest={resetRequest}
					handleClose={this.handleClose}
				/>
			</div>
		);
	}
}

GISControl.propTypes = propTypes;
GISControl.defaultProps = defaultProps;

export default withStyles(styles)(GISControl);
