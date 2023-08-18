import React, { Fragment, useCallback, useEffect, useState, memo } from "react";
import PropTypes from "prop-types";
import { BasicLayer } from "orion-components/Map/Layers";
import _ from "lodash";
import isEqual from "react-fast-compare";
const propTypes = {
	accessPoints: PropTypes.object.isRequired,
	labelsVisible: PropTypes.bool,
	feedId: PropTypes.string,
	setMapEntities: PropTypes.func,
	mapTools: PropTypes.object,
	before: PropTypes.string
};

const defaultProps = {
	labelsVisible: false
};

const AccessPointLayer = ({ accessPoints, labelsVisible, loadProfile, map, mapTools, secondary, feedId, setMapEntities, filters, before }) => {
	const [filteredAccessPoint, setFilteredAccessPoint] = useState({});
	useEffect(() => {
		const filtered = {};
		if (!Object.values(accessPoints).length || Object.values(accessPoints).length === 0) {
			// -- clear out facility entities once context changes
			setFilteredAccessPoint({});
		}
		else {
			Object.keys(accessPoints).forEach(accessPoint => {
				if (!filters || _.isEmpty(filters) || _.includes(filters, accessPoint)) {
					filtered[accessPoint] = {...accessPoints[accessPoint]};
				}
			});
			setFilteredAccessPoint(filtered);
			if (feedId && setMapEntities) {
				setMapEntities({ [feedId]: filtered });
			}
		}
	}, [feedId, setMapEntities, map, mapTools, accessPoints, filters, setFilteredAccessPoint]);
	const handleClick = useCallback((accessPointId, accessPointName) => {
		loadProfile(accessPointId, accessPointName, "accessPoint", "profile", secondary ? "secondary" : "primary");
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

AccessPointLayer.propTypes = propTypes;
AccessPointLayer.defaultProps = defaultProps;

export default memo(AccessPointLayer, (prevProps, nextProps) => {
	if (!isEqual(prevProps, nextProps)) {
		return false;
	}
	return true;
});
