import React, { useState, useEffect, memo } from "react";
import { Popover, MenuItem } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";
import { setMapStyle } from "./tileOptionsActions";

const TileOptions = () => {

    const dispatch = useDispatch();

    const mapSettings = useSelector(state => state.appState.persisted.mapSettings);
    const baseMaps = useSelector(state => state.baseMaps);
    const selected = mapSettings && mapSettings.mapStyle ? mapSettings.mapStyle : "satellite";
    const dir = useSelector(state => getDir(state));

    const [open, setOpen] = useState(false);
    const [layer, setLayer] = useState(null);
    const [label, setLabel] = useState(null);
    const [BaseMaps, setBaseMaps] = useState([]);
    const [thumbNail, setThumbNail] = useState("");

    const [anchorEl, setAnchorEl] = useState(null);


    useEffect(() => {
        if (baseMaps.length > 0) {
            const selectedThumbnail = baseMaps.filter((element) => element.name === selected)[0];
            setBaseMaps(baseMaps);
            setLayer(selectedThumbnail.name);
            setLabel(selectedThumbnail.label);
            setThumbNail(selectedThumbnail.thumbnail);
        }
    }, [selected]);

    const toggleOpen = (e) => {
        setOpen(!open);
        setAnchorEl(e.currentTarget);
    };

    const handleRequestClose = () => {
        setOpen(false);
        setAnchorEl(null);
    };

    const SetMapStyle = style => {
        dispatch(setMapStyle(style));
        setOpen(false);
    };

    const allOptions = BaseMaps.map((tileLayer, index) => {
        // Return all but the currently selected layer
        return (
            tileLayer.name !== layer && (
                <div
                    className={"map-sample-square hilite"}
                    onClick={() => {
                        SetMapStyle(tileLayer.name);
                    }}
                    key={index}
                >
                    <div className="thumb" style={{ backgroundImage: `url(${tileLayer.thumbnail})` }} />
                    <div className={dir === "rtl" ? "labelRTL" : "label"}>{tileLayer.label}</div>
                </div>
            )
        );
    });

    const getLabel = BaseMaps.map(value => {
        if (value.name === selected) {
            return value.label;
        }
    });

    return (
        <div className="map-selector-wrapper">
            <div className="map-tile-options drop">
                <div
                    className={"map-sample-square"}
                    onClick={() => toggleOpen()}
                >
                    <div className="thumb" style={{ backgroundImage: `url(${thumbNail})` }} />

                    <div className={dir === "rtl" ? "labelRTL" : "label"}>{getLabel}</div>
                    <div className="dropper">
                        <i className="material-icons">keyboard_arrow_down</i>
                    </div>
                </div>
            </div>
            <Popover
                style={{
                    backgroundColor: "transparent"
                }}
                open={open}
                //animation={PopoverAnimationVertical}
                anchorEl={anchorEl}
                className={dir === "rtl" ? "map-selectionRTL" : "map-selection"}
                onClose={() => handleRequestClose()}
                PaperProps={{
                    className: "customPopOver"
                }}
            >
                <MenuItem style={{ width: "242px" }}>
                    <div className="map-tile-options">{allOptions}</div>
                </MenuItem>
            </Popover>
        </div>
    );
};

export default memo(TileOptions);