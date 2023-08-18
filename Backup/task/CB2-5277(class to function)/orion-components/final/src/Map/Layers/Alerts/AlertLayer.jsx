import React, { Fragment, useEffect } from "react";
import { Source, Layer } from "react-mapbox-gl";

const AlertLayer = ({
	openAlertProfile,
	map,
	forReplay,
	alerts,
	before
}) => {

	useEffect(() => {
		map.on("click", "alerts", e => {
			const features = map.queryRenderedFeatures(e.point);
			const { properties } = features[0];
			if (properties) {
				const alert = alerts[properties.id];
				if (alert) {
					openAlertProfile(alert, forReplay);
				}
			}
		});
	}, []);

	const getAlertGeoJSON = () => {
		const features = Object.values(alerts).map(alert => {
			const { geometry, id } = alert;
			const data = {
				geometry,
				properties: { id }
			};
			return data;
		});
		return features;
	};

	return (
		<Fragment>
			<Source
				id="ac2-alerts"
				geoJsonSource={{
					type: "geojson",
					data: {
						type: "FeatureCollection",
						features: getAlertGeoJSON()
					}
				}}
			/>

			<Layer
				key="alerts"
				id="ac2-alerts"
				sourceId="ac2-alerts"
				type="symbol"
				layout={{
					"icon-image": "alert",
					"icon-size": 1,
					"icon-allow-overlap": true
				}}
				before={before}
			/>
		</Fragment>
	);
};

export default AlertLayer;
