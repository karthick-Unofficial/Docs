import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";

import $ from "jquery";

const propTypes = {
	map: PropTypes.object.isRequired,
	firstObject: PropTypes.object.isRequired,
	secondObject: PropTypes.object,
	thirdObject: PropTypes.object,
	markerSizes: PropTypes.object.isRequired
};

const MapObjectConnector = ( { map, firstObject, secondObject, thirdObject, markerSizes } ) => {
	const setRerender = useState(0)[1];
	const [ id ] = useState(`mapObjectConnector_${Math.ceil(Math.random() * 100000)}`);

	useEffect(() => {
		const idSelector = `#${id}`;
		const triggerRerender = () => {
			setRerender(Math.random());
		};

		$(idSelector)
			.detach()
			.appendTo("#root");

		if (map) {
			map.on("moveend", triggerRerender);
		}

		return () => {
			$(idSelector).remove();
			if (map) {
				map.off("moveend", triggerRerender);
			}
		};
	}, [map]);

	const getRadiusForEntity = (properties) => {
		let markerSize;
		if (properties.entityType === "agent") {
			markerSize = markerSizes.agents[properties.team];
			return ((markerSize * 50) / 2) + 5;
		}
		return ((markerSizes.others * 40) / 2) + 5;
	};

	const drawConnector = () => {
		const mapPosition = $(map.getCanvas()).offset();

		let centerCoords1;
		let radius1 = 16;
		const entityData1 = firstObject.entityData ? firstObject.entityData : firstObject;
		if (entityData1.properties && entityData1.properties.entityType) {
			centerCoords1 = map.project(entityData1.geometry.coordinates);
			radius1 = getRadiusForEntity(entityData1.properties);
		} else {
			centerCoords1 = map.project(firstObject.coordinates);
		}

		const xOne = centerCoords1.x + mapPosition.left;
		const yOne = centerCoords1.y + mapPosition.top;
		
		let centerCoords2, centerCoords3;
		let radius2 = 16;
		let radius3 = 16;
		let xTwo, yTwo, xThree, yThree, xFour, yFour;
		let xFive, yFive, xSix, ySix, xSeven, ySeven;

		if (secondObject) {
			const entityData2 = secondObject.entityData ? secondObject.entityData : (secondObject.entity? secondObject.entity: secondObject );
			
			if (entityData2.properties && entityData2.properties.entityType) {
				centerCoords2 = map.project(entityData2.geometry.coordinates);
				radius2 = getRadiusForEntity(entityData2.properties);
			} else {
				try {
					centerCoords2 = map.project(entityData2.geometry? entityData2.geometry.coordinates : entityData2.coordinates);
				} catch (error) {
					console.log("MapObjectConnector - Error occurred setting centerCoords2.");
				}
			}

			xTwo = centerCoords2.x + mapPosition.left;
			yTwo = centerCoords2.y + mapPosition.top;

			// Set line x3/y3 and x4/y4 on outside of circle
			const adjacent = Math.abs(xOne - xTwo);
			const opposite = Math.abs(yOne - yTwo);
			const theta = Math.atan2(opposite, adjacent);

			if (xOne < xTwo) {
				xThree = xOne + radius1 * Math.cos(theta);
				xFour = xTwo - radius2 * Math.cos(theta);
			} else {
				xThree = xOne - radius1 * Math.cos(theta);
				xFour = xTwo + radius2 * Math.cos(theta);
			}

			if (yOne < yTwo) {
				yThree = yOne + radius1 * Math.sin(theta);
				yFour = yTwo - radius2 * Math.sin(theta);
			} else {
				yThree = yOne - radius1 * Math.sin(theta);
				yFour = yTwo + radius2 * Math.sin(theta);
			}
		}

		if (thirdObject) {
			const entityData3 = thirdObject.entityData ? thirdObject.entityData : (thirdObject.entity? thirdObject.entity: thirdObject );
			
			if (entityData3.properties && entityData3.properties.entityType) {
				centerCoords3 = map.project(entityData3.geometry.coordinates);
				radius3 = getRadiusForEntity(entityData3.properties);
			} else {
				try {
					centerCoords3 = map.project(entityData3.geometry? entityData3.geometry.coordinates : entityData3.coordinates);
				} catch (error) {
					console.log("MapObjectConnector - Error occurred setting centerCoords3.");
				}
			}

			xFive = centerCoords3.x + mapPosition.left;
			yFive = centerCoords3.y + mapPosition.top;

			// Set line x3/y3 and x4/y4 on outside of circle
			const adjacent = Math.abs(xOne - xFive);
			const opposite = Math.abs(yOne - yFive);
			const theta = Math.atan2(opposite, adjacent);

			if (xOne < xFive) {
				xSix = xOne + radius1 * Math.cos(theta);
				xSeven = xFive - radius3 * Math.cos(theta);
			} else {
				xSix = xOne - radius1 * Math.cos(theta);
				xSeven = xFive + radius3 * Math.cos(theta);
			}

			if (yOne < yFive) {
				ySix = yOne + radius1 * Math.sin(theta);
				ySeven = yFive - radius3 * Math.sin(theta);
			} else {
				ySix = yOne - radius1 * Math.sin(theta);
				ySeven = yFive + radius3 * Math.sin(theta);
			}
		}

		const lineStyles = {
			top: 0,
			position: "fixed",
			zIndex: 1200,
			pointerEvents: "none"
		};

		return (
			<div id={id} style={lineStyles}>
				<svg width="2000" height="1200">
					<circle
						cx={xOne}
						cy={yOne}
						r={radius1}
						stroke="#4db5f4"
						strokeWidth="1.75"
						fill="#4db5f452"
					/>
					{secondObject &&
						<Fragment>
							<circle
								cx={xTwo}
								cy={yTwo}
								r={radius2}
								stroke="#4db5f4"
								strokeWidth="1.75"
								fill="#4db5f452"
							/>
							<line
								x1={xThree}
								y1={yThree}
								x2={xFour}
								y2={yFour}
								stroke="#4db5f4"
								strokeWidth="1.75"
							/>
						</Fragment>
					}
					{thirdObject &&
						<Fragment>
							<circle
								cx={xFive}
								cy={yFive}
								r={radius3}
								stroke="#4db5f4"
								strokeWidth="1.75"
								fill="#4db5f452"
							/>
							<line
								x1={xSix}
								y1={ySix}
								x2={xSeven}
								y2={ySeven}
								stroke="#4db5f4"
								strokeWidth="1.75"
							/>
						</Fragment>
					}
				</svg>
			</div>
		);
	};

	return (
		<div>
			{drawConnector()}
		</div>
	);
};

MapObjectConnector.propTypes = propTypes;
export default MapObjectConnector;