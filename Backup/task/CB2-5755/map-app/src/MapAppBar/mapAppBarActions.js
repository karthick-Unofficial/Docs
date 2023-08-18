import * as t from "../actionTypes.js";
import { updatePersistedState } from "orion-components/AppState/Actions";
import {
	subscribeFOVs,
	unsubscribeFOVs
} from "orion-components/GlobalData/Actions";
import { createUserFeedback } from "orion-components/Dock/Actions/index.js";
import { selectFloorPlan } from "../ListPanel/FacilityProfile/facilityProfileActions";
import { integrationService } from "client-app-core";
import keys from "lodash/keys";
export { logOut } from "orion-components/AppMenu";
export { updatePersistedState } from "orion-components/AppState/Actions";
export { unsubscribe } from "orion-components/ContextualData/Actions";
export { subscribeFeed } from "orion-components/GlobalData/Actions";
export {
	createService,
	getGISLayers,
	turnOffGISLayer,
	resetGISRequest,
	updateVisibleGIS,
	updateGISService,
	deleteGISService
} from "orion-components/Map/Controls/Actions";

export const hideFOVs = () => {
	return (dispatch, getState) => {
		const fovs = getState().globalData.fovs;

		if (fovs) {
			dispatch(unsubscribeFOVs(keys(fovs.data), fovs.subscription));
		}

		dispatch(
			updatePersistedState("map-app", "showAllFOVs", {
				showAllFOVs: false
			})
		);
	};
};

export const showFOVs = (cameraFeeds) => {
	return (dispatch, getState) => {
		Object.values(cameraFeeds).forEach((feed) => {
			dispatch(
				subscribeFOVs(keys(getState().globalData[feed.feedId].data))
			);
		});

		dispatch(
			updatePersistedState("map-app", "showAllFOVs", {
				showAllFOVs: true
			})
		);
	};
};

const addTile = (data) => {
	return {
		type: t.ADD_TILE,
		payload: data
	};
};

const clearTiles = () => {
	return {
		type: t.CLEAR_TILES
	};
};

export const updateSsrRadarTiles = (ssrRadarVisible) => {
	return (dispatch, getState) => {
		const map = getState().mapState.baseMap.mapRef;
		if (!ssrRadarVisible) {
			dispatch(clearTiles());
		} else if (map) {
			const ssrRadarTiles = { ...getState().ssrRadarTiles };

			// -- tile size requested from SSR (range: 128 - 1024)
			const tileSize = getState().clientConfig.ssrTileSize || 1024;
			const tileWidth = tileSize;
			const tileHeight = tileSize;

			const zoomLevel = map.getZoom();
			const { width, height } = map
				.getContainer()
				.getBoundingClientRect();
			const screenWidth = width;
			const screenHeight = height;

			// -- calculate # of tiles
			const columns = Math.ceil(screenWidth / tileWidth);
			const rows = Math.ceil(screenHeight / tileHeight);
			let lastColumnWidth = screenWidth % tileWidth;
			let lastRowHeight = screenHeight % tileHeight;

			// -- overlay tile can't be smaller than 128x128
			lastColumnWidth = lastColumnWidth < 128 ? 128 : lastColumnWidth;
			lastRowHeight = lastRowHeight < 128 ? 128 : lastRowHeight;

			// -- loop through each tile and set properties accordingly
			let currentTileWidth, currentTileHeight;
			for (let i = 0; i < rows; i++) {
				for (let j = 0; j < columns; j++) {
					let data = {};

					// -- check if in the last row or column
					currentTileWidth =
						j === columns - 1 ? lastColumnWidth : tileWidth;
					currentTileHeight =
						i === rows - 1 ? lastRowHeight : tileHeight;

					// -- identify and store tiles by row-column location for future reference
					const tileId = i + "-" + j;
					if (ssrRadarTiles[tileId]) {
						data = ssrRadarTiles[tileId];
					} else {
						data["tileId"] = tileId;
					}

					data = {
						...data,
						center: {},
						windowDimension: {}
					};

					// -- calculate center of tile and convert to lat/lng coordinates
					const coords = map.unproject([
						j * tileWidth + currentTileWidth / 2,
						i * tileHeight + currentTileHeight / 2
					]);

					// -- build out SSR data
					data.center["latitude"] = coords.lat;
					data.center["longitude"] = coords.lng;
					data.windowDimension["width"] = parseInt(
						currentTileWidth,
						10
					);
					data.windowDimension["height"] = parseInt(
						currentTileHeight,
						10
					);

					const radians = (coords.lat * Math.PI) / 180;
					data["metersPerPixel"] =
						Math.abs(156543.04 * Math.cos(radians)) /
						Math.pow(2, zoomLevel);

					// -- keep radarImageId for reuse of radarImage slot if possible
					if (ssrRadarTiles[tileId]) {
						data.radarImageId = ssrRadarTiles[tileId].radarImageId;
					}
					ssrRadarTiles[tileId] = data;

					const queryString =
						`tileId=${data.tileId}&centerLatitude=${data.center.latitude}&centerLongitude=${data.center.longitude}` +
						`&width=${data.windowDimension.width}&height=${data.windowDimension.height}&metersPerPixel=${data.metersPerPixel}` +
						`${
							data.radarImageId
								? `&radarImageId=${data.radarImageId}`
								: ""
						}`;
					integrationService.getExternalSystemLookup(
						"ssr-radar",
						"setupTile",
						(err, response) => {
							if (err || !response) {
								dispatch(
									updatePersistedState(
										"map-app",
										"mapSettings",
										{ ssrRadarVisible: false }
									)
								);
								dispatch(
									createUserFeedback(
										"Failed loading SSR Radar Tiles.",
										null
									)
								);
								return;
							}

							const { data } = response;
							if (data) {
								dispatch(addTile({ data }));
							} else {
								dispatch(
									updatePersistedState(
										"map-app",
										"mapSettings",
										{ ssrRadarVisible: false }
									)
								);
								dispatch(
									createUserFeedback(
										"Failed loading SSR Radar Tiles.",
										null
									)
								);
							}
						},
						queryString
					);
				}
			}
		} else {
			console.log("Map not available");
		}
	};
};

export const selectFloorPlanOn = (floorplan, feedId) => {
	return (dispatch) => {
		dispatch(selectFloorPlan(floorplan, feedId));
	};
};
