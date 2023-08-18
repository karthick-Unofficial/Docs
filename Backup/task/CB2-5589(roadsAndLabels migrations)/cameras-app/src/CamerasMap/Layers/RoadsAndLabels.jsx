import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { mapSettingsSelector, roadAndLabelLayerOpacitySelector } from "orion-components/AppState/Selectors";


const RoadsAndLabels = ({ map }) => {

    let { roadsVisible } = useSelector((state) => mapSettingsSelector(state));
    const roadAndLabelLayerOpacity = useSelector((state) => roadAndLabelLayerOpacitySelector(state));
    const roadsVisibleRef = useRef(null);
    const props = { roadsVisible, roadAndLabelLayerOpacity };


    const { mapSettings } = useSelector(state => state.appState.persisted);
    const { baseMap } = useSelector(state => state.mapState);

    let opacity;
    let visible;
    if (mapSettings && mapSettings["roadsAndLabels"]) {
        opacity = mapSettings["roadsAndLabels"].opacity;
        visible = mapSettings["roadsAndLabels"].visible;
    }
    else {
        opacity = 1;
        visible = false;
    }

    const setRoadsAndLabels = (visible) => {
        // Preserve roads and labels state on map style change
        // Get all layers that contain roads or labels
        const roadsAndLabels = map.getStyle().layers.filter((layer) => {
            return (
                layer["source-layer"] &&
                (layer["source-layer"].includes("road") ||
                    layer["source-layer"].includes("label"))
            );
        });
        // Hide all layers with roads and labels
        roadsAndLabels.forEach((layer) => {
            if (visible) {
                if (layer.type === "line") {
                    map.setLayoutProperty(
                        layer.id,
                        "visibility",
                        "visible"
                    ).setPaintProperty(
                        layer.id,
                        "line-opacity",
                        roadAndLabelLayerOpacity
                    );
                } else if (layer.type === "symbol") {
                    map.setLayoutProperty(layer.id, "visibility", "visible")
                        .setPaintProperty(
                            layer.id,
                            "text-opacity",
                            roadAndLabelLayerOpacity
                        )
                        .setPaintProperty(
                            layer.id,
                            "icon-opacity",
                            roadAndLabelLayerOpacity
                        );
                }
            } else {
                map.setLayoutProperty(layer.id, "visibility", "none");
            }
        });
    };

    const setRoadsAndLabelsOpacity = (opacity) => {
        // Get all layers that contain roads or labels
        const roadsAndLabels = map.getStyle().layers.filter((layer) => {
            return (
                layer["source-layer"] &&
                (layer["source-layer"].includes("road") ||
                    layer["source-layer"].includes("label"))
            );
        });

        // Update opacity for all layers with roads and labels
        roadsAndLabels.forEach((layer) => {
            if (layer.type === "line") {
                map.setPaintProperty(layer.id, "line-opacity", opacity);
            } else if (layer.type === "symbol") {
                map.setPaintProperty(
                    layer.id,
                    "text-opacity",
                    opacity
                ).setPaintProperty(layer.id, "icon-opacity", opacity);
            }
        });
    };

    useEffect(() => {
        // Roads and labels
        setRoadsAndLabels(roadsVisible);

        // cSpell:ignore styledata
        map.on("styledata", (e) => {
            setRoadsAndLabels(roadsVisibleRef.current);
        });
    }, []);

    const usePrevious = (value) => {
        const ref = useRef();
        useEffect(() => {
            ref.current = value;
        }, [value]);
        return ref.current;
    };

    const prevProps = usePrevious(props);

    useEffect(() => {
        roadsVisibleRef.current = roadsVisible;
        if (prevProps) {
            if (prevProps.roadsVisible !== roadsVisible) {
                setRoadsAndLabels(roadsVisible);
            }
            if (
                prevProps.roadAndLabelLayerOpacity !==
                roadAndLabelLayerOpacity
            ) {
                setRoadsAndLabelsOpacity(roadAndLabelLayerOpacity);
            }
        }
    }, [baseMap, opacity, roadsVisible]);
    return null;
};

export default RoadsAndLabels;
