import { connect } from "react-redux";
import { FacilitiesLayer } from "orion-components/Map/Layers";
import { bindActionCreators } from "redux";
import * as actionCreators from "./facilitiesActions";
import {
	mapSettingsSelector,
	replayMapObject
} from "orion-components/AppState/Selectors";
import { mapFiltersById } from "orion-components/ContextPanel/Selectors";
import { getInitialPlayBarData } from "../../shared/utility/utilities";

const mapStateToProps = (state, props) => {
	const { appState } = state;
	const { persisted } = appState;
	const settings = mapSettingsSelector(state);
	const filters = mapFiltersById(state);
	const { playBarValue } = state.playBar;
	let data = null;
	const facilities = {};
	data = getInitialPlayBarData(playBarValue, state.replay.timeTransactions);
	if (data) {
		Object.keys(data).map(key => {
			if (data[key].feedId === props.feedId) {
				facilities[key] = (data[key]);
			}
		});
	}
	const map = replayMapObject(state);
	if (persisted.mapSettings) {
		return {
			facilities,
			filters,
			settings,
			map,
			labelsVisible: settings.entityLabels ? settings.entityLabels.visible : false
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

const FacilitiesContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(FacilitiesLayer);

export default FacilitiesContainer;
