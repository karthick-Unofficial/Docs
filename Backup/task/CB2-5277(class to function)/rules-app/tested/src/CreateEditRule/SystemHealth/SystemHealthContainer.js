import { connect } from "react-redux";
import SystemHealth from "./SystemHealth";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = (state, ownProps) => {

	return {
	  systemHealthEvents: state.globalData.healthSystems.items.map((id) => {
			return {
				id: state.globalData.healthSystems.itemsById[id].system,
				name: state.globalData.healthSystems.itemsById[id].name
			};
	  }),
	  timeFormatPreference: state.appState.global.timeFormat,
	  dir: getDir(state),
	  locale: state.i18n.locale
	};
};

const SubjectContainer = connect(
	mapStateToProps,
	null
)(SystemHealth);

export default SubjectContainer;