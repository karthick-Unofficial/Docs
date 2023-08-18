import React, { Fragment, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Button, Typography, List } from "@material-ui/core";
import { facilityService, accessPointService } from "client-app-core";
import { CollectionItem } from "orion-components/CBComponents";
import _ from "lodash";
import { Translate } from "orion-components/i18n/I18nContainer";

const propTypes = {
	setMapTools: PropTypes.func.isRequired,
	feature: PropTypes.object,
	selectedFloor: PropTypes.object,
	attachAccessPointToFloorPlan: PropTypes.func.isRequired,
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

const AccessPointForm = ({
	setMapTools,
	selectedFloor,
	attachAccessPointToFloorPlan,
	feature,
	dir
}) => {
	const [accessPoints, setAccessPoints] = useState([]);
	const [selectedAccessPoint, setSelectedAccessPoint] = useState({});

	const handleSave = () => {
		attachAccessPointToFloorPlan(selectedFloor, selectedAccessPoint);
		setMapTools({ type: null });
	};
	const handleCancel = () => {
		setMapTools({ type: null });
	};
	useEffect(() => {
		facilityService.getAccessPointsForPlacing((err, res) => {
			if (err) {
				console.log(err);
			} else {
				setAccessPoints(res.result);
				console.log("getAccessPointsForPlacing", res.result);
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
					<span><Translate value="drawingPanel.accessPointForm.addAccessPoint" count={selectedFloor.name}/></span>
				</Typography>
				<Button style={{ marginLeft: "auto" }} onClick={handleCancel}>
					<Translate value="drawingPanel.accessPointForm.cancel" />
				</Button>
				<Button
					color="primary"
					onClick={handleSave}
					disabled={!feature || _.isEmpty(selectedAccessPoint)}
				>
					<Translate value="drawingPanel.accessPointForm.save" />
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
					<Translate value="drawingPanel.accessPointForm.accessPoints" />
				</Typography>
				{accessPoints.length && (
					<List>
						{accessPoints.sort((a, b) => {
							if (a.name < b.name) {
								return -1;
							}
							if (a.name > b.name) {
								return 1;
							}
							return 0;
						})
							.map(accessPoint => (
								<CollectionItem key={accessPoint.id}
									primaryText={accessPoint.name || accessPoint.id.toUpperCase()}
									secondaryText={""}
									item={accessPoint}
									handleSelect={() => setSelectedAccessPoint(accessPoint)}
									selected={accessPoint.id === selectedAccessPoint.id}
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
					<Translate value="drawingPanel.accessPointForm.noAccessPoints" />
				</Typography>
			</div>
			<Typography variant="caption">
				<Translate value="drawingPanel.accessPointForm.clickToPlaceAP" />
			</Typography>
		</Fragment>
	);
};

AccessPointForm.propTypes = propTypes;
AccessPointForm.defaultProps = defaultProps;

export default AccessPointForm;
