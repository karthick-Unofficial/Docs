import React, { useEffect, useState, memo, useRef } from "react";
import moment from "moment";
import { Typography } from "@mui/material";
import { useSelector } from "react-redux";

const ElapsedTimer = ({ initialActivityDate, eventEndDate }) => {
	const locale = useSelector((state) => state.i18n.locale);
	moment.locale(locale);

	const [hoursPassed, setHoursPassed] = useState("");
	const [minutesPassed, setMinutesPassed] = useState("");
	const [secondsPassed, setSecondsPassed] = useState("");
	const updateInterval = useRef(null);

	useEffect(() => {
		if (updateInterval.current) {
			clearInterval(updateInterval.current);
		}

		updateTimer();

		if (!eventEndDate) {
			updateInterval.current = setInterval(function () {
				updateTimer();
			}, 1000);
		}

		return () => {
			if (updateInterval.current) {
				clearInterval(updateInterval.current);
			}
		};
	}, [eventEndDate]);

	const updateTimer = () => {
		const formattedDateTime = moment(initialActivityDate).format("YYYY/MM/DD HH:mm:ss");
		const endTime = eventEndDate ? moment(eventEndDate) : moment();
		const timeDiff = endTime.diff(moment(formattedDateTime, "YYYY/MM/DD HH:mm:ss"));
		setMinutesPassed(moment.utc(timeDiff).format("m"));
		setSecondsPassed(moment.utc(timeDiff).format("ss"));
		setHoursPassed(endTime.diff(initialActivityDate, "hours"));
	};

	return (
		<Typography style={{ color: "#fff", fontSize: 22, lineHeight: "unset" }}>
			{hoursPassed > 0 && `${hoursPassed}h `}
			{minutesPassed}m {secondsPassed}s
		</Typography>
	);
};

export default memo(ElapsedTimer);
