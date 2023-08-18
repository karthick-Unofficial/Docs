import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { eventService } from "client-app-core";
import { IconButton, Typography, Button } from "@mui/material";
import Expand from "@mui/icons-material/ZoomOutMap";
import ProximityDialog from "./components/ProximityDialog";
import ProximityCard from "./components/ProximityCard";
import { Translate, getTranslation } from "orion-components/i18n";
import { useDispatch } from "react-redux";
import { getWidgetState, isWidgetLaunchableAndExpandable } from "orion-components/Profiles/Selectors";
import { useSelector } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";
import { openDialog, closeDialog } from "orion-components/AppState/Actions";

const propTypes = {
	selected: PropTypes.bool,
	expanded: PropTypes.bool,
	canManage: PropTypes.bool,
	event: PropTypes.object.isRequired,
	widgetsExpandable: PropTypes.bool,
	contextId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	context: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
	eventEnded: PropTypes.bool,
	readOnly: PropTypes.bool,
	loadProfile: PropTypes.func,
	selectWidget: PropTypes.func,
	startProximityEntitiesStream: PropTypes.func,
	unsubscribeFromFeed: PropTypes.func,
	subscriberRef: PropTypes.string,
	dir: PropTypes.string,
	forReplay: PropTypes.bool
};

const defaultProps = {
	selected: false,
	expanded: false,
	widgetsExpandable: false,
	openDialog: null,
	closeDialog: null,
	eventEnded: null,
	readOnly: false,
	loadProfile: null,
	selectWidget: null,
	startProximityEntitiesStream: null,
	unsubscribeFromFeed: null,
	subscriberRef: "",
	dir: "ltr",
	forReplay: false
};

