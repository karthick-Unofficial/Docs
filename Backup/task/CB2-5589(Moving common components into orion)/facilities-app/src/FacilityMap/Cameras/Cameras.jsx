import React, { Fragment, memo, useCallback, useEffect } from "react";
import { BasicLayer } from "orion-components/Map/Layers";
import { useSelector, useDispatch } from "react-redux";
import { primaryContextSelector } from "orion-components/ContextPanel/Selectors";
import { floorPlanSelector } from "orion-components/Map/Selectors";
import { loadProfile, setMapEntities } from "./camerasActions";
import groupBy from "lodash/groupBy";
import each from "lodash/each";
import keys from "lodash/keys";
import keyBy from "lodash/keyBy";

const Cameras = () => {

	const facilityId = useSelector(state => primaryContextSelector(state));
	const facility = useSelector(state => state.contextualData[facilityId]);
	const { selectedFloor } = useSelector(state => floorPlanSelector(state));
	const { mapRef } = useSelector(state => state.mapState.baseMap);
	const cameras = facility && facility.floorPlanCameras ? facility.floorPlanCameras : [];
	const map = mapRef;

	const labelsVisible = true;

	const dispatch = useDispatch();

	useEffect(() => {
		if (cameras.length) {
			const byFeed = groupBy(cameras, "feedId");
			each(
				keys(byFeed),
				feed => (byFeed[feed] = keyBy(byFeed[feed], "id"))
			);
			each(keys(byFeed), feed => dispatch(setMapEntities({ [feed]: byFeed[feed] })));
		}
	}, [cameras, setMapEntities]);

	useEffect(() => {
		return () => {
			dispatch(setMapEntities({}));
		};
	}, [setMapEntities]);

	const handleClick = useCallback((cameraId, cameraName) => {
		dispatch(loadProfile(cameraId, cameraName, "camera", "profile", "secondary"));


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

export default memo(Cameras);