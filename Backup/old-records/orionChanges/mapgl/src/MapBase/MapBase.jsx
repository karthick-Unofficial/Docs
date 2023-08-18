// react
import React, { Component, Fragment } from "react";

// mapbox
import ReactMapboxGl, { RotationControl, ZoomControl } from "react-mapbox-gl";

//components
import LayerSourcesContainer from "./LayerSources/LayerSourcesContainer";
import { default as ContextMenu } from "./ContextMenu/ContextMenuContainer";

// utility
import _ from "lodash";

// mapstyles
import aresTileServer from "./mapstyles/ares/aresTileServer.json";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

// metrics
import Metric from "browser-metrics/lib/Metric";
const metric = new Metric("INITIAL_LOAD");

// Mapbox doesn't support relative urls for sprite paths, so we have to grab the correct hostname here and set manually
const setSpritePath = path =>
	path.replace(
		"please-replace-me-with-the-correct-hostname",
		location.hostname
	);


aresTileServer.sprite = setSpritePath(aresTileServer.sprite);

const Map = ReactMapboxGl({
	accessToken:
"pk.eyJ1IjoibGNsYXJrc29uIiwiYSI6ImNpaWh2dzlnaDAwZmp1ZGtueXdpa2loNXcifQ.gcbR_GT1AD2kUmIxkSxseA"
});

class MapBaseMapboxGL extends Component {
	state = {
		map: null,
		mapStyle: {}
	};

	componentDidMount() {
		metric.start();
	}

	static getDerivedStateFromProps(props, state) {
		if (props.baseMaps.length > 0) {
			const { style } = props;
			const baseMapSelection = props.baseMaps.filter((element) => element.name === style)[0];
			let spritePath = baseMapSelection.style;
			spritePath.sprite = setSpritePath(spritePath.sprite);
			return {
				mapStyle: spritePath
			};
		}

	}

	setMap(map) {
		this.props.setMapReference(map);

		this.setState({
			map: map
		});
	}

	setPosition = map => {
		const { updatePersistedState } = this.props;
		// convert center object to array
		const newCoords = Object.values(map.getCenter());
		updatePersistedState("map-app", "mapSettings", {
			mapCenter: newCoords,
			mapZoom: map.getZoom()
		});
	};

	shouldComponentUpdate(nextProps, nextState) {
		const { style, WavCam } = this.props;

		if (!this.state.map || style !== nextProps.style || WavCam !== nextProps.WavCam) {
			return true;
		} else {
			return false;
		}
	}



	render() {
		const { zoom, center, WavCam } = this.props;
		const { mapStyle } = this.state;
		return (
			<Map
				ref="map"
				/* Comment out accessToken and style below to use internal tile server */
				style={mapStyle}
				center={center}
				maxZoom={18}
				minZoom={2} // was at 2
				zoom={[zoom]}
				/* Uncomment this line to use local settings for tile server */
				/* style={simple} */
				containerStyle={{ width: "100%", height: `calc(100vh - ${WavCam ? "288px" : "48px"})` }}
				onStyleLoad={map => {
				metric.end();
				console.log(`\nMap Loaded in : ${metric.duration} ms.\n`);

					this.setMap(map);
				}}
				className="mapChild"
				movingMethod="easeTo"
				onMoveEnd={map => this.setPosition(map)}
			>
				<ZoomControl />
				<RotationControl />
				{this.state.map && (
					<Fragment>
						<LayerSourcesContainer map={this.state.map} />
						<ContextMenu map={this.state.map} />
					</Fragment>
				)}
			</Map>
		);
	}
}

export default MapBaseMapboxGL;