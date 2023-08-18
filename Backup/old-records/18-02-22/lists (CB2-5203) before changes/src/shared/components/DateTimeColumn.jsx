import React, { Fragment } from "react";
import { Checkbox, FormControlLabel, Typography } from "@material-ui/core";
import moment from "moment";
import { timeConversion } from "client-app-core";
import { Translate } from "orion-components/i18n/I18nContainer";

const DateTimeColumn = ({ includeTime, handleToggleTimeOption, timeFormatPreference = null }) => {
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
				label={<Translate value="shared.dateTimeColumn.fieldLabel.includeTime"/>}
			/>
			<Typography
				style={{ color: "#828283" }}
				variant="subtitle1"
			>
				{<Translate value="shared.dateTimeColumn.fieldLabel.example"/>}{timeConversion.convertToUserTime(moment(), dateTimeFormat)}
			</Typography>
		</Fragment>
	);
};

export default DateTimeColumn;
