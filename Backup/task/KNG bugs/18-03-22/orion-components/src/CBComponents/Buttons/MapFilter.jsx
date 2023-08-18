import React, { Component } from "react";
import PropTypes from "prop-types";
import {
	point as tPoint,
	lineString as tLineString,
	polygon as tPolygon,
	featureCollection as tFCollection
} from "@turf/helpers";
import tBbox from "@turf/bbox";
import { Checkbox } from "@material-ui/core";
import { Visibility } from "@material-ui/icons";
import _ from "lodash";
import isEqual from "react-fast-compare";

const propTypes = {
	center: PropTypes.array.isRequired,
	zoom: PropTypes.number.isRequired,
	filters: PropTypes.object,
	map: PropTypes.object,
	secondaryOpen: PropTypes.bool.isRequired,
	items: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
	id: PropTypes.string.isRequired,
	addToMapFilters: PropTypes.func.isRequired,
	removeFromMapFilters: PropTypes.func.isRequired
};

const defaultProps = {
	map: null,
	filters: {}
};

class MapFilter extends Component {
	constructor(props) {
		super(props);
		const { zoom, center } = this.props;
		this.state = {
			filtered: false,
			prevZoom: zoom,
			prevCenter: center
		};
	}

	componentDidUpdate(prevProps) {
		const { map, filters } = this.props;
		const { prevZoom, prevCenter } = this.state;
		if (!isEqual(filters, prevProps.filters) && _.size(filters) > 0) {
			this.handleUpdateBounds();
			map.on("dragend", () => {
				this.setState({
					prevZoom: map.getZoom(),
					prevCenter: map.getCenter()
				});
			});
		} else if (_.size(prevProps.filters) > 0 && _.size(filters) === 0) {
			// Zoom out to previous level on clear
			map.setZoom(prevZoom);
			map.setCenter(prevCenter);
			this.setState({
				filtered: false
			});
		}
	}

	handleUpdateBounds = () => {
		const { map, filters, secondaryOpen } = this.props;
		const filterItems = Object.values(filters).map(filter => filter.entityData);
		if (filterItems.length) {
			const features = filterItems
				.filter(data => {
					return data.geometry && !_.isEmpty(data.geometry);
				})
				.map(data => {
					let geometry;
					switch ((data.properties.type || data.properties.entityType).toLowerCase()) {
						case "point":
						case "track":
						case "camera":
						case "facility":
							geometry = tPoint(data.geometry.coordinates);
							break;
						case "polygon":
						case "fov":
							geometry = tPolygon(data.geometry.coordinates);
							break;
						case "line":
						case "linestring":
							geometry = tLineString(data.geometry.coordinates);
							break;
						default:
							break;
					}
					return geometry;
				});
			const featureCollection = tFCollection(features);
			const newBounds = tBbox(featureCollection);
			// Prevent if a profile is loaded
			if (!secondaryOpen) {
				map.fitBounds(newBounds, {
					maxZoom: 15,
					padding: {
						top: 20,
						bottom: 20,
						left: 450,
						right: 100
					}
				});
			}
		}
	};

	handleFilter = () => {
		const { addToMapFilters, removeFromMapFilters, id, items } = this.props;
		const { filtered } = this.state;
		const filterItems = Array.isArray(items) ? items : Object.values(items);
		if (!filtered) {
			addToMapFilters(id, filterItems);
			this.setState({
				filtered: true
			});
		} else {
			removeFromMapFilters(id);
			this.setState({
				filtered: false
			});
		}
	};
	render() {
		const { map } = this.props;
		const { filtered } = this.state;
		return map ? (
			<Checkbox
				color="primary"
				checked={filtered}
				onChange={this.handleFilter}
				icon={<Visibility />}
				checkedIcon={<Visibility />}
			/>
		) : null;
	}
}

MapFilter.propTypes = propTypes;
MapFilter.defaultProps = defaultProps;

export default MapFilter;
