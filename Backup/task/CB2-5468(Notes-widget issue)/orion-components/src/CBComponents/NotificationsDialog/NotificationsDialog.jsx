import React, { useState, useEffect, Fragment } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Button
} from "@mui/material";

const propTypes = {
	notifications: PropTypes.array.isRequired,
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
		onExiting: PropTypes.func
	}),
	clearSystemNotifications: PropTypes.func.isRequired,
	dir: PropTypes.string
};

const defaultProps = {
	notifications: [],
	dir: "ltr"
};

const styles = {
	dialog: { backgroundColor: "#2c2d2f" },
	title: { color: "#fff" },
	pageCounter: {
		position: "absolute",
		top: "0",
		right: "0",
		margin: "0",
		padding: "16px 24px",
		color: "#fff",
		fontSize: "12px"
	},
	text: {
		color: "#B5B9BE",
		minWidth: "552px",
		minHeight: "130px"
	},
	confirm: { color: "#35b7f3" },
	pageCounterRTL: {
		position: "absolute",
		top: "0",
		left: "0",
		margin: "0",
		padding: "16px 24px",
		color: "#fff",
		fontSize: "12px"
	}
};

const stopPropagation = e => {
	e.stopPropagation();
};

const NotificationsDialog = ({
	notifications,
	options,
	paperPropStyles,
	titlePropStyles,
	clearSystemNotifications,
	dir
}) => {
	const dispatch = useDispatch();
	const [ open, setOpen ] = useState(notifications.length > 0);
	const [ currentPage, setCurrentPage ] = useState(1);
	const [ currentNotification, setCurrentNotification ] = useState(notifications[0]);

	useEffect(() => {
		// -- open dialog if new notifications and currently closed
		if (open === false) {
			setOpen(notifications.length > 0);
			setCurrentNotification(notifications[0]);
		}
	}, [notifications]);

	const goToNextPage = (newPage) => {
		// -- move on to the next notification if available, or close the dialog
		const newNotification = notifications[newPage-1];
		if (newNotification) {
			if (newNotification.ack) {
				// -- skip notification if already acknowledged
				goToNextPage(newPage + 1);
			}
			else {
				setCurrentNotification(newNotification);
				setCurrentPage(newPage);
			}
		}
		else {
			// -- close dialog and remove system notifications
			setOpen(false);
			dispatch(clearSystemNotifications());
		}
	};

	const onConfirmClick = () => {
		// -- run action associated with confirmation
		currentNotification.confirm.action();

		goToNextPage(currentPage + 1);
	};

	return currentNotification ? (
		<Dialog
			{...options}
			PaperProps={{ style: {...styles.dialog, ...(paperPropStyles ? paperPropStyles : {})} }}
			open={open}
			disableEnforceFocus={true}
			scroll="paper"
			onMouseDown={stopPropagation}
			onTouchStart={stopPropagation}
		>
			{currentNotification.title && (
				<DialogTitle style={{...styles.title, ...titlePropStyles}} disableTypography={true}>
					{currentNotification.title}
				</DialogTitle>
			)}
			{notifications.length > 1 && (
				<p style={dir && dir == "rtl" ? styles.pageCounterRTL : styles.pageCounter}>{`${currentPage}/${notifications.length}`}</p>
			)}
			<DialogContent>
				{currentNotification.textContent && (
					<DialogContentText variant="body2" style={styles.text}>
						{currentNotification.textContent.split("\n").map((text, index, array) => {
							// -- don't add line break on last item
							const lastItem = index === array.length-1;
							return (
								<Fragment key={index}>
									{text}{!lastItem && <br/>}
								</Fragment>
							);
						})}
					</DialogContentText>
				)}
			</DialogContent>
			<DialogActions>
				{currentNotification.confirm && (
					<Button
						disabled={currentNotification.confirm.disabled}
						onClick={onConfirmClick}
						onMouseDown={stopPropagation}
						onTouchStart={stopPropagation}
						color="primary"
					>
						{currentNotification.confirm.label}
					</Button>
				)}
			</DialogActions>
		</Dialog>
	) : null;
};

NotificationsDialog.propTypes = propTypes;
NotificationsDialog.defaultProps = defaultProps;

export default NotificationsDialog;
