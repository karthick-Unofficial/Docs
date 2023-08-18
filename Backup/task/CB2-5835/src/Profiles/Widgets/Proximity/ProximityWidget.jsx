import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { eventService } from "client-app-core";
import { IconButton, Typography, SvgIcon } from "@mui/material";
import Expand from "@mui/icons-material/ZoomOutMap";
import ProximityDialog from "./components/ProximityDialog";
import ProximityCard from "./components/ProximityCard";
import { Translate } from "orion-components/i18n";
import { useDispatch } from "react-redux";
import { getWidgetState } from "orion-components/Profiles/Selectors";
import { useSelector } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";
import { openDialog, closeDialog } from "orion-components/AppState/Actions";
import { loadProfile } from "orion-components/ContextPanel/Actions";
import { unsubscribeFromFeed, startProximityEntitiesStream } from "orion-components/ContextualData/Actions";
import { getSelectedContextData } from "orion-components/Profiles/Selectors";
import { mdiExpandAll, mdiCollapseAll } from "@mdi/js";
import { getGlobalWidgetState } from "../Selectors";
import WidgetMenu from "./components/WidgetMenu";

const propTypes = {
	selected: PropTypes.bool,
	expanded: PropTypes.bool,
	canManage: PropTypes.bool,
	widgetsExpandable: PropTypes.bool,
	contextId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	eventEnded: PropTypes.bool,
	readOnly: PropTypes.bool,
	selectWidget: PropTypes.func,
	subscriberRef: PropTypes.string,
	dir: PropTypes.string,
	forReplay: PropTypes.bool,
	id: PropTypes.string
};

const defaultProps = {
	selected: false,
	expanded: false,
	widgetsExpandable: false,
	eventEnded: null,
	readOnly: false,
	selectWidget: null,
	subscriberRef: "",
	dir: "ltr",
	forReplay: false
};

const widgetName = "proximity";

const ProximityWidget = ({
	selected,
	expanded,
	canManage,
	contextId,
	eventEnded,
	readOnly,
	selectWidget,
	subscriberRef,
	forReplay,
	id,
	widgetsExpandable
}) => {
	const dispatch = useDispatch();

	const enabled = useSelector((state) => expanded || getWidgetState(state)(id, "enabled"));
	const dir = useSelector((state) => getDir(state));
	const dialog = useSelector((state) => state.appState?.dialog?.openDialog || "");
	let proximityEntities = useSelector((state) => getSelectedContextData(state)(contextId, "proximityEntities")) || [];
	const event = useSelector((state) => getSelectedContextData(state)(contextId, "entity")) || [];
	const widgetState = useSelector((state) => getGlobalWidgetState(state)(widgetName)) || {};
	const [childKey, setChildKey] = useState(0); //Used for forcibly updating the proximity card child component when the same collapse value is required to be passed as a prop.

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
	const [collapsed, setCollapsed] = useState(!widgetState?.autoExpand);
	const [tempCollapsed, setTempCollapsed] = useState(null);
	const [expandedChildren, setExpandedChildren] = useState([]);
	const [triggered, setTriggered] = useState(false);

	useEffect(() => {
		if (!forReplay) {
			dispatch(unsubscribeFromFeed(contextId, "proximityEntities", subscriberRef));
			if (proximityEntities && proximityEntities.length > 0) {
				proximityEntities = [];
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

	const handleProximityCardCollapseAndExpand = (proximityId, isExpanded) => {
		if (!triggered) {
			setTriggered(true);
		}

		if (expandedChildren.includes(proximityId) || !isExpanded) {
			const latestExpanded = expandedChildren.filter((value) => value !== proximityId);
			setExpandedChildren(latestExpanded);
		} else {
			if (!expandedChildren.includes(proximityId) && isExpanded) {
				setExpandedChildren([...expandedChildren, proximityId]);
			}
		}
	};

	useEffect(() => {
		if (triggered) {
			if (expandedChildren.length > 0) {
				const { proximities } = event;
				if (proximities.length === expandedChildren.length) {
					setCollapsed(false);
					setTempCollapsed(null);
				} else {
					// Setting temporary collapse here when the proximities are not completely collapsed or expanded.
					// Another reason for using temporary collapse is that it will not be passed to the proximity card component, while the collapsed `useState` variable or hook will be passed.
					setTempCollapsed(true);
				}
			} else {
				if (!collapsed) {
					setCollapsed(!collapsed);
				}
			}
		}
	}, [expandedChildren, triggered]);

	useEffect(() => {
		if (!collapsed) {
			setTempCollapsed(null);
			const { proximities } = event;
			const proximityChildren = proximities.map((element) => element.id);
			setExpandedChildren(proximityChildren);
		} else {
			setTempCollapsed(null);
			setExpandedChildren([]);
		}
	}, [collapsed]);

	let canCreateProximityArea = false;
	let canEditItems = false;
	let canRemoveItems = false;
	if (canManage) {
		canCreateProximityArea = true;
		canEditItems = true;
		canRemoveItems = true;
	}

	const styles = {
		svgIcon: {
			width: "24px",
			height: "24px",
			color: "#FCFDFD",
			cursor: "pointer",
			...(dir === "rtl" && { marginLeft: "2.5%" }),
			...(dir === "ltr" && { marginRight: "2.5%" })
		}
	};

	return selected || !enabled ? (
		<div />
	) : (
		<div className={`widget-wrapper ${expanded ? "expanded" : "collapsed"}`}>
			{!expanded && !readOnly && (
				<div className="widget-header">
					<SvgIcon
						style={styles.svgIcon}
						onClick={() => {
							if (tempCollapsed) {
								setCollapsed(false);
								setTempCollapsed(null);
								setChildKey(childKey + 1);
							} else {
								setCollapsed(!collapsed);
							}
						}}
					>
						{tempCollapsed === null && <path d={collapsed ? mdiExpandAll : mdiCollapseAll} />}
						{tempCollapsed !== null && <path d={tempCollapsed ? mdiExpandAll : mdiCollapseAll} />}
					</SvgIcon>
					<div className="cb-font-b2">
						<Translate value="global.profiles.widgets.proximity.main.title" />
					</div>

					<div className="widget-header-buttons">
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
						<WidgetMenu
							dir={dir}
							createProximity={handleOpenDialog}
							canCreateProximityArea={canCreateProximityArea}
							eventEnded={eventEnded}
							collapsed={collapsed}
							widgetState={widgetState}
							widgetName={widgetName}
						/>
					</div>
				</div>
			)}
			<div className="widget-content">
				{event.proximities && event.proximities.length > 0 ? (
					event.proximities.map((proximity) => {
						return (
							<ProximityCard
								key={proximity.id + childKey}
								id={proximity.id}
								proximity={proximity}
								event={event}
								canEdit={canEditItems}
								canRemove={canRemoveItems}
								handleEdit={() => handleEditProximity(proximity.id)}
								handleRemove={() => handleRemoveProximity(proximity.id)}
								loadProfile={loadProfile}
								handleLoadEntityDetails={handleLoadEntityDetails}
								widgetExpanded={expanded}
								entities={proximityEntities ? proximityEntities : []}
								collapsed={collapsed}
								handleCollapseAndExpand={handleProximityCardCollapseAndExpand}
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
