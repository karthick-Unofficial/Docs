import React from "react";
import PropTypes from "prop-types";
import TracesFilter from "./TracesFilter";
import LayersFilter from "./LayersFilter";
import { Divider } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import _ from "lodash";
import * as eventUtilities from "../../../shared/utility/eventUtility";
import LayerIcon from "./MapLayerIcon";
import Switch from "../../../shared/components/Switch";
import { Translate } from "orion-components/i18n/I18nContainer";

const styles = {
	flexContainer:{
		display: "flex",
		flexDirection: "column",
		justifyContent: "flex-start",
		paddingLeft:10,
		paddingRight: 10,
		marginTop:10,
		marginBottom:10,
		width:"100%"
	},
	flexContentHorizontal: {
		display: "flex",
		justifyContent: "flex-start",
		marginTop: 5,
		marginBottom: 5
	}
};

const propTypes = {
	classes: PropTypes.object.isRequired,
	mapLayerSettings: PropTypes.object,
	teamsConfig: PropTypes.object,
	updatePersistedState: PropTypes.func.isRequired
};

const MapLayers = ( { classes, mapLayerSettings, teamsConfig, updatePersistedState } ) => {
	
	const mapLayerSettingsTemp = _.cloneDeep(mapLayerSettings);
	
	const initializeTracesSettings = () =>{
		let tracesConfig = mapLayerSettingsTemp.traces;
		if (!tracesConfig) {
			tracesConfig = eventUtilities.createDefaultObject(true, true);
		}
		
		_.keys(tracesConfig).forEach(team => {
			tracesConfig[team]["all"] = false;
			
			let flagTemp = true;
			_.map(tracesConfig[team], (val, eventType) => {
				if (eventType !== "all"){
					tracesConfig[team][eventType] = val;
					
					if (!val){
						flagTemp = false;
					}
				}
			});

			tracesConfig[team]["all"] = flagTemp;
		});

		return tracesConfig;
	};

	let traceSettingsTemp = null;
	const getTraceSettingsForModification = () =>{
		if (!traceSettingsTemp){
			traceSettingsTemp = initializeTracesSettings();
		}
		return traceSettingsTemp;
	};

	const getMapLayerSettingsForModification = () =>{
		let layerConfig = null;
		if (mapLayerSettingsTemp && mapLayerSettingsTemp.mapLayers) {
			layerConfig = mapLayerSettingsTemp.mapLayers;
		}
		return layerConfig;
	};

	const saveTraces = (currentTraceSettings)=> {
		mapLayerSettingsTemp.traces = currentTraceSettings;
		updatePersistedState("tabletop-app", "mapLayerSettings", mapLayerSettingsTemp);
	};
	
	const saveMapLayers = (modifiedLayers)=> {
		mapLayerSettingsTemp.mapLayers = modifiedLayers;

		if (mapLayerSettingsTemp.traces){
			_.forEach(mapLayerSettingsTemp.traces, (value, key)=> {
				delete mapLayerSettingsTemp["traces"][key]["all"];
			});
		}
		updatePersistedState("tabletop-app", "mapLayerSettings", mapLayerSettingsTemp);
	};

	const handleChange = (event) => {
		//setState({ ...state, [event.target.name]: event.target.checked });
		mapLayerSettingsTemp[event.target.name] = event.target.checked;
		if (mapLayerSettingsTemp.traces){
			_.forEach(mapLayerSettingsTemp.traces, (value, key)=> {
				delete mapLayerSettingsTemp["traces"][key]["all"];
			});
		}
		updatePersistedState("tabletop-app", "mapLayerSettings", mapLayerSettingsTemp);
	};

	return (
		<div style={{width:"100%"}}>
			{/*Timeline Control */}
			<div className={classes.flexContainer}>
				<div className={classes.flexContentHorizontal}>
					<Switch key="displayTimeline" name="displayTimeline" onChange={(e) => handleChange(e)} checked={mapLayerSettingsTemp.displayTimeline} />
					<LayerIcon timeline labelText={<Translate value="tableopSession.panels.mapLayers.timelineControl"/>}/>
				</div>
				<div className={classes.flexContentHorizontal}>
					<Switch key="displayFloorPlan" name="displayFloorPlan" onChange={(e) => handleChange(e)} checked={mapLayerSettingsTemp.displayFloorPlan} />
					<LayerIcon floorPlan labelText={<Translate value="tableopSession.panels.mapLayers.floorPlanControl"/>}/>
				</div>
			</div>
			<Divider style={{ left:0, right:0 }}/>
			<div style={{width:"100%"}}>
				{/* Blue/Red Teams */}
				<TracesFilter eventConf={getTraceSettingsForModification()} teamsConfig={teamsConfig} saveFilters={saveTraces}/>
			</div>
			<Divider style={{ left:0, right:0 }}/>
			<LayersFilter mapLayers={getMapLayerSettingsForModification()} saveMapLayers={saveMapLayers}/>
			
		</div>
	);
};

MapLayers.propTypes = propTypes;
export default withStyles(styles)(MapLayers);