const styles = [
	{
		id: "gl-draw-polygon-stroke-active",
		type: "line",
		filter: ["all", ["==", "$type", "Polygon"], ["!=", "mode", "static"]],
		paint: {
			"line-color": [
				"case",
				["has", "user_strokeColor"],
				["get", "user_strokeColor"],
				"#35b7f3"
			],
			"line-width": 10
		}
	},
	{
		id: "highlight-active-points",
		type: "symbol",
		filter: [
			"all",
			["==", "$type", "Point"],
			["==", "meta", "feature"],
			["!=", "mode", "static"]
		],
		paint: {
			"text-color": "#FFF",
			"text-halo-color": "#FFF",
			"text-halo-width": 1
		},
		layout: {
			"text-field": "|",
			"text-rotate": [
				"case",
				["==", ["get", "user_movement"], "lng"],
				0,
				90
			]
		}
	}
];

export default styles;
