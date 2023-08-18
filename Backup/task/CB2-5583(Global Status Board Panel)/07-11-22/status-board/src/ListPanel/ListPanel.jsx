import React, { memo, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { ContextPanel } from "orion-components/ContextPanel";
import {
	Fab,
	Typography,
	List,
	ListItem,
	ListItemText
} from "@mui/material";
import { withStyles } from "@mui/styles";
import { Add } from "@mui/icons-material";

import CreateStatusCardDialog from "./Dialog/CreateStatusCardDialog";
import { Translate, getTranslation } from "orion-components/i18n";
import { useDispatch, useSelector } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";
import { orgFilterChanged } from "./listPanelActions";


const matUiStyles = {
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
};

const ListPanel = ({ classes }) => {

	const dispatch = useDispatch();

	const session = useSelector(state => state.session);
	const userCanCreate = session.user.profile.applications
		&& session.user.profile.applications.find(app => app.appId === "status-board-app")
		&& session.user.profile.applications.find(app => app.appId === "status-board-app").permissions
		&& session.user.profile.applications.find(app => app.appId === "status-board-app").permissions.includes("manage");
	const orgsById = useSelector(state => state.statusCards.orgsById);
	const WavCamOpen = useSelector(state => state.appState.dock.dockData.WavCam);
	const dir = useSelector(state => getDir(state));

	const [dialogOpen, setDialogOpen] = useState(false);
	const [selectedOrgs, setSelectedOrgs] = useState([]);
	const [organizations, setOrganizations] = useState([]);

	const toggleCreateDialog = () => {
		setDialogOpen(!dialogOpen);
	};

	const selectOrg = (orgId) => {
		let newSelectedOrgs = [];

		if (selectedOrgs.includes(orgId)) {
			newSelectedOrgs = selectedOrgs.filter(org => org !== orgId);
		}
		else {
			newSelectedOrgs = [...selectedOrgs, orgId];
		}

		setSelectedOrgs(newSelectedOrgs);
		dispatch(orgFilterChanged(newSelectedOrgs));
	};

	useEffect(() => {
		if (orgsById) {
			const formattedOrgs = [];
			Object.keys(orgsById).forEach(orgId => {
				formattedOrgs.push({
					name: orgsById[orgId],
					id: orgId
				});
			});

			formattedOrgs.sort((orgA, orgB) => {
				if (orgA.name < orgB.name) {
					return -1;
				}
				if (orgA.name > orgB.name) {
					return 1;
				}
				return 0;
			});

			setOrganizations(formattedOrgs);
		}
	}, [orgsById]);

	const styles = {
		controls: {
			display: "flex",
			align: "center",
			alignItems: "center",
			padding: "1rem",
			backgroundColor: "#242426"
		},
		contents: {
			padding: "0.5rem 1rem",
			height: "calc(100% - 72px)"
		},
		empty: {
			display: "flex",
			justifyContent: "center",
			textAlign: "center",
			alignItems: "center"
		},
		wrapper: {
			height: `calc(100vh - ${WavCamOpen ? "288px" : "48px"})`
		},
		typography: {
			...(dir === "rtl" && { marginRight: "1rem" }),
			...(dir === "ltr" && { marginLeft: "1rem" })
		}
	};

	return (
		<ContextPanel dir={dir}>
			<div style={styles.wrapper}>
				{<div style={styles.controls}>
					<Fab
						onClick={toggleCreateDialog}
						color="primary"
						disabled={!userCanCreate}
						size="small"
					>
						<Add />
					</Fab>
					<Typography variant="body1" style={styles.typography}>
						<Translate value="listPanel.main.newCard" />
					</Typography>
				</div>}
				<div style={styles.contents}>
					<div style={{ overflow: "scroll", height: "calc(100% - 60px)" }}>
						<List>
							{organizations.map(org => {
								return (
									<ListItem
										button
										key={org.id}
										onClick={() => selectOrg(org.id)}
										selected={selectedOrgs.includes(org.id)}
										classes={{ root: classes.root, selected: classes.selected }}
									>
										<ListItemText
											primary={org.name}
											secondary={getTranslation("listPanel.main.organization")}
										/>
									</ListItem>
								);
							})}
						</List>
					</div>
				</div>
			</div>
			<CreateStatusCardDialog
				open={dialogOpen}
				closeDialog={toggleCreateDialog}
				dir={dir}
			/>
		</ContextPanel>
	);
};

ListPanel.propTypes = propTypes;

export default memo(withStyles(matUiStyles)(ListPanel));
