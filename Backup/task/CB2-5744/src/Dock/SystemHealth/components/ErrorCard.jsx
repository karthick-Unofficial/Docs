import React from "react";
import { Card, ListItem, ListItemText } from "@mui/material";
import { Alert } from "orion-components/CBComponents/Icons";
import { getTranslation } from "orion-components/i18n";

const ErrorCard = ({ dir }) => {
	const styles = {
		card: {
			borderRadius: "5px",
			marginBottom: 12,
			background: "transparent"
		},
		listItem: {
			backgroundColor: "#494d53",
			...(dir === "rtl" && {
				flexDirection: "row-reverse",
				textAlign: "right"
			})
		}
	};

	return (
		<Card style={styles.card}>
			<ListItem style={styles.listItem}>
				<div style={{ padding: "12px" }}>
					<Alert dir={dir} />
				</div>
				<ListItemText
					style={{ fontSize: "14px" }}
					primary={getTranslation(
						"global.dock.systemHealth.errorCard.errorText"
					)}
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
