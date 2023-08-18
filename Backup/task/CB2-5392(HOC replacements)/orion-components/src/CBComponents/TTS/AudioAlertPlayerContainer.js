// import { connect } from "react-redux";
// import AudioAlertPlayer from "./AudioAlertPlayer";
// import { alertSelector, alertStateSelector } from "../../GlobalData/Selectors";

// const mapStateToProps = (state, props) => {
// 	const alerts = alertSelector(state);
// 	const isInitialBatch = alertStateSelector(state);

// 	const globalState = state.appState.global;
// 	const tts = globalState.tts;

// 	return {
// 		activeAlerts: alerts,
// 		isInitialBatch,
// 		tts
// 	};
// };

// const AudioAlertPlayerContainer = connect(
// 	mapStateToProps
// )(AudioAlertPlayer);

// export default AudioAlertPlayerContainer;