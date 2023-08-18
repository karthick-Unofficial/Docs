import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./conditionActions";
import Condition from "./Condition";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = (state, ownProps) => {
	const { landUnitSystem } = state.appState.global.unitsOfMeasurement;
	const timeFormatPreference = state.appState.global.timeFormat;
	return {
		isOpen: state.appState.dialog.openDialog,
		entityCollections: state.globalData.collections,
		landUnitSystem,
		timeFormatPreference,
		dir: getDir(state),
		locale: state.i18n.locale
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
