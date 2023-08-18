import React from "react";
import PropTypes from "prop-types";
import { ListItem, List } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import Switch from "../../../shared/components/Switch";
import LayerIcon from "./MapLayerIcon";
import _ from "lodash";

const styles = {
	flexContainer: {
	  paddingTop: 10,
	  display: "flex",
	  background: "transparent"
	},
	flexContentHorizontal: {
		display: "flex",
		justifyContent: "flex-start"
	},
	listItem:{
		marginTop: 10, 
		marginBottom: 0,
		paddingTop: 0, 
		paddingBottom: 0, 
		paddingRight: 10 
	}
};

const propTypes = {
	classes: PropTypes.object.isRequired,
	mapLayers: PropTypes.object,
	saveMapLayers: PropTypes.func
};

const LayersFilter = (props) => {
	const {classes, mapLayers, saveMapLayers} = props;

	let mapLayersTemp = null;
	const getMapLayer = () =>{
		if (!mapLayersTemp){
			mapLayersTemp = _.cloneDeep(mapLayers);
		}
		return mapLayersTemp;
	};

	//#region Commented Sample json data
	/* 
		mapLayers: {
			labels: true,
			teams: {
				BLUE: {enabled:true, disabled:false},
				RED: {enabled:false, disabled:false},
			},
			objectives: true,
			interdictionPoints: true,
			facilities: true
		}
	*/
	//#endregion

	const onChange = (event) =>{
		const curMapLayers = mapLayers;
		curMapLayers[event.target.name] = event.target.checked;
		saveMapLayers(curMapLayers);
	};

	const onEnabledChange = (event, teamSelected) =>{
		const curMapLayers = mapLayers;
		curMapLayers["teams"][teamSelected].enabled = event.target.checked;
		saveMapLayers(curMapLayers);
	};

	const onDisabledChange = (event, teamSelected) =>{
		const curMapLayers = mapLayers;
		curMapLayers["teams"][teamSelected.toUpperCase()].disabled = event.target.checked;
		saveMapLayers(curMapLayers);
	};

	return (
		<div className={classes.flexContainer} style={{flexDirection: "row", marginTop:0}}>
			{
				<List>
					<ListItem className={classes.listItem} key="listLabel">
						<div className={classes.flexContentHorizontal}>
							<Switch key="labels" name="labels" onChange={(e) => onChange(e)}
								checked={getMapLayer().labels} />
							<LayerIcon mapLabel labelText="Map Labels"/>
						</div>
					</ListItem>
					{
						//For Blue/Red Enabled agents 
						_.map(getMapLayer().teams, (value, index) => {
							return (<ListItem className={classes.listItem} key={"listF" + index}>
								<div className={classes.flexContentHorizontal}>
									<Switch key={"enabled" + index} name={"enabled" + index} onChange={(e) => onEnabledChange(e, index)}
										checked={value.enabled} />
									<LayerIcon team={index} enabled labelText={`${index.charAt(0).toUpperCase()}${index.substring(1).toLowerCase()} Forces`} />
								</div>
							</ListItem>);
						})
					}
					{
						//For Blue/Red Disabled agents
						_.map(getMapLayer().teams, (value, index) => {
							return (<ListItem className={classes.listItem} key={"listD" + index}>
								<div className={classes.flexContentHorizontal}>
									<Switch key={"dis" + index} name={"dis" + index} onChange={(e) => onDisabledChange(e, index)}
										checked={value.disabled} />
									<LayerIcon team={index} disabled labelText="Disabled Players"/>
								</div>
							</ListItem>);
						})
					}

					<ListItem className={classes.listItem} key="listObjectives">
						<div className={classes.flexContentHorizontal}>
							<Switch key="objectives" name="objectives" checked={getMapLayer().objectives} onChange={(e) => onChange(e)}/>
							<LayerIcon objective labelText="Objectives"/>
						</div>
					</ListItem>
					<ListItem className={classes.listItem} key={"listFacility"}>
						<div className={classes.flexContentHorizontal}>
							<Switch key="facilities" name="facilities" checked={getMapLayer().facilities} onChange={(e) => onChange(e)}/>
							<LayerIcon facility labelText="Facilities"/>
						</div>
					</ListItem>
					<ListItem className={classes.listItem} key={"listInter"}>
						<div className={classes.flexContentHorizontal}>
							<Switch key="interdictionSites" name="interdictionSites" checked={getMapLayer().interdictionSites} onChange={(e) => onChange(e)}/>
							<LayerIcon interdictionSite labelText="Interdiction Sites"/>
						</div>
					</ListItem>
				</List>
			}
		</div>
	);
};

LayersFilter.propTypes = propTypes;
export default withStyles(styles)(LayersFilter);

