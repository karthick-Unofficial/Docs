import React, {useState, useEffect} from "react";
import _ from "lodash";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { Star, StarOutline, Sort } from "mdi-material-ui";
import T2CheckBox from "../../shared/components/Checkbox";

const styles = {
	flexContainer:{
		display: "flex",
		justifyContent: "flex-start",
		alignItems:"center",
		background: "transparent",
		minHeight: 41,
		paddingLeft: 10,
		paddingRight: 10
	},
	iconContainer:{
		background: "transparent",
		order:1,
		paddingTop: 10,
		paddingLeft: 10,
		paddingRight: 5
	},
	contentContainer:{
		display: "flex",
		order:2,
		justifyContent: "space-between",
		alignItems:"center",
		background: "transparent",
		paddingLeft: 10,
		paddingRight: 5
	}
};

const propTypes = {
	classes: PropTypes.object.isRequired,
	human: PropTypes.bool,
	humanFillColor:PropTypes.string,
	star: PropTypes.bool,
	starOutline: PropTypes.bool,
	cubeOutline: PropTypes.bool,
	sort:  PropTypes.bool,
	width:PropTypes.string,
	labelText: PropTypes.string,
	selectedValue: PropTypes.array,
	items: PropTypes.array.isRequired,
	handleChange: PropTypes.func.isRequired,
	align: PropTypes.string,
	id : PropTypes.string
};

