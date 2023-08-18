import React, { Component, Fragment, useState } from "react";
import { Dialog } from "orion-components/CBComponents";
import {
	//withWidth,
	List,
	ListItem,
	ListItemText,
	ListItemSecondaryAction,
	Collapse,
	Checkbox
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { withStyles } from "@mui/styles";
import includes from "lodash/includes";
import map from "lodash/map";
import truncate from "lodash/truncate";
import without from "lodash/without";
import size from "lodash/size";
import { getTranslation } from "orion-components/i18n";
import { useDispatch } from "react-redux";

const styles = {
	root: {
		"&:hover": {
			backgroundColor: "transparent"
		},
		color: "#FFF"
	},
	checked: {
		color: "#00bcd4!important"
	}

};

// TODO: Create a Simple List component


const FilterDialog = ({ filters, updateFilters, classes, width, open, activeTab, usedTemplates, dir, closeDialog }) => {

	const dispatch = useDispatch();

	const [expanded, setExpanded] = useState({});
	const [Filters, setFilters] = useState(filters || {});

	const handleSave = () => {
		dispatch(updateFilters(Filters));
		handleClose();
	};

	const handleClose = () => {
		setFilters(filters);
		setExpanded({});
		closeDialog("filterDialog");
	};

	const handleExpand = id => {
		expanded[id]
			? setExpanded({ ...expanded, [id]: false })
			: setExpanded({ ...expanded, [id]: true });
	};

	const handleToggle = (type, id) => {
		// If filter is checked, uncheck
		if (includes(Filters[type], id)) {
			setFilters({ ...Filters, [type]: without(Filters[type], id) });
		}
		/* If category is not empty, check filter and retain category information
		   -- Prevents null conversion error if category is empty              */
		else if (Filters[type]) {
			setFilters({ ...Filters, [type]: [...Filters[type], id] });
		}
		// If category is empty, add check filter
		else {
			setFilters({ ...Filters, [type]: [id] });
		}
	};

	const truncateFunc = (templateName) => {
		return truncate(templateName, 30);
	};

	const dirStyles = {
		listItemText: {
			...(dir === "rtl" && { textAlign: "right" })
		},
		listItem: {
			...(dir === "rtl" && { paddingLeft: 48, paddingRight: 16 })
		},
		listItemSecondaryAction: {
			...(dir === "rtl" && { right: "unset", left: 16 })
		}

	}

	return (
		<Dialog
			open={open}
			title={getTranslation("eventListPanel.filterDialog.filter", activeTab)}
			confirm={{
				label: getTranslation("eventListPanel.filterDialog.save"),
				action: handleSave
			}}
			abort={{ label: getTranslation("eventListPanel.filterDialog.cancel"), action: handleClose }}
			titlePropStyles={{ fontWeight: "400" }}
			dialogContentStyles={{ padding: "8px 24px!important" }}
		>
			<div style={{ width: width === "xs" ? "auto" : 350 }}>
				<List>
					{activeTab === "Events" && (
						<Fragment>
							<ListItem
								className={classes.root}
								button
								onClick={() => handleExpand("time")}
								disableGutters
								disableTouchRipple
							>
								<ListItemText primary={getTranslation("eventListPanel.filterDialog.byStatus")} style={dirStyles.listItemText} />
								{expanded["time"] ? (
									<ExpandLess color="inherit" />
								) : (
									<ExpandMore color="inherit" />
								)}
							</ListItem>
							<Collapse in={expanded["time"]}>
								<List>
									<ListItem style={dirStyles.listItem}>
										<ListItemText
											primary={getTranslation("eventListPanel.filterDialog.upcoming")}
											primaryTypographyProps={{ noWrap: true }}
											secondaryTypographyProps={{ noWrap: true }}
											style={dirStyles.listItemText}
										/>
										<ListItemSecondaryAction style={dirStyles.listItemSecondaryAction} >
											<Checkbox
												classes={{ checked: classes.checked }}
												checked={includes(Filters["status"], "upcoming")} // Layers are stored in state with a unique ID from service and layer ID
												onChange={() => handleToggle("status", "upcoming")}
											/>
										</ListItemSecondaryAction>
									</ListItem>
									<ListItem style={dirStyles.listItem}>
										<ListItemText
											primary={getTranslation("eventListPanel.filterDialog.active")}
											primaryTypographyProps={{ noWrap: true }}
											secondaryTypographyProps={{ noWrap: true }}
											style={dirStyles.listItemText}
										/>
										<ListItemSecondaryAction style={dirStyles.listItemSecondaryAction} >
											<Checkbox
												classes={{ checked: classes.checked }}
												checked={includes(Filters["status"], "active")} // Layers are stored in state with a unique ID from service and layer ID
												onChange={() => handleToggle("status", "active")}
											/>
										</ListItemSecondaryAction>
									</ListItem>
									<ListItem style={dirStyles.listItem}>
										<ListItemText
											primary={getTranslation("eventListPanel.filterDialog.closed")}
											primaryTypographyProps={{ noWrap: true }}
											secondaryTypographyProps={{ noWrap: true }}
											style={dirStyles.listItemText}
										/>
										<ListItemSecondaryAction style={dirStyles.listItemSecondaryAction} >
											<Checkbox
												classes={{ checked: classes.checked }}
												checked={includes(Filters["status"], "closed")} // Layers are stored in state with a unique ID from service and layer ID
												onChange={() => handleToggle("status", "closed")}
											/>
										</ListItemSecondaryAction>
									</ListItem>
								</List>
							</Collapse>
						</Fragment>
					)}
					<ListItem
						className={classes.root}
						button
						onClick={() => handleExpand("template")}
						disableGutters
						disableTouchRipple
					>
						<ListItemText primary={getTranslation("eventListPanel.filterDialog.byTemplate")}
							style={dirStyles.listItemText} />
						{expanded["template"] ? (
							<ExpandLess color="inherit" />
						) : (
							<ExpandMore color="inherit" />
						)}
					</ListItem>

					<Collapse in={expanded["template"]}>
						<List>
							{map(usedTemplates, template => (
								<ListItem key={template.id}
									style={dirStyles.listItem}
								>
									<ListItemText
										primary={size(template.name) > 30 ? truncateFunc(template.name) : template.name}
										primaryTypographyProps={{ noWrap: true }}
										secondaryTypographyProps={{ noWrap: true }}
										style={dirStyles.listItemText}
									/>
									<ListItemSecondaryAction style={dirStyles.listItemSecondaryAction} >
										<Checkbox
											classes={{ checked: classes.checked }}
											checked={includes(Filters["template"], template.id)} // Layers are stored in state with a unique ID from service and layer ID
											onChange={() => handleToggle("template", template.id)}
										/>
									</ListItemSecondaryAction>
								</ListItem>
							))}
						</List>
					</Collapse>
				</List>
			</div>
		</Dialog>
	);
};

//export default withStyles(styles)(withWidth()(FilterDialog));
export default withStyles(styles)(FilterDialog);
