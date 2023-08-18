import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import _ from "lodash";

import * as actionCreators from "./mapFilterActions.js";
import { MapFilter } from "orion-components/CBComponents";

import {
	contextPanelState,
	mapFiltersSelector
} from "orion-components/ContextPanel/Selectors";
import {
	mapObject,
	mapSettingsSelector
} from "orion-components/AppState/Selectors";

const mapStateToProps = state => {
	const secondaryOpen = contextPanelState(state).secondaryOpen;
	const map = mapObject(state);
	const settings = mapSettingsSelector(state);
	const zoom = settings.mapZoom;
	const center = settings.mapCenter;
	const filters = mapFiltersSelector(state);
	return {
		map,
		secondaryOpen,
		zoom,
		center,
		filters
	};
};

function mapDispatchToProps(dispatch) {
	return bindActionCreators(actionCreators, dispatch);
}

const MapFilterContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(MapFilter);

export default MapFilterContainer;
