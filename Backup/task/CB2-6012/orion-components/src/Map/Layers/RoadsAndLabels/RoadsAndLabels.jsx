import { useEffect } from "react";
import { useSelector } from "react-redux";
import { mapObject, replayMapObject, mapSettingsSelector } from "orion-components/AppState/Selectors";
import PropTypes from "prop-types";
import debounce from "debounce";

const propTypes = {
    map: PropTypes.object,
    opacityEnabled: PropTypes.boolean,
    defaultVisible: PropTypes.boolean

};

const defaultProps = {
    opacityEnabled: true,
    defaultVisible: false
};

const RoadsAndLabels = ({ opacityEnabled, defaultVisible }) => {

    const map = useSelector((state) => mapObject(state) || replayMapObject(state));
    const mapSettings = useSelector((state) => mapSettingsSelector(state));
    const mapStyle = mapSettings.mapStyle;

    const opacity = defaultVisible ? 1
        : mapSettings && mapSettings["roadsAndLabels"] ? mapSettings["roadsAndLabels"].opacity
            : 1;

    const visible = defaultVisible ? defaultVisible
        : mapSettings && mapSettings.roadsVisible ? mapSettings.roadsVisible
            : mapSettings["roadsAndLabels"] ? mapSettings["roadsAndLabels"].visible
                : false;

    useEffect(() => {
        const setRoadsAndLabels = debounce(() => {
            const roadsAndLabels = map.getStyle().layers.filter((layer) => {
                return (
                    layer["source-layer"] &&
                    (layer["source-layer"].includes("road") ||
                        layer["source-layer"].includes("label"))
                );
            });
            roadsAndLabels.forEach((layer) => {
                if (visible) {
                    if (opacityEnabled) {
                        if (layer.type === "line") {
                            map
                                .setLayoutProperty(layer.id, "visibility", "visible")
                                .setPaintProperty(layer.id, "line-opacity", opacity);
                        } else if (layer.type === "symbol") {
                            map
                                .setLayoutProperty(layer.id, "visibility", "visible")
                                .setPaintProperty(layer.id, "text-opacity", opacity)
                                .setPaintProperty(layer.id, "icon-opacity", opacity);
                        }
                    } else {
                        if (layer.type === "line") {
                            map.setLayoutProperty(layer.id, "visibility", "visible")
                        } else if (layer.type === "symbol") {
                            map.setLayoutProperty(layer.id, "visibility", "visible")
                        }
                    }
                } else {
                    map.setLayoutProperty(layer.id, "visibility", "none");
                }
            });
        }, 100);

        if (map) {
            setRoadsAndLabels();
        }
    }, [mapStyle, opacity, visible]);

    return null;
};

RoadsAndLabels.propTypes = propTypes;
RoadsAndLabels.defaultProps = defaultProps;

export default RoadsAndLabels;