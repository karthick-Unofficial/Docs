import React from "react";
import PropTypes from "prop-types";
import { Dialog, DialogContent, withStyles } from "@material-ui/core";
import DialogTitleWithCloseIcon from "./DialogTitleWithCloseIcon";

const styles = {
	dialogContainer: {
		paddingTop: 10,
		display: "flex",
		flexDirection: "column",
		justifyContent: "stretch",
		background: "#414449"
	},
	dialogActions: {
		paddingTop: 20,
		paddingBottom: 20,
		paddingRight: 20,
		background: "#414449"
	},
	dialogContent: {
		paddingTop: 10,
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		background: "#414449"
	}
};

const propTypes = {
	classes: PropTypes.object.isRequired,
	open: PropTypes.bool.isRequired,
	content: PropTypes.element.isRequired,
	onClose: PropTypes.func.isRequired,
	headline:PropTypes.string.isRequired,
	dir: PropTypes.string
};

function SetupTeamDialog(props) {
	const { onClose, classes,  open, content, headline, dir} = props;
	return (
		<Dialog
			maxWidth= "lg"
			open={open}
			hideBackdrop
			onClose={onClose}
		>
			<DialogTitleWithCloseIcon title={headline} onClose={onClose} disabled={false} dir={dir}/>

			<DialogContent className={classes.dialogContainer}>
				{content}
			</DialogContent>

			{/* <DialogActions className={classes.dialogActions}>
				<Button onClick={onClose}>Cancel</Button>
				<Button variant="contained" color="primary" style={{ width: 258 }} onClick={handleSubmit}>{submitlabel}</Button>
			</DialogActions> */}

		</Dialog>
	);
}

SetupTeamDialog.propTypes =propTypes ;

export default withStyles(styles)(SetupTeamDialog);
