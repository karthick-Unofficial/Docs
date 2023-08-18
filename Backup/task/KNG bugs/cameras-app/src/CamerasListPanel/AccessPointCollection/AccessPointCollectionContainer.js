import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./accessPointCollectionActions.js";

import AccessPointCollection from "./AccessPointCollection";
import {
	feedEntitiesByTypeSelector,
	makeGetCollection,
	makeGetCollectionMembers
} from "orion-components/GlobalData/Selectors";

import _ from "lodash";
import { getDir, getCultureCode } from "orion-components/i18n/Config/selector";

const makeMapStateToProps = () => {
	const getCollection = makeGetCollection();
	const getCollectionMembers = makeGetCollectionMembers();
	const mapStateToProps = (state, ownProps) => {
		const accessPoints =
			ownProps.id === "all_accessPoints"
				? feedEntitiesByTypeSelector("accessPoint")(state)
				: getCollectionMembers(state, ownProps);
		const collection =
			ownProps.id === "all_accessPoints"
				? ownProps.collection
				: getCollection(state, ownProps);
		return { accessPoints, collection, dir: getDir(state), locale: getCultureCode(state) };
	};

	return mapStateToProps;
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const AccessPointCollectionContainer = connect(
	makeMapStateToProps,
	mapDispatchToProps
)(AccessPointCollection);

export default AccessPointCollectionContainer;
