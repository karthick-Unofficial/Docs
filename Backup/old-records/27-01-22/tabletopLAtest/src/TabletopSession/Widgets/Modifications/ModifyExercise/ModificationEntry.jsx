// This control represents a single modification and takes into account the options that should
// be displayed to the user (like approve/reject for controllers, edit/delete for self created modifications)
import React, {useState, useEffect, Fragment} from "react";
import PropTypes from "prop-types";
import {Delete, Edit, Undo} from "@material-ui/icons";
import { iconConfig } from "../../../../shared/iconConfig";
import { Comment } from "mdi-material-ui";
import { CheckCircle } from "mdi-material-ui";
import { CloseCircle } from "mdi-material-ui";
import { Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { TextField } from "@material-ui/core";
import TargetingIconContainer from "../../../Controls/TargetingIcon/TargetingIconContainer";
import AgentIcon from "../../../MapBase/LayerSources/MapLayer/AgentIcon";

const styles = {
	flexContainer: {
	  paddingTop: 10,
	  paddingLeft: 5,
	  display: "flex",
	  background: "transparent"
	}
};

const propTypes ={
	entities: PropTypes.array,
	geometries: PropTypes.array,
	history: PropTypes.bool,
	isController: PropTypes.bool,
	entryMode:  PropTypes.string, // Add OR Edit OR Pending OR ACCEPT or REJECT) to display icon
	description: PropTypes.string,
	existingcomment: PropTypes.string,
	onEdit:  PropTypes.func,
	onDelete:  PropTypes.func,
	onAccept:  PropTypes.func,
	onReject:  PropTypes.func,
	onUndo:  PropTypes.func
};

const ModificationEntry = (props) => {
	const {entities, geometries, history, isController, entryMode, description, existingcomment, onEdit, onDelete, onAccept, onReject, onUndo } = props;
	
	const [ comment, setComment ] = useState(existingcomment);

	useEffect(() => {
		setComment(existingcomment);
	}, [existingcomment]);
	
	const mode = entryMode? entryMode.toUpperCase(): ""; // to display various icons and button 

	const commentTextFieldVisible = () =>{
		return (isController && (mode === "SUBMITTED" || mode === "RESUBMITTED"))? true: false;
	};

	const commentLabelVisible = () =>{
		if (comment && comment.trim().length>0){
			return ((mode === "APPROVED" || mode === "REJECTED"))? true: false; 
		} else{ 
			return false;
		}
	};

	const getIcon = (entity) =>{
		const entType = entity.entityType? entity.entityType.toLowerCase() : entity.entityData.properties.entityType.toLowerCase();
		return (
			<div style={{display: "flex", alignItems: "center", justifyContent: "center", height: 45, width: 45}} className="agentIcon">
				{
					( entType === "agent") && <AgentIcon size={45} agent={entity} group={false} />
				}
				{
					(entType === "objective") && <img style={{height: 30, width: 30}} src={`${history ? iconConfig["objective"] : iconConfig["objective_modification"]}`} />
				}
			</div>
		);
	};

	return (entities && entities.length>0) ? (
		<div className="modificationItemContainer" style={{marginTop:10, marginBottom:10, minHeight:70, width: "98%"}}>
			
			{/* target icon */}
			<div style={{width:45, visibility:"visible", alignSelf: "center"}} data-html2canvas-ignore="true">
				{entities[0].entityData.geometry && <TargetingIconContainer marginTop={5} entities={entities} geometries={geometries}/>}
			</div>

			{/* Agent icon */}
			<div style={{minWidth:45, visibility:"visible", margin:5, alignSelf: "center"}} className="agentIconDiv">
				{
					getIcon(entities[0])
				}
			</div>
			
			{/* Modification desc */}
			<div className="modificationflexColumn" style={{margin:5, marginLeft:10, width:"100%"}}>
				<Typography variant="body1" className="b2-gray" 
					style={{textAlign:"left", textDecoration:(mode === "REJECTED")? "line-through": "none"}}>{description}</Typography>
				{
					commentTextFieldVisible() && 
					<div className="modificationCommentsField">
						<TextField
							id={`txt-${entities[0].id}`}
							value={comment}
							//formControlStyles={{ margin: "0px 0px 0px 0px" }}
							placeholder="Add comment…"
							multiline={false}
							onChange={(e)=>setComment(e.target.value)}
							//disabled={false}
						/>
						{/*<TextField
							id={`txt-${entities[0].id}`}
							formControlStyles={{ margin: "0px 0px 0px 0px" }}
							label=""
							value={comment ? comment : "Add Comment..."}
							handleChange={(e)=>setComment(e.target.value)}
							disabled={false}
						/>*/}
					</div>
				}
				{
					commentLabelVisible() &&
					<div className="modificationflex" style={{marginTop:0, justifyContent: "start", alignItems: "center"}}>
						<Comment  style={{textAlign:"center", width:20, height:20, color:"white"}}/>
						<Typography variant="body1" className="b2-gray" style={{textAlign:"left", marginLeft:10}}>{comment}</Typography>
					</div>
				}
			</div>
			
			<div className="" style={{margin:5, alignSelf: "center"}}>
				{ /* PENDING Button */
					!isController && (mode === "SUBMITTED" || mode === "RESUBMITTED") && <Typography variant="body1" className="b2-gray" style={{textAlign:"left"}}>{"Pending..."}</Typography>
				}
			</div>
			
			{ /* Edit Button */
				(mode === "CREATED" || mode === "EDITED" || (mode === "REJECTED" && !isController)) && <div style={{width:20, margin:5, alignSelf: "center"}}>
					<Edit style={{textAlign: "center", width:20, height:20, cursor:"pointer"}} onClick={onEdit}/>
				</div>
			}

			{ /* Delete Button */
				(mode === "CREATED" || mode === "EDITED" || (mode === "REJECTED" && !isController)) && <div style={{width:20, margin:5, alignSelf: "center"}}>
					<Delete style={{textAlign: "center", width:20, height:20, cursor:"pointer"}} onClick={onDelete}/>
				</div>
			}

			{ /* Accept Button */
				isController && (mode === "SUBMITTED" || mode === "RESUBMITTED" ) && <div style={{width:20, margin:5, alignSelf: "center"}}>
					<CheckCircle style={{textAlign: "center", width:20, height:20, cursor:"pointer"}}  onClick={() => onAccept(comment)}></CheckCircle>
				</div>
			}
			
			{	/* Reject Button */ 
				isController && (mode === "SUBMITTED" || mode === "RESUBMITTED" ) && <div style={{width:20, margin:5, alignSelf: "center"}}>
					<CloseCircle style={{textAlign:"center", width:20, height:20, cursor:"pointer"}} onClick={() => onReject(comment)} />
					
				</div>
			}

			{	/* Accept Status Icon */
				(mode === "APPROVED") && <div style={{width:20, margin:5, alignSelf: "center"}}>
					<img src={iconConfig["green_check"]} style={{width: 20, height:20 }} />
				</div>
			}

			{	/* Reject Status Icon */
				(mode === "REJECTED") && <div style={{width:20, margin:5, alignSelf: "center"}}>
					<img src={iconConfig["red_cross"]} style={{width: 20, height:20 }} />
				</div>
			}

			{	/* Undo Button, Note: this button should be visible only when accepted or rejected by controller */ 
				isController && (mode === "APPROVED" || mode === "REJECTED") && <div style={{width:20, margin:5, alignSelf: "center"}}>
					<Undo style={{textAlign:"center", width:20, height:20, cursor:"pointer"}} onClick={onUndo}/>
				</div>
			}
		</div>
	) : (
		<Fragment></Fragment>
	);
};

ModificationEntry.propTypes = propTypes;

export default withStyles(styles)(ModificationEntry);