import React, { Fragment, useCallback, useEffect, useState, memo } from "react";
import PropTypes from "prop-types";
import { BasicLayer } from "orion-components/Map/Layers";
import _ from "lodash";
import isEqual from "react-fast-compare";
import { useDispatch, useSelector } from "react-redux";

import { mapSettingsSelector } from "orion-components/AppState/Selectors";

import { setMapEntities } from "orion-components/AppState/Actions";
import { getFacilities } from "orion-components/Map/Selectors";

const propTypes = {
	feedId: PropTypes.string,
	before: PropTypes.string
};

const FacilitiesWrapper = (props) => {
	const { loadProfile, secondary, feedId, before, filters } = props;

	const settings = useSelector((state) => mapSettingsSelector(state));
	const labelsVisible =
		settings && settings.entityLabels
			? settings.entityLabels.visible
			: settings.entityLabelsVisible
				? settings.entityLabelsVisible
				: false;
	const map = useSelector((state) => state.mapState.baseMap.mapRef);
	const mapTools = useSelector((state) => state.mapState.mapTools);

	const facilities = useSelector((state) => getFacilities(state)(state, props));

	return (
		<FacilitiesLayer
			facilities={facilities}
			labelsVisible={labelsVisible}
			loadProfile={loadProfile}
			map={map}
			mapTools={mapTools}
			secondary={secondary}
			feedId={feedId}
			setMapEntities={setMapEntities}
			filters={filters}
			before={before}
		/>
	);
};

const FacilitiesLayer = memo(
	(props) => {
		const dispatch = useDispatch();
		const {
			facilities,
			labelsVisible,
			loadProfile,
			map,
			mapTools,
			secondary,
			feedId,
			setMapEntities,
			filters,
			before
		} = props;

		const [filteredFacilities, setFilteredFacilities] = useState({});

		useEffect(() => {
			const filtered = {};
			if (!Object.values(facilities).length || Object.values(facilities).length === 0) {
				// -- clear out facility entities once context changes
				setFilteredFacilities({});
			} else {
				Object.keys(facilities).forEach((facility) => {
					if (!filters || _.isEmpty(filters) || _.includes(filters, facility)) {
						filtered[facility] = { ...facilities[facility] };
					}
				});
				setFilteredFacilities(filtered);
				if (feedId && setMapEntities) {
					dispatch(setMapEntities({ [feedId]: filtered }));
				}
			}
		}, [feedId, setMapEntities, map, mapTools, facilities, filters, setFilteredFacilities]);

		useEffect(() => {
			return () => {
				dispatch(setMapEntities({ [feedId]: {} }));
			};
		}, []);

		const handleClick = useCallback(
			(facilityId, facilityName) => {
				dispatch(
					loadProfile(facilityId, facilityName, "facility", "profile", secondary ? "secondary" : "primary")
				);
			},
			[loadProfile]
		);

		const featureData = Object.keys(filteredFacilities).map((facility) => {
			const feature = filteredFacilities[facility].entityData;
			const entityType = filteredFacilities[facility].entityType;
			feature.properties.mapIcon =
				mapTools?.feature?.id === facility ? "" : feature.properties.mapIcon || "Facility_blue";
			feature.properties.entityType = entityType;
			feature.properties.name = feature.properties.name;
			return feature;
		});

		return Object.keys(filteredFacilities).length && map ? (
			<Fragment>
				<BasicLayer
					labelsVisible={labelsVisible}
					map={map}
					handleClick={handleClick}
					layer={{
						type: "symbol",
						name: feedId ? feedId : "facilities",
						layerTypes: ["symbol"],
						paint: {
							symbol: {
								"text-color": "#000000",
								"text-halo-color": "rgba(255, 255, 255, 1)",
								"text-halo-width": 2
							}
						},
						layout: {
							symbol: {
								"icon-image": "{mapIcon}",
								"icon-size": 1,
								"icon-allow-overlap": true,
								"text-field": labelsVisible ? "{name}" : "",
								"text-offset": [2, 0],
								"icon-rotation-alignment": "map",
								"text-anchor": "left",
								"text-transform": "uppercase",
								"text-optional": true,
								"text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
								"text-size": 12,
								"text-letter-spacing": 0
							}
						},
						data: {
							type: "FeatureCollection",
							features: featureData
						}
					}}
					before={before}
				/>
			</Fragment>
		) : null;
	},
	(prevProps, nextProps) => {
		if (!isEqual(prevProps, nextProps)) {
			return false;
		}
		return true;
	}
);

FacilitiesWrapper.propTypes = propTypes;

export default FacilitiesWrapper;
