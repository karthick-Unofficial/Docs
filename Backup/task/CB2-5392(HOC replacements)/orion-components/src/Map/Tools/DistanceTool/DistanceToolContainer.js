// import { connect } from "react-redux";
// import { bindActionCreators } from "redux";
// import {
// 	setMapTools,
// 	updatePath,
// 	updatePaths,
// 	deletePath,
// 	setActivePath
// } from "orion-components/Map/Tools/Actions";
// import { feedEntityGeoSelector } from "orion-components/GlobalData/Selectors";

// import _ from "lodash";

// import DistanceTool from "./DistanceTool";
// import { getDir } from "orion-components/i18n/Config/selector";

// const mapStateToProps = state => {
// 	const tracks = _.pickBy(
// 		feedEntityGeoSelector(state),
// 		entity => !!entity && entity.entityType === "track"
// 	);
// 	const { appState, mapState } = state;
// 	const { baseMap, distanceTool, mapTools } = mapState;
// 	const { landUnitSystem } = appState.global.unitsOfMeasurement;

// 	return {
// 		map: baseMap.mapRef,
// 		tracks: tracks || {},
// 		landUnitSystem,
// 		distanceTool,
// 		toolType: mapTools.type,
// 		dir: getDir(state)
// 	};
// };
// updatePaths, updatePath, setMapTools, setActivePath
// const mapDispatchToProps = dispatch => {
// 	return bindActionCreators(
// 		{
// 			setMapTools,
// 			updatePath,
// 			updatePaths,
// 			deletePath,
// 			setActivePath
// 		},
// 		dispatch
// 	);
// };

// const DistanceToolContainer = connect(
// 	mapStateToProps,
// 	mapDispatchToProps
// )(DistanceTool);

// export default DistanceToolContainer;
