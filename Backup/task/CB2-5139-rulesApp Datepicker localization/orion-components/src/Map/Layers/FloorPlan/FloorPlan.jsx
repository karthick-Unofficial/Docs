import { useEffect } from "react";
import PropTypes from "prop-types";
import area from "@turf/area";
import bBoxPoly from "@turf/bbox-polygon";

const propTypes = {
	id: PropTypes.string.isRequired,
	map: PropTypes.object.isRequired,
	imgSrc: PropTypes.string.isRequired,
	coordinates: PropTypes.array,
	setCoordinates: PropTypes.func,
	before: PropTypes.string
};

const defaultProps = {
	coordinates: null,
	setCoordinates: null
};

const FloorPlan = ({ map, imgSrc, coordinates, setCoordinates, id, editing, feedId, before }) => {
	useEffect(() => {
		const addFloorPlan = () => {
			const parseDim = coords => {
				return Object.values(map.unproject(coords));
			};
			const img = new Image();
			img.src = imgSrc;
			img.onload = () => {
				const height = img.height;
				const width = img.width;
				const center = map.project(map.getCenter());
				const { x, y } = center;
				const imgXMax = x + width / 10;
				const imgXMin = x - width / 10;
				const imgYMax = y + height / 10;
				const imgYMin = y - height / 10;
				const dimA = parseDim({ x: imgXMin, y: imgYMax });
				const dimB = parseDim({ x: imgXMax, y: imgYMax });
				const dimC = parseDim({ x: imgXMax, y: imgYMin });
				const dimD = parseDim({ x: imgXMin, y: imgYMin });
				const { _ne, _sw } = map.getBounds();
				if (
					!coordinates &&
					!map.getSource(`ac2-${id}-floor-plan-source`) &&
					area(bBoxPoly([...Object.values(_ne), ...Object.values(_sw)])) <
						area(bBoxPoly([...dimA, ...dimC]))
				) {
					map.fitBounds([...dimA, ...dimC], { padding: 300 });
				}
				if (!coordinates) {
					setCoordinates([dimD, dimC, dimB, dimA, dimD]);
				} else {
					setCoordinates(
						coordinates.length < 5
							? [...coordinates, coordinates[0]]
							: coordinates
					);
				}
				const sourceData = {
					type: "image",
					url: imgSrc,
					coordinates: coordinates
						? coordinates.filter((coord, index) => index < 4)
						: [dimD, dimC, dimB, dimA]
				};
				if (!map.getSource(`ac2-${id}-floor-plan-source`)) {
					map.addSource(`ac2-${id}-floor-plan-source`, sourceData);
					map.addLayer({
						id: `ac2-${id}-floor-plan-overlay`,
						source: `ac2-${id}-floor-plan-source`,
						type: "raster",
						paint: {
							"raster-opacity": editing ? 0.7 : 1.0
						}
					}, before);
				}
			};
		};
		if (map && !map.getSource(`ac2-${id}-floor-plan-source`) && imgSrc) {
			addFloorPlan();
		}
	}, [map, imgSrc, coordinates]);
	useEffect(() => {
		if (map && map.getSource(`ac2-${id}-floor-plan-source`) && coordinates) {
			const imgSource = map.getSource(`ac2-${id}-floor-plan-source`);
			imgSource.updateImage({ ...imgSource, coordinates: coordinates });
		}
	}, [map, coordinates]);
	useEffect(() => {
		return () => {
			if (map) {
				if (map.getLayer(`ac2-${id}-floor-plan-overlay`)) {
					map.removeLayer(`ac2-${id}-floor-plan-overlay`);
				}
				if (map.getSource(`ac2-${id}-floor-plan-source`)) {
					map.removeSource(`ac2-${id}-floor-plan-source`);
				}
			}
		};
	}, [map, id]);
	return null;
};

FloorPlan.propTypes = propTypes;
FloorPlan.defaultProps = defaultProps;

export default FloorPlan;