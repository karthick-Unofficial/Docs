import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import {  Button, Typography, FormControlLabel } from "@material-ui/core";
import { ArrowLeft, PlusCircle } from "mdi-material-ui";
import { iconConfig } from "../iconConfig";
import { Translate } from "orion-components/i18n/I18nContainer";

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
	plusCircle: PropTypes.bool,
	back: PropTypes.bool,
	isFacilitator: PropTypes.bool,
	labelText: PropTypes.string,
	openPlayerSelection: PropTypes.func,
	dir: PropTypes.string
};

function T2IconButton(props) {
	const { classes, openPlayerSelection, role, isFacilitator, dir } = props;
	const iconPath =  (isFacilitator)? iconConfig["player_facilitator"] : iconConfig[`player_${role}`];
	const labelText = props.labelText? props.labelText: "None";
	const handleOnClick = ()=> {
		openPlayerSelection(true);
	};

	return (
		<div className={classes.flexContainer}>
			<div className={dir == "rtl" ? classes.contentContainerRTL : classes.contentContainer}>
				<FormControlLabel
					className={classes.formControlLabel}
					control={
						<Button color="primary" onClick={handleOnClick}>
							<div>
								{(props.human && <img src={iconPath} style={{ width:35, height: 35 }} />)}
                    
								{(props.plusCircle &&  <PlusCircle style={{color: "white", paddingTop:5}} />)}

								{(props.back && <ArrowLeft style={{color: "#5E6571", paddingTop:5}} />)}

							</div>
						</Button>
					}
					label={<Typography variant="body1" style={dir == "rtl" ? {color: (props.back?"#5E6571": "white"),  marginRight: (props.back?-15: -5)} : {color: (props.back?"#5E6571": "white"),  marginLeft: (props.back?-15: -5)}}>{labelText == "None" ?  <Translate value="shared.components.t2IconButton.none"/> : labelText}</Typography>}
				/>
			</div>
		</div>
	);
}

T2IconButton.propTypes = propTypes;

export default withStyles(styles)(T2IconButton);
