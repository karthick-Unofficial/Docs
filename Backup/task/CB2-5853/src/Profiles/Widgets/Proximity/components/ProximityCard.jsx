import React, { useState } from "react";
import PropTypes from "prop-types";
import { IconButton, Card, CardContent, Collapse, ListItem, ListItemText, Typography, Button } from "@mui/material";
import { Cancel, ExpandMore, ExpandLess } from "@mui/icons-material";
import { Translate, getTranslation } from "orion-components/i18n";
import SortProximityEntities from "./SortProximityEntities";

const propTypes = {
	proximity: PropTypes.object.isRequired,
	event: PropTypes.object.isRequired,
	canRemove: PropTypes.bool,
	handleRemove: PropTypes.func,
	canEdit: PropTypes.bool,
	handleEdit: PropTypes.func,
	loadProfile: PropTypes.func,
	handleLoadEntityDetails: PropTypes.func,
	widgetExpanded: PropTypes.bool,
	entities: PropTypes.object,
	dir: PropTypes.string
};

const ProximityCard = ({
	proximity,
	canRemove,
	handleRemove,
	canEdit,
	handleEdit,
	loadProfile,
	handleLoadEntityDetails,
	widgetExpanded,
	entities
}) => {
	const [expanded, setExpanded] = useState(true);

	const handleExpand = () => {
		setExpanded(!expanded);
	};

	const radius =
		proximity.distanceUnits === "mi"
			? proximity.radius * 1.609344
			: proximity.distanceUnits === "m"
			? proximity.radius / 1000
			: proximity.distanceUnits === "ft"
			? proximity.radius / 3280.84
			: proximity.radius;

	return (
		<Card
			style={{
				borderRadius: 0,
				marginBottom: 12,
				background: "transparent"
			}}
		>
			<ListItem style={{ backgroundColor: "#494d53", padding: "0px" }}>
				<IconButton onClick={handleExpand}>{expanded ? <ExpandLess /> : <ExpandMore />}</IconButton>
				<ListItemText
					style={{
						paddingLeft: 0,
						overflow: "hidden",
						whiteSpace: "nowrap",
						textOverflow: "ellipsis",
						color: "white"
					}}
					primary={proximity.name}
					primaryTypographyProps={{
						variant: "body1",
						noWrap: true
					}}
				/>
				{canEdit && (
					<Button variant="text" color="primary" onClick={handleEdit}>
						{getTranslation("global.profiles.widgets.proximity.proximityCard.edit")}
					</Button>
				)}
				{canRemove && (
					<IconButton onClick={handleRemove}>
						<Cancel />
					</IconButton>
				)}
			</ListItem>
			<Collapse in={expanded}>
				<CardContent style={{ padding: 0, border: "1px solid #494d53" }}>
					<div style={{ maxHeight: "470px" }} className="proximityEntitiesScroll scrollbar">
						{entities && entities.length > 0 ? (
							<SortProximityEntities
								entities={entities}
								radius={radius}
								loadProfile={loadProfile}
								handleLoadEntityDetails={handleLoadEntityDetails}
								widgetExpanded={widgetExpanded}
							/>
						) : (
							<Typography style={{ padding: 12 }} align="center" variant="caption" component="p">
								<Translate value="global.profiles.widgets.proximity.proximityCard.noEntities" />
							</Typography>
						)}
					</div>
				</CardContent>
			</Collapse>
		</Card>
	);
};

ProximityCard.propTypes = propTypes;

export default ProximityCard;
