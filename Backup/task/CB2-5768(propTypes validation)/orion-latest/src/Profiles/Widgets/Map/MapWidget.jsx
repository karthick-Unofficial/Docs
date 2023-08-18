import React from "react";
import { BaseWidget } from "../shared";
import { Map } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { getWidgetState } from "orion-components/Profiles/Selectors";
import { getDir } from "orion-components/i18n/Config/selector";
import PropTypes from "prop-types";
import { mapState } from "orion-components/AppState/Selectors";
import { getTranslation } from "orion-components/i18n";

const propTypes = {
	id: PropTypes.string,
	selectWidget: PropTypes.string,
	entityType: PropTypes.string
};
const getMapStatus = (appId, entityType) => {
	switch (`${appId}_${entityType}`) {
		case "map-app_camera":
		case "map-app_entity":
		case "map-app_event":
			return true;
		default:
			return false;
	}
};

const getTitle = (entityType) => {
	switch (entityType) {
		case "camera":
			return getTranslation("global.profiles.cameraProfile.mapLocationFOV");
		case "event":
			return getTranslation("global.profiles.eventProfile.main.mapPlanner");
		default:
			return null;
	}
};

const MapWidget = ({ id, selectWidget, entityType }) => {
	const dispatch = useDispatch();

	const enabled = useSelector((state) => getWidgetState(state)(id, "enabled"));
	const dir = useSelector((state) => getDir(state));
	const mapStatus = useSelector((state) => mapState(state));
	const appId = useSelector((state) => state.application.appId);
	const mapVisible = getMapStatus(appId, entityType)
		? mapStatus.visible
		: useSelector((state) => state?.mapstate?.baseMap?.visible);
	const title = getTitle(entityType);

	const handleExpand = () => {
		dispatch(selectWidget("map-view"));
	};

	return (
		<BaseWidget
			enabled={enabled}
			title={title}
			expanded={mapVisible}
			expandable={true}
			handleExpand={handleExpand}
			icon={<Map fontSize="large" />}
			dir={dir}
		/>
	);
};

MapWidget.propTypes = propTypes;

export default MapWidget;
