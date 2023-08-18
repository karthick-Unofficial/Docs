import React from "react";
import { Timestamp } from "orion-components/CBComponents";
import { Typography } from "@mui/material";
import { Translate } from "orion-components/i18n";

const Activity = ({ activity, forReplay, timeFormatPreference, dir, locale }) => {
	const styles = {
		wrapper: {
			padding: 16,
			borderBottom: "1px solid rgba(255,255,255, 0.3)",
			color: "#fff",
			...(dir === "rtl" && { textAlign: "right" })
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
		<div style={styles.wrapper}>
			<Typography style={{ wordWrap: "break-word", fontSize: 14 }} variant="body1">
				{primaryText}
			</Typography>
			<Typography noWrap variant="body2" style={{ color: "rgb(181, 185, 190)", fontSize: 12 }}>
				{type === "comment" ? (
					<Translate value="global.profiles.widgets.activities.activity.posted" count={actor.name} />
				) : (
					""
				)}
				<Timestamp
					key={id}
					timestamp={published}
					format={`full_${timeFormatPreference}`}
					useTimeAgo={!forReplay}
					locale={locale}
				/>
			</Typography>
		</div>
	);
};

export default Activity;
