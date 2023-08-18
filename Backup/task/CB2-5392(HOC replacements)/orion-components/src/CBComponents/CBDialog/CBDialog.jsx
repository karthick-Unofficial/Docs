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
} from "@material-ui/core";
import { Translate } from "orion-components/i18n";

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
	})
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
	deleteConfirmation: true
};

const styles = {
	dialog: { backgroundColor: "#2c2d2f" },
	title: { color: "#fff" },
	confirm: { color: "#35b7f3" },
	footer: { margin: "32px 0" }
};

const stopPropagation = e => {
	e.stopPropagation();
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
	dir
}) => {
	const [deletionConfirm, setDeletionConfirm] = useState(false);

	const askForDeleteConfirmation = () => {
		setDeletionConfirm(true);
		setTimeout(() => {
			setDeletionConfirm(false);
		}, 5000);
	};

	return (
		<Dialog
			{...options}
			PaperProps={{ style: { ...styles.dialog, ...(paperPropStyles ? paperPropStyles : {}) } }}
			open={open}
			disableEnforceFocus={true}
			scroll="paper"
			onMouseDown={stopPropagation}
			onTouchStart={stopPropagation}
		>
			{title && (
				<DialogTitle style={{ ...styles.title, ...titlePropStyles }} disableTypography={true}>
					{title}
				</DialogTitle>
			)}
			<DialogContent>
				{textContent && (
					<DialogContentText variant="body2" style={styles.text}>
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
								style={dir == "rtl" ? { color: deletionConfirm ? "#FFF" : "#E85858", marginLeft: "auto" } : { color: deletionConfirm ? "#FFF" : "#E85858", marginRight: "auto" }}
								onClick={deletionConfirm ? deletion.action : askForDeleteConfirmation}
								variant={deletionConfirm ? "contained" : "text"}
								color={deletionConfirm ? "secondary" : "default"}
								onMouseDown={stopPropagation}
								onTouchStart={stopPropagation}
							>
								{deletionConfirm ? <Translate value="global.CBComponents.CBDialog.confirmDelete" /> : deletion.label}
							</Button>
						)
						: (
							<Button
								style={dir == "rtl" ? { color: "#E85858", marginLeft: "auto" } : { color: "#E85858", marginRight: "auto" }}
								onClick={deletion.action}
								onMouseDown={stopPropagation}
								onTouchStart={stopPropagation}
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
					>{abort.label}</Button>
				)}
				{confirm && !requesting && (
					<Button
						disabled={confirm.disabled}
						onClick={confirm.action}
						onMouseDown={stopPropagation}
						onTouchStart={stopPropagation}
						color="primary"
					>
						{confirm.label}
					</Button>
				)}
				{requesting && <CircularProgress />}
			</DialogActions>
		</Dialog>
	);
};

CBDialog.propTypes = propTypes;
CBDialog.defaultProps = defaultProps;

export default CBDialog;
