import React, { Fragment, memo, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { BasicLayer } from "orion-components/Map/Layers";
import _ from "lodash";
const propTypes = {
	cameras: PropTypes.array.isRequired,
	setMapEntities: PropTypes.func.isRequired,
	labelsVisible: PropTypes.bool,
	map: PropTypes.object,
	loadProfile: PropTypes.func.isRequired,
	selectedFloor: PropTypes.object
};

const defaultProps = {
	cameras: [],
	labelsVisible: false
};

const Cameras = ({ cameras, labelsVisible, map, loadProfile, setMapEntities, selectedFloor }) => {
	useEffect(() => {
		if (cameras.length) {
			const byFeed = _.groupBy(cameras, "feedId");
			_.each(
				_.keys(byFeed),
				feed => (byFeed[feed] = _.keyBy(byFeed[feed], "id"))
			);
			_.each(_.keys(byFeed), feed => setMapEntities({ [feed]: byFeed[feed] }));
		}
	}, [cameras, setMapEntities]);

	useEffect(() => {
		return () => {
			setMapEntities({});
		};
	}, [setMapEntities]);

	const handleClick = useCallback((cameraId, cameraName) => {
		loadProfile(cameraId, cameraName, "camera", "profile", "secondary");
	}, [loadProfile]);

	let features = [];
	if (cameras.length) {
		features = cameras.map(camera => {
			if (camera.entityData && camera.entityData.properties) {
				if (!selectedFloor || (selectedFloor.id === camera.entityData.displayTargetId)) {
					camera.entityData.properties.id = camera.id;
					camera.entityData.properties.entityType = camera.entityType;
					camera.entityData.properties.controls = camera.controls;
				}
			}
			return camera.entityData;
		});
	}
	return cameras.length && map ? (
		<Fragment>
			<BasicLayer
				labelsVisible={labelsVisible}
				map={map}
				handleClick={handleClick}
				layer={{
					type: "symbol",
					name: "cameras",
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
							"icon-size": 1,
							"icon-image": "Camera_gray",
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
						features
					}
				}}
				before="---ac2-feed-entities-position-end"
			/>
		</Fragment>
	) : null;
};

Cameras.propTypes = propTypes;
Cameras.defaultTypes = defaultProps;

export default memo(Cameras);