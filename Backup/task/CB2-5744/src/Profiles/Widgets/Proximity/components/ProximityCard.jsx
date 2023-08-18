import React, { useState } from "react";
import PropTypes from "prop-types";
import {
	IconButton,
	Card,
	CardContent,
	Collapse,
	ListItem,
	ListItemText,
	Typography,
	Button
} from "@mui/material";
import { Cancel, ExpandMore, ExpandLess } from "@mui/icons-material";
import { CollectionCardItem } from "orion-components/CBComponents";
import { Translate, getTranslation } from "orion-components/i18n";

const propTypes = {
	proximity: PropTypes.object.isRequired,
	event: PropTypes.object.isRequired
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
	entities,
	dir
}) => {
	const [expanded, setExpanded] = useState(false);

	const handleExpand = () => {
		setExpanded(!expanded);
	};

	const radius =
		proximity.distanceUnits === "mi"
			? proximity.radius * 1.609344
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
				<IconButton onClick={handleExpand}>
					{expanded ? <ExpandLess /> : <ExpandMore />}
				</IconButton>
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
						{getTranslation(
							"global.profiles.widgets.proximity.proximityCard.edit"
						)}
					</Button>
				)}
				{canRemove && (
					<IconButton onClick={handleRemove}>
						<Cancel />
					</IconButton>
				)}
			</ListItem>
			<Collapse in={expanded}>
				<CardContent
					style={{ padding: 0, border: "1px solid #494d53" }}
				>
					<div
						style={{ maxHeight: "400px" }}
						className="proximityEntitiesScroll scrollbar"
					>
						{entities && entities.length > 0 ? (
							entities
								.filter((entity) => {
									return (
										entity.proximityId === Number(radius)
									);
								})
								.map((entity) => {
									const {
										entityData,
										feedId,
										id,
										isDeleted
									} = entity;
									const { name, type, subtype } =
										entityData.properties;
									return (
										<CollectionCardItem
											canRemove={false}
											disabled={isDeleted}
											feedId={feedId}
											handleClick={
												loadProfile
													? () =>
															handleLoadEntityDetails(
																entity
															)
													: null
											}
											id={id}
											key={id}
											name={name}
											type={
												widgetExpanded
													? subtype
														? subtype
														: type
													: ""
											}
											dir={dir}
										/>
									);
								})
						) : (
							<Typography
								style={{ padding: 12 }}
								align="center"
								variant="caption"
								component="p"
							>
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
