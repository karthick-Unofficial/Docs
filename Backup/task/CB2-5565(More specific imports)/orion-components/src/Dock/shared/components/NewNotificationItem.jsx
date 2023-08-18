import React, { useState, useEffect } from "react";

// Material UI
import { default as User } from '@mui/icons-material/Person';
import { default as Alert } from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import { Button } from "@mui/material";
// Moment
import moment from "moment";
import { timeConversion } from "client-app-core";
import { getTranslation } from "orion-components/i18n";
import { useDispatch, useSelector } from "react-redux";


// Create variable that will hold setTimeout for clearing notification
let clearItem = undefined;

const NewNotificationItem = ({
	clearNotification,
	notification,
	isLonely,
	triggerGroupAnimation,
	close,
	timeFormatPreference,
	firstPriority
}) => {
	const dispatch = useDispatch();

	const [animating, setAnimating] = useState(false);
	const [undone, setUndone] = useState(false);

	useEffect(() => {
		// Assign setTimeout to variable. Will complete normally if undo is not clicked on user feedback toast
		clearItem = setTimeout(
			() => dispatch(clearNotification(notification.id)),
			5000
		);
	}, []);


	const handleTouchTap = () => {
		if (isLonely) {
			// If this is the last notification in group, we should animate the whole group
			triggerGroupAnimation();
			// give time for animation before we dispatch optimistic update
			setTimeout(() => close(notification.id), 200);
		} else {
			setAnimating(true);
			// give time for animation before we dispatch optimistic update
			setTimeout(() => close(notification.id), 200);
		}
	};

	const handleUndo = () => {
		notification.undoFunc();
		setUndone(true);
		// Clear inital setTimeout and set a new one
		// Prevents toast from clearing before user can visualize feedback after clicking undo
		window.clearTimeout(clearItem);
		setTimeout(
			() => dispatch(clearNotification(notification.id)),
			5000
		);
	};

	const alertIconStyles = {
		borderRadius: "30px",
		backgroundColor: "white",
		height: "28px",
		width: "28`px"
	};

	const infoIconStyles = {
		height: "30px",
		width: "30px",
		color: "//" // <-- Garbage value to overwrite mat-ui and use var
	};

	const {
		id,
		createdDate,
		summary,
		isPriority,
		feedback,
		undoFunc
	} = notification;

	const locale = useSelector(state => state.i18n.locale);
	moment.locale(locale); // support date localization

	moment.relativeTimeThreshold("h", 100000);

	const twoDaysAgo = new Date().getTime() - 2 * 24 * 60 * 60 * 1000;
	const isMoreThanTwoDaysAgo = new Date(createdDate).getTime() < twoDaysAgo;

	return (
		<div
			className={
				"new-alert-item notification-item" +
				(isPriority ? " is-priority" : "") +
				(feedback ? " feedback" : "") +
				(undone ? " undone" : "")
			}
			id={`${firstPriority ? "first-priority" : ""}`}
		>
			<div className="icon-container">
				{feedback ? (
					<div className="info-icon-wrapper">
						<User style={infoIconStyles} />
					</div>
				) : isPriority ? (
					<div className="info-icon-wrapper">
						<Alert style={alertIconStyles} color="#c64849" />
					</div>
				) : (
					<div className="info-icon-wrapper">
						<InfoIcon style={infoIconStyles} className="info-icon" />
					</div>
				)}
			</div>
			<div className="text-wrapper">
				<p className="message">
					{/* Check length of summary to prevent overflow/add ellipsis (CSS text-overflow only works on single lines) */}
					{summary.length > 50 ? summary.slice(0, 50) + "..." : summary}
				</p>
				<p className="time">
					{isMoreThanTwoDaysAgo
						? timeConversion.convertToUserTime(createdDate, `full_${timeFormatPreference ? timeFormatPreference : "12-hour"}`)
						: moment(createdDate).fromNow()}
				</p>
			</div>
			{!!undoFunc && (
				<div className="undo-button">
					<Button
						onClick={undone ? null : handleUndo}
						variant="text"
						style={{ color: "#fff" }}
					>
						{undone ? getTranslation("global.dock.shared.newNotificationItem.cancelled") : getTranslation("global.dock.shared.newNotificationItem.undo")}
					</Button>
				</div>
			)}
		</div>
	);
};

export default NewNotificationItem;
