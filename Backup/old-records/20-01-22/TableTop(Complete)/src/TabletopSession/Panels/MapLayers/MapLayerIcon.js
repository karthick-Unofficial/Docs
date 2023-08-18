import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import {  Typography, FormControlLabel } from "@material-ui/core";
import AgentIcon from "../../MapBase/LayerSources/MapLayer/AgentIcon";
import { iconConfig } from "../../../shared/iconConfig";

const styles = {
	flexContainer:{
		display: "flex",
		justifyContent: "flex-start",
		alignItems:"center",
		background: "transparent",
		minHeight: 41,
		paddingLeft: 0,
		paddingRight: 10
	},
	contentContainer:{
		display: "flex",
		justifyContent: "space-between",
		alignItems:"center",
		background: "transparent",
		paddingLeft: 10,
		paddingRight: 10
	}
};

function MapLayerIcon(props) {
	const { classes } = props;
	const labelText = props.labelText? props.labelText: "None";

	const getAgentIcon = (team, enabled) => {
		const agent = {
			"id": 1,
			"entityType": "agent",
			"entityData": {
				"properties": {
					"id": 1,
					"name": "1",
					"team": team,
					"enabled": enabled,
					"detected": true,
					"heading": 0,
					"vehicle": null,
					"equipment": null
				}
			}
		};
		return <AgentIcon agent={agent} group={false} size={53} />;
	};

	return (
		<div 
			className={classes.contentContainer}
			style={{
				marginLeft: `${props.team ? "-8px" : "0px"}`,
				marginTop: `${props.team ? "-8px" : "0px"}`
			}}
		>
			<FormControlLabel
				control={
					<div className={classes.contentContainer} >
						{props.mapLabel && 
							<div style={{height: 35, width: 35, display: "flex", alignItems: "center", justifyContent: "center"}}>
								<img style={{height: 18, width: 17}} src={iconConfig["legend_labels"]} />
							</div>
						}

						{props.timeline && 
							<img style={{height: 35, width: 35}} src={iconConfig["legend_timeline_control"]} />
						}

						{props.floorPlan && 
							<img style={{height: 35, width: 35}} src={iconConfig["legend_floorplan_control"]} />
						}

						{props.team && props.disabled && 
							getAgentIcon(props.team, false)
						}

						{props.team && props.enabled && 
							getAgentIcon(props.team, true)
						}

						{props.facility &&
							<img style={{height: 35, width: 35}} src={iconConfig["facility"]} />
						}
						
						{props.objective && 
							<img style={{height: 35, width: 35}} src={iconConfig["objective"]} />
						}
						
						{props.interdictionSite && 
							<img style={{height: 35, width: 35}} src={iconConfig["interdictionSite"]} />
						}
					</div>
				}
				label={labelText && 
					<Typography 
						variant="body1" 
						className="b1-white" 
						style={{
							marginLeft: `${props.team ? "0px" : "10px"}`,
							marginTop: `${props.team ? "-4px" : "0px"}`
						}}
					>
						{labelText}
					</Typography>}
			/>
		</div>
	);
}

MapLayerIcon.propTypes = {
	classes: PropTypes.object.isRequired,
	mapLabel: PropTypes.bool,
	team: PropTypes.string,
	timeline: PropTypes.bool,
	floorPlan: PropTypes.bool,
	facility: PropTypes.bool,
	objective: PropTypes.bool,
	interdictionSite: PropTypes.bool,
	enabled: PropTypes.bool,
	disabled: PropTypes.bool,
	fillColor: PropTypes.string,
	labelText: PropTypes.string
};

export default withStyles(styles)(MapLayerIcon);
