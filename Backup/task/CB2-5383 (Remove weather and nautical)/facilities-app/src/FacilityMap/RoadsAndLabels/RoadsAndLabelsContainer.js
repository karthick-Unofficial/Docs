import { connect } from "react-redux";
import RoadsAndLabels from "./RoadsAndLabels.jsx";

const mapStateToProps = state => {
	const { mapSettings } = state.appState.persisted;
	const { baseMap } = state.mapState;
	if (mapSettings && mapSettings["roadsAndLabels"]) {
		const { opacity, visible } = mapSettings["roadsAndLabels"];
		return { opacity, visible, baseMap };
	}
	return { baseMap };
};

const RoadsAndLabelsContainer = connect(mapStateToProps)(RoadsAndLabels);

export default RoadsAndLabelsContainer;
