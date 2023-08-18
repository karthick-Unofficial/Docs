import { connect } from "react-redux";
import { FacilitiesLayer } from "orion-components/Map/Layers";
import { bindActionCreators } from "redux";
import * as actionCreators from "./facilitiesActions";
import _ from "lodash";
import {
	layerSourcesSelector
} from "orion-components/GlobalData/Selectors";
import {
	mapSettingsSelector,
	mapObject
} from "orion-components/AppState/Selectors";
import { mapFiltersById } from "orion-components/ContextPanel/Selectors";

const mapStateToProps = (state, props) => {
	const { appState } = state;
	const { persisted } = appState;
	const settings = mapSettingsSelector(state);
	const facilities = layerSourcesSelector(state, props);
	const filters = mapFiltersById(state);
	
	const map = mapObject(state);
	if (persisted.mapSettings) {
		return {
			facilities,
			filters,
			settings,
			map,
			labelsVisible: settings.entityLabelsVisible
		};
	} else {
		return {
			facilities
		};
	}
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const FacilitiesLayerContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(FacilitiesLayer);

export default FacilitiesLayerContainer;
