import React from "react";
import { FloorPlan } from "orion-components/Map/Layers";
import { useSelector } from "react-redux";
import { floorPlanSelector } from "orion-components/Map/Selectors";

const ActiveFloorPlan = () => {

	const mapState = useSelector(state => state.mapState);
	const { selectedFloor } = useSelector(state => floorPlanSelector(state)) || null;
	const { coordinates } = useSelector(state => floorPlanSelector(state));
	const { creating } = useSelector(state => floorPlanSelector(state));
	const { mode } = mapState.mapTools;
	const { mapRef } = useSelector(state => state.mapState.baseMap);
	const map = mapRef;

	return selectedFloor && map && !creating ? (
		<FloorPlan
			id={selectedFloor.id}
			coordinates={coordinates ? [...coordinates] : [...selectedFloor.geometry.coordinates[0]]}
			image={`/_download?handle=${selectedFloor.handle}`}
			editing={mode === "floor_plan_mode" ? true : false}
			map={map}
			before="---ac2-floorplans-position-end"
		/>
	) : null;
};

export default ActiveFloorPlan;
