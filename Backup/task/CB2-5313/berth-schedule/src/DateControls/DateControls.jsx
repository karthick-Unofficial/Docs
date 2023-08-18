import React, { memo } from "react";
import PropTypes from "prop-types";
import { Button, IconButton } from "@mui/material";
import { Event } from "@mui/icons-material";
import { ArrowLeftCircle, ArrowRightCircle } from "mdi-material-ui";
import { DatePicker } from "orion-components/CBComponents";
import { Translate } from "orion-components/i18n";
import { useDispatch } from "react-redux";
import { setDay, setNextDay, setPreviousDay, setToday } from "./dateControlsActions";

const propTypes = {
	dir: PropTypes.string,
	locale: PropTypes.string
};

const DateControls = ({ dir, locale }) => {
	const dispatch = useDispatch();

	return (
		<div style={{ height: 48, display: "flex" }}>
			<div style={dir == "rtl" ? { borderLeft: "1px solid #B5B9BE", width: "fit-content" } : { borderRight: "1px solid #B5B9BE", width: "fit-content" }}>
				<IconButton style={{ color: "#FFF" }}>
					<div
						style={{
							position: "absolute",
							opacity: 0
						}}
					>
						<DatePicker
							handleChange={(e) => dispatch(setDay(e))}
							value={new Date()}
							clearable={false}
							dir={dir}
							locale={locale}
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
				<IconButton onClick={() => dispatch(setPreviousDay())}>
					{dir == "rtl" ? <ArrowRightCircle /> : <ArrowLeftCircle />}
				</IconButton>
				<Button onClick={() => dispatch(setToday())} variant="contained" color="primary" style={{ color: "#fff" }}>
					<Translate value="dateControls.todayLbl" />
				</Button>
				<IconButton onClick={() => dispatch(setNextDay())}>
					{dir == "rtl" ? <ArrowLeftCircle /> : <ArrowRightCircle />}
				</IconButton>
			</div>
		</div>
	);
};

DateControls.propTypes = propTypes;

export default memo(DateControls);
