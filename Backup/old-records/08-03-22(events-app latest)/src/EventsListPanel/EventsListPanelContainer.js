import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./eventsListPanelActions.js";
import EventsListPanel from "./EventsListPanel";
import { eventFiltersSelector, eventTemplateFiltersSelector } from "orion-components/AppState/Selectors";
import {
	eventSearchSelector,
	eventTemplateSearchSelector,
	selectedEntityState,
	selectedContextSelector
} from "orion-components/ContextPanel/Selectors";
import { closeDialog } from "orion-components/AppState/Actions";
import {
	eventsSelector,
	currentOwnedEventsSelector,
	sharedEventsSelector,
	ownedTemplatesSelector,
	sharedTemplatesSelector,
	usedEventTemplatesSelector,
	availableTemplatesSelector
} from "orion-components/GlobalData/Selectors";
import _ from "lodash";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = state => {
	const eventFilters = eventFiltersSelector(state);
	const selectedEntity = selectedEntityState(state);
	const profileLoaded =
		!state.appState.loading.profileLoading &&
		Boolean(selectedContextSelector(state));
	const ownedEvents = currentOwnedEventsSelector(state);
	const sharedEvents = sharedEventsSelector(state);
	const ownedTemplates = ownedTemplatesSelector(state);
	const sharedTemplates = sharedTemplatesSelector(state);
	const availableTemplates = availableTemplatesSelector(state);
	const eventFiltering = _.size(_.filter(eventFilters, filter => _.size(filter)));
	const events = eventsSelector(state);
	const { appState, mapState } = state;
	return {
		eventSearch: eventSearchSelector(state),
		eventTemplateSearch: eventTemplateSearchSelector(state),
		ownedEvents,
		sharedEvents,
		ownedTemplates,
		sharedTemplates,
		availableTemplates,
		eventFilters,
		user: state.session.user.profile,
		profileMode: selectedEntity ? selectedEntity.type : null,
		profileLoaded,
		dialog: appState.dialog.openDialog,
		dialogData: appState.dialog.dialogData,
		eventFiltering,
		drawingToolsActive: !!mapState.mapTools.type,
		events,
		widgetLaunchData: state.userAppState.widgetLaunchData,
		WavCamOpen: state.appState.dock.dockData.WavCam,
		dir: getDir(state),
		locale: state.i18n.locale
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(
		{
			...actionCreators,
			closeDialog
		},
		dispatch
	);
};

const EventsListPanelContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(EventsListPanel);

export default EventsListPanelContainer;
