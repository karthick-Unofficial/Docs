import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { Star, StarOutline, CubeOutline, Sort } from "mdi-material-ui";
import { iconConfig } from "../iconConfig";

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
	},
	iconContainerRTL:{
		background: "transparent",
		order:1,
		paddingTop: 10,
		paddingRight: 10,
		paddingLeft: 5
	},
	contentContainerRTL:{
		display: "flex",
		order:2,
		justifyContent: "space-between",
		alignItems:"center",
		background: "transparent",
		paddingRight: 10,
		paddingLeft: 5
	}
};

const propTypes = {
	classes: PropTypes.object.isRequired,
	human: PropTypes.bool,
	role:PropTypes.string,
	star: PropTypes.bool,
	starOutline: PropTypes.bool,
	cubeOutline: PropTypes.bool,
	sort:  PropTypes.bool,
	isFacilitator: PropTypes.bool,
	width:PropTypes.string,
	labelText: PropTypes.string,
	selectedValue: PropTypes.string,
	items: PropTypes.array.isRequired,
	handleChange: PropTypes.func.isRequired,
	align: PropTypes.string,
	dir: PropTypes.string
};

function T2SelectControl(props) {
	//const { classes, items, handleChange } = props;
	const { classes, items, align, handleChange, role, isFacilitator, dir } = props;
	const widthTemp = props.width? props.width: 363;
	const iconPath  =  (isFacilitator)? iconConfig["player_facilitator"] : iconConfig[`player_${role}`];
	const selectedValue = props.selectedValue ? props.selectedValue: "";
	
	return (
		<div className={classes.flexContainer} style={{justifyContent:(align && align === "right")? "flex-end": "flex-start"}}>
			<div className={dir == "rtl" ? classes.iconContainerRTL : classes.iconContainer}>
				{(props.human && <img src={iconPath } style={{ width:35, height: 35 }} />)}

				{(props.cubeOutline && <CubeOutline style={{color: "white", fontSize: "48px"}}/>)}
				{(props.star && <Star style={{color: "white"}} />)}
				{(props.starOutline && <StarOutline style={{color: "white"}} />)}
				{(props.sort && <Sort style={{color: "white"}} />)}

			</div>
			<div className={dir == "rtl" ? classes.contentContainerRTL : classes.contentContainer}>
				<FormControl>
					<InputLabel id="demo-simple-select-helper-label">{props.labelText}</InputLabel>
					<Select style={{width: widthTemp}}
						labelId={selectedValue.toString()}
						id={selectedValue.toString()}
						value={selectedValue}
						onChange={ (e) => handleChange(e.target.value)}
					>
						{items && items.map(item => {
							// eslint-disable-next-line react/jsx-key
							return <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>;
						})}
					</Select>
				</FormControl>
			</div>
		</div>
	);
}

T2SelectControl.propTypes = propTypes;

export default withStyles(styles)(T2SelectControl);
