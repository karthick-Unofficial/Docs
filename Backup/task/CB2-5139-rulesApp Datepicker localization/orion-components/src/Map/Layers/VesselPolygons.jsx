import React, { Fragment, memo, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Layer, Source } from "react-mapbox-gl";
import { polygon, lengthToDegrees } from "@turf/helpers";
import rotate from "@turf/transform-rotate";

const propTypes = {
	vessels: PropTypes.object.isRequired,
	before: PropTypes.string
};

const VesselPolygons = ({ vessels, minZoom, before }) => {
	const [polygons, setPolygons] = useState([]);
	useEffect(() => {
		const newPolygons = [];
		Object.values(vessels)
			.filter(vessel => {
				const { geometry, properties } = vessel.entityData;
				const { heading, hdg } = properties;
				// 511 is an unavailable heading
				return geometry && (heading || hdg) && hdg !== 511;
			})
			.forEach(vessel => {
				const { geometry, properties } = vessel.entityData;
				const {
					dimA = 0,
					dimB = 0,
					dimC = 0,
					dimD = 0,
					heading,
					hdg,
					length
				} = properties;
				const { coordinates } = geometry;
				const [x, y] = coordinates;
				const starboard = x + lengthToDegrees(dimD, "meters");
				const port = x - lengthToDegrees(dimC, "meters");
				const bow = y + lengthToDegrees(dimA, "meters");
				const stern = y - lengthToDegrees(dimB, "meters");
				const centerX =
					starboard - lengthToDegrees((dimC + dimD) / 2, "meters");
				const noseStart = stern + lengthToDegrees(length * 0.8, "meters");
				const a = [centerX, bow];
				const b = [starboard, noseStart];
				const c = [starboard, stern];
				const d = [port, stern];
				const e = [port, noseStart];
				const poly = rotate(polygon([[a, b, c, d, e, a]]), heading || hdg, {
					pivot: coordinates
				});
				newPolygons.push(poly);
			});
		setPolygons(newPolygons);
	}, [vessels]);
	return (
		<Fragment>
			<Source
				id="ac2-vessel-polygons-source"
				geoJsonSource={{
					type: "geojson",
					data: { type: "FeatureCollection", features: polygons }
				}}
			/>
			<Layer
				id="ac2-vessel-polygons"
				sourceId="ac2-vessel-polygons-source"
				type="fill"
				paint={{ "fill-color": "#35b7f3", "fill-opacity": 0.5 }}
				minZoom={minZoom}
				before={before}
			/>
		</Fragment>
	);
};

VesselPolygons.propTypes = propTypes;

export default VesselPolygons;
