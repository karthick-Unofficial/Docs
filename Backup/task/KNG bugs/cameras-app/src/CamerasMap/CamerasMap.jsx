import React, { Component } from "react";

// Mapbox
import ReactMapboxGl, { RotationControl, ZoomControl } from "react-mapbox-gl";

// Components
import CamerasMapLayersContainer from "./CamerasMapLayers/CamerasMapLayersContainer";
// Map Styles
import aresTileServer from "./mapstyles/ares/aresTileServer.json";

import { ContextMenuContainer } from "orion-components/Map/ContextMenu";
import ErrorBoundary from "orion-components/ErrorBoundary";

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
	constructor(props) {
		super(props);

		this.state = {
			map: null,
			mapStyle: {}
		};
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

	setMap = map => {
		// Only on first style load
		this.props.setMapReference(map);
		// Set up future style loads to reinsert layers
		// map.on("style.load", () => {
		// 	// this.props.enableLayers();
		// });
		this.setState({
			map: map
		});
	};

	setPosition = map => {
		const { updatePersistedState } = this.props;
		// convert center object to array
		const newCoords = Object.values(map.getCenter());
		updatePersistedState("cameras-app", "mapSettings", {
			mapCenter: newCoords,
			mapZoom: map.getZoom()
		});
	};

	shouldComponentUpdate(nextProps) {
		if (this.state.map && this.props.WavCamOpen === nextProps.WavCamOpen) {
			return false;
		} else {
			return true;
		}
	}



	getToken() {
		return "pk.eyJ1IjoibGNsYXJrc29uIiwiYSI6ImNpaWh2dzlnaDAwZmp1ZGtueXdpa2loNXcifQ.gcbR_GT1AD2kUmIxkSxseA";
	}

	render() {
		const { zoom, center, WavCamOpen } = this.props;
		const { mapStyle } = this.state;
		return (
			<Map
				ref="map"
				/* Comment out accessToken and style below to use internal tile server */
				style={mapStyle}
				center={center}
				maxZoom={18}
				minZoom={2}
				zoom={[zoom]}
				/* Uncomment this line to use local settings for tile server */
				/* style={simple} */
				containerStyle={{ width: "100vw", height: `calc(100vh - ${WavCamOpen ? "288px" : "48px"})` }}
				onStyleLoad={map => this.setMap(map)}
				className="map-base"
				movingMethod="easeTo"
				onMoveEnd={this.setPosition}
			>
				<ZoomControl />
				<RotationControl />
				{this.state.map && (
					<ErrorBoundary>
						<CamerasMapLayersContainer map={this.state.map} />
						<ContextMenuContainer map={this.state.map} />
					</ErrorBoundary>
				)}
			</Map>
		);
	}
}

export default MapBaseMapboxGL;
