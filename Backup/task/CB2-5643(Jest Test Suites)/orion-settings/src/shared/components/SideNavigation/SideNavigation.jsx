import React, { useState, useEffect, memo } from "react";

// router
import { Link as RouterLink } from "react-router-dom";
import { routes as r } from "../../../routes";

// material-ui
import { List, ListItem, ListItemIcon } from "@mui/material";
import { AccountMultiple, CardAccountDetailsOutline, CloudCheck } from "mdi-material-ui";

//i18n Translator
import { Translate } from "orion-components/i18n";
import { useSelector } from "react-redux";

const styles = {
	listItem: {
		display: "flex",
		width: 255,
		height: 45,
		marginLeft: 12,
		borderRadius: 4,
		position: "relative",
		color: "white"
	},
	iconButton: {
		color: "white",
		minWidth: 45
	}
};
const SideNavigation = ({
	location
}) => {
	const isEcoAdmin = useSelector(state => state.session.user.profile.ecoAdmin);
	const isAdmin = useSelector(state => state.session.user.profile.admin);

	const [selected, setSelected] = useState(0);
	useEffect(() => {
		if (location) {
			setSelected(location);
		}
	}, [location]);
	return (
		<div style={{
			position: "fixed"
		}}>
			<List componetn="nav" style={{
				position: "relative"
			}}>
				<ListItem
					button
					component={RouterLink}
					to={r.MY_ACCOUNT}
					style={{ ...styles.listItem, ...(selected === 1 ? { backgroundColor: "#3eb8f1", fontWeight: "bold" } : {}) }}
					selected={selected === 1}
				>
					<ListItemIcon style={styles.iconButton}>
						<CardAccountDetailsOutline style={{ height: 24, width: 24 }} />
					</ListItemIcon>
					<p className="b1-white" style={selected === 1 ? { fontWeight: "bold" } : {}}><Translate value="sideBar.option1.variant1" /></p>
				</ListItem>
				{isAdmin && (
					<ListItem
						button
						component={RouterLink}
						to={r.MANAGE_ORGANIZATION}
						style={{ ...styles.listItem, ...(selected === 2 ? { backgroundColor: "#3eb8f1", fontWeight: "bold" } : {}) }}
						selected={selected === 2}
					>
						<ListItemIcon style={styles.iconButton}>
							<AccountMultiple style={{ height: 24, width: 24 }} />
						</ListItemIcon>
						<p className="b1-white" style={selected === 2 ? { fontWeight: "bold" } : {}}><Translate value="sideBar.option2" /></p>
					</ListItem>
				)}
				{isEcoAdmin && (
					<ListItem
						button
						component={RouterLink}
						to={r.MANAGE_ECOSYSTEM}
						style={{ ...styles.listItem, ...(selected === 3 ? { backgroundColor: "#3eb8f1", fontWeight: "bold" } : {}) }}
						selected={selected === 3}
					>
						<ListItemIcon style={styles.iconButton}>
							<CloudCheck style={{ height: 24, width: 24 }} />
						</ListItemIcon>
						<p className="b1-white" style={selected === 3 ? { fontWeight: "bold" } : {}}><Translate value="sideBar.option3" /></p>
					</ListItem>
				)}
			</List>
		</div>
	);
};

export default memo(SideNavigation);