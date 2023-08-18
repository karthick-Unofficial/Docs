import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import VesselEvent from "./VesselEvent";
import * as actionCreators from "./vesselEventActions";

const mapStateToProps = (state, ownProps) => {
	const rules = Object.keys(state.globalData.rules).map(key => {
		return state.globalData.rules[key];
	});
    
	return {
		rules,
		berths: state.globalData.berths,
		entityCollections: state.globalData.collections,
		timeFormatPreference: state.appState.global.timeFormat
	};
};

function mapDispatchToProps(dispatch) {
	return bindActionCreators(
		actionCreators,
		dispatch
	);
}

const VesselEventContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(VesselEvent);

export default VesselEventContainer;