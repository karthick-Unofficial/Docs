import { connect } from "react-redux";
import SystemHealth from "./SystemHealth";
import { getDir } from "orion-components/i18n/Config/selector";

const hasError = (errorFlag, health) => {
	if (errorFlag) {
		return true;
	} else if (health.hasOwnProperty("success") && !health.success) {
		return true;
	} else {
		return false;
	}
};

const mapStateToProps = (state) => {
	const { locale } = state.i18n;
	return {
		systemHealth: state.systemHealth.health,
		error: hasError(state.systemHealth.hasApiError, state.systemHealth.health),
		dir: getDir(state),
		locale

	};
};

const SystemHealthContainer = connect(
	mapStateToProps,
	null
)(SystemHealth);

export default SystemHealthContainer;
