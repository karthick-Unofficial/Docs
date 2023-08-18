import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "../../modificationActions";
import ModificationEditor from "./ModificationEditor";
import { loadFacilityFloorPlan} from "../../../../tabletopSessionActions";
import { raiseError } from "../../../../../appActions";

const mapStateToProps = state => {
	return {
		modificationsConfig: state.clientConfig ? state.clientConfig.modificationsConfig : null,
		map: state.tabletopSession && state.tabletopSession.mapRefs ? state.tabletopSession.mapRefs.find(mapRef => mapRef.floorPlanId == null).mapRef : null,
		floorPlans: state.tabletopSession ? state.tabletopSession.floorPlans : null
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators({
		...actionCreators, 
		loadFacilityFloorPlan,
		raiseError
	}, dispatch);
};

const ModificationEditorContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ModificationEditor);

export default ModificationEditorContainer;
