import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./eventsMapLayersActions.js";
import { availableEventsSelector, userFeedsSelector } from "orion-components/GlobalData/Selectors";
import {
	primaryContextSelector,
	selectedContextSelector,
	secondaryContextSelector
} from "orion-components/ContextPanel/Selectors";
import { contextualDataByKey } from "orion-components/ContextualData/Selectors";

import {
	mapSettingsSelector,
	mapState as mapStateSelector,
	persistedState
} from "orion-components/AppState/Selectors";

import EventsMapLayers from "./EventsMapLayers";

import _ from "lodash";
import { getDir } from "orion-components/i18n/Config/selector";

const jsonata = require("jsonata");

const mapStateToProps = (state, ownProps) => {
	const baseMaps = state.baseMaps;
	const user = state.session.user.profile;
	const events = availableEventsSelector(state);
	const primaryId = primaryContextSelector(state);
	const secondaryId = secondaryContextSelector(state);
	const { clientConfig, contextualData, mapState } = state;
	const { dockData } = state.appState.dock;
	const primary = contextualData[primaryId];
	const mapStatus = mapStateSelector(state);
	// const event = primary ? primary.entity : null;
	let event;
	let pinnedItems = [];
	let canEditGeo;
	let proximityEntities = [];
	const context = selectedContextSelector(state);
	if (primary && primary.entity) {
		const { entity } = primary;
		event = entity;
		canEditGeo =
			user.applications
			&& user.applications.find(app => app.appId === "events-app")
			&& user.applications.find(app => app.appId === "events-app").permissions
			&& user.applications.find(app => app.appId === "events-app").permissions.includes("manage") &&
			(context && (context.entity.id === primaryId || context.entity.id === secondaryId));
		proximityEntities = context && context.proximityEntities ? context.proximityEntities : [];
		//don't duplicate items that exist in proximity and are pinned
		pinnedItems = contextualDataByKey(primaryId, "pinnedItems")(state) ? contextualDataByKey(primaryId, "pinnedItems")(state).filter(pinned => !proximityEntities.find(entity => pinned.id === entity.id)) : [];
	}

	const activeFOVs = state.globalData.fovs
		? _.filter(_.values(state.globalData.fovs.data), fov =>
			_.includes(_.keys(mapStatus.entities.cameras), fov.parentEntity)
		)
		: [];
	const types = ["Track", "Line", "Point", "Polygon", "Camera", "FOV", "AccessPoint"];
	const trackHistory = _.mapValues(
		_.filter(contextualData, context => context.trackHistory),
		"trackHistory"
	);
	const { selectedFloors } = persistedState(state);
	const filteredSelectedFloors = {};
	const pinnedItemsById = _.groupBy(pinnedItems, "id");
	if (pinnedItems.length && selectedFloors) {
		Object.keys(selectedFloors).forEach(facilityId => {
			if (pinnedItemsById[facilityId] && selectedFloors[facilityId]) {
				filteredSelectedFloors[facilityId] = selectedFloors[facilityId];
			}
		});
	}


	// -- get a list of all mapIconTemplates
	const mapIconTemplates = {};
	Object.values(userFeedsSelector(state)).forEach(feed => {
		mapIconTemplates[feed.feedId] = jsonata(feed.mapIconTemplate || "properties.(iconType & '_' & disposition)");
	});

	return {
		canEditGeo,
		mapSettings: mapSettingsSelector(state),
		entities: [...pinnedItems, ...activeFOVs, ...proximityEntities],
		types,
		selectedFloors,
		trackHistory,
		event, // single selected event
		events, // all available events
		aerisKey: clientConfig.mapSettings.AERIS_API_KEY,
		mapTools: mapState.mapTools,
		dockOpen: dockData.isOpen,
		mapIconTemplates,
		baseMaps,
		dir: getDir(state)
	};
};

function mapDispatchToProps(dispatch) {
	return bindActionCreators(actionCreators, dispatch);
}

const EventsMapLayersContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(EventsMapLayers);

export default EventsMapLayersContainer;
