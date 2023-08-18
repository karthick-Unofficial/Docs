import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./importFacilitiesActions";
import ImportFacilities from "./ImportFacilities";

const mapStateToProps = state => {
	return {
		facilitiesImportData: state.facilitiesImportData
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const ImportFacilitiesContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ImportFacilities);

export default ImportFacilitiesContainer;