import React, { memo, useCallback } from "react";
import PropTypes from "prop-types";
import { ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { Videocam } from "@material-ui/icons";
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
	classes: PropTypes.object.isRequired,
	group: PropTypes.object.isRequired,
	selected: PropTypes.bool,
	setSelectedGroup: PropTypes.func.isRequired,
	dir: PropTypes.string
};

const defaultProps = {
	selected: false
};

const CameraGroup = ({ classes, group, selected, setSelectedGroup, dir }) => {
	const { cameras, id, name } = group;
	const handleSelect = useCallback(() => {
		if (!selected) {
			setSelectedGroup({ id, name }, cameras);
		} else {
			setSelectedGroup(null);
		}
	}, [cameras, id, name, selected, setSelectedGroup]);
	const cameraCount = Object.values(cameras).filter(camera => camera).length;
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
				secondary={cameraCount !== 1 ? <Translate value="listPanel.cameraGroup.cameraPlural" count={cameraCount}/> : <Translate value="listPanel.cameraGroup.cameraSingular" count={cameraCount}/>}
				style={dir == "rtl" ? {textAlign: "right"} : {}}
			/>
		</ListItem>
	);
};

CameraGroup.propTypes = propTypes;
CameraGroup.defaultProps = defaultProps;

export default memo(withStyles(styles)(CameraGroup));
