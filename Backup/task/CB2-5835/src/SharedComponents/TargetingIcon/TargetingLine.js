import React, { useEffect, useState } from "react";
import center from "@turf/center";
import { polygon, point, lineString, multiPolygon } from "@turf/helpers";

import $ from "jquery";

const ROTATION_SPEED = 0.2;

// cSpell:ignore millis
const TargetingLine = ({ config, map, geometry, x, y }) => {
	const time = Date.now();
	const [millis, setMillis] = useState(time);
	const [request, setRequest] = useState(null);

	useEffect(() => {
		// Prevents { position: fixed } from working improperly within a parent element that has a CSS transform
		$("#targeting-line").detach().appendTo("#root");

		setRequest(requestAnimationFrame(tick));

		return () => {
			$("#targeting-line").remove();
			cancelAnimationFrame(request);
		};
	}, []);

	const tick = () => {
		setMillis(Date.now());
		setRequest(requestAnimationFrame(tick));
	};

	const drawTargetingLine = (x1, y1) => {
		const defaults = {
			xOffset: 0,
			yOffset: 0
		};

		// Configuration to compensate for absolute positioning on sidebars
		const options = {
			...defaults,
			...config
		};

		// Centering calculations
		let feature;
		switch (geometry.type) {
			case "Point":
				feature = point(geometry.coordinates);
				break;
			case "LineString":
				feature = lineString(geometry.coordinates);
				break;
			case "Polygon":
				feature = polygon(geometry.coordinates);
				break;
			case "MultiPolygon":
				feature = multiPolygon(geometry.coordinates);
				break;
			default:
				break;
		}

		const centerCoords = map.project(center(feature).geometry.coordinates);

		// Set width of circle dependent on zoom
		const radius = 3 * map.getZoom();
		const xOne = x1 + options.xOffset;
		const yOne = y1; // + options.yOffset;
		const xTwo = centerCoords.x - 5 + options.xOffset;
		const yTwo = centerCoords.y + options.yOffset;

		// Set line x2/y2 on outside of circle
		const adjacent = Math.abs(xOne - xTwo);
		const opposite = Math.abs(yOne - yTwo);
		const theta = Math.atan2(opposite, adjacent);
		let xThree;
		let yThree;

		xOne < xTwo ? (xThree = xTwo - radius * Math.cos(theta)) : (xThree = xTwo + radius * Math.cos(theta));

		yOne < yTwo ? (yThree = yTwo - radius * Math.sin(theta)) : (yThree = yTwo + radius * Math.sin(theta));

		const lineStyles = {
			top: 48, // Offset for Menu Bar
			position: "fixed",
			zIndex: 999999999,
			pointerEvents: "none",
			left: 6 // Offset for icon padding
		};

		return (
			<div id="targeting-line" style={lineStyles}>
				<svg width="2000" height="1200">
					<line x1={xOne} y1={yOne} x2={xThree} y2={yThree} stroke="black" strokeWidth="1.75" />
					<line x1={xOne} y1={yOne} x2={xThree} y2={yThree} stroke="white" strokeWidth="1.5" />
					<g
						className="targetingCircle"
						transform={`rotate(${(millis * ROTATION_SPEED) % 360} ${xTwo} ${yTwo})`}
					>
						<circle cx={xTwo} cy={yTwo} r={radius} stroke="black" strokeWidth="1.75" fill="none" />
						<circle cx={xTwo} cy={yTwo} r={radius} stroke="white" strokeWidth="1.5" fill="none" />
						<line
							x1={xTwo - radius}
							y1={yTwo}
							x2={xTwo - radius / 2}
							y2={yTwo}
							stroke="black"
							strokeWidth="1.75"
						/>
						<line
							x1={xTwo - radius}
							y1={yTwo}
							x2={xTwo - radius / 2}
							y2={yTwo}
							stroke="white"
							strokeWidth="1.5"
						/>
						<line
							x1={xTwo + radius}
							y1={yTwo}
							x2={xTwo + radius / 2}
							y2={yTwo}
							stroke="black"
							strokeWidth="1.75"
						/>
						<line
							x1={xTwo + radius}
							y1={yTwo}
							x2={xTwo + radius / 2}
							y2={yTwo}
							stroke="white"
							strokeWidth="1.5"
						/>
						<line
							x1={xTwo}
							y1={yTwo - radius}
							x2={xTwo}
							y2={yTwo - radius / 2}
							stroke="black"
							strokeWidth="1.75"
						/>
						<line
							x1={xTwo}
							y1={yTwo - radius}
							x2={xTwo}
							y2={yTwo - radius / 2}
							stroke="white"
							strokeWidth="1.5"
						/>
						<line
							x1={xTwo}
							y1={yTwo + radius}
							x2={xTwo}
							y2={yTwo + radius / 2}
							stroke="black"
							strokeWidth="1.75"
						/>
						<line
							x1={xTwo}
							y1={yTwo + radius}
							x2={xTwo}
							y2={yTwo + radius / 2}
							stroke="white"
							strokeWidth="1.5"
						/>
					</g>
				</svg>
			</div>
		);
	};

	return <div>{drawTargetingLine(x, y)}</div>;
};

export default TargetingLine;
