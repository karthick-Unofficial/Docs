import React from "react";
import PropTypes from "prop-types";
import {
	Dialog,
	DialogContent,
	DialogActions,
	Button
} from "@material-ui/core";
import { Translate } from "orion-components/i18n/I18nContainer";
import { withStyles } from "@material-ui/core/styles";
import { AlertRhombus } from "mdi-material-ui";

const propTypes = {
	error: PropTypes.object,
	clearError: PropTypes.func.isRequired,
	classes: PropTypes.object.isRequired,
	dir: PropTypes.string
};

const styles = {
	dialogActions: {
		display: "flex",
		justifyContent: "flex-end",
		alignItems:"center",
		background: "transparent",
		paddingTop: 50,
		paddingBottom: 30,
		paddingRight: 25
	},
	dialogActionsRTL: {
		display: "flex",
		justifyContent: "flex-end",
		alignItems:"center",
		background: "transparent",
		paddingTop: 50,
		paddingBottom: 30,
		paddingLeft: 25
	}
};

const ErrorDialog = ( { error, clearError, classes, dir } ) => {
	if (!error || !error.errorMessage) {
		return null;
	}

	return (
		<Dialog open={true}>
			<DialogContent style={{width:478}}>
				<div style={{marginLeft: 36, marginRight: 36}}>
					<div 
						style={{
							background: "#d58f8c", 
							height: 45, 
							display: "flex", 
							alignItems: "center", 
							marginTop: 18
						}}
					>
						<AlertRhombus style={{color: "#fff", marginLeft: 15}}/>
						<span className="b1-white" style={dir == "rtl" ? {marginRight: 25} : {marginLeft: 25}}><Translate value="shared.components.errorBoundary.Error" /></span>
					</div>
					<div className="b2-white" style={{marginTop: 32, whiteSpace: "pre-line"}}>{error.errorMessage}</div>
				</div>
			</DialogContent>
			<DialogActions className={dir == "rtl" ? classes.dialogActionsRTL : classes.dialogActions}>
				<Button 
					onClick={clearError} 
					style={dir == "rtl" ? { 
						background: "#5f6571", 
						color: "#fff", 
						width: 74, 
						height: 41, 
						marginRight:0, 
						marginLeft:10 
					} : { 
						background: "#5f6571", 
						color: "#fff", 
						width: 74, 
						height: 41, 
						marginLeft:0, 
						marginRight:10 
					}}
				>
					<Translate value="shared.components.errorBoundary.ok" />
				</Button>
			</DialogActions>
		</Dialog>
	);
};

ErrorDialog.propTypes = propTypes;
export default withStyles(styles)(ErrorDialog);
