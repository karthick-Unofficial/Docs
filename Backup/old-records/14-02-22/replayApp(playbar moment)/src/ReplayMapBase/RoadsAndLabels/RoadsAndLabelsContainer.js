import { connect } from "react-redux";
import RoadsAndLabels from "./RoadsAndLabels.jsx";

const mapStateToProps = state => {
	const { mapSettings } = state.appState.persisted;
	const { replayBaseMap } = state.replayMapState;
	if (mapSettings && mapSettings["roadsAndLabels"]) {
		const { opacity, visible } = mapSettings["roadsAndLabels"];
		return { opacity, visible, baseMap: replayBaseMap };
	}
	return { baseMap: replayBaseMap };
};

const RoadsAndLabelsContainer = connect(mapStateToProps)(RoadsAndLabels);

export default RoadsAndLabelsContainer;
