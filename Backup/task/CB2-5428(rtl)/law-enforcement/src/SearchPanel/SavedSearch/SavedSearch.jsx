import React, { memo, useCallback } from "react";
import PropTypes from "prop-types";
import { timeConversion } from "client-app-core";
import {
	IconButton,
	ListItem,
	ListItemIcon,
	ListItemSecondaryAction,
	ListItemText
} from "@mui/material";
import { withStyles } from "@mui/styles"
import { Cancel } from "@mui/icons-material";
import { AccountSearch } from "mdi-material-ui";
import { useDispatch, useSelector } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";
import {
	setSavedSearch,
	removeSavedSearch
} from "./savedSearchActions";

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
	search: PropTypes.object.isRequired
};


const SavedSearch = ({
	classes,
	search
}) => {

	const State = useSelector(state => state);
	const { selected } = useSelector(state => state.searchForm);
	const canManage = State.session.user.profile.applications.find(app => app.appId === "law-enforcement-search-app")
		&& State.session.user.profile.applications.find(app => app.appId === "law-enforcement-search-app").permissions
		&& State.session.user.profile.applications.find(app => app.appId === "law-enforcement-search-app").permissions.includes("manage");
	const timeFormatPreference = useSelector(state => state.appState.global.timeFormat);
	const dir = useSelector(state => getDir(state));
	const dispatch = useDispatch();

	const { date, id, type, values } = search;

	const handleSelect = useCallback(() => {
		if (selected) {
			if (selected === id) {
				dispatch(setSavedSearch(null));
			}
			else {
				dispatch(setSavedSearch(id));
			}
		}
		else {
			dispatch(setSavedSearch(id));
		}
	}, [selected, setSavedSearch, id]);

	const handleRemove = useCallback(() => {
		dispatch(removeSavedSearch(id));
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

	const conditionalStyles = {
		listItem: {
			...(dir == "rtl" && { paddingRight: 30 })
		},
		textAlignRight: {
			...(dir == "rtl" && { textAlign: "right" })
		},
		listItemSecondaryAction: {
			...(dir == "rtl" && { right: "unset", left: 16 })
		}
	};

	return (
		<ListItem
			button
			onClick={handleSelect}
			selected={selected && selected === id ? true : false}
			classes={{ root: classes.root, selected: classes.selected }}
			style={conditionalStyles.listItem}
		>
			<ListItemIcon>{icon}</ListItemIcon>
			<ListItemText
				primary={displayName}
				secondary={timeConversion.convertToUserTime(date, dateTimeFormat)}
				style={conditionalStyles.textAlignRight}
			/>
			{canManage &&
				<ListItemSecondaryAction style={conditionalStyles.listItemSecondaryAction} >
					<IconButton onClick={handleRemove}>
						<Cancel />
					</IconButton>
				</ListItemSecondaryAction>
			}
		</ListItem>
	);
};

SavedSearch.propTypes = propTypes;


export default memo(withStyles(styles)(SavedSearch));
