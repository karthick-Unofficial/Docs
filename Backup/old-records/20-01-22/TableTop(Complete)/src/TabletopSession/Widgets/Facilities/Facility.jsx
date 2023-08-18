import _ from "lodash";
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Card, CardContent } from "@material-ui/core";
import { ChevronLeft, ArrowExpand, ArrowCollapse, ArrowUpDropCircleOutline, ArrowDownDropCircleOutline } from "mdi-material-ui";
import FloorPlanContainer from "./FloorPlanContainer";
import TargetingIconContainer from "../../Controls/TargetingIcon/TargetingIconContainer";
import { withStyles } from "@material-ui/core/styles";
//import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import { iconConfig } from "../../../shared/iconConfig";
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
	floorIconContainer:{
		background: "transparent",
		order:2,
		flexBasis: "15%"
	},
	contentContainer:{
		order:4,
		flexBasis: "60%",
		flexWrap: "wrap",
		background: "transparent",
		paddingLeft: 5,
		paddingRight: 5
	},

	maxHeight:{
		height:"calc(100vh - 300px)"
	}
};

const propTypes = {
	classes: PropTypes.object.isRequired,
	facility: PropTypes.object.isRequired,
	floorPlan: PropTypes.object,
	floorPlans: PropTypes.array,
	navigate: PropTypes.func.isRequired
};

const Facility = ( { classes, facility, floorPlan, floorPlans, navigate } ) => {
	const [expandInfo, setExpandInfo]  =useState({expand: false, floorId: "", orderId: 1});

	useEffect(() => {
		if (floorPlan) {
			setExpandInfo({
				expand: true,
				floorId: floorPlan.id,
				orderId: floorPlan.order
			});
		} else {
			setExpandInfo({
				expand: false,
				floorId: "",
				orderId: 1
			});
		}
	}, [ floorPlan ]);

	const flrPlansCount = floorPlans && floorPlans.length || 0;

	const handleFloorExpand = (floorId) =>{
		const plan = floorPlans.find(f => f.id === floorId);
		navigate(facility, plan);
	};

	const handleFloorUpDown =(currentOrderNo, upOrdown) =>{
		let orderId=0; 
		if (upOrdown === "DOWN"){
			if (currentOrderNo > 1){
				orderId = (currentOrderNo-1);
			}
			else {
				return;
			}
		}
		else if (upOrdown === "UP"){
			if (currentOrderNo < floorPlans.length){
				orderId = (currentOrderNo + 1);
			}
			else {
				return;
			}
		}

		const floorTemp = floorPlans.find( f=> (f.order === orderId));

		navigate(facility, floorTemp);
	};

	return (
		<div>
			<div style={{display: "flex", margin: 10}} >
				<ChevronLeft className="b1-white" style={{cursor: "hand", margin: -3}} onClick={() => navigate(null, null)} />
				<div className="b1-white" style={{marginLeft:10, color:"#4DB5F4"}}><Translate value="tableopSession.widgets.facilities.facility.title"/></div>
			</div>
			<div className={classes.flexContainer} style={{backgroundColor:"#3C4656", borderRadius: 5, paddingTop:10, paddingBottom:10}}>
				<div className={classes.targetIconContainer}> 
					{facility.entityData.geometry && <TargetingIconContainer entities={[facility]} />}
				</div>
				<div className={classes.floorIconContainer}> {
					(<img src={iconConfig["facility"]} style={{ width:45, height: 45 }} />)
				}
				</div>
				<div className={classes.contentContainer} style={{cursor:"pointer"}}>
					<div className="b1-white">{facility.entityData.properties.name}</div>
					<div className="b1-bright-gray">{<Translate value="tableopSession.widgets.facilities.facility.floors" count={flrPlansCount}/>}</div>
				</div>
			</div>
			
			{!expandInfo.expand && floorPlans && _.orderBy(floorPlans, "order", "asc").map(floorPlan => {
				return (
					<Card key={floorPlan.id} style={{boxShadow:"none", paddingLeft:0, paddingRight:0, paddingBottom:0}}>
						<CardContent style={{paddingLeft:0, paddingRight:0}}>
							<div className={classes.flexContainer} style={{height:37, background:"#161617", marginLeft:0, marginRight:0}}>
								<div style={{width:10, flexBasis:25}}> 
								</div>
								<div>{floorPlan.name}</div>
								<IconButton aria-label="floorExpand" onClick={() => handleFloorExpand(floorPlan.id)} style={{flexBasis:25}}>
									{expandInfo.expand && <ArrowCollapse />}
									{!expandInfo.expand && <ArrowExpand />}
								</IconButton>
							</div>
							<div style={{marginLeft:0, marginRight:0, height:217, width:"100%"}}>
								<FloorPlanContainer facility={facility} floorPlan={floorPlan}/>
							</div>
						</CardContent>
					</Card>
				);
			})}

			{expandInfo.expand && floorPlans && floorPlan &&
				<Card key={floorPlan.id} style={{boxShadow:"none", paddingLeft:0, paddingRight:0, paddingBottom:0, height:"100%"}}>
					<CardContent style={{paddingLeft:0, paddingRight:0}}>
						<div className={classes.flexContainer} style={{height:37, background:"#161617", marginLeft:0, marginRight:0}}>
							<div style={{width:10}}></div>
							<div className={classes.flexContainer} style={{width:"100%"}}>
								<IconButton aria-label="down" onClick={() => handleFloorUpDown(floorPlan.order, "DOWN")} disabled={(floorPlan.order > 1)? false: true} >
									<ArrowDownDropCircleOutline style={{marginLeft:10, marginRight:5}}/>
								</IconButton>
								<div style={{textAlignLast:"center"}}>{floorPlan.name}</div>
								<IconButton aria-label="up" onClick={() => handleFloorUpDown(floorPlan.order,  "UP")} disabled={(floorPlan.order < floorPlans.length)? false: true} >
									<ArrowUpDropCircleOutline style={{marginLeft:5, marginRight:10}}/>
								</IconButton>
							</div>
							<IconButton aria-label="floorExpand" onClick={() => handleFloorExpand(floorPlan.id, floorPlan.order)} >
								{expandInfo.expand && <ArrowCollapse />}
								{!expandInfo.expand && <ArrowExpand />}
							</IconButton>
						</div>
						<div className={classes.maxHeight} style={{marginLeft:0, marginRight:0, width:"100%", paddingBottom:10}}>
							<FloorPlanContainer facility={facility} floorPlan={floorPlan} style={{marginLeft:0, marginRight:0, height:"100%", width:"100%"}}/>
						</div>
					</CardContent>
				</Card>
			}
		</div>
	);
};

Facility.propTypes = propTypes;
export default  withStyles(styles)(Facility);