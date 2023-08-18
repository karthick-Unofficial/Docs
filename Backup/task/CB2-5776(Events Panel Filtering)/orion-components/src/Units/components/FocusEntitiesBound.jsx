import { useState, useRef, useEffect } from "react";
import { point as tPoint, featureCollection as tFCollection } from "@turf/helpers";
import tBbox from "@turf/bbox";
import isEqual from "react-fast-compare";
import { useSelector } from "react-redux";
import { contextPanelState } from "orion-components/ContextPanel/Selectors";
import { mapObject, mapSettingsSelector } from "orion-components/AppState/Selectors";
import isEmpty from "lodash/isEmpty";

const usePreviousValue = (value) => {
	const ref = useRef();
	useEffect(() => {
		ref.current = value;
	});
	return ref.current;
};

const FocusEntitiesBound = ({ items }) => {
	const secondaryOpen = useSelector((state) => contextPanelState(state).secondaryOpen);
	const map = useSelector((state) => mapObject(state));
	const settings = useSelector((state) => mapSettingsSelector(state));
	const zoom = settings.mapZoom;
	const center = settings.mapCenter;

	const [prevZoom, setPrevZoom] = useState(zoom);
	const [prevCenter, setPrevCenter] = useState(center);

	const prevItems = usePreviousValue(items);

	const handleUpdateBounds = () => {
		const filterItems = items;
		if (filterItems.length) {
			const features = filterItems
				.filter((data) => {
					return data.geometry && !isEmpty(data.geometry);
				})
				.map((data) => {
					return tPoint(data.geometry.coordinates);
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

	useEffect(() => {
		componentUpdate();
	}, [items]);

	const componentUpdate = () => {
		if (!isEqual(items, prevItems)) {
			handleUpdateBounds();
			map.on("dragend", () => {
				setPrevZoom(map.getZoom());
				setPrevCenter(map.getCenter());
			});
		} else if (prevItems.length > 0 && items.length === 0) {
			// Zoom out to previous level on clear
			map.setZoom(prevZoom);
			map.setCenter(prevCenter);
		}
	};

	return null;
};

export default FocusEntitiesBound;
