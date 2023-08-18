import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "../../modificationActions";
import ObjectiveEditor from "./ObjectiveEditor";
import { raiseError } from "../../../../../appActions";

const mapStateToProps = state => {
	return {
		map: state.tabletopSession && state.tabletopSession.mapRefs ? state.tabletopSession.mapRefs.find(mapRef => mapRef.floorPlanId == null).mapRef : null,
		floorPlans: state.tabletopSession ? state.tabletopSession.floorPlans : null
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators({
		...actionCreators, 
		raiseError
	}, dispatch);
};


const ObjectiveEditorContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ObjectiveEditor);

export default ObjectiveEditorContainer;

