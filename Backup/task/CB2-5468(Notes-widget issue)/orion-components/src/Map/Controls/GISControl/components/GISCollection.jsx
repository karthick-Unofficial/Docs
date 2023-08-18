import React, { Fragment, useState } from "react";
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
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { withStyles } from "@mui/styles";
import GISManagement from "./GISManagement";

import _ from "lodash";
import { Translate, getTranslation } from "orion-components/i18n";

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
	},
	thumbOff: {
		backgroundColor: "#bdbdbd"
	},
	trackOff: {
		backgroundColor: "#fff",
		opacity: "0.3"
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

const GISCollection = ({
	classes,
	service,
	handleToggle,
	serviceState,
	updateGISService,
	deleteGISService,
	dir
}) => {
	const [expanded, setExpanded] = useState({});
	const [open, setOpen] = useState(false);

	const renderListItem = layer => {
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
						<ListItemSecondaryAction style={dir == "rtl" ? { right: "unset", left: 16 } : {}}>
							<IconButton
								className={classes.root}
								disableRipple
								onClick={() => handleExpand(id)}
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
											style={dir == "rtl" ? { textAlign: "right" } : {}}
										/>
										<ListItemSecondaryAction style={dir == "rtl" ? { right: "unset", left: 16 } : {}}>
											<Switch
												color="primary"
												checked={serviceState[`${service.id}-${layer.id}`]} // Layers are stored in state with a unique ID from service and layer ID
												onChange={() => handleToggle(service.id, layer.id)}
												classes={{
													thumb: !serviceState[`${service.id}-${layer.id}`] && classes.thumbOff,
													track: !serviceState[`${service.id}-${layer.id}`] && classes.trackOff
												}}
							
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
					<ListItemSecondaryAction style={dir == "rtl" ? { right: "unset", left: 16 } : {}}>
						<Switch
							color="primary"
							checked={serviceState[`${service.id}-${id}`]}
							onChange={() => handleToggle(service.id, id)}
							classes={{
								thumb: !serviceState[`${service.id}-${id}`] && classes.thumbOff,
								track: !serviceState[`${service.id}-${id}`] && classes.trackOff
							}}
						/>
					</ListItemSecondaryAction>
				</ListItem>
			);
		}

		return listItem;
	};

	const handleExpand = id => {
		expanded[id]
			? setExpanded({ ...expanded, [id]: false })
			: setExpanded({ ...expanded, [id]: true });
	};

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const { layers, properties, id, authentication } = service;

	return (
		<Fragment>
			<ListItem disableGutters>
				<ListItemText
					primary={properties.name}
					secondary={
						<Button
							onClick={handleOpen}
							size="small"
							variant="text"
							color="primary"
							className={classes.text}
							disableRipple
						>
							<Translate value="global.map.controls.gisControl.gisCollection.manage" />
						</Button>
					}
					primaryTypographyProps={{ noWrap: true }}
					secondaryTypographyProps={{ noWrap: true }}
					style={dir == "rtl" ? { textAlign: "right" } : {}}
				/>
				<ListItemSecondaryAction style={dir == "rtl" ? { right: "unset", left: 16 } : {}}>
					<IconButton
						className={classes.root}
						disableRipple
						onClick={() => handleExpand(id)}
					>
						{expanded[id] ? <ExpandLess /> : <ExpandMore />}
					</IconButton>
				</ListItemSecondaryAction>
			</ListItem>
			<Collapse in={expanded[id]}>
				<List>{_.map(layers, layer => renderListItem(layer))}</List>
			</Collapse>
			<GISManagement
				open={open}
				handleClose={handleClose}
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
};

GISCollection.propTypes = propTypes;
GISCollection.defaultProps = defaultProps;

export default withStyles(styles)(GISCollection);
