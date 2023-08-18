import { connect } from "react-redux";
import NauticalCharts from "./NauticalCharts.jsx";

const mapStateToProps = state => {
	const { mapSettings } = state.appState.persisted;
	if (mapSettings && mapSettings["nauticalCharts"]) {
		const { opacity, visible } = mapSettings["nauticalCharts"];
		return { opacity, visible };
	}
	return {};
};

const NauticalChartsContainer = connect(mapStateToProps)(NauticalCharts);

export default NauticalChartsContainer;
