import React, { PureComponent, Fragment } from "react";
import { Source, Layer } from "react-mapbox-gl";
import _ from "lodash";

class BasicLayer extends PureComponent {
	componentDidMount = () => {
		const { map, layer, labelsVisible, handleClick } = this.props;
		const { layerTypes, name } = layer;
		const primaryType = this.getPrimaryLayerType(layerTypes);
		const features = layer.features || layer.data.features || [];
		const mapboxType = features && features[0] && features[0].geometry.type ? features[0].geometry.type : "-unknown";
		// Remove labels if labelsVisible is false
		if (!labelsVisible) {
			map.setLayoutProperty(`ac2-${name}-${mapboxType}-symbol`, "text-field", "");
		}
		if (_.includes(layerTypes, "symbol")) {
			this.handleLoadImages();
		}
		map.on("click", `ac2-${name}-${mapboxType}-${primaryType}`, e => {
			if (e.features[0]) {
				const { id, name } = e.features[0].properties;
				handleClick(id, name, layer.id);
			}
		});
	};

	componentDidUpdate = (prevProps, prevState) => {
		const { map, layer, layerTypes, labelsVisible } = this.props;
		const { name } = layer;
		const features = layer.features || layer.data.features || [];
		const mapboxType = features && features[0] && features[0].geometry.type ? features[0].geometry.type : "-unknown";
		if (!labelsVisible && prevProps.labelsVisible) {
			map.setLayoutProperty(`ac2-${name}-${mapboxType}-symbol`, "text-field", "");
		}
		if (labelsVisible && !prevProps.labelsVisible) {
			map.setLayoutProperty(`ac2-${name}-${mapboxType}-symbol`, "text-field", ["case", ["has", "text-field"], ["get", "text-field"], ["get", "name"]]);
		}
		if (_.includes(layerTypes, "symbol")) {
			this.handleLoadImages();
		}
	};

	handleLoadImages = () => {
		const { map, layer } = this.props;
		const { images, serviceId } = layer;
		_.each(images, image => {
			const { url, id } = image;
			let resourceUrl = url;
			if (url.indexOf("http://") < 0 && url.indexOf("https://") < 0) {
				const sID = `${serviceId}-`;
				const removeSID = new RegExp(sID, "g");
				const layerId = layer.id.replace(removeSID, "");
				resourceUrl = `${layerId}/images/${url}`;
			}
			if (!map.hasImage(id)) {
				map.loadImage(
					`/gis-app/api/proxy-resource?serviceId=${serviceId}&resourceUrl=${resourceUrl}`,
					(err, data) => {
						if (err) {
							console.log("ERROR", err);
						} else {
							map.addImage(id, data);
						}
					}
				);
			}
		});
	};

	/**
	 * Grab primary layer type
	 * @param {array} layerTypes - all the layer types used to build features on map
	 * All layers will have a symbol type for displaying names. For example, polygons may have
	 * a fill, line (for outlines), and a symbol layer. We want to ensure that the fill layer
	 * is selected for click interactions, etc.
	 */
	getPrimaryLayerType = layerTypes => {
		if (_.includes(layerTypes, "fill")) {
			return "fill";
		} else if (_.includes(layerTypes, "line")) {
			return "line";
		} else if (_.includes(layerTypes, "circle")) {
			return "circle";
		} else {
			return "symbol";
		}
	};

	renderLayers = () => {
		const { layer, before } = this.props;
		const { name, layerTypes, layout, paint } = layer;
		const features = layer.features || layer.data.features || [];
		const mapboxType = features && features[0] && features[0].geometry.type ? features[0].geometry.type : "-unknown";
		const sourceId = `${name}-source`;
		const beforeLayer = before ? before.replace("{mapboxType}", mapboxType.toLowerCase()) : null;
		const layers = (
			<Fragment>
				<Source
					id={`ac2-${sourceId}`}
					geoJsonSource={{ type: "geojson", data: layer.data ? layer.data : layer }}
				/>
				{_.map(_.uniq(layerTypes), type => {
					return (
						<Layer
							key={`${name}-${type}`}
							id={`ac2-${name}-${mapboxType}-${type}`}
							sourceId={`ac2-${sourceId}`}
							type={type}
							layout={layout[type]}
							paint={paint[type]}
							before={beforeLayer}
						/>
					);
				})}
			</Fragment>
		);

		return layers;
	};

	render() {
		return this.renderLayers();
	}
}

export default BasicLayer;