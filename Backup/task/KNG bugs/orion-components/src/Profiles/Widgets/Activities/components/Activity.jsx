import React from "react";
import { Timestamp } from "orion-components/CBComponents";
import { Typography } from "@material-ui/core";
import { Translate } from "orion-components/i18n/I18nContainer";

const Activity = ({ activity, forReplay, timeFormatPreference, dir, locale }) => {
	const styles = {
		wrapper: {
			padding: 16,
			borderBottom: "1px solid rgba(255,255,255, 0.3)"
		},
		wrapperRTL: {
			padding: 16,
			borderBottom: "1px solid rgba(255,255,255, 0.3)",
			textAlign: "right"
		}
	};
	const { id, type, published, object, actor, summary } = activity;
	let primaryText;
	switch (type) {
		case "comment":
			primaryText = `"${object.message}"`;
			break;
		default:
			primaryText = summary;
			break;
	}

	return (
		<div style={dir == "rtl" ? styles.wrapperRTL : styles.wrapper}>
			<Typography style={{wordWrap: "break-word"}} variant="body1">{primaryText}</Typography>
			<Typography noWrap variant="body2">
				{type === "comment" ? <Translate value="global.profiles.widgets.activities.activity.posted" count={actor.name}/> : ""}
				<Timestamp key={id} timestamp={published} format={`full_${timeFormatPreference}`} useTimeAgo={!forReplay} locale={locale}/>
			</Typography>
		</div>
	);
};

export default Activity;