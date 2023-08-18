import React from "react";
import {
    Drawer,
    List,
    ListItem,
    ListItemText,
    Switch,
    Divider,
    Typography,
    Collapse
} from "@mui/material";
import { CBSlider } from "orion-components/CBComponents";
import { Translate, getTranslation } from "orion-components/i18n";
import { useSelector, useDispatch } from "react-redux";
import {
    mapSettingsSelector,
    nauticalChartLayerOpacitySelector,
    roadAndLabelLayerOpacitySelector,
    weatherRadarLayerOpacitySelector
} from "orion-components/AppState/Selectors";
import { getDir } from "orion-components/i18n/Config/selector";
import size from "lodash/size";
import { makeStyles } from "@mui/styles";
import { updatePersistedState, updateGlobalUserAppSettings } from "orion-components/AppState/Actions";

import TileOptions from "./components/TileOptions";
import SpotlightProximity from "./components/SpotlightProximity";

const useStyles = makeStyles({
    thumbOff: {
        backgroundColor: "#ffffff"
    },
    trackOff: {
        backgroundColor: "#828283",
        opacity: 1
    },
    thumbSwitched: {
        backgroundColor: "#29B6F6"
    },
    trackSwitched: {
        backgroundColor: "#bee1f1!important",
        opacity: "1!important"
    }
});

