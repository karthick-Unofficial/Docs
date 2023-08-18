import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./entityCollectionActions.js";
import EntityCollection from "./EntityCollection";
import {
	activeAlertsSelector,
	sharedEntitiesSelector,
	makeGetCollection,
	makeGetCollectionMembers,
	userFeedsSelector
} from "orion-components/GlobalData/Selectors";
import { getDir } from "orion-components/i18n/Config/selector";

const makeMapStateToProps = () => {

	const getCollection = makeGetCollection();
	const getCollectionMembers = makeGetCollectionMembers();
	const mapStateToProps = (state, ownProps) => {
		const { orgId, id } = state.session.user.profile;
		const collection =
			ownProps.id === "shared"
				? ownProps.collection
				: getCollection(state, ownProps);
		const activeAlerts = activeAlertsSelector(state);
		const entities =
			ownProps.id === "shared"
				? sharedEntitiesSelector(state)
				: getCollectionMembers(state, ownProps);
		const manageable =
			ownProps.id !== "shared" && state.session.user.profile.applications &&
			state.session.user.profile.applications.find(app => app.appId === "map-app") &&
			state.session.user.profile.applications.find(app => app.appId === "map-app").permissions &&
			state.session.user.profile.applications.find(app => app.appId === "map-app").permissions.includes("manage");
		const profileIconTemplates = {};
		Object.values(userFeedsSelector(state)).forEach(feed => {
			profileIconTemplates[feed.feedId] = feed.profileIconTemplate;
		});
		const user = state.session.user.profile;
		return {
			collection,
			entities,
			orgId,
			activeAlerts,
			searchActive: !!ownProps.search,
			manageable,
			userId: id,
			profileIconTemplates,
			user,
			dir: getDir(state)
		};
	};
	return mapStateToProps;
};

function mapDispatchToProps(dispatch) {
	return bindActionCreators(actionCreators, dispatch);
}

const EntityCollectionContainer = connect(
	makeMapStateToProps,
	mapDispatchToProps
)(EntityCollection);

export default EntityCollectionContainer;
