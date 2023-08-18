import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./listPanelActions";
import _ from "lodash";
import {
	userFeedsSelector,
	feedDataSelector
} from "orion-components/GlobalData/Selectors";
import ListPanel from "./ListPanel";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = state => {
	const user = state.session.user.profile;
	// TODO: Add selectors for lists and pinnedLists
	const canCreate = userFeedsSelector(state).some(feed => {
		return feed && feed.canView && feed.entityType === "list" && feed.ownerOrg === user.orgId
			&& user.integrations.find(int => int.intId === feed.feedId)
			&& user.integrations.find(int => int.intId === feed.feedId).permissions
			&& user.integrations.find(int => int.intId === feed.feedId).permissions.includes("manage");
	});
	const listsApp = user.applications.find(app => app.appId === "lists-app");
	const canManageCategories = user && listsApp && listsApp.permissions
		&& listsApp.permissions.includes("manage");
	let lists = {};
	const listFeeds = _.map(
		_.filter(
			_.map(userFeedsSelector(state)),
			feed => {
				return (feed && feed.entityType === "list");
			}
		), "feedId");
	const pinnedLists = state.appState.persisted.pinnedLists;
	if (state.globalData) {
		listFeeds.forEach(feed => {
			lists = _.merge(lists, (_.cloneDeep(feedDataSelector(state, { feedId: feed })) || {}));
		});
		lists = _.pickBy(
			lists,
			list => list.name && !list.deleted && !list.targetId && !list.targetType
		);
	}
	const categories = state.globalData.listCategories.data;
	const dialog = state.appState.dialog.openDialog;
	return {
		user,
		canManageCategories,
		lists,
		canCreate,
		categories,
		pinnedLists: pinnedLists || {},
		dialog,
		WavCamOpen: state.appState.dock.dockData.WavCam,
		dir: getDir(state)
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const ListPanelContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ListPanel);

export default ListPanelContainer;
