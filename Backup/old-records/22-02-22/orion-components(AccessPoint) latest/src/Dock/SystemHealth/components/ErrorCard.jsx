import React from "react";
import {
	Card,
	ListItem,
	ListItemText
} from "@material-ui/core";
import { Alert } from "orion-components/CBComponents/Icons";
import { getTranslation } from "orion-components/i18n/I18nContainer";

const ErrorCard = ({dir}) => {
	return (
		<Card
			style={{ borderRadius: "5px", marginBottom: 12, background: "transparent" }}
		>
			<ListItem style={dir && dir == "rtl" ? {flexDirection: "row-reverse", textAlign: "right", backgroundColor: "#494d53" } : { backgroundColor: "#494d53" }}>
				<div style={{padding: "12px"}}><Alert dir={dir}/></div>
				<ListItemText
					style={{ fontSize: "14px" }}
					primary={getTranslation("global.dock.systemHealth.errorCard.errorText")}
					primaryTypographyProps={{
						noWrap: true,
						variant: "body1"
					}}
				/>
			</ListItem>
		</Card>
	);
};

export default ErrorCard;