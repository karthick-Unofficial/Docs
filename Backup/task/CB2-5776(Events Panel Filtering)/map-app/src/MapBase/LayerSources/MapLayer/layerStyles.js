export const layerStyles = (type, labelsVisible, feature) => {
	switch (type) {
		case "Line":
		case "LineString":
			return {
				layout: {
					line: {
						"line-join": "round",
						"line-cap": "round"
					},
					dashed: {
						"line-join": "miter",
						"line-cap": "butt"
					},
					dotted: {
						"line-join": "round",
						"line-cap": "round"
					},
					symbol: {
						shapes: {
							"symbol-placement": "line",
							"text-field": labelsVisible ? "{name}" : "",
							"text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
							"text-transform": "uppercase",
							"text-size": 10,
							"text-allow-overlap": false
						}
					}
				},
				paint: {
					symbol: {
						"text-color": "#000000",
						"text-halo-color": "rgba(255, 255, 255, 1)",
						"text-halo-width": 2
					},
					line: {
						shapes: {
							"line-color": {
								type: "identity",
								property: "polyStroke",
								default: "#35b7f3"
							},
							"line-width": {
								type: "identity",
								property: "lineWidth",
								default: 3
							}
						},
						dashed: {
							"line-color": {
								type: "identity",
								property: "polyStroke",
								default: "#35b7f3"
							},
							"line-width": {
								type: "identity",
								property: "lineWidth",
								default: 3
							},
							"line-dasharray": [2, 2]
						},
						dotted: {
							"line-color": {
								type: "identity",
								property: "polyStroke",
								default: "#35b7f3"
							},
							"line-width": {
								type: "identity",
								property: "lineWidth",
								default: 3
							},
							"line-dasharray": [0, 2]
						}
					}
				}
			};

		case "Point": {
			return {
				layout: {
					symbol: {
						track: {
							"icon-image": "{mapIcon}",
							"icon-size": 1,
							"icon-rotate": [
								"case",
								["any", ["all", ["has", "course"], ["has", "heading"]], ["has", "heading"]],
								["get", "heading"],
								[
									"any",
									["all", ["has", "course"], ["has", "hdg"], ["!=", ["get", "hdg"], 511]],
									["all", ["has", "hdg"], ["!=", ["get", "hdg"], 511]]
								],
								["get", "hdg"],
								[
									"any",
									["all", ["has", "course"], ["has", "hdg"], ["==", ["get", "hdg"], 511]],
									["has", "course"]
								],
								["get", "course"],
								0
							],
							"icon-allow-overlap": true,
							"text-field": labelsVisible ? "{name}" : "",
							"text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
							"text-size": 12,
							"text-letter-spacing": 0,
							"text-offset": [2, 0],
							"icon-rotation-alignment": "map",
							"text-anchor": "left",
							"text-transform": "uppercase",
							"text-optional": true,
							"text-allow-overlap": false
						},
						shapes: {
							"icon-image": feature
								? ["case", ["==", ["get", "id"], `${feature.id}`], "", ["get", "symbol"]]
								: "{symbol}",
							"icon-size": 1,
							"icon-allow-overlap": true,
							"text-field": labelsVisible ? "{name}" : "",
							"text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
							"text-size": 12,
							"text-letter-spacing": 0,
							"text-offset": [
								"case",
								["==", ["get", "symbol"], "marker"],
								["literal", [1, 0]],
								["literal", [2.2, 0]]
							],
							"text-anchor": "left",
							"text-transform": "uppercase",
							"text-optional": true,
							"icon-offset": [
								"case",
								["==", ["get", "symbol"], "marker"],
								["literal", [0, -10]],
								["literal", [0, 0]]
							],
							"text-allow-overlap": false
						},
						camera: {
							"icon-image": ["case", ["has", "mapIcon"], ["get", "mapIcon"], "Camera_gray"],
							"icon-size": 1,
							"icon-allow-overlap": true,
							"text-field": labelsVisible ? "{name}" : "",
							"text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
							"text-size": 12,
							"text-letter-spacing": 0,
							"text-offset": [2, 0],
							"text-anchor": "left",
							"text-transform": "uppercase",
							"text-optional": true,
							"text-allow-overlap": false
						},
						accessPoint: {
							"icon-image": ["case", ["has", "mapIcon"], ["get", "mapIcon"], "Sensor_gray"],
							"icon-size": 1,
							"icon-allow-overlap": true,
							"text-field": labelsVisible ? "{name}" : "",
							"text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
							"text-size": 12,
							"text-letter-spacing": 0,
							"text-offset": [2, 0],
							"text-anchor": "left",
							"text-transform": "uppercase",
							"text-optional": true,
							"text-allow-overlap": false
						}
					}
				},
				paint: {
					symbol: {
						"text-color": "#000000",
						"text-halo-color": "rgba(255, 255, 255, 1)",
						"text-halo-width": 2
					}
				}
			};
		}
		case "Polygon":
			return {
				layout: {
					symbol: {
						shapes: {
							"symbol-placement": "point",
							"text-field": labelsVisible ? "{name}" : "",
							"text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
							"text-size": 10,
							"text-letter-spacing": 0,
							"text-anchor": "center",
							"text-transform": "uppercase",
							"text-optional": true,
							"symbol-avoid-edges": true,
							"text-allow-overlap": false
						}
					},
					dashed: {
						"line-join": "miter",
						"line-cap": "butt"
					},
					dotted: {
						"line-join": "round",
						"line-cap": "round"
					}
				},
				paint: {
					fill: {
						"fill-color": {
							type: "identity",
							property: "polyFill",
							default: "#35b7f3"
						},
						"fill-opacity": {
							type: "identity",
							property: "polyFillOpacity",
							default: 0.2
						},
						"fill-antialias": true,
						"fill-outline-color": {
							type: "identity",
							property: "polyStroke",
							default: "#35b7f3"
						}
					},
					symbol: {
						"text-color": "#000000",
						"text-halo-color": "rgba(255, 255, 255, 1)",
						"text-halo-width": 2
					},
					line: {
						fovs: {
							"line-color": {
								type: "identity",
								property: "polyStroke",
								default: "#35b7f3"
							},
							"line-width": {
								type: "identity",
								property: "lineWidth",
								default: 1
							}
						},
						shapes: {
							"line-color": {
								type: "identity",
								property: "polyStroke",
								default: "#35b7f3"
							},
							"line-width": {
								type: "identity",
								property: "lineWidth",
								default: 1
							}
						},
						dashed: {
							"line-color": {
								type: "identity",
								property: "polyStroke",
								default: "#35b7f3"
							},
							"line-width": {
								type: "identity",
								property: "lineWidth",
								default: 3
							},
							"line-dasharray": [2, 2]
						},
						dotted: {
							"line-color": {
								type: "identity",
								property: "polyStroke",
								default: "#35b7f3"
							},
							"line-width": {
								type: "identity",
								property: "lineWidth",
								default: 3
							},
							"line-dasharray": [0, 2]
						}
					}
				}
			};

		default:
			return { layout: {}, paint: {} };
	}
};
