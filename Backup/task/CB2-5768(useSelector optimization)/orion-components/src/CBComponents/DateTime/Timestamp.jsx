import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { timeConversion } from "client-app-core";

moment.relativeTimeThreshold("h", 24);

const propTypes = {
	timestamp: PropTypes.string.isRequired,
	format: PropTypes.string,
	locale: PropTypes.string
};

const defaultProps = {
	format: "L",
	locale: "en"
};

const Timestamp = ({ timestamp, format, useTimeAgo, locale }) => {
	const [display, setDisplay] = useState(null);
	let secondInterval = false;
	let minuteInterval = false;

	useEffect(() => {
		getTimestamp();
		handleRefresh();

		return () => {
			clearInterval(secondInterval);
			clearInterval(minuteInterval);
		};
	}, []);

	const getDuration = () => {
		const x = moment(timestamp);
		const y = moment();
		const duration = moment.duration(y.diff(x));
		return duration;
	};

	const getTimestamp = () => {
		const momentTimestamp = moment(timestamp).locale(locale);
		const display = useTimeAgo
			? `${momentTimestamp.fromNow()} (${timeConversion.convertToUserTime(momentTimestamp, "L", locale)})`
			: `${timeConversion.convertToUserTime(momentTimestamp, format, locale)}`;
		setDisplay(display);
	};

	const handleRefresh = () => {
		const duration = getDuration();
		const seconds = duration.asSeconds();
		const minutes = duration.asMinutes();
		if (minutes < 1) {
			if (!secondInterval) secondInterval = setInterval(() => handleRefresh(), 10000);
		}
		if (seconds > 59 && minutes < 59) {
			clearInterval(secondInterval);
			if (!minuteInterval) minuteInterval = setInterval(() => handleRefresh(), 60000);
		}
		if (minutes === 59) {
			clearInterval(minuteInterval);
		}
		getTimestamp();
	};

	return <span>{display}</span>;
};

Timestamp.propTypes = propTypes;
Timestamp.defaultProps = defaultProps;

export default Timestamp;
