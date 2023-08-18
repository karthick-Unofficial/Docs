import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./conditionActions";
import Condition from "./Condition";

const mapStateToProps = (state, ownProps) => {
	const { landUnitSystem } = state.appState.global.unitsOfMeasurement;
	const timeFormatPreference = state.appState.global.timeFormat;
	return {
		isOpen: state.appState.dialog.openDialog,
		entityCollections: state.globalData.collections,
		landUnitSystem,
		timeFormatPreference
		// typeAheadFilterValue: state.appState.indexPage.typeAheadFilter
	};
};

function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		actionCreators,
		dispatch
	);
}

const ConditionContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(Condition);

export default ConditionContainer;
