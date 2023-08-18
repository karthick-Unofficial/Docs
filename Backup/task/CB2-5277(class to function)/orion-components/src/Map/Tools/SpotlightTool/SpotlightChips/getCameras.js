import pointInPoly from "@turf/boolean-point-in-polygon";

export const getCameras = (spotlight, cameras) => {
	const filteredCameras = Object.values(cameras)
		.filter(camera => {
			return !!camera.entityData.geometry;
		})
		.filter(camera => {
			return pointInPoly(
				camera.entityData.geometry.coordinates,
				spotlight.geometry
			);
		});
	return filteredCameras;
};
