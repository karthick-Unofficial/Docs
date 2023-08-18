import React, { useState } from "react";

// Material UI
import { ListItem, ListItemButton, ListItemIcon, IconButton, ListItemText, Switch } from "@mui/material";
import { Reorder } from "@mui/icons-material";
import { getDir } from "orion-components/i18n/Config/selector";
import { useSelector } from "react-redux";
import isEqual from "lodash/isEqual";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
	thumbOff: {
		backgroundColor: "#ffffff"
	},
	trackOff: {
		backgroundColor: "#828283",
		opacity: 1
	},
	thumbSwitched: {
		backgroundColor: "#29B6F6"
	},
	trackSwitched: {
		backgroundColor: "#bee1f1!important",
		opacity: "1!important"
	}
});

const WidgetCard = ({ widget, enable, disable, isExpanded }) => {
	const classes = useStyles();
	const [widgetState, setWidgetState] = useState(widget);
	const dir = useSelector((state) => getDir(state), isEqual);

	const toggleSwitch = () => {
		const id = widget.id;
		if (widgetState.enabled) {
			setWidgetState({ ...widgetState, enabled: false });
			disable(id);
		} else {
			setWidgetState({ ...widgetState, enabled: true });
			enable(id);
		}
	};

	const styles = {
		listItemStyles: {
			backgroundColor: widgetState.enabled ? "#2C2D2F" : "#1F1F21",
			width: "100%",
			zIndex: "999999",
			borderRadius: 5,
			margin: "0.25rem 0"
		},
		listIconEnd: {
			padding: "8px 0",
			...(dir === "ltr" && { marginLeft: "auto" }),
			...(dir === "rtl" && { marginRight: "auto" })
		},
		listItemButton: {
			...(dir === "ltr" && { padding: "8px 16px 8px 10px" }),
			...(dir === "rtl" && { padding: "8px 10px 8px 16px" })
		},
		listItemText: {
			color: "#fff",
			padding: "0 20px",
			...(dir === "rtl" && { textAlign: "right" }),
			opacity: widgetState.enabled ? 1 : 0.69
		}
	};

	const getSwitch = () => {
		if (isExpanded) return null;
		else {
			return <IconButton style={styles.listIconEnd}>
				<Switch
					checked={widgetState.enabled}
					onChange={() => toggleSwitch()}
					classes={{
						thumb: widgetState.enabled ? classes.thumbSwitched : classes.thumbOff,
						track: widgetState.enabled ? classes.trackSwitched : classes.trackOff
					}}
				/>
			</IconButton>
		}
	};

	return (
		<ListItem disablePadding style={styles.listItemStyles}>
			<ListItemButton style={styles.listItemButton}>
				{getSwitch()}
				<ListItemText primary={widget.name} sx={styles.listItemText} />
				{widgetState.enabled && <ListItemIcon style={{ minWidth: "unset" }}>
					<Reorder sx={{ color: "#FFF" }} />
				</ListItemIcon>}
			</ListItemButton>
		</ListItem>
	);
};

export default WidgetCard;
