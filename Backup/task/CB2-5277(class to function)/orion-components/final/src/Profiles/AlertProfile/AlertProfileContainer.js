import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./actions.js";
import AlertProfile from "./AlertProfile";
import { contextById } from "orion-components/ContextualData/Selectors";
import {
	userFeedsSelector,
	notificationById
} from "orion-components/GlobalData/Selectors";
import { fullscreenCameraOpen } from "orion-components/AppState/Selectors";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = (state, props) => {
	const { session, appState, spotlights } = state;
	const { id, activityId } = props;
	const user = session.user.profile;
	const { expandedAlert } = appState.dock.dockData;
	const userFeeds = userFeedsSelector(state);
	const context = contextById(activityId)(state);
	const notification = notificationById(id)(state) || {};
	const { dockedCameras } = appState.dock.cameraDock;
	const dialog = appState.dialog.openDialog;
	const { spotlightProximity, timeFormat } = appState.global;
	const appId = state.appId;
	return {
		context,
		dockedCameras,
		expanded: Boolean(id === expandedAlert),
		notification: props.notification ? props.notification : notification,
		userFeeds,
		user,
		dialog,
		fullscreenCamera: fullscreenCameraOpen(state),
		spotlights,
		spotlightProximity,
		timeFormat,
		appId,
		dir: getDir(state),
		locale: state.i18n.locale
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const AlertProfileContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(AlertProfile);

export default AlertProfileContainer;
