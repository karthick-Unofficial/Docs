import React, { memo, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { getIcon } from "orion-components/SharedComponents";
import { IconButton, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText } from "@mui/material";
import { withStyles } from "@mui/styles";
import { Cancel } from "@mui/icons-material";
import { getTranslation } from "orion-components/i18n";
import { useDispatch, useSelector } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";

import { setSelectedPinnedItem, removeFromPinnedItems, subscribeCameraContexts } from "./pinnedItemActions";

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
	item: PropTypes.object.isRequired,
	id: PropTypes.string
};

const PinnedItem = (props) => {
	const { classes, item } = props;
	const { selectedPinnedItem } = useSelector((state) => state.appState.persisted);
	const cameraCount = useSelector((state) =>
		state.camerasByContext[props.id] ? state.camerasByContext[props.id].length : 0
	);
	const selected = Boolean(selectedPinnedItem && selectedPinnedItem.id === props.id);
	const dir = useSelector((state) => getDir(state));
	const dispatch = useDispatch();

	const { entityType, id, name, type } = item;
	useEffect(() => {
		dispatch(subscribeCameraContexts(id, entityType));
	}, [dispatch, entityType, id]);

	const handleSelect = useCallback(() => {
		if (!selected) {
			dispatch(setSelectedPinnedItem(item));
		} else {
			dispatch(setSelectedPinnedItem(null));
		}
	}, [dispatch, item, selected]);

	const conditionalStyling = {
		listItem: {
			...(dir === "rtl" && { paddingLeft: 48, paddingRight: 16 })
		},
		textAlignRight: {
			...(dir === "rtl" && { textAlign: "right" })
		},
		listItemSecondaryAction: {
			...(dir === "rtl" && { right: "unset", left: 16 })
		}
	};

	return (
		<ListItem
			disabled={!cameraCount}
			button
			onClick={handleSelect}
			selected={selected}
			classes={{ root: classes.root, selected: classes.selected }}
			style={conditionalStyling.listItem}
		>
			<ListItemIcon>{getIcon(type)}</ListItemIcon>
			<ListItemText
				primary={name}
				secondary={
					cameraCount === 1
						? getTranslation("listPanel.pinnedItemJSX.cameraSingular", "", type, cameraCount)
						: getTranslation("listPanel.pinnedItemJSX.cameraPlural", "", type, cameraCount)
				}
				style={conditionalStyling.textAlignRight}
			/>
			<ListItemSecondaryAction style={styles.listItemSecondaryAction}>
				<IconButton onClick={() => dispatch(removeFromPinnedItems(id))}>
					<Cancel />
				</IconButton>
			</ListItemSecondaryAction>
		</ListItem>
	);
};

PinnedItem.propTypes = propTypes;

export default memo(withStyles(styles)(PinnedItem));
