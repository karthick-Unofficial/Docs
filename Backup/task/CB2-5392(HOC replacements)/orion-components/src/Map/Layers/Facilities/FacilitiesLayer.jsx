import React, { Fragment, useCallback, useEffect, useState, memo } from "react";
import PropTypes from "prop-types";
import { BasicLayer } from "orion-components/Map/Layers";
import _ from "lodash";
import isEqual from "react-fast-compare";
import { useDispatch, useSelector } from "react-redux";

import { layerSourcesSelector, userFeedsSelector } from "orion-components/GlobalData/Selectors";
import { mapSettingsSelector } from "orion-components/AppState/Selectors";
import { primaryContextSelector, selectedContextSelector } from "orion-components/ContextPanel/Selectors";

const propTypes = {
	feedId: PropTypes.string,
	setMapEntities: PropTypes.func,
	before: PropTypes.string
};


const FacilitiesWrapper = (props) => {
	const { loadProfile, secondary, feedId, setMapEntities, before, filters } = props;

	const settings = useSelector(state => mapSettingsSelector(state));
	const labelsVisible = settings && settings.entityLabels ? settings.entityLabels.visible : settings.entityLabelsVisible ? settings.entityLabelsVisible : false;
	const context = useSelector(state => primaryContextSelector(state));
	const baseMap = useSelector(state => state.mapState.baseMap);
	const { mapRef } = baseMap;
	const map = mapRef;
	const mapTools = useSelector(state => state.mapState.mapTools);
	const userFeeds = useSelector(state => userFeedsSelector(state));

	const contextualData = useSelector(state => state.contextualData);
	const selectedContext = useSelector(state => selectedContextSelector(state));
	// const primaryId = useSelector(state => primaryContextSelector(state));
	const primary = contextualData[context];
	const proximityEntities = selectedContext && selectedContext.proximityEntities ? selectedContext.proximityEntities : [];
	const pinnedEntities = primary && primary.pinnedItems ? primary.pinnedItems : [];

	const facilityFeeds = _.map(
		_.filter(
			_.map(userFeeds),
			feed => {
				return (feed && feed.entityType === "facility");
			}
		), "feedId");

	let facilities = {};
	const globalGeo = useSelector(state => state.globalGeo);

	useSelector(state => {
		if (feedId) {
			facilities = layerSourcesSelector(state, props);

		} else if (secondary) {
			[...proximityEntities, ...pinnedEntities].forEach(item => {
				if (item.entityType === "facility" && item.entityData.geometry) {
					facilities[item.id] = item;
				}
			});

		} else {
			if (state.globalData && globalGeo) {
				facilityFeeds.map(feed => {
					facilities = _.merge(facilities, (_.cloneDeep(layerSourcesSelector(state, { feedId: feed })) || {}));
				});
			}
			facilities = context && context.entity ? { [context.entity.id]: context.entity } : facilities;
		}
	});


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
	)
};

const FacilitiesLayer = (props) => {
	const dispatch = useDispatch();
	const { facilities, labelsVisible, loadProfile, map, mapTools, secondary, feedId, setMapEntities, filters, before } = props;

	const [filteredFacilities, setFilteredFacilities] = useState({});

	useEffect(() => {
		const filtered = {};
		if (!Object.values(facilities).length || Object.values(facilities).length === 0) {
			// -- clear out facility entities once context changes
			setFilteredFacilities({});
		}
		else {
			Object.keys(facilities).forEach(facility => {
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

	const handleClick = useCallback((facilityId, facilityName) => {
		dispatch(loadProfile(facilityId, facilityName, "facility", "profile", secondary ? "secondary" : "primary"));
	}, [loadProfile]);

	const featureData = Object.keys(filteredFacilities).map(facility => {
		return filteredFacilities[facility].entityData;
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
							"icon-image": mapTools && mapTools.feature
								? [
									"case",
									["==", ["get", "id"], `${mapTools.feature.id}`],
									"",
									"Facility_blue"
								]
								: "Facility_blue",
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
};

FacilitiesWrapper.propTypes = propTypes;


export default memo(FacilitiesWrapper, (prevProps, nextProps) => {
	if (!isEqual(prevProps, nextProps)) {
		return false;
	}
	return true;
});
