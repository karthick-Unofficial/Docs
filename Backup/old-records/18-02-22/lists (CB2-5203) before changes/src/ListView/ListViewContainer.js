import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./listViewActions";
import {
	userFeedsSelector,
	feedDataSelector
} from "orion-components/GlobalData/Selectors";
import ListView from "./ListView";

import _ from "lodash";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = state => {
	const user = state.session.user.profile;
	const { clientConfig } = state;
	let lists = {}; //_.pickBy(state.globalData.lists.data, list => list.name);
	let lookupData = {};
	const pinnedLists = state.appState.persisted.pinnedLists;
	const primaryOpen = state.appState.contextPanel.contextPanelData.primaryOpen;
	const xOffset = primaryOpen ? 360 : 60;
	const dialog = state.appState.dialog.openDialog;
	const manageableListFeeds = userFeedsSelector(state).filter(feed => {
		return feed && feed.canView && feed.entityType === "list" && feed.ownerOrg === user.orgId
			&& user.integrations.find(int => int.intId === feed.feedId)
			&& user.integrations.find(int => int.intId === feed.feedId).permissions
			&& user.integrations.find(int => int.intId === feed.feedId).permissions.includes("manage");
	}).map((feed) => feed.feedId);
	const listFeeds = _.map(
		_.filter(
			_.map(userFeedsSelector(state)),
			feed => {
				return (feed && feed.entityType === "list");
			}
		), "feedId");

	if (state.globalData) {
		lookupData = state.globalData.listLookupData ? 
			state.globalData.listLookupData : {};
		listFeeds.forEach(feed => {
			lists = _.merge(lists, (_.cloneDeep(feedDataSelector(state, { feedId: feed })) || {}));
		});
		lists = _.pickBy(
			lists,
			list => list.name && !list.deleted
		);
	}

	// assign manage permission for each list
	if(lists) {
		Object.keys(lists).forEach(key => {
			const list = lists[key];
			list["canManage"] = manageableListFeeds.includes(list.feedId);
		});
	}
	
	// Filter out pinnedList state if it doesn't exist in list data
	const activePinned = _.pickBy(
		pinnedLists,
		list =>
			_.includes(_.keys(lists), list.id) &&
			!lists[list.id].deleted &&
			list.selected
	);
	const categories = state.globalData.listCategories.data;
	const timeFormatPreference = state.appState.global.timeFormat;
	return {
		user,
		defaultListPagination: clientConfig.defaultListPagination,
		listPaginationOptions: clientConfig.listPaginationOptions,
		lists: lists,
		lookupData,
		categories,
		pinnedLists: activePinned || {},
		xOffset,
		dialog,
		timeFormatPreference,
		dir: getDir(state)
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const ListViewContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ListView);

export default ListViewContainer;