const ProximityWidget = ({
	selected,
	expanded,
	canManage,
	event,
	contextId,
	context,
	eventEnded,
	readOnly,
	loadProfile,
	selectWidget,
	startProximityEntitiesStream,
	unsubscribeFromFeed,
	subscriberRef,
	forReplay,
	id
}) => {
	const dispatch = useDispatch();

	const enabled = useSelector((state) => getWidgetState(state)(id, "enabled"));
	const dir = useSelector((state) => getDir(state));
	const launchableAndExpandable = useSelector((state) => isWidgetLaunchableAndExpandable(state));
	const { widgetsExpandable } = launchableAndExpandable;
	const dialog = useSelector((state) => state.appState?.dialog?.openDialog || "");

	const [proximity, setProximity] = useState({
		distanceUnits: "mi",
		lineType: "Solid",
		lineWidth: 3,
		name: "",
		polyFill: "#0073c8",
		polyFillOpacity: 0.2,
		polyStroke: "#2face8",
		radius: ""
	});
	const [isEditing, setIsEditing] = useState(false);
	const [selectedProximityId, setSelectedProximityId] = useState("");

	useEffect(() => {
		if (!forReplay) {
			dispatch(unsubscribeFromFeed(contextId, "proximityEntities", subscriberRef));
			if (context.proximityEntities && context.proximityEntities.length > 0) {
				context.proximityEntities = [];
			}
			if (event.proximities && event.proximities.length > 0) {
				const radiuses = [];
				for (const proximity of event.proximities) {
					const radiusInKM =
						proximity.distanceUnits === "mi"
							? proximity.radius * 1.609344
							: proximity.distanceUnits === "m"
								? proximity.radius / 1000
								: proximity.distanceUnits === "ft"
									? proximity.radius / 3280.84
									: proximity.radius;
					radiuses.push(Number(radiusInKM));
				}
				radiuses.sort(function (a, b) {
					return a - b;
				});
				dispatch(startProximityEntitiesStream(contextId, event.entityData.geometry, radiuses, subscriberRef));
			}
		}
	}, [event.proximities]);

	const handleOpenDialog = () => {
		setIsEditing(false);
		setProximity((prevProximity) => ({
			...prevProximity,
			distanceUnits: "mi",
			lineType: "Solid",
			lineWidth: 3,
			name: "",
			polyFill: "#0073c8",
			polyFillOpacity: 0.2,
			polyStroke: "#2face8",
			radius: ""
		}));
		dispatch(openDialog("proximityDialog"));
	};

	const handleExpand = () => {
		dispatch(selectWidget("Proximity"));
	};

	const handleLoadEntityDetails = (item) => {
		dispatch(loadProfile(item.id, item.entityData.properties.name, item.entityType, "profile", "secondary"));
	};

	const handleRemoveProximity = (proximityId) => {
		eventService.deleteProximity(contextId, proximityId, (err, response) => {
			if (err) console.log(err, response);
		});
	};

	const handleEditProximity = (proximityId) => {
		const proximity = event.proximities.find((x) => x.id === Number(proximityId));
		setIsEditing(true);
		setSelectedProximityId(proximityId);
		setProximity({
			...proximity,
			distanceUnits: proximity.distanceUnits,
			lineType: proximity.lineType,
			lineWidth: proximity.lineWidth,
			name: proximity.name,
			polyFill: proximity.polyFill,
			polyFillOpacity: proximity.polyFillOpacity,
			polyStroke: proximity.polyStroke,
			radius: proximity.radius
		});
		dispatch(openDialog("proximityDialog"));
	};

	const handleChangeName = (event) => {
		setProximity({
			...proximity,
			name: event.target.value
		});
	};

	const handleChangeRadius = (event) => {
		const re = /^\d*\.?\d*$/;
		if (event.target.value === "" || re.test(event.target.value)) {
			setProximity({
				...proximity,
				radius: event.target.value
			});
		}
	};

	const handleChangeDistanceUnits = (event) => {
		setProximity({
			...proximity,
			distanceUnits: event.target.value
		});
	};

	const handleChangeLineType = (value) => {
		setProximity({
			...proximity,
			lineType: value
		});
	};

	const handleChangeLineWidth = (value) => {
		setProximity({
			...proximity,
			lineWidth: value
		});
	};

	const handleChangePolyFill = (value) => {
		setProximity({
			...proximity,
			polyFill: value
		});
	};

	const handleChangePolyFillOpacity = (value) => {
		setProximity({
			...proximity,
			polyFillOpacity: value / 100
		});
	};

	const handleChangePolyStroke = (value) => {
		setProximity({
			...proximity,
			polyStroke: value
		});
	};

	let canCreateProximityArea = false;
	let canEditItems = false;
	let canRemoveItems = false;
	if (canManage) {
		canCreateProximityArea = true;
		canEditItems = true;
		canRemoveItems = true;
	}

	return selected || !enabled ? (
		<div />
	) : (
		<div className={`widget-wrapper ${expanded ? "expanded" : "collapsed"}`}>
			{!expanded && !readOnly && (
				<div className="widget-header">
					<div className="cb-font-b2">
						<Translate value="global.profiles.widgets.proximity.main.title" />
					</div>
					{canCreateProximityArea && !eventEnded && (
						<Button variant="text" color="primary" onClick={handleOpenDialog}>
							{getTranslation("global.profiles.widgets.proximity.main.createProxZone")}
						</Button>
					)}
					{widgetsExpandable ? (
						<div className="widget-expand-button">
							<IconButton
								style={{
									width: "auto",
									...(dir === "rtl" && { paddingLeft: 0 }),
									...(dir === "ltr" && { paddingRight: 0 })
								}}
								onClick={handleExpand}
							>
								<Expand />
							</IconButton>
						</div>
					) : null}
				</div>
			)}
			<div className="widget-content">
				{event.proximities && event.proximities.length > 0 ? (
					event.proximities.map((proximity) => {
						return (
							<ProximityCard
								key={proximity.id}
								proximity={proximity}
								event={event}
								canEdit={canEditItems}
								canRemove={canRemoveItems}
								handleEdit={() => handleEditProximity(proximity.id)}
								handleRemove={() => handleRemoveProximity(proximity.id)}
								loadProfile={loadProfile}
								handleLoadEntityDetails={handleLoadEntityDetails}
								widgetExpanded={expanded}
								entities={context && context.proximityEntities ? context.proximityEntities : []}
							/>
						);
					})
				) : (
					<Typography style={{ padding: 12 }} align="center" variant="caption" component="p">
						<Translate value="global.profiles.widgets.proximity.main.noAssocProx" />
					</Typography>
				)}
			</div>
			<div>
				<ProximityDialog
					closeDialog={closeDialog}
					dialog={dialog}
					contextId={contextId}
					event={event}
					isEditing={isEditing}
					proximityId={selectedProximityId}
					name={proximity.name}
					radius={proximity.radius}
					distanceUnits={proximity.distanceUnits}
					fillColor={proximity.polyFill}
					strokeColor={proximity.polyStroke}
					strokeThickness={proximity.lineWidth}
					strokeType={proximity.lineType}
					transparency={proximity.polyFillOpacity * 100}
					handleChangeName={handleChangeName}
					handleChangeRadius={handleChangeRadius}
					handleChangeDistanceUnits={handleChangeDistanceUnits}
					handleChangeLineType={handleChangeLineType}
					handleChangeLineWidth={handleChangeLineWidth}
					handleChangePolyFill={handleChangePolyFill}
					handleChangePolyFillOpacity={handleChangePolyFillOpacity}
					handleChangePolyStroke={handleChangePolyStroke}
					dir={dir}
				/>
			</div>
		</div>
	);
};

ProximityWidget.propTypes = propTypes;
ProximityWidget.defaultProps = defaultProps;

export default ProximityWidget;
