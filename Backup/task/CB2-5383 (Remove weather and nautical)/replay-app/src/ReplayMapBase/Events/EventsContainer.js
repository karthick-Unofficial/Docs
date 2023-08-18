import { connect } from "react-redux";
import Events from "./Events";
import { bindActionCreators } from "redux";
import * as actionCreators from "./eventsActions";
import {
	mapSettingsSelector,
	replayMapObject
} from "orion-components/AppState/Selectors";
import { mapFiltersById, selectedContextSelector } from "orion-components/ContextPanel/Selectors";
import { getInitialPlayBarData } from "../../shared/utility/utilities";

const mapStateToProps = (state, props) => {
	const { appState } = state;
	const { persisted } = appState;
	const settings = mapSettingsSelector(state);
	const filters = mapFiltersById(state);
	const { playBarValue } = state.playBar;
	let data = null;
	const events = [];
	data = getInitialPlayBarData(playBarValue, state.replay.timeTransactions);
	if (data) {
		Object.keys(data).map(key => {
			if (data[key].entityType === "event") {
				events.push(data[key]);
			}
		});
	}
	const context = selectedContextSelector(state);
	let event;
	if (context && context.entity && context.entity.entityType === "event") {
		event = context.entity;
	}
	const map = replayMapObject(state);
	if (persisted.mapSettings) {
		return {
			events,
			selectedEvent: event,
			filters,
			settings,
			map,
			labelsVisible: settings.entityLabels ? settings.entityLabels.visible : false
		};
	} else {
		return {
			events,
			selectedEvent: event
		};
	}
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const EventsContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(Events);

export default EventsContainer;
