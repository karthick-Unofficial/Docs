import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { Button } from "@mui/material";
import moment from "moment";
import { Translate } from "orion-components/i18n";

const EventReOpenAndClose = ({ startDate, endDate, onSave }) => {
	const [isEventActive, setIsEventActive] = useState(false);
	const [isCloseButtonDisabled, setIsCloseButtonDisabled] = useState(false);

	useEffect(() => {
		const eventClosed = endDate && moment(endDate) < moment(new Date());
		const isPastStartDate = moment(startDate) > moment(new Date());
		setIsCloseButtonDisabled(isPastStartDate);
		setIsEventActive(eventClosed);
	}, [startDate, endDate]);

	const handleSave = () => {
		const now = new Date().toISOString();
		const action = isEventActive ? "re-open" : "close";
		onSave(action, now);
	};

	const buttonLabel = useMemo(() => {
		return (
			<Translate
				value={
					isEventActive
						? "global.profiles.eventProfile.components.eventReopenAndClose.reopen"
						: "global.profiles.eventProfile.components.eventReopenAndClose.close"
				}
			/>
		);
	}, [isEventActive]);

	const styles = useMemo(() => {
		return {
			button: {
				color: "#fff",
				padding: "8px 40px"
			}
		};
	}, []);

	return (
		<div>
			<Button
				variant="contained"
				color="primary"
				style={styles.button}
				onClick={handleSave}
				disabled={isEventActive ? false : isCloseButtonDisabled}
			>
				{buttonLabel}
			</Button>
		</div>
	);
};

EventReOpenAndClose.propTypes = {
	startDate: PropTypes.instanceOf(Date).isRequired,
	endDate: PropTypes.instanceOf(Date),
	onSave: PropTypes.func.isRequired
};

export default React.memo(EventReOpenAndClose);
