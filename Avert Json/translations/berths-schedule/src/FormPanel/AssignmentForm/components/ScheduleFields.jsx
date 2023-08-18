import React, { Fragment, memo } from "react";
import PropTypes from "prop-types";
import { DateTimePicker } from "orion-components/CBComponents";
import { Grid, Typography } from "@material-ui/core";

const propTypes = {
	handleChange: PropTypes.func.isRequired,
	schedule: PropTypes.object.isRequired,
	timeFormatPreference: PropTypes.string.isRequired
};

const ScheduleFields = ({ handleChange, schedule, timeFormatPreference }) => {
	const { ata, atd, eta, etd } = schedule;
	const format = `full_${timeFormatPreference}`;
	return (
		<Fragment>
			<Typography
				style={{
					padding: "4px 16px",
					backgroundColor: "#41454a"
				}}
			>
				Schedule
			</Typography>
			<Grid style={{ padding: "0px 16px 24px 16px" }} container spacing={3}>
				<Grid item style={{ paddingBottom: 0 }} xs={5}>
					<DateTimePicker
						id="eta"
						label="ETA *"
						value={eta}
						handleChange={handleChange("eta", "schedule")}
						format={format}
					/>
				</Grid>
				<Grid item style={{ paddingBottom: 0 }} xs={5}>
					<DateTimePicker
						id="etd"
						label="ETD *"
						value={etd}
						minDate={eta || new Date("1900-01-01")}
						handleChange={handleChange("etd", "schedule")}
						format={format}
					/>
				</Grid>
				<Grid item style={{ paddingBottom: 0 }} xs={5}>
					<DateTimePicker
						id="ata"
						label="ATA"
						value={ata}
						handleChange={handleChange("ata", "schedule")}
						disabled={!eta || !etd}
						format={format}
					/>
				</Grid>
				<Grid item style={{ paddingBottom: 0 }} xs={5}>
					<DateTimePicker
						id="atd"
						label="ATD"
						value={atd}
						minDate={ata || new Date("1900-01-01")}
						handleChange={handleChange("atd", "schedule")}
						disabled={!eta || !etd}
						format={format}
					/>
				</Grid>
			</Grid>
		</Fragment>
	);
};

ScheduleFields.propTypes = propTypes;

export default memo(ScheduleFields);