function T2MultiSelectControl(props) {
	//const { classes, items, handleChange } = props;
	const { classes, items, align, handleChange, id } = props;
	const widthTemp = props.width? props.width: 363;
	//const fillColor = props.humanFillColor === "red"? "#c2342a" : (props.humanFillColor === "green"? "#21c230": "#2371e5");

	const selectedValue = props.selectedValue ? props.selectedValue: [];
	const [selectedAgents, setSelectedAgents] = useState(selectedValue);
	const [open, setOpen] = useState(false);


	const handleChangeMultiple = (event, agentId) => {
		const agentIds = _.cloneDeep(selectedAgents);
		const element = event.target;
		const closestEle = element.closest("LI");
		if(element.tagName === "LI"){
			if(element.classList.contains("checked")){
				element.classList.remove("checked");
				const indexC = agentIds.findIndex((ele) => ele === agentId);
				if (indexC > -1){
					agentIds.splice(indexC, 1);
				}
			}
			else if(!element.classList.contains("checked")){
				const index = agentIds.findIndex((ele) => ele === agentId);
				if (index > -1){
					agentIds.splice(index, 1);
				}
				else {
					if(!element.classList.contains("checked")){
						element.classList.add("checked");
					}
					const index = agentIds.findIndex((ele) => ele === agentId);
					if(index < 0) {
						agentIds.push(agentId);
					}
					else{
						agentIds.splice(index, 1);
					}
				}
			}		
		}
		else if(element.type === "checkbox"){
			if (event.target.checked){
				agentIds.push(agentId);
				if(!closestEle.classList.contains("checked")){
					closestEle.classList.add("checked");
				}
			} else if (!event.target.checked){
				const indexC = agentIds.findIndex((ele) => ele === agentId);
				if (indexC > -1){
					agentIds.splice(indexC, 1);
				}
				if(closestEle.classList.contains("checked")){
					closestEle.classList.remove("checked");
				}
			}
		}
		setSelectedAgents(agentIds);
		//isAgentSelected();
	};

	const handleAddClick = () => {
		handleClose();
		handleChange(selectedAgents);
	};
	
	const isAgentSelected = (agentId) =>{
		return selectedAgents && (selectedAgents.length>0) && selectedAgents.includes(agentId) || false;
	};
	const selectAllElements =(event, agents) => {
		const agentIds = [];
		const element = event.target;
		//const closestEle = element.closest("LI");
		if(element.tagName === "LI"){
			if(element.classList.contains("checked")){
				element.classList.remove("checked");
				agentIds.length = 0;
				const matchedInputs = document.querySelectorAll("div.menuItems > input");
				matchedInputs.forEach(ele =>{
					ele.classList.remove("checked");
				});
				const matchedMenuItems = document.querySelectorAll("div.menuItems > LI");
				matchedMenuItems.forEach(ele =>{
					ele.classList.remove("checked");
				});
			}

			else if(!element.classList.contains("checked")){
				element.classList.add("checked");
				const matchedInputs = document.querySelectorAll("div.menuItems > input");
				matchedInputs.forEach(ele =>{
					ele.classList.add("checked");
				});
				const matchedMenuItems = document.querySelectorAll("div.menuItems > LI");
				matchedMenuItems.forEach(ele =>{
					ele.classList.remove("checked");
				});
				agents.forEach(agent => {
					agentIds.push(agent.id);
				});
			}
			else if(selectedAgents.length != agents.length){
				console.log(selectedAgents.length);
				console.log(agents.length);
				element.classList.remove("checked");
			}

		}	
		setSelectedAgents(agentIds);
		
	};

	const selectAll = (event, agents) => {
		const agentIds = [];
		if (event.target.checked){
			agents.forEach(agent => {
				agentIds.push(agent.id);
			});
			const matchedMenuItems = document.querySelectorAll("div.menuItems > LI");
			matchedMenuItems.forEach(ele =>{
				ele.classList.add("checked");
			});
		}
		else {
			agentIds.length = 0;
			const matchedMenuItems = document.querySelectorAll("div.menuItems > LI");
			matchedMenuItems.forEach(ele =>{
				ele.classList.remove("checked");
			});
		}
		
		setSelectedAgents(agentIds);
	};

	const isAllAgentsSelected = (agents) => {
		if(selectedAgents.length === agents.length){
			return true;
		}
		else {
			return false;
		}
	};

	const handleClose = () => {
		setOpen(false);
	};
	
	const handleOpen = () => {
		setOpen(true);
	};

	useEffect(() => {
		if(!open) {
			selectedAgents.length = 0;
		}
	}, [open]);

	const disableSubmit = () =>{
		return (selectedAgents.length>0) ? false: true;
	};

	return (
		<div className={classes.flexContainer} style={{justifyContent:(align && align === "right")? "flex-end": "flex-start"}}>
			{(props.star && <Star style={{color: "white"}} />)}
			{(props.starOutline && <StarOutline style={{color: "white"}} />)}
			{(props.sort && <Sort style={{color: "white"}} />)}

			<div className={classes.contentContainer}>
				<FormControl>
					<InputLabel id="demo-simple-select-helper-label">{props.labelText}</InputLabel>
					<Select style={{width: widthTemp}}
						labelId={id}
						id={id}
						value={selectedValue}
						multiple
						open={open}
						onClose={handleClose}
          				onOpen={handleOpen}
						//onChange={}
					>
						{items.length > 0 &&
							<div className="menuItems">
								<MenuItem key={items.length} onClick={(e) => selectAllElements(e, items)} value="select All"><T2CheckBox checked={isAllAgentsSelected(items)} onChange={(e) => selectAll(e, items)} name="select All"/>Select All</MenuItem>
								{items && items.map(item => {
									// eslint-disable-next-line react/jsx-key
									return <MenuItem key={item.name} onClick={(e) =>  handleChangeMultiple(e, item.id)} name="menuItem">
										<T2CheckBox checked={isAgentSelected(item.id)} onChange={(e) => handleChangeMultiple(e, item.id)} name={`${item.id}`} />{item.name}</MenuItem>;
								})}
							</div>
						}
						{items.length > 0 &&
							<div className="addButton">
								<Button variant="contained" color="primary" disabled={disableSubmit()} onClick={handleAddClick}>Add</Button>
							</div>
						}
						{items.length < 1 &&
							<div className="noAgents">No Agents to Select</div>
						}
					</Select>
				</FormControl>
			</div>
		</div>
	);
}

T2MultiSelectControl.propTypes = propTypes;

export default withStyles(styles)(T2MultiSelectControl);
