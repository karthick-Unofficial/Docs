import React, { memo } from "react";
import PropTypes from "prop-types";
import { Button, IconButton } from "@material-ui/core";
import { Event } from "@material-ui/icons";
import { ArrowLeftCircle, ArrowRightCircle } from "mdi-material-ui";
import { DatePicker } from "orion-components/CBComponents";
import { Translate } from "orion-components/i18n/I18nContainer";

const propTypes = {
	setDay: PropTypes.func.isRequired,
	setNextDay: PropTypes.func.isRequired,
	setPreviousDay: PropTypes.func.isRequired,
	setToday: PropTypes.func.isRequired
};

const DateControls = ({ setDay, setNextDay, setPreviousDay, setToday }) => {
	return (
		<div style={{ height: 48, display: "flex" }}>
			<div style={{ borderRight: "1px solid #B5B9BE", width: "fit-content" }}>
				<IconButton style={{ color: "#FFF" }}>
					<div
						style={{
							position: "absolute",
							opacity: 0
						}}
					>
						<DatePicker
							handleChange={setDay}
							value={new Date()}
							clearable={false}
						/>
					</div>
					<Event />
				</IconButton>
			</div>
			<div
				style={{
					width: "100%",
					display: "flex",
					alignItems: "center",
					justifyContent: "space-around"
				}}
			>
				<IconButton onClick={setPreviousDay}>
					<ArrowLeftCircle />
				</IconButton>
				<Button onClick={setToday} variant="contained" color="primary">
					<Translate value="dateControls.todayLbl"/>
				</Button>
				<IconButton onClick={setNextDay}>
					<ArrowRightCircle />
				</IconButton>
			</div>
		</div>
	);
};

DateControls.propTypes = propTypes;

export default memo(DateControls);
