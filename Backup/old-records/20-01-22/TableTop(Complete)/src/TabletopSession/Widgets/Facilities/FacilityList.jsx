import _ from "lodash";
import React, { Fragment } from "react";
import PropTypes from "prop-types";
//Card, CardContent,  Button, Typography, FormControlLabel,
import {  List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { iconConfig } from "../../../shared/iconConfig";
import TargetingIconContainer from "../../Controls/TargetingIcon/TargetingIconContainer";
import { Translate } from "orion-components/i18n/I18nContainer";

const styles = {
	flexContainer:{
		display: "flex",
		justifyContent: "space-between",
		alignItems:"center",
		background: "transparent",
		minHeight: 45,
		paddingLeft: 5,
		paddingRight: 5,
		width:"100%"
	},
	targetIconContainer:{
		background: "transparent",
		order:1,
		flexBasis: "10%" 
	},
	agentIconContainer:{
		background: "transparent",
		order:2,
		flexBasis: "15%"
	},
	starIconContainer:{
		background: "transparent",
		order:3,
		flexBasis: "10%",
		marginLeft: 10
		

	},
	contentContainer:{
		order:4,
		flexBasis: "60%",
		flexWrap: "wrap",
		background: "transparent",
		paddingLeft: 5,
		paddingRight: 5
	},
	leftText: {
		flex: "0 0 120px",
		alignItems: "center",
		marginRight: 12,
		paddingTop: 4,
		paddingLeft: 12,
		fontSize: 12,
		color: "#b5b9be",
		"& span" :{
			fontSize: 12,
			color: "#b5b9be"
		}
		  
	},
	rightText: {
		alignItems: "center",
		marginRight: 12,
		paddingTop: 4,
		paddingLeft: 12,
		fontSize: 12,
		color: "#b5b9be",
		"& span" :{
			fontSize: 12,
			color: "#b5b9be"
		}
	},

	listItem: {
		paddingLeft: 0
	},

	accordionSummary_content:{
		margin:0,
		"& div" :{
			margin:0
		}
	}

};

const propTypes = {
	classes: PropTypes.object.isRequired,
	facilities: PropTypes.object,
	facilityFloorPlans: PropTypes.object,
	navigate: PropTypes.func.isRequired
};

const FacilityList = ( { classes, facilities, facilityFloorPlans, navigate } ) => {
	if (!facilities) {
		return <div><Translate value="tableopSession.widgets.facilities.facilityList.noFac"/></div>;
	}

	return (
		<List style={{ width:"100%"}}>
			{	_.values(facilities).map((facility, index) => {
				const flrPlansCount = facilityFloorPlans 
						&& facilityFloorPlans.hasOwnProperty(facility.entityData.properties.id) 
						&& facilityFloorPlans[facility.entityData.properties.id].length || 0;

				return (
					<Fragment key={`facil-${facility.entityData.properties.id}`}>
						<ListItem style={{backgroundColor:"#3C4656", borderRadius: 5, paddingTop: 10, paddingRight: 10, paddingBottom: 10, marginTop: 10, marginBottom: 10}} key={`facListItem-${index}`}>
							<ListItemIcon>
								{facility.entityData.geometry && <TargetingIconContainer entities={[facility]} />}
							</ListItemIcon>
							<ListItemIcon>
								{
									<div>
										{<img src={iconConfig["facility"]} style={{ width:45, height: 45 }} />}
									</div>
								}
							</ListItemIcon>
							<ListItemText
								style={styles.rightText}
								primary={
									<div className={classes.contentContainer} style={{cursor:"pointer"}} onClick={() => navigate(facility, null)}>
										<div className="b1-white">{facility.entityData.properties.name}</div>
										<div className="b2-bright-gray">{<Translate value="tableopSession.widgets.facilities.facility.floors" count={flrPlansCount}/>}</div>
									</div>
								}
							/>
						</ListItem>
					</Fragment>
				);})
			}
		</List>
	);
};

FacilityList.propTypes = propTypes;
export default withStyles(styles)(FacilityList);