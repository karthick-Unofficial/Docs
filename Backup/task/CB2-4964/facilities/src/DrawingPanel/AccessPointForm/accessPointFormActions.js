import { facilityService } from "client-app-core";
export { setMapTools } from "orion-components/Map/Tools/Actions";

export const createAccessPoint = ({ name, description }) => {
	return (dispatch, getState) => {
		const { feature } = getState().mapState.mapTools;
		const entityData = {};
		const { geometry } = feature;
		entityData.geometry = geometry;
		entityData.properties = { name, description, type: "Access Point" };
		const accessPoint = { entityData };
		facilityService.create(accessPoint, err => {
			if (err) {
				console.log("ERROR", err);
			}
		});
	};
};

export const updateAccessPoint = ({ id, name, description }) => {
	return (dispatch, getState) => {
		const { feature } = getState().mapState.mapTools;
		const entityData = {};
		const { geometry } = feature;
		entityData.geometry = geometry;
		entityData.properties = { name, description };
		const accessPoint = { entityData };
		facilityService.update(id, accessPoint, err => {
			if (err) {
				console.log("ERROR", err);
			}
		});
	};
};
