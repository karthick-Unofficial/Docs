import React, { Fragment } from "react";
import { Checkbox, FormControlLabel, Typography } from "@mui/material";
import moment from "moment";
import { timeConversion } from "client-app-core";
import { Translate, getTranslation } from "orion-components/i18n";

const DateTimeColumn = ({ includeTime, handleToggleTimeOption, timeFormatPreference = null, locale }) => {
	const dateTimeFormat = !includeTime ? "DD/MM/YY" :
						   timeFormatPreference ? `full_${timeFormatPreference}` : "full_12-hour";
	return (
		<Fragment>
			<FormControlLabel
				control={
					<Checkbox
						color="primary"
						checked={includeTime}
						onChange={handleToggleTimeOption}
					/>
				}
				label={getTranslation("shared.dateTimeColumn.fieldLabel.includeTime")}
			/>
			<Typography
				style={{ color: "#828283" }}
				variant="subtitle1"
			>
				{<Translate value="shared.dateTimeColumn.fieldLabel.example" />}{timeConversion.convertToUserTime(moment().locale(locale), dateTimeFormat, locale)}
			</Typography>
		</Fragment>
	);
};

export default DateTimeColumn;
