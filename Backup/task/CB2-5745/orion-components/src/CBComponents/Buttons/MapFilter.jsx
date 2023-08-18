import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import {
	point as tPoint,
	lineString as tLineString,
	polygon as tPolygon,
	featureCollection as tFCollection
} from "@turf/helpers";
import tBbox from "@turf/bbox";
import { Checkbox } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import isEqual from "react-fast-compare";
import { useSelector, useDispatch } from "react-redux";
import {
	contextPanelState,
	mapFiltersSelector
} from "orion-components/ContextPanel/Selectors";
import {
	mapObject,
	mapSettingsSelector
} from "orion-components/AppState/Selectors";
import isEmpty from "lodash/isEmpty";
import size from "lodash/size";

const propTypes = {
	filters: PropTypes.object,
	map: PropTypes.object,
	items: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
	id: PropTypes.string.isRequired,
	addToMapFilters: PropTypes.func.isRequired,
	removeFromMapFilters: PropTypes.func.isRequired
};

const defaultProps = {
	map: null,
	filters: {}
};

const MapFilter = ({ addToMapFilters, removeFromMapFilters, id, items }) => {
	const dispatch = useDispatch();

	const secondaryOpen = useSelector(
		(state) => contextPanelState(state).secondaryOpen
	);
	const map = useSelector((state) => mapObject(state));
	const settings = useSelector((state) => mapSettingsSelector(state));
	const zoom = settings.mapZoom;
	const center = settings.mapCenter;
	const filters = useSelector((state) => mapFiltersSelector(state));

	const [filtered, setFiltered] = useState(false);
	const [prevZoom, setPrevZoom] = useState(zoom);
	const [prevCenter, setPrevCenter] = useState(center);

	const usePreviousValue = (value) => {
		const ref = useRef();
		useEffect(() => {
			ref.current = value;
		});
		return ref.current;
	};

	const prevFilters = usePreviousValue(filters);

	const handleUpdateBounds = () => {
		const filterItems = Object.values(filters).map(
			(filter) => filter.entityData
		);
		if (filterItems.length) {
			const features = filterItems
				.filter((data) => {
					return data.geometry && !isEmpty(data.geometry);
				})
				.map((data) => {
					let geometry;
					const type =
						filters[data.properties.id].entityType === "accessPoint"
							? filters[data.properties.id].entityType
							: data.properties.type;
					switch (type.toLowerCase()) {
						case "point":
						case "track":
						case "camera":
						case "accesspoint": // cSpell:ignore accesspoint
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
			dispatch(addToMapFilters(id, filterItems));
			setFiltered(true);
		} else {
			dispatch(removeFromMapFilters(id));
			setFiltered(false);
		}
	};

	useEffect(() => {
		componentUpdate();
	}, [filters, prevFilters]);

	const componentUpdate = () => {
		if (!isEqual(filters, prevFilters) && size(filters) > 0) {
			handleUpdateBounds();
			map.on("dragend", () => {
				setPrevZoom(map.getZoom());
				setPrevCenter(map.getCenter());
			});
		} else if (size(prevFilters) > 0 && size(filters) === 0) {
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
