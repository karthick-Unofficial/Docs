import React, { memo, useCallback } from "react";
import PropTypes from "prop-types";
import { ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { withStyles } from "@mui/styles";
import { Videocam } from "@mui/icons-material"; // cSpell:ignore videocam
import { getTranslation } from "orion-components/i18n";
import { useDispatch, useSelector } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";

import { setSelectedGroup } from "./cameraGroupActions";

const styles = {
	root: {
		backgroundColor: "#494D53",
		borderRadius: 5,
		marginBottom: 12,
		"&$selected": {
			backgroundColor: "#1688bd",
			"&:focus": {
				backgroundColor: "#1688bd"
			},
			"&:hover": {
				backgroundColor: "#1688bd"
			}
		}
	},
	selected: {}
};

const propTypes = {
	classes: PropTypes.object.isRequired,
	group: PropTypes.object.isRequired,
	id: PropTypes.string
};

const CameraGroup = (props) => {
	const { classes, group } = props;
	const { selectedGroup } = useSelector((state) => state.appState.persisted);
	const dir = useSelector((state) => getDir(state));
	const selected = Boolean(selectedGroup && selectedGroup.id === props.id);
	const dispatch = useDispatch();

	const { cameras, id, name } = group;
	const handleSelect = useCallback(() => {
		if (!selected) {
			dispatch(setSelectedGroup({ id, name }, cameras));
		} else {
			dispatch(setSelectedGroup(null));
		}
	}, [cameras, dispatch, id, name, selected]);
	const cameraCount = Object.values(cameras).filter((camera) => camera).length;

	const conditionalStyling = {
		textAlignRight: {
			...(dir == "rtl" && { textAlign: "right" })
		}
	};

	return (
		<ListItem
			button
			onClick={handleSelect}
			selected={selected}
			classes={{ root: classes.root, selected: classes.selected }}
		>
			<ListItemIcon>
				<Videocam fontSize="large" />
			</ListItemIcon>
			<ListItemText
				primary={name}
				secondary={
					cameraCount !== 1
						? getTranslation("listPanel.cameraGroup.cameraPlural", cameraCount)
						: getTranslation("listPanel.cameraGroup.cameraSingular", cameraCount)
				}
				style={conditionalStyling.textAlignRight}
			/>
		</ListItem>
	);
};

CameraGroup.propTypes = propTypes;

export default memo(withStyles(styles)(CameraGroup));
