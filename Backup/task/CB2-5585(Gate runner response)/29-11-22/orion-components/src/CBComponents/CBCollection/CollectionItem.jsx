import React from "react";
import { TargetingIcon, getIconByTemplate } from "orion-components/SharedComponents";
import { Alert } from "orion-components/CBComponents/Icons";
import PropTypes from "prop-types";
import { ListItem, ListItemText, ListItemIcon } from "@mui/material";
import { withStyles } from "@mui/styles";

const styles = {
	root: {
		color: "#fff",
		backgroundColor: "#494D53",
		"&:hover": {
			backgroundColor: "#494D53"
		},
		borderRadius: 5,
		paddingLeft: 12,
		paddingRight: 12,
		marginBottom: 8
	}
};

const propTypes = {
	classes: PropTypes.object.isRequired,
	item: PropTypes.object.isRequired,
	primaryText: PropTypes.string.isRequired,
	secondaryText: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
	handleSelect: PropTypes.func.isRequired,
	selected: PropTypes.bool,
	geometry: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
	type: PropTypes.string,
	alert: PropTypes.bool,
	dir: PropTypes.string,
	selectFloor: PropTypes.func
};

const defaultProps = {
	secondaryText: "",
	selected: false,
	geometry: false,
	type: null,
	alert: false,
	selectFloor: () => { }
};

const CollectionItem = ({
	classes,
	item,
	primaryText,
	secondaryText,
	handleSelect,
	selected,
	geometry,
	type,
	alert,
	dir,
	selectFloor
}) => {
	const inlineStyles = {
		textAlign: {
			...(dir === "rtl" && { textAlign: "right" })
		}
	};
	const { id, feedId, entityData } = item;
	const profileIconTemplate = entityData && entityData.properties ? entityData.properties.profileIconTemplate : null;
	return (
		<ListItem
			button
			onClick={() => handleSelect(item)}
			key={id}
			className={classes.root}
			style={selected ? { backgroundColor: "#383D48" } : {}}
		>
			{geometry && (
				<TargetingIcon id={id} feedId={feedId} geometry={geometry} selectFloor={selectFloor} />
			)}
			{type && getIconByTemplate(type, item, "2rem", profileIconTemplate) && <ListItemIcon>{getIconByTemplate(type, item, "2rem", profileIconTemplate)}</ListItemIcon>}
			<ListItemText
				primary={primaryText}
				secondary={secondaryText}
				primaryTypographyProps={{
					noWrap: true,
					variant: "body1",
					component: "p"
				}}
				secondaryTypographyProps={{
					style: { color: "#B5B9BE" },
					noWrap: true,
					variant: "body2"
				}}
				inset={!geometry}
				style={inlineStyles.textAlign}
			/>
			{alert && <Alert fontSize="large" />}
		</ListItem>
	);
};

CollectionItem.propTypes = propTypes;
CollectionItem.defaultProps = defaultProps;

export default withStyles(styles)(CollectionItem);
