// cSpell:ignore millis
import React, { useEffect, useState } from "react";

const ROTATION_SPEED = 0.2;

const TargetingLine = ({ config, entityGeo, map, x, y }) => {
	const [millis, setMillis] = useState(Date.now());
	const [request, setRequest] = useState(null);

	useEffect(() => {
		setRequest(requestAnimationFrame(tick));
	}, []);

	useEffect(() => {
		return () => {
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
		let coords;
		switch (entityGeo.type) {
			case "Point":
				coords = map.project(entityGeo.coordinates);
				break;
			case "LineString": {
				const line = Object.values(entityGeo.coordinates);

				// Get line center
				const lineCenter = line.reduce(
					(x, y) => {
						return [
							x[0] + y[0] / line.length,
							x[1] + y[1] / line.length
						];
					},
					[0, 0]
				);

				coords = map.project(lineCenter);
				break;
			}
			case "Polygon": {
				// Map coordinate objects to an arry
				const poly = entityGeo.coordinates[0].map((obj) => {
					return Object.keys(obj)
						.sort()
						.map((key) => {
							return obj[key];
						});
				});
				// Get Polygon center
				let a = 0;
				let b = 0;
				let c = 0;
				const length = poly.length;
				const x = function (i) {
					return poly[i % length][0];
				};
				const y = function (i) {
					return poly[i % length][1];
				};
				for (let i = 0; i < poly.length; i++) {
					const m = x(i) * y(i + 1) - x(i + 1) * y(i);
					a += m;
					b += (x(i) + x(i + 1)) * m;
					c += (y(i) + y(i + 1)) * m;
				}
				const n = 3 * a;
				const polyCenter = [b / n, c / n];

				coords = map.project(polyCenter);
				break;
			}
			default:
				break;
		}

		// set width of circle dependent on zoom
		const radius = 4 * map.getZoom();
		const xOne = x1 + options.xOffset;
		const yOne = y1 + options.yOffset;
		const xTwo = coords.x - 5 + options.xOffset;
		const yTwo = coords.y + options.yOffset;
		const adjacent = Math.abs(xOne - xTwo);
		const opposite = Math.abs(yOne - yTwo);
		const theta = Math.atan2(opposite, adjacent);
		let xThree;
		let yThree;

		if (xOne < xTwo) {
			xThree = xTwo - radius * Math.cos(theta);
		} else {
			xThree = xTwo + radius * Math.cos(theta);
		}

		if (yOne < yTwo) {
			yThree = yTwo - radius * Math.sin(theta);
		} else {
			yThree = yTwo + radius * Math.sin(theta);
		}

		return (
			<div className="targetingLine">
				<svg width="2000" height="1200">
					<line
						x1={xOne}
						y1={yOne}
						x2={xThree}
						y2={yThree}
						stroke="black"
						strokeWidth="1.75"
					/>
					<line
						x1={xOne}
						y1={yOne}
						x2={xThree}
						y2={yThree}
						stroke="white"
						strokeWidth="1.5"
					/>
					<g
						className="targetingCircle"
						transform={`rotate(${
							(millis * ROTATION_SPEED) % 360
						} ${xTwo} ${yTwo})`}
					>
						<circle
							cx={xTwo}
							cy={yTwo}
							r={radius}
							stroke="black"
							strokeWidth="1.75"
							fill="none"
						/>
						<circle
							cx={xTwo}
							cy={yTwo}
							r={radius}
							stroke="white"
							strokeWidth="1.5"
							fill="none"
						/>
						<line
							x1={xTwo - radius}
							y1={yTwo}
							x2={xTwo - radius - radius / 2}
							y2={yTwo}
							stroke="black"
							strokeWidth="1.75"
						/>
						<line
							x1={xTwo - radius}
							y1={yTwo}
							x2={xTwo - radius - radius / 2}
							y2={yTwo}
							stroke="white"
							strokeWidth="1.5"
						/>
						<line
							x1={xTwo + radius}
							y1={yTwo}
							x2={xTwo + radius + radius / 2}
							y2={yTwo}
							stroke="black"
							strokeWidth="1.75"
						/>
						<line
							x1={xTwo + radius}
							y1={yTwo}
							x2={xTwo + radius + radius / 2}
							y2={yTwo}
							stroke="white"
							strokeWidth="1.5"
						/>
						<line
							x1={xTwo}
							y1={yTwo - radius}
							x2={xTwo}
							y2={yTwo - radius - radius / 2}
							stroke="black"
							strokeWidth="1.75"
						/>
						<line
							x1={xTwo}
							y1={yTwo - radius}
							x2={xTwo}
							y2={yTwo - radius - radius / 2}
							stroke="white"
							strokeWidth="1.5"
						/>
						<line
							x1={xTwo}
							y1={yTwo + radius}
							x2={xTwo}
							y2={yTwo + radius + radius / 2}
							stroke="black"
							strokeWidth="1.75"
						/>
						<line
							x1={xTwo}
							y1={yTwo + radius}
							x2={xTwo}
							y2={yTwo + radius + radius / 2}
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
