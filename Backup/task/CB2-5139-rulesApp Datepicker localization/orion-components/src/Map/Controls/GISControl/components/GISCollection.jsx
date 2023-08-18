import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import {
	List,
	ListItem,
	ListItemText,
	ListItemSecondaryAction,
	Collapse,
	Switch,
	Button,
	IconButton
} from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import { withStyles } from "@material-ui/core/styles";
import GISManagement from "./GISManagement";

import _ from "lodash";
import { Translate, getTranslation } from "orion-components/i18n/I18nContainer";

const styles = {
	root: {
		color: "#FFF",
		"&:hover": {
			backgroundColor: "transparent"
		}
	},
	text: {
		"&:hover": {
			backgroundColor: "transparent"
		},
		textTransform: "none",
		padding: 0,
		justifyContent: "flex-start"
	}
};

const propTypes = {
	service: PropTypes.object.isRequired,
	handleToggle: PropTypes.func.isRequired,
	serviceState: PropTypes.object,
	updateGISService: PropTypes.func.isRequired,
	deleteGISService: PropTypes.func.isRequired,
	dir: PropTypes.string
};

const defaultProps = {
	serviceState: {},
	dir: "ltr"
};

class GISCollection extends Component {
	constructor(props) {
		super(props);
		this.state = { expanded: {}, open: false };
	}

	renderListItem = layer => {
		const { classes, service, handleToggle, serviceState, dir } = this.props;
		const { expanded } = this.state;
		const { layers } = service;
		const { subLayerIds, id, name } = layer;
		let listItem;
		const isSubLayer = _.includes(
			_.flattenDeep(_.map(layers, layer => layer.subLayerIds)),
			id
		);
		if (subLayerIds) {
			listItem = (
				<Fragment key={id}>
					<ListItem disableGutters>
						<ListItemText
							style={dir == "rtl" ? { paddingRight: 12, textAlign: "right" } : { paddingLeft: 12 }}
							primary={name}
							secondary={_.size(subLayerIds) === 1 ? getTranslation("global.map.controls.gisControl.gisCollection.layer", _.size(subLayerIds)) : getTranslation("global.map.controls.gisControl.gisCollection.layers", _.size(subLayerIds))}
							primaryTypographyProps={{ noWrap: true }}
							secondaryTypographyProps={{ noWrap: true }}
						/>
						<ListItemSecondaryAction style={dir == "rtl" ? {right: "unset", left: 16}: {}}>
							<IconButton
								className={classes.root}
								disableRipple
								onClick={() => this.handleExpand(id)}
							>
								{expanded[id] ? <ExpandLess /> : <ExpandMore />}
							</IconButton>
						</ListItemSecondaryAction>
					</ListItem>
					<Collapse in={expanded[id]}>
						<List>
							{_.map(
								_.filter(layers, layer => _.includes(subLayerIds, layer.id)),
								layer => (
									<ListItem key={layer.id}>
										<ListItemText
											primary={layer.name}
											primaryTypographyProps={{ noWrap: true }}
											secondaryTypographyProps={{ noWrap: true }}
											style={dir == "rtl" ? {textAlign: "right"}: {}}
										/>
										<ListItemSecondaryAction style={dir == "rtl" ? {right: "unset", left: 16}: {}}>
											<Switch
												color="primary"
												checked={serviceState[`${service.id}-${layer.id}`]} // Layers are stored in state with a unique ID from service and layer ID
												onChange={() => handleToggle(service.id, layer.id)}
											/>
										</ListItemSecondaryAction>
									</ListItem>
								)
							)}
						</List>
					</Collapse>
				</Fragment>
			);
		} else if (!isSubLayer) {
			listItem = (
				<ListItem key={id} disableGutters>
					<ListItemText
						style={dir == "rtl" ? { paddingRight: 12, textAlign: "right" } : { paddingLeft: 12 }}
						primary={name}
						primaryTypographyProps={{ noWrap: true }}
						secondaryTypographyProps={{ noWrap: true }}
					/>
					<ListItemSecondaryAction style={dir == "rtl" ? {right: "unset", left: 16}: {}}>
						<Switch
							color="primary"
							checked={serviceState[`${service.id}-${id}`]}
							onChange={() => handleToggle(service.id, id)}
						/>
					</ListItemSecondaryAction>
				</ListItem>
			);
		}

		return listItem;
	};

	handleExpand = id => {
		const { expanded } = this.state;
		expanded[id]
			? this.setState({ expanded: { ...expanded, [id]: false } })
			: this.setState({ expanded: { ...expanded, [id]: true } });
	};

	handleOpen = () => {
		this.setState({ open: true });
	};

	handleClose = () => {
		this.setState({ open: false });
	};

	render() {
		const { classes, service, updateGISService, deleteGISService, dir } = this.props;
		const { expanded, open } = this.state;
		const { layers, properties, id, authentication } = service;
		return (
			<Fragment>
				<ListItem disableGutters>
					<ListItemText
						primary={properties.name}
						secondary={
							<Button
								onClick={this.handleOpen}
								size="small"
								variant="text"
								color="primary"
								className={classes.text}
								disableRipple
							>
								<Translate value="global.map.controls.gisControl.gisCollection.manage"/>
							</Button>
						}
						primaryTypographyProps={{ noWrap: true }}
						secondaryTypographyProps={{ noWrap: true }}
						style={dir == "rtl" ? {textAlign: "right"}: {}}
					/>
					<ListItemSecondaryAction style={dir == "rtl" ? {right: "unset", left: 16}: {}}>
						<IconButton
							className={classes.root}
							disableRipple
							onClick={() => this.handleExpand(id)}
						>
							{expanded[id] ? <ExpandLess /> : <ExpandMore />}
						</IconButton>
					</ListItemSecondaryAction>
				</ListItem>
				<Collapse in={expanded[id]}>
					<List>{_.map(layers, layer => this.renderListItem(layer))}</List>
				</Collapse>
				<GISManagement
					open={open}
					handleClose={this.handleClose}
					serviceId={id}
					properties={properties}
					authentication={authentication}
					name={properties.name}
					updateGISService={updateGISService}
					deleteGISService={deleteGISService}
					dir={dir}
				/>
			</Fragment>
		);
	}
}

GISCollection.propTypes = propTypes;
GISCollection.defaultProps = defaultProps;

export default withStyles(styles)(GISCollection);
