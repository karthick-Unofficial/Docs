import React, { memo, useCallback } from "react";
import PropTypes from "prop-types";
import { timeConversion } from "client-app-core";
import {
	IconButton,
	ListItem,
	ListItemIcon,
	ListItemSecondaryAction,
	ListItemText
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { Cancel } from "@material-ui/icons";
import { AccountSearch } from "mdi-material-ui";

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
	canManage: PropTypes.bool,
	classes: PropTypes.object.isRequired,
	search: PropTypes.object.isRequired,
	selected: PropTypes.bool,
	setSavedSearch: PropTypes.func.isRequired,
	removeSavedSearch: PropTypes.func.isRequired,
	timeFormatPreference: PropTypes.string
};

const defaultProps = {
	selected: false,
	timeFormatPreference: "12-hour"
};

const SavedSearch = ({
	canManage,
	classes,
	search,
	selected,
	setSavedSearch,
	removeSavedSearch,
	timeFormatPreference
}) => {
	const { date, id, type, values } = search;
	const handleSelect = useCallback(() => {
		if (!selected) {
			setSavedSearch(id);
		} else {
			setSavedSearch(null);
		}
	}, [selected, setSavedSearch, id]);
	const handleRemove = useCallback(() => {
		removeSavedSearch(id);
	}, [id, removeSavedSearch]);
	let displayName;
	let icon;
	switch (type) {
		case "person":
			displayName = `${values.firstName} ${values.lastName}`;
			icon = <AccountSearch fontSize="large" />;
			break;
		default:
			break;
	}
	const dateTimeFormat = `MMM D, YYYY ${timeFormatPreference === "24-hour" ? "H" : "h"}:mm ${timeFormatPreference === "24-hour" ? "" : "A "}z`;
	return (
		<ListItem
			button
			onClick={handleSelect}
			selected={selected}
			classes={{ root: classes.root, selected: classes.selected }}
		>
			<ListItemIcon>{icon}</ListItemIcon>
			<ListItemText
				primary={displayName}
				secondary={timeConversion.convertToUserTime(date, dateTimeFormat)}
			/>
			{canManage && 
			<ListItemSecondaryAction>
				<IconButton onClick={handleRemove}>
					<Cancel />
				</IconButton>
			</ListItemSecondaryAction>
			}
		</ListItem>
	);
};

SavedSearch.propTypes = propTypes;
SavedSearch.defaultProps = defaultProps;

export default memo(withStyles(styles)(SavedSearch));
