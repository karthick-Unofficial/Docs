import { createSelector } from "reselect";
import { mapSettingsSelector } from "orion-components/AppState/Selectors";

const overlayLayerSelector = createSelector(
    [
        mapSettingsSelector
    ],
    (mapSettings) => (layerType, allowOpacity, minZoom, maxZoom) => {
        let mapZoomVisibility = true;
        const visible = mapSettings && mapSettings[layerType] ? mapSettings[layerType].visible : false;
        const opacity = !allowOpacity ? 1
            : mapSettings[layerType] && mapSettings[layerType].opacity !== undefined ? mapSettings[layerType].opacity
                : 1;

        if (minZoom || maxZoom) {
            const currentZoom = mapSettings?.mapZoom;
            mapZoomVisibility = minZoom && maxZoom ? currentZoom >= minZoom && currentZoom <= maxZoom
                : minZoom ? currentZoom >= minZoom
                    : maxZoom ? currentZoom <= maxZoom
                        : true;
        }

        const enabled = visible && mapZoomVisibility;

        return { opacity, enabled };
    });

export { overlayLayerSelector };