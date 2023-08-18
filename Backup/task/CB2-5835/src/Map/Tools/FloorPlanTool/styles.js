const styles = [
	{
		id: "gl-draw-polygon-fill",
		type: "fill",
		filter: ["==", "$type", "Polygon"],
		paint: {
			"fill-color": "#FFF",
			"fill-opacity": 0.1
		}
	},
	{
		id: "gl-draw-polygon-stroke-active",
		type: "line",
		filter: ["==", "$type", "Polygon"],
		paint: {
			"line-color": "#35b7f3",
			"line-width": 4
		}
	},
	{
		id: "gl-draw-line",
		type: "line",
		filter: ["==", "$type", "LineString"],
		layout: {
			"line-cap": "round",
			"line-join": "round"
		},
		paint: {
			"line-color": "#35b7f3",
			"line-dasharray": [0.2, 2],
			"line-width": 4
		}
	},
	{
		id: "highlight-active-points",
		type: "circle",
		filter: ["==", "$type", "Point"],
		paint: {
			"circle-radius": ["case", ["==", ["get", "user_rotateHandle"], true], 12, 7],
			"circle-color": "#35b7f3",
			"circle-stroke-color": "#FFF",
			"circle-stroke-width": [
				"case",
				["==", ["get", "user_rotateHandle"], true],
				3,
				["==", ["get", "user_hover"], true],
				4,
				0
			]
		}
	}
];

export default styles;
