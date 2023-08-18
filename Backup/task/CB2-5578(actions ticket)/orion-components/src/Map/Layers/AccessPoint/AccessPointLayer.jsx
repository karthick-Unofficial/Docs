import React, { Fragment, useCallback, useEffect, useState, memo } from "react";
import PropTypes from "prop-types";
import { BasicLayer } from "orion-components/Map/Layers";
import isEqual from "react-fast-compare";
import { useDispatch, useSelector } from "react-redux";
import { floorPlanSelector } from "orion-components/Map/Selectors";
import { primaryContextSelector } from "orion-components/ContextPanel/Selectors";
import values from "lodash/values";
import isEmpty from "lodash/isEmpty";
import includes from "lodash/includes";

const jsonata = require("jsonata");

const propTypes = {
	labelsVisible: PropTypes.bool,
	feedId: PropTypes.string,
	setMapEntities: PropTypes.func,
	mapTools: PropTypes.object,
	before: PropTypes.string
};

const defaultProps = {
	labelsVisible: false
};

const profileIconTemplates = {};
const AccessPointWrapper = ({ labelsVisible, loadProfile, mapTools, secondary, feedId, setMapEntities, filters, before }) => {
	const facilityId = useSelector(state => primaryContextSelector(state));
	const facility = useSelector(state => state.contextualData[facilityId]);
	const { selectedFloor } = useSelector(state => floorPlanSelector(state));
	const { mapRef } = useSelector(state => state.mapState.baseMap);
	const accessPoints = facility && facility.floorPlanAccessPoints ? facility.floorPlanAccessPoints : [];
	const map = mapRef;

	const userFeedState = useSelector((state) => state.session.userFeeds);
	const userFeedsSelector = values(userFeedState);

	Object.values(userFeedsSelector).forEach(feed => {
		if (feed.entityType === "accessPoint") {
			profileIconTemplates[feed.feedId] = feed.mapIconTemplate && jsonata(feed.mapIconTemplate);
		}
	});

	return (
		<AccessPointLayer
			accessPoints={accessPoints}
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

const AccessPointLayer = ({ accessPoints, labelsVisible, loadProfile, map, mapTools, secondary, feedId, setMapEntities, filters, before }) => {
	const dispatch = useDispatch();

	const [filteredAccessPoint, setFilteredAccessPoint] = useState({});
	useEffect(() => {
		const filtered = {};
		if (!Object.values(accessPoints).length || Object.values(accessPoints).length === 0) {
			// -- clear out facility entities once context changes
			setFilteredAccessPoint({});
		}
		else {
			Object.keys(accessPoints).forEach(accessPoint => {
				if (profileIconTemplates[accessPoints[accessPoint].feedId]) {
					accessPoints[accessPoint].entityData.properties.mapIcon = profileIconTemplates[accessPoints[accessPoint].feedId].evaluate(accessPoints[accessPoint].entityData);
				}

				if (!filters || isEmpty(filters) || includes(filters, accessPoint)) {
					filtered[accessPoint] = { ...accessPoints[accessPoint] };
				}
			});
			setFilteredAccessPoint(filtered);
			if (feedId && setMapEntities) {
				dispatch(setMapEntities({ [feedId]: filtered }));
			}
		}
	}, [feedId, setMapEntities, map, mapTools, accessPoints, filters, setFilteredAccessPoint]);
	const handleClick = useCallback((accessPointId, accessPointName) => {
		dispatch(loadProfile(accessPointId, accessPointName, "accessPoint", "profile", "secondary"));
	}, [loadProfile]);
	const featureData = Object.keys(filteredAccessPoint).map(accessPoint => {
		return filteredAccessPoint[accessPoint].entityData;
	});
	return Object.keys(filteredAccessPoint).length && map ? (
		<Fragment>
			<BasicLayer
				labelsVisible={labelsVisible}
				map={map}
				handleClick={handleClick}
				layer={{
					type: "symbol",
					name: feedId ? feedId : "accessPoint",
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
									"case",
									["has", "mapIcon"],
									["get", "mapIcon"],
									"Sensor_gray"
								]
								: [
									"case",
									["has", "mapIcon"],
									["get", "mapIcon"],
									"Sensor_gray"
								],
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

AccessPointWrapper.propTypes = propTypes;
AccessPointWrapper.defaultProps = defaultProps;

export default memo(AccessPointWrapper, (prevProps, nextProps) => {
	if (!isEqual(prevProps, nextProps)) {
		return false;
	}
	return true;
});
