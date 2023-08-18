import React, { useState } from "react";

// Material UI
import { ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton } from "@mui/material";
import { Reorder, AddCircle, RemoveCircle } from "@mui/icons-material";
import { getDir } from "orion-components/i18n/Config/selector";
import { useSelector } from "react-redux";
import isEqual from "lodash/isEqual";

const WidgetCard = ({ widget, enable, disable, isExpanded }) => {
	const [widgetState, setWidgetState] = useState(widget);
	const dir = useSelector((state) => getDir(state), isEqual);

	const handleEnableClick = (id) => {
		setWidgetState({ ...widgetState, enabled: true });
		enable(id);
	};

	const handleDisableClick = (id) => {
		setWidgetState({ ...widgetState, enabled: false });
		disable(id);
	};
	const styles = {
		listItemStyles: {
			backgroundColor: "#1F1F21",
			margin: ".25rem .5rem",
			width: "95.5%",
			zIndex: "999999"
		},
		listIconEnd: {
			...(dir === "ltr" && { marginLeft: "auto" }),
			...(dir === "rtl" && { marginRight: "auto" })
		}
	};

	const getRightIconButton = () => {
		if (isExpanded) return null;
		else {
			return widgetState.enabled ? (
				<IconButton style={styles.listIconEnd} onClick={() => handleDisableClick(widget.id)}>
					<RemoveCircle sx={{ color: "#E85858" }} />
				</IconButton>
			) : (
				<IconButton style={styles.listIconEnd} onClick={() => handleEnableClick(widget.id)}>
					<AddCircle sx={{ color: "#A4B966" }} />
				</IconButton>
			);
		}
	};

	return (
		<ListItem disablePadding style={styles.listItemStyles}>
			<ListItemButton>
				<ListItemIcon>
					<Reorder sx={{ color: "#FFF" }} />
				</ListItemIcon>
				<ListItemText primary={widget.name} sx={{ color: "#fff" }} />
				<ListItemIcon>{getRightIconButton()}</ListItemIcon>
			</ListItemButton>
		</ListItem>
	);
};

export default WidgetCard;
