import React, { Fragment, memo } from "react";
import PropTypes from "prop-types";
import { DateTimePicker } from "orion-components/CBComponents";
import { Grid, Typography } from "@mui/material";
import { Translate, getTranslation } from "orion-components/i18n";

const propTypes = {
	handleChange: PropTypes.func.isRequired,
	schedule: PropTypes.object.isRequired,
	timeFormatPreference: PropTypes.string.isRequired,
	dir: PropTypes.string,
	locale: PropTypes.string
};

const ScheduleFields = ({ handleChange, schedule, timeFormatPreference, dir, locale }) => {
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
				<Translate value="formPanel.schedule.title" />
			</Typography>
			<Grid container style={{ padding: "0px 16px 24px", margin: "-12px", width: "calc(100% + 24px)" }}>
				<Grid item style={{ padding: "12px 12px 0 12px" }} xs={5}>
					<DateTimePicker
						id="eta"
						label={getTranslation("formPanel.schedule.ETA")}
						value={eta}
						handleChange={handleChange("eta", "schedule")}
						format={format}
						dir={dir}
						locale={locale}
					/>
				</Grid>
				<Grid item style={{ padding: "12px 12px 0 12px" }} xs={5}>
					<DateTimePicker
						id="etd"
						label={getTranslation("formPanel.schedule.ETD")}
						value={etd}
						minDate={eta || new Date("1900-01-01")}
						handleChange={handleChange("etd", "schedule")}
						format={format}
						dir={dir}
						locale={locale}
					/>
				</Grid>
				<Grid item style={{ padding: "12px 12px 0 12px" }} xs={5}>
					<DateTimePicker
						id="ata"
						label={getTranslation("formPanel.schedule.ATA")}
						value={ata}
						handleChange={handleChange("ata", "schedule")}
						disabled={!eta || !etd}
						format={format}
						dir={dir}
						locale={locale}
					/>
				</Grid>
				<Grid item style={{ padding: "12px 12px 0 12px" }} xs={5}>
					<DateTimePicker
						id="atd"
						label={getTranslation("formPanel.schedule.ATD")}
						value={atd}
						minDate={ata || new Date("1900-01-01")}
						handleChange={handleChange("atd", "schedule")}
						disabled={!eta || !etd}
						format={format}
						dir={dir}
						locale={locale}
					/>
				</Grid>
			</Grid>
		</Fragment>
	);
};

ScheduleFields.propTypes = propTypes;

export default memo(ScheduleFields);
