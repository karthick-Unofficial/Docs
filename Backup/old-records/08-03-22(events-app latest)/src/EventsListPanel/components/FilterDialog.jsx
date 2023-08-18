import React, { Component, Fragment } from "react";
import { Dialog } from "orion-components/CBComponents";
import {
	withWidth,
	List,
	ListItem,
	ListItemText,
	ListItemSecondaryAction,
	Collapse,
	Checkbox
} from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import { withStyles } from "@material-ui/core/styles";
import _ from "lodash";
import { Translate } from "orion-components/i18n/I18nContainer";

const styles = {
	root: {
		"&:hover": {
			backgroundColor: "transparent"
		},
		color: "#FFF"
	}
};

// TODO: Create a Simple List component
class FilterDialog extends Component {
	constructor(props) {
		super(props);
		const { filters } = this.props;
		this.state = {
			expanded: {},
			filters: filters || {}
		};
	}

	handleSave = () => {
		const { updateFilters } = this.props;
		const { filters } = this.state;
		updateFilters(filters);
		this.handleClose();
	};

	handleClose = () => {
		const { closeDialog, filters } = this.props;

		this.setState({filters: filters, expanded: {}}, () => {
			closeDialog("filterDialog");
		});
	};

	handleExpand = id => {
		const { expanded } = this.state;
		expanded[id]
			? this.setState({ expanded: { ...expanded, [id]: false } })
			: this.setState({ expanded: { ...expanded, [id]: true } });
	};

	handleToggle = (type, id) => {
		const { filters } = this.state;

		// If filter is checked, uncheck
		if (_.includes(filters[type], id)) {
			this.setState({
				filters: { ...filters, [type]: _.without(filters[type], id) }
			});
		}
		/* If category is not empty, check filter and retain category information
		   -- Prevents null conversion error if category is empty              */
		else if (filters[type]) {
			this.setState({
				filters: { ...filters, [type]: [...filters[type], id] }
			});
		}
		// If category is empty, add check filter
		else {
			this.setState({
				filters: {...filters, [type]: [id]}
			});
		}
	};

	render() {
		const { classes, width, open, activeTab, usedTemplates, dir } = this.props;
		const { expanded, filters } = this.state;


		return (
			<Dialog
				open={open}
				title={<Translate value="eventListPanel.filterDialog.filter" count={activeTab}/>}
				confirm={{
					label: <Translate value="eventListPanel.filterDialog.save"/>,
					action: this.handleSave
				}}
				abort={{ label:  <Translate value="eventListPanel.filterDialog.cancel"/>, action: this.handleClose }}
			>
				<div style={{ width: width === "xs" ? "auto" : 350 }}>
					<List>
						{activeTab === "Events" && (
							<Fragment>
								<ListItem
									className={classes.root}
									button
									onClick={() => this.handleExpand("time")}
									disableGutters
									disableTouchRipple
								>
									<ListItemText primary={<Translate value="eventListPanel.filterDialog.byStatus"/>} style={dir == "rtl" ? {textAlign: "right"} : {}} />
									{expanded["time"] ? (
										<ExpandLess color="inherit" />
									) : (
										<ExpandMore color="inherit" />
									)}
								</ListItem>
								<Collapse in={expanded["time"]}>
									<List>
										<ListItem style={dir == "rtl" ? {paddingLeft: 48, paddingRight: 16} : {}}>
											<ListItemText
												primary={<Translate value="eventListPanel.filterDialog.upcoming"/>}
												primaryTypographyProps={{ noWrap: true }}
												secondaryTypographyProps={{ noWrap: true }}
												style={dir == "rtl" ? {textAlign: "right"} : {}} 
											/>
											<ListItemSecondaryAction style={dir == "rtl" ? {right: "unset", left: 16} : {}} >
												<Checkbox
													color="primary"
													checked={_.includes(filters["status"], "upcoming")} // Layers are stored in state with a unique ID from service and layer ID
													onChange={() => this.handleToggle("status", "upcoming")}
												/>
											</ListItemSecondaryAction>
										</ListItem>
										<ListItem style={dir == "rtl" ? {paddingLeft: 48, paddingRight: 16} : {}}>
											<ListItemText
												primary={<Translate value="eventListPanel.filterDialog.active"/>}
												primaryTypographyProps={{ noWrap: true }}
												secondaryTypographyProps={{ noWrap: true }}
												style={dir == "rtl" ? {textAlign: "right"} : {}} 
											/>
											<ListItemSecondaryAction style={dir == "rtl" ? {right: "unset", left: 16} : {}} >
												<Checkbox
													color="primary"
													checked={_.includes(filters["status"], "active")} // Layers are stored in state with a unique ID from service and layer ID
													onChange={() => this.handleToggle("status", "active")}
												/>
											</ListItemSecondaryAction>
										</ListItem>
										<ListItem style={dir == "rtl" ? {paddingLeft: 48, paddingRight: 16} : {}}>
											<ListItemText
												primary={<Translate value="eventListPanel.filterDialog.closed"/>}
												primaryTypographyProps={{ noWrap: true }}
												secondaryTypographyProps={{ noWrap: true }}
												style={dir == "rtl" ? {textAlign: "right"} : {}} 
											/>
											<ListItemSecondaryAction style={dir == "rtl" ? {right: "unset", left: 16} : {}} >
												<Checkbox
													color="primary"
													checked={_.includes(filters["status"], "closed")} // Layers are stored in state with a unique ID from service and layer ID
													onChange={() => this.handleToggle("status", "closed")}
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
							onClick={() => this.handleExpand("template")}
							disableGutters
							disableTouchRipple
						>
							<ListItemText primary={<Translate value="eventListPanel.filterDialog.byTemplate"/>} style={dir == "rtl" ? {textAlign: "right"} : {}} />
							{expanded["template"] ? (
								<ExpandLess color="inherit" />
							) : (
								<ExpandMore color="inherit" />
							)}
						</ListItem>
						
						<Collapse in={expanded["template"]}>
							<List>
								{_.map(usedTemplates, template => (
									<ListItem key={template.id}>
										<ListItemText
											primary={template.name}
											primaryTypographyProps={{ noWrap: true }}
											secondaryTypographyProps={{ noWrap: true }}
											style={dir == "rtl" ? {textAlign: "right"} : {}} 
										/>
										<ListItemSecondaryAction style={dir == "rtl" ? {right: "unset", left: 16} : {}} >
											<Checkbox
												color="primary"
												checked={_.includes(filters["template"], template.id)} // Layers are stored in state with a unique ID from service and layer ID
												onChange={() => this.handleToggle("template", template.id)}
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
	}
}

export default withStyles(styles)(withWidth()(FilterDialog));
