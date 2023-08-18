import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./cameraCollectionActions.js";

import CameraCollection from "./CameraCollection";
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
		const cameras =
			ownProps.id === "all_cameras"
				? feedEntitiesByTypeSelector("camera")(state)
				: getCollectionMembers(state, ownProps);
		const collection =
			ownProps.id === "all_cameras"
				? ownProps.collection
				: getCollection(state, ownProps);
		return { cameras, collection, dir: getDir(state), locale: getCultureCode(state) };
	};

	return mapStateToProps;
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const CameraCollectionContainer = connect(
	makeMapStateToProps,
	mapDispatchToProps
)(CameraCollection);

export default CameraCollectionContainer;
