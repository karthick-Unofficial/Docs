import { connect } from "react-redux";
import SystemHealth from "./SystemHealth";

const mapStateToProps = (state, ownProps) => {

	return {
	  systemHealthEvents: state.globalData.healthSystems.items.map((id) => {
			return {
				id: state.globalData.healthSystems.itemsById[id].system,
				name: state.globalData.healthSystems.itemsById[id].name
			};
	  }),
	  timeFormatPreference: state.appState.global.timeFormat
	};
};

const SubjectContainer = connect(
	mapStateToProps,
	null
)(SystemHealth);

export default SubjectContainer;