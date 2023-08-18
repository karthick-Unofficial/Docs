import { useEffect } from "react";
import PropTypes from "prop-types";

const propTypes = {
	floorPlan: PropTypes.object.isRequired,
	map: PropTypes.object.isRequired,
	layerAbove: PropTypes.string.isRequired
};

const FloorPlanLayer = ({ floorPlan, map, layerAbove }) => {
	useEffect(() => {
		const id = floorPlan.id;
		const addFloorPlan = () => {
			const imgSrc = `/_download?handle=${floorPlan.handle}`;
			const coords = floorPlan.geometry.coordinates[0].filter((coord, index) => index < 4);
			const sourceData = {
				type: "image",
				url: imgSrc,
				coordinates: coords
			};
			if (!map.getSource(`${id}-floor-plan-source`)) {
				map.addSource(`${id}-floor-plan-source`, sourceData);
				map.addLayer({
					id: `${id}-overlay`,
					source: `${id}-floor-plan-source`,
					type: "raster",
					paint: {
						"raster-opacity": 1.0
					}
				}, layerAbove);
				const bounds = floorPlan.bbox; 
				map.fitBounds([[bounds[0], bounds[1]], [bounds[2], bounds[3]]]);
			}
		};
		if (map && !map.getSource(`${id}-floor-plan-source`) && floorPlan) {
			addFloorPlan();
		}

		return () => {
			try {
				if (map && map.getSource(`${id}-floor-plan-source`)) {
					map.removeLayer(`${id}-overlay`);
					map.removeSource(`${id}-floor-plan-source`);
				}
			} catch (err) {
				console.log("Error occurred when cleaning up FloorPlanLayer");
			}
		};
	}, [ floorPlan, map, layerAbove]);

	return null;
};

FloorPlanLayer.propTypes = propTypes;

export default FloorPlanLayer;