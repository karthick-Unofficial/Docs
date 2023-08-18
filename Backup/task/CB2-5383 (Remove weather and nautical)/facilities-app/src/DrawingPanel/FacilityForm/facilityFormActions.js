import { facilityService } from "client-app-core";
export { setMapTools } from "orion-components/Map/Tools/Actions";

export const createFacility = ({ name, description }) => {
	return (dispatch, getState) => {
		const { feature } = getState().mapState.mapTools;
		const entityData = {};
		const { geometry } = feature;
		entityData.geometry = geometry;
		entityData.properties = { name, description, type: "Facility" };
		const facility = { entityData };
		facilityService.create(facility, err => {
			if (err) {
				console.log("ERROR", err);
			}
		});
	};
};

export const updateFacility = ({ id, name, description }) => {
	return (dispatch, getState) => {
		const { feature } = getState().mapState.mapTools;
		const entityData = {};
		const { geometry } = feature;
		entityData.geometry = geometry;
		entityData.properties = { name, description };
		const facility = { entityData };
		facilityService.update(id, facility, err => {
			if (err) {
				console.log("ERROR", err);
			}
		});
	};
};
