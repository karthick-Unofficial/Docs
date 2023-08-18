import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./listPanelActions";
import ListPanel from "./ListPanel.jsx";
import {
	selectedEntityState,
	selectedContextSelector
} from "orion-components/ContextPanel/Selectors";
import {
	layerSourcesSelector,
	userFeedsSelector
} from "orion-components/GlobalData/Selectors";
import _ from "lodash";
import { floorPlanSelector } from "orion-components/Map/Selectors";
import { getDir } from "orion-components/i18n/Config/selector";


const mapStateToProps = state => {
	const { mapState, appState, session } = state;
	const context = selectedContextSelector(state);
	const selectedEntity = selectedEntityState(state);
	const { secondaryOpen: profileOpen } = appState.contextPanel.contextPanelData;
	const { mode } = mapState.mapTools;
	const canCreate = userFeedsSelector(state).some(feed => {
		return feed && feed.canView && feed.entityType === "facility" && feed.ownerOrg === session.user.profile.orgId
			&& session.user.profile.integrations.find(int => int.intId === feed.feedId)
			&& session.user.profile.integrations.find(int => int.intId === feed.feedId).permissions
			&& session.user.profile.integrations.find(int => int.intId === feed.feedId).permissions.includes("manage");
	});
	const facilityFeeds = _.map(
		_.filter(
			_.map(userFeedsSelector(state)),
			feed => {
				return (feed && feed.entityType === "facility");
			}
		), "feedId");
	const { preLoaded } = floorPlanSelector(state);
	const { widgetLaunchData } = state.userAppState;
	const allowImport = state.clientConfig ? state.clientConfig.allowImport : false;
	if (state.globalData && state.globalGeo) {
		const { floorPlans } = state.globalData;
		let facilities = {};
		facilityFeeds.map(feed => {
			facilities = _.merge(facilities, (_.cloneDeep(layerSourcesSelector(state, { feedId: feed })) || {}));
		});

		return {
			preLoaded,
			hidden: !!mode,
			floorPlans,
			facilities,
			canCreate,
			allowImport,
			profileMode: selectedEntity ? selectedEntity.type : null,
			profileOpen: context && context.entity ? profileOpen : false,
			widgetLaunchData,
			dir: getDir(state)

		};
	} else {
		return {
			preLoaded,
			hidden: !!mode,
			canCreate,
			allowImport,
			profileMode: selectedEntity ? selectedEntity.type : null,
			profileOpen: context && context.entity ? profileOpen : false,
			dir: getDir(state)

		};
	}
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const ListPanelContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ListPanel);

export default ListPanelContainer;