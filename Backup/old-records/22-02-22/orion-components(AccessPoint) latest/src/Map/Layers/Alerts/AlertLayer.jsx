import React, { PureComponent, Fragment } from "react";
import { Source, Layer } from "react-mapbox-gl";

class AlertLayer extends PureComponent {
	componentDidMount = () => {
		const { openAlertProfile, map, forReplay } = this.props;
		map.on("click", "alerts", e => {
			const features = map.queryRenderedFeatures(e.point);
			const { properties } = features[0];
			if (properties) {
				const alert = this.props.alerts[properties.id];
				if (alert) {
					openAlertProfile(alert, forReplay);
				}
			}
		});
	};

	getAlertGeoJSON = () => {
		const { alerts } = this.props;
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

	render() {
		return (
			<Fragment>
				<Source
					id="ac2-alerts"
					geoJsonSource={{
						type: "geojson",
						data: {
							type: "FeatureCollection",
							features: this.getAlertGeoJSON()
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
					before={this.props.before}
				/>
			</Fragment>
		);
	}
}

export default AlertLayer;