const OptionsDrawer = ({
    open,
    toggleClosed,
    spotlightProximity,
    children
}) => {
    const dispatch = useDispatch();
    const classes = useStyles();

    const settings = useSelector(state => mapSettingsSelector(state));
    const globalState = useSelector(state => state.appState.global);
    const clientConfig = useSelector(state => state.clientConfig);
    const { nauticalChartsEnabled, weatherEnabled } = size(clientConfig) && clientConfig.mapSettings;
    const entityLabelsVisible = settings.entityLabelsVisible || false;
    const nauticalChartsVisible = settings.nauticalChartsVisible || false;
    const roadsVisible = settings.roadsVisible || false;
    const weatherVisible = settings.weatherVisible || false;
    const mapLabel = settings.mapStyle;
    const mapName = settings.mapStyle;
    const nauticalChartLayerOpacity = useSelector(state => nauticalChartLayerOpacitySelector(state));
    const roadAndLabelLayerOpacity = useSelector(state => roadAndLabelLayerOpacitySelector(state));
    const weatherRadarLayerOpacity = useSelector(state => weatherRadarLayerOpacitySelector(state));
    const appId = useSelector((state) => state.application.appId);

    const dir = useSelector(state => getDir(state));

    const handleSettingsUpdate = keyVal => {
        dispatch(updatePersistedState(appId, "mapSettings", keyVal));
    };

    const handleSliderChange =
        (event, value, layer) => {
            if (layer === "nauticalCharts") {
                dispatch(updatePersistedState(appId, "nauticalChartLayerOpacity", {
                    nauticalChartLayerOpacity: value
                }));
            } else if (layer === "roadAndLabels") {
                dispatch(updatePersistedState(appId, "roadAndLabelLayerOpacity", {
                    roadAndLabelLayerOpacity: value
                }));
            } else if (layer === "weatherRadar") {
                dispatch(updatePersistedState(appId, "weatherRadarLayerOpacity", {
                    weatherRadarLayerOpacity: value
                }));
            }
        };



    const styles = {
        listItem: {
            padding: "4px 16px",
            ...(dir === "rtl" && { textAlign: "right" })
        },
        drawer: {
            ...(dir === "rtl" ? { background: "linear-gradient(to left, rgba(0,0,0,0.85) 20%, rgba(0,0,0,0) 95%)" } : { background: "linear-gradient(to right, rgba(0,0,0,0.85) 20%, rgba(0,0,0,0) 95%)" })
        },
        typography: {
            ...(dir === "rtl" ? { marginRight: 16 } : { marginLeft: 16 })
        }
    };
    return (
        <Drawer
            className="options-drawer"
            docked={false}
            width={300}
            open={open}
            onClose={toggleClosed}
            style={styles.drawer}
            anchor={dir === "rtl" ? "right" : "left"}
            PaperProps={{
                style: { width: 300, backgroundColor: "#1F1F21" }
            }}
            BackdropProps={{ invisible: true }}
        >
            <section style={{ margin: 16, padding: 0 }}>
                <Typography variant="subtitle1" style={{ paddingBottom: 16 }}><Translate value="global.sharedComponents.optionsDrawer.baseMap" /></Typography>
                <TileOptions />
            </section>
            <Divider />
            <List>
                <ListItem
                    sx={styles.listItem}
                >
                    <ListItemText
                        primary={getTranslation("global.sharedComponents.optionsDrawer.mapLabels")}
                        primaryTypographyProps={{ style: { fontSize: 16 }, className: `option-label ${entityLabelsVisible ? "toggle-on" : "toggle-off"}` }}
                    />
                    <Switch
                        edge="end"
                        onChange={() => handleSettingsUpdate({ entityLabelsVisible: !entityLabelsVisible })}
                        checked={entityLabelsVisible}
                        classes={{
                            thumb: entityLabelsVisible ? classes.thumbSwitched : classes.thumbOff,
                            track: entityLabelsVisible ? classes.trackSwitched : classes.trackOff
                        }}
                    />
                </ListItem>
            </List>

            <Divider />

            <List>
                <Typography style={styles.typography} variant="subtitle1">
                    <Translate value="global.sharedComponents.optionsDrawer.mapOverlays" />
                </Typography>
                {!nauticalChartsEnabled ? null : <><ListItem sx={styles.listItem}>
                    <ListItemText
                        primary={getTranslation("global.sharedComponents.optionsDrawer.nauticalCharts")}
                        primaryTypographyProps={{ style: { fontSize: 16 }, className: `option-label ${nauticalChartsVisible ? "toggle-on" : "toggle-off"}` }}
                    />
                    <Switch
                        edge="end"
                        onChange={() => handleSettingsUpdate({ nauticalChartsVisible: !nauticalChartsVisible })}
                        checked={nauticalChartsVisible}
                        classes={{
                            thumb: nauticalChartsVisible ? classes.thumbSwitched : classes.thumbOff,
                            track: nauticalChartsVisible ? classes.trackSwitched : classes.trackOff
                        }}
                    />
                </ListItem><Collapse style={{ padding: "0px 16px" }} in={nauticalChartsVisible}>
                        <CBSlider
                            value={nauticalChartLayerOpacity}
                            min={0}
                            max={1}
                            step={0.1}
                            onChange={(e, value) => handleSliderChange(e, value, "nauticalCharts")}
                        />
                    </Collapse></>}
                <ListItem
                    sx={styles.listItem}
                >
                    <ListItemText
                        primary={getTranslation("global.sharedComponents.optionsDrawer.roadsLabels")}
                        primaryTypographyProps={{ style: { fontSize: 16 }, className: `option-label ${roadsVisible ? "toggle-on" : "toggle-off"}` }}
                    />
                    <Switch
                        edge="end"
                        onChange={() => handleSettingsUpdate({ roadsVisible: !roadsVisible })}
                        checked={roadsVisible}
                        classes={{
                            thumb: roadsVisible ? classes.thumbSwitched : classes.thumbOff,
                            track: roadsVisible ? classes.trackSwitched : classes.trackOff
                        }}
                    />
                </ListItem>
                <Collapse style={{ padding: "0px 16px" }} in={roadsVisible}>
                    <CBSlider
                        value={roadAndLabelLayerOpacity}
                        min={0}
                        max={1}
                        step={0.1}
                        onChange={(e, v) => handleSliderChange(e, v, "roadAndLabels")}
                    />
                </Collapse>
                {!weatherEnabled ? null : <><ListItem sx={styles.listItem}>
                    <ListItemText
                        primary={getTranslation("global.sharedComponents.optionsDrawer.weatherRadar")}
                        primaryTypographyProps={{ style: { fontSize: 16 }, className: `option-label ${weatherVisible ? "toggle-on" : "toggle-off"}` }}
                    />
                    <Switch
                        edge="end"
                        onChange={() => handleSettingsUpdate({ weatherVisible: !weatherVisible })}
                        checked={weatherVisible}
                        classes={{
                            thumb: weatherVisible ? classes.thumbSwitched : classes.thumbOff,
                            track: weatherVisible ? classes.trackSwitched : classes.trackOff
                        }}
                    />
                </ListItem><Collapse style={{ padding: "0px 16px" }} in={weatherVisible}>
                        <CBSlider
                            value={weatherRadarLayerOpacity}
                            min={0}
                            max={1}
                            step={0.1}
                            onChange={(e, value) => handleSliderChange(e, value, "weatherRadar")}
                        />
                    </Collapse></>}
            </List>
            <Divider />
            {children}
            {spotlightProximity &&
                <SpotlightProximity
                    globalState={globalState}
                    updateGlobalSettings={updateGlobalUserAppSettings}
                    dir={dir}
                />
            }
        </Drawer>
    );
};

export default OptionsDrawer;