import React, { Fragment, useCallback, useEffect, useState, memo } from "react";
import PropTypes from "prop-types";
import { BasicLayer } from "orion-components/Map/Layers";
import _ from "lodash";
import isEqual from "react-fast-compare";
const propTypes = {
	facilities: PropTypes.object.isRequired,
	labelsVisible: PropTypes.bool,
	feedId: PropTypes.string,
	setMapEntities: PropTypes.func,
	mapTools: PropTypes.object,
	before: PropTypes.string
};

const defaultProps = {
	labelsVisible: false
};

const FacilitiesLayer = ({ facilities, labelsVisible, loadProfile, map, mapTools, secondary, feedId, setMapEntities, filters, before }) => {
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
					filtered[facility] = {...facilities[facility]};
				}
			});
			setFilteredFacilities(filtered);
			if (feedId && setMapEntities) {
				setMapEntities({ [feedId]: filtered });
			}
		}
	}, [feedId, setMapEntities, map, mapTools, facilities, filters, setFilteredFacilities]);
	const handleClick = useCallback((facilityId, facilityName) => {
		loadProfile(facilityId, facilityName, "facility", "profile", secondary ? "secondary" : "primary");
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

FacilitiesLayer.propTypes = propTypes;
FacilitiesLayer.defaultProps = defaultProps;

export default memo(FacilitiesLayer, (prevProps, nextProps) => {
	if (!isEqual(prevProps, nextProps)) {
		return false;
	}
	return true;
});
