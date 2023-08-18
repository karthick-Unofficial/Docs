import React, { Fragment, useState, useEffect } from "react";
import { Button, Typography, List } from "@mui/material";
import { facilityService } from "client-app-core";
import { CollectionItem } from "orion-components/CBComponents";
import isEmpty from "lodash/isEmpty";
import { Translate } from "orion-components/i18n";
import { useDispatch, useSelector } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";

import { attachAccessPointToFloorPlan, setMapTools } from "./accessPointFormActions";
import { selectedContextSelector } from "orion-components/ContextPanel/Selectors";
import { floorPlanSelector } from "orion-components/Map/Selectors";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
	disabled: {
		color: "#fff!important",
		opacity: "0.3"
	}
});

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

const AccessPointForm = () => {
	const classes = useStyles();

	const context = useSelector(state => selectedContextSelector(state));
	const { feature } = useSelector(state => state.mapState.mapTools);
	const { selectedFloor } = useSelector(state => floorPlanSelector(state));
	const dir = useSelector(state => getDir(state));

	const [accessPoints, setAccessPoints] = useState([]);
	const [selectedAccessPoint, setSelectedAccessPoint] = useState({});
	const dispatch = useDispatch();

	const handleSave = () => {
		dispatch(attachAccessPointToFloorPlan(selectedFloor, selectedAccessPoint));
		dispatch(setMapTools({ type: null }));
	};
	const handleCancel = () => {
		dispatch(setMapTools({ type: null }));
	};
	useEffect(() => {
		facilityService.getAccessPointsForPlacing((err, res) => {
			if (err) {
				console.log(err);
			} else {
				setAccessPoints(res.result);
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
					<span><Translate value="drawingPanel.accessPointForm.addAccessPoint" count={selectedFloor.name} /></span>
				</Typography>
				<Button style={{ marginLeft: "auto" }} onClick={handleCancel}>
					<Translate value="drawingPanel.accessPointForm.cancel" />
				</Button>
				<Button
					color="primary"
					onClick={handleSave}
					disabled={!feature || isEmpty(selectedAccessPoint)}
					classes={{ disabled: classes.disabled }}
				>
					<Translate value="drawingPanel.accessPointForm.save" />
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

export default AccessPointForm;
