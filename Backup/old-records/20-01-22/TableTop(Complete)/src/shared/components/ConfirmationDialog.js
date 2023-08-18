import React from "react";
import PropTypes from "prop-types";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Button
} from "@material-ui/core";

import { withStyles } from "@material-ui/core/styles";
import { AlertCircle	} from "mdi-material-ui";
import { Translate } from "orion-components/i18n/I18nContainer";

const styles = {
	flexContainer:{
		display: "flex",
		justifyContent: "space-between",
		alignItems:"center",
		background: "transparent",
		minHeight: 80,
		paddingLeft: 20,
		paddingRight: 10
	},
	contentContainer:{
		display: "flex",
		justifyContent: "flex-start",
		alignItems:"center",
		background: "transparent",
		paddingTop: 10,
		paddingBottom: 10,
		paddingLeft: 10,
		paddingRight: 10
	},
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

function ConfirmationDialog(props) {
	const { open, onClose, loading, title, content, onConfirm, classes, dir } = props;
	return (
		<Dialog
			open={open}
			onClose={onClose}
			disableBackdropClick={loading}
			disableEscapeKeyDown={loading}
		>
			<DialogTitle>{title}</DialogTitle>
			<DialogContent className={classes.contentContainer} style={{width:478}}>
				<AlertCircle style={dir == "rtl" ? {color: "white", marginTop: -25, marginRight:30} : {color: "white", marginTop: -25, marginLeft:30}}/>
				<DialogContentText style={dir == "rtl" ? {width: 330, marginRight:25} : {width: 330, marginLeft:25}}> {content}</DialogContentText>
			</DialogContent>
			<DialogActions className={dir == "rtl" ? classes.dialogActionsRTL : classes.dialogActions}>
				<Button style={dir == "rtl" ? { width: 100, marginRight:10, marginLeft:0} : { width: 100, marginLeft:10, marginRight:0}} onClick={onClose}> <Translate value="shared.components.confirmationDialog.cancel"/> </Button>
				<Button color="primary" onClick={onConfirm} variant="contained" style={dir == "rtl" ? { width: 74, height: 41, marginRight:0, marginLeft:10 } : { width: 74, height: 41, marginLeft:0, marginRight:10 }} > <Translate value="shared.components.confirmationDialog.ok"/> </Button>
			</DialogActions>
		</Dialog>
	);
}

ConfirmationDialog.propTypes = {
	open: PropTypes.bool,
	onClose: PropTypes.func,
	loading: PropTypes.bool,
	title: PropTypes.string,
	content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
	onConfirm: PropTypes.func,
	classes: PropTypes.object.isRequired,
	dir: PropTypes.string
};

export default withStyles(styles)(ConfirmationDialog);
