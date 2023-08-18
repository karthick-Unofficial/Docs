import React, { Fragment, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FloorPlan } from "orion-components/Map/Layers";
import { persistedState } from "orion-components/AppState/Selectors";
import { layerSourcesSelector } from "orion-components/GlobalData/Selectors";
import { mapSettingsSelector } from "orion-components/AppState/Selectors";
import { useSelector } from "react-redux";

const propTypes = {
	selectedFloor: PropTypes.object,
	feedId: PropTypes.string,
	before: PropTypes.string
};

const ActiveFloorPlans = (props) => {
	const { feedId, before } = props;

	const { selectedFloors } = useSelector((state) => persistedState(state));
	const feedData = useSelector((state) => layerSourcesSelector(state, props));
	const settings = useSelector((state) => mapSettingsSelector(state));

	const filteredFps = {};

	const [selectedFloorsData, setSelectedFloor] = useState({});
	const [style, setStyle] = useState(null);

	useEffect(() => {
		if (selectedFloors) {
			if (feedData && selectedFloors) {
				Object.keys(feedData).forEach((facilityId) => {
					if (
						selectedFloors[facilityId] &&
						selectedFloors[facilityId].id
					) {
						filteredFps[facilityId] = selectedFloors[facilityId];
					}
				});
			}
			setSelectedFloor(
				Object.keys(filteredFps).length ? filteredFps : null
			);
		}
	}, [selectedFloors]);

	useEffect(() => {
		if (settings) {
			setStyle(settings.mapStyle);
		}
	}, [settings]);

	const [styleReloaded, setStyleReloaded] = useState(true);

	// This is necessary to re-add the floor plan images after the map style changes
	// because the map style change clears out the image.
	useEffect(() => {
		setStyleReloaded(false);
		setTimeout(() => setStyleReloaded(true), 10);
	}, [style]);

	return selectedFloorsData &&
		styleReloaded &&
		Object.keys(selectedFloorsData).length ? (
		<Fragment>
			{Object.keys(selectedFloorsData).map((facilityId) => {
				return (
					<FloorPlan
						key={`selected-floorplan-${selectedFloorsData[facilityId].id}`}
						id={selectedFloorsData[facilityId].id}
						coordinates={
							selectedFloorsData[facilityId].geometry
								.coordinates[0]
						}
						image={`/_download?handle=${selectedFloorsData[facilityId].handle}`}
						editing={false}
						feedId={feedId}
						before={before}
					/>
				);
			})}
		</Fragment>
	) : null;
};

ActiveFloorPlans.propTypes = propTypes;

export default ActiveFloorPlans;
