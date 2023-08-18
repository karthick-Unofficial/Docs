import React, { memo, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { getIcon } from "orion-components/SharedComponents";
import {
	IconButton,
	ListItem,
	ListItemIcon,
	ListItemSecondaryAction,
	ListItemText
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { Cancel } from "@material-ui/icons";
import { Translate } from "orion-components/i18n/I18nContainer";

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
	cameraCount: PropTypes.number,
	classes: PropTypes.object.isRequired,
	item: PropTypes.object.isRequired,
	removeFromPinnedItems: PropTypes.func.isRequired,
	selected: PropTypes.bool,
	setSelectedPinnedItem: PropTypes.func.isRequired,
	subscribeCameraContexts: PropTypes.func.isRequired,
	dir: PropTypes.string
};

const defaultProps = {
	cameraCount: 0,
	selected: false
};

const PinnedItem = ({
	cameraCount,
	classes,
	item,
	removeFromPinnedItems,
	selected,
	setSelectedPinnedItem,
	subscribeCameraContexts,
	dir
}) => {
	const { entityType, id, name, type } = item;
	useEffect(() => {
		subscribeCameraContexts(id, entityType);
	}, [entityType, id, subscribeCameraContexts]);

	const handleSelect = useCallback(() => {
		if (!selected) {
			setSelectedPinnedItem(item);
		} else {
			setSelectedPinnedItem(null);
		}
	}, [item, selected, setSelectedPinnedItem]);

	return (
		<ListItem
			disabled={!cameraCount}
			button
			onClick={handleSelect}
			selected={selected}
			classes={{ root: classes.root, selected: classes.selected }}
		>
			<ListItemIcon>{getIcon(type)}</ListItemIcon>
			<ListItemText
				primary={name}
				secondary={cameraCount === 1 ? <Translate value="listPanel.cameraGroup.cameraSingular" type={type} count={cameraCount}/> : <Translate value="listPanel.cameraGroup.cameraPlural" type={type} count={cameraCount}/>}
				style={dir == "rtl" ? {textAlign: "right"} : {}}
			/>
			<ListItemSecondaryAction>
				<IconButton onClick={() => removeFromPinnedItems(id)}>
					<Cancel />
				</IconButton>
			</ListItemSecondaryAction>
		</ListItem>
	);
};

PinnedItem.propTypes = propTypes;
PinnedItem.defaultProps = defaultProps;

export default memo(withStyles(styles)(PinnedItem));
