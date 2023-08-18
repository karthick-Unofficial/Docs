import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./facilityMenuActions";
import FacilityMenu from "./FacilityMenu.jsx";
import { selectedContextSelector } from "orion-components/ContextPanel/Selectors";
import {
	userFeedsSelector
} from "orion-components/GlobalData/Selectors";
const mapStateToProps = state => {
	const context = selectedContextSelector(state);
	const { floorPlan, globalData, session } = state;
	const canCreate = userFeedsSelector(state).some(feed => {
		return feed && feed.canView && feed.entityType === "facility" && feed.ownerOrg === session.user.profile.orgId
			&& session.user.profile.integrations.find(int => int.intId === feed.feedId)
			&& session.user.profile.integrations.find(int => int.intId === feed.feedId).permissions
			&& session.user.profile.integrations.find(int => int.intId === feed.feedId).permissions.includes("manage");
	});
	const { floorPlans } = globalData;
	const { selectedFloor } = floorPlan;
	// TODO: Move to a selector
	const { entity } = context || {};
	const selectedFloorPlan = floorPlans[selectedFloor ? selectedFloor.id : ""];
	const canEdit = entity ? session.user.profile.integrations.find(int => int.intId === entity.feedId)
		&& session.user.profile.integrations.find(int => int.intId === entity.feedId).permissions
		&& session.user.profile.integrations.find(int => int.intId === entity.feedId).permissions.includes("manage") : false;

	return { context, selectedFloorPlan, canCreate, canEdit };
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const FacilityMenuContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(FacilityMenu);

export default FacilityMenuContainer;
