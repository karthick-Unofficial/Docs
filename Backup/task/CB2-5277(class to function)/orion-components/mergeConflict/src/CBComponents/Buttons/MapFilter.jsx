import React, { useState, useRef, useEffect } from "react";
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

const MapFilter = ({
	zoom,
	center,
	map,
	filters,
	secondaryOpen,
	addToMapFilters,
	removeFromMapFilters,
	id,
	items
}) => {
	const [filtered, setFiltered] = useState(false);
	const [prevZoom, setPrevZoom] = useState(zoom);
	const [prevCenter, setPrevCenter] = useState(center);

	const usePreviousValue = value => {
		const ref = useRef();
		useEffect(() => {
			ref.current = value;
		});
		return ref.current;
	};

	const prevFilters = usePreviousValue(filters);

	const handleUpdateBounds = () => {

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
						case "accessPoint" || "AccessPoint":
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

	const handleFilter = () => {

		const filterItems = Array.isArray(items) ? items : Object.values(items);
		if (!filtered) {
			addToMapFilters(id, filterItems);
			setFiltered(true);
		} else {
			removeFromMapFilters(id);
			setFiltered(false);
		}
	};

	useEffect(() => {
		componentUpdate();
	}, [filters, prevFilters]);

	const componentUpdate = () => {
		if (!isEqual(filters, prevFilters) && _.size(filters) > 0) {
			handleUpdateBounds();
			map.on("dragend", () => {
				setPrevZoom(map.getZoom());
				setPrevCenter(map.getCenter());
			});
		} else if (_.size(prevFilters) > 0 && _.size(filters) === 0) {
			// Zoom out to previous level on clear
			map.setZoom(prevZoom);
			map.setCenter(prevCenter);
			setFiltered(false);
		}
	};

	return map ? (
		<Checkbox
			color="primary"
			checked={filtered}
			onChange={handleFilter}
			icon={<Visibility />}
			checkedIcon={<Visibility />}
		/>
	) : null;

};

MapFilter.propTypes = propTypes;
MapFilter.defaultProps = defaultProps;

export default MapFilter;
