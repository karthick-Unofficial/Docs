import React, { useState } from "react";
import PropTypes from "prop-types";
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Button,
	CircularProgress
} from "@mui/material";
import { Translate } from "orion-components/i18n";
import { withStyles } from "@mui/styles";

const propTypes = {
	open: PropTypes.bool.isRequired,
	title: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
	children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
	textContent: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
	confirm: PropTypes.shape({
		label: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
		action: PropTypes.func.isRequired,
		disabled: PropTypes.bool
	}),
	abort: PropTypes.shape({
		label: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
		action: PropTypes.func.isRequired,
		disabled: PropTypes.bool
	}),
	deletion: PropTypes.shape({
		label: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
		action: PropTypes.func.isRequired,
		disabled: PropTypes.bool
	}),
	textFooter: PropTypes.string,
	requesting: PropTypes.bool,
	deleteConfirmation: PropTypes.bool,
	// The options prop allows you to pass in any Material-ui Dialog prop
	// Found here: https://material-ui.com/api/dialog/#props
	options: PropTypes.shape({
		disableBackdropClick: PropTypes.bool,
		disableEscapeKeyDown: PropTypes.bool,
		fullScreen: PropTypes.bool,
		fullWidth: PropTypes.bool,
		maxWidth: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl", false]),
		onBackdropClick: PropTypes.func,
		onClose: PropTypes.func,
		onEnter: PropTypes.func,
		onEntered: PropTypes.func,
		onEntering: PropTypes.func,
		onEscapeKeyDown: PropTypes.func,
		onExit: PropTypes.func,
		onExited: PropTypes.func,
		onExiting: PropTypes.func,
		dir: PropTypes.string
	}),
	dialogContentStyles: PropTypes.object,
	actionPropStyles: PropTypes.object
};

const defaultProps = {
	title: "",
	children: [],
	textContent: "",
	confirm: null,
	abort: null,
	deletion: null,
	textFooter: "",
	requesting: false,
	deleteConfirmation: true,
	actionPropStyles: {}
};



const stopPropagation = e => {
	e.stopPropagation();
};

const styleOverrides = {
	disabled: {
		color: "#fff!important",
		opacity: "0.3"
	}
};

const CBDialog = ({
	open,
	title,
	children,
	textContent,
	confirm,
	abort,
	deletion,
	textFooter,
	requesting,
	deleteConfirmation,
	options,
	paperPropStyles,
	titlePropStyles,
	dir,
	classes,
	dialogContentStyles,
	actionPropStyles
}) => {
	const [deletionConfirm, setDeletionConfirm] = useState(false);

	const styles = {
		dialog: { backgroundColor: "#2c2d2f" },
		title: { color: "#fff", letterSpacing: "unset", lineHeight: "unset" },
		confirm: { color: "#35b7f3" },
		footer: { margin: "32px 0" },
		deleteConfirmationBtn: {
			color: deletionConfirm ? "#FFF" : "#E85858",
			"&.MuiButton-root": {
				background: deletionConfirm ? "#E85858" : ""
			},
			...(dir === "ltr" && { marginRight: "auto" })
		},
		deleteBtn: {
			color: "#E85858",
			...(dir === "ltr" && { marginRight: "auto" }),
			...(dir === "rtl" && { marginLeft: "auto" })
		}
	};

	const askForDeleteConfirmation = () => {
		setDeletionConfirm(true);
		setTimeout(() => {
			setDeletionConfirm(false);
		}, 5000);
	};

	return (
		<Dialog
			{...options}
			PaperProps={{ sx: { ...styles.dialog, ...(paperPropStyles ? paperPropStyles : {}) } }}
			open={open}
			disableEnforceFocus={true}
			scroll="paper"
			onMouseDown={stopPropagation}
			onTouchStart={stopPropagation}
		>
			{title && (
				<DialogTitle
					sx={{ ...styles.title, ...titlePropStyles }}
					disableTypography={true}>
					{title}
				</DialogTitle>
			)}
			<DialogContent sx={dialogContentStyles}>
				{textContent && (
					<DialogContentText variant="body2" color="#fff">
						{textContent}
					</DialogContentText>
				)}
				{children}
				{textFooter && (
					<DialogContentText variant="body2" style={styles.footer}>
						{textFooter}
					</DialogContentText>
				)}
			</DialogContent>
			<DialogActions>

				{deletion && !requesting && (
					deleteConfirmation
						? (
							<Button
								sx={styles.deleteConfirmationBtn}
								onClick={deletionConfirm ? deletion.action : askForDeleteConfirmation}
								variant={deletionConfirm ? "contained" : "text"}
								onMouseDown={stopPropagation}
								onTouchStart={stopPropagation}
							>
								{deletionConfirm ? <Translate value="global.CBComponents.CBDialog.confirmDelete" /> : deletion.label}
							</Button>
						)
						: (
							<Button
								sx={styles.deleteBtn}
								onClick={deletion.action}
								onMouseDown={stopPropagation}
								onTouchStart={stopPropagation}
								style={actionPropStyles}
							>
								{deletion.label}
							</Button>
						)
				)}
				{abort && !requesting && (
					<Button
						onClick={abort.action}
						onMouseDown={stopPropagation}
						onTouchStart={stopPropagation}
						style={actionPropStyles}
						sx={{ color: "#B3B7BC", ...actionPropStyles }}
					>{abort.label}</Button>
				)}
				{confirm && !requesting && (
					<Button
						disabled={confirm.disabled}
						onClick={confirm.action}
						onMouseDown={stopPropagation}
						onTouchStart={stopPropagation}
						sx={{ ...actionPropStyles }}
						color="primary"
						classes={{
							disabled: classes.disabled
						}}
					>
						{confirm.label}
					</Button>
				)}
				{requesting && <CircularProgress />}
			</DialogActions>
		</Dialog >
	);
};

CBDialog.propTypes = propTypes;
CBDialog.defaultProps = defaultProps;

export default withStyles(styleOverrides)(CBDialog);
