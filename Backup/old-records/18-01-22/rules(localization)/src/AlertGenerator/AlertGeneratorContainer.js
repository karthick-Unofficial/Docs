import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./alertGeneratorActions";
import AlertGenerator from "./AlertGenerator.jsx";

const mapStateToProps = (state) => {
	const defaultConfig = {
		"types": [
			{
				"id": "enter",
				"label": "Zone Entry",
				"summary": "[track] entered [shape]."
			},
			{
				"id": "exit",
				"label": "Zone Exit",
				"summary": "[track] exited [shape]."
			},
			{
				"id": "demo",
				"label": "Demo Alert",
				"summary": "Something crazy happened."
			},
			{
				"id": "loiter",
				"label": "Loiter Rule",
				"summary": "[track] loitered in [shape] for longer than 5 minutes."
			}
		]
	};

	return {
		alertTypes: state.clientConfig.alertGeneratorConfig ? state.clientConfig.alertGeneratorConfig.types : defaultConfig.types,
		orgUsers: state.globalData.org.orgUsers,
		user: state.session.user,
		WavCamOpen: state.appState.dock.dockData.WavCam
	};
};

function mapDispatchToProps(dispatch) {
	return bindActionCreators(actionCreators, dispatch);
}

const AlertGeneratorContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(AlertGenerator);

export default AlertGeneratorContainer;