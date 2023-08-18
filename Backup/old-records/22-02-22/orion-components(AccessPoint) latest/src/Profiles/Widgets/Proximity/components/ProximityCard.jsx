import React, { Component } from "react";
import PropTypes from "prop-types";
import { FlatButton } from "material-ui";
import {
	IconButton,
	Card,
	CardContent,
	Collapse,
	ListItem,
	ListItemText
} from "@material-ui/core";
import { Cancel, ExpandMore, ExpandLess } from "@material-ui/icons";
import { CollectionCardItem } from "orion-components/CBComponents";
import { Typography } from "@material-ui/core";
import { Translate, getTranslation } from "orion-components/i18n/I18nContainer";

const propTypes = {
	proximity: PropTypes.object.isRequired,
	event: PropTypes.object.isRequired
};

class ProximityCard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			expanded: false,
			isQuerying: false
		};
	}
	handleExpand = () => {
		const { expanded } = this.state;
		this.setState({ expanded: !expanded });
	};

	render() {
		const { proximity, canRemove, handleRemove, canEdit, handleEdit, loadProfile, handleLoadEntityDetails, widgetExpanded, entities } = this.props;
		const { expanded } = this.state;
		const radius = proximity.distanceUnits === "mi" ? proximity.radius * 1.609344 : proximity.radius;
		return (
			<Card
				style={{ borderRadius: 0, marginBottom: 12, background: "transparent" }}
			>
				<ListItem style={{ backgroundColor: "#494d53", padding: "0px" }}>
					<IconButton onClick={this.handleExpand}>
						{expanded ? <ExpandLess /> : <ExpandMore />}
					</IconButton>
					<ListItemText
						style={{ paddingLeft: 0, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", color: "white" }}
						primary={proximity.name}
						primaryTypographyProps={{
							variant: "body1", 
							noWrap: true
						}}
					/>
					{canEdit && (
						<FlatButton
							label={getTranslation("global.profiles.widgets.proximity.proximityCard.edit")}
							primary={true}
							onClick={handleEdit}
						/>
					)}
					{canRemove && (
						<IconButton onClick={handleRemove}>
							<Cancel />
						</IconButton>
					)}
				</ListItem>
				<Collapse in={expanded}>
					<CardContent style={{ padding: 0, border: "1px solid #494d53" }}>
						<div
							style={{ maxHeight: "400px" }}
							className="proximityEntitiesScroll scrollbar"
						>
							{entities && entities.length > 0 ? (
								entities
									.filter(entity => {
										return entity.proximityId === Number(radius);
									})
									.map(entity => {
										const {
											entityData,
											feedId,
											id,
											isDeleted
										} = entity;
										const { name, type, subtype } = entityData.properties;
										return (
											<CollectionCardItem
												canRemove={false}
												disabled={isDeleted}
												feedId={feedId}
												handleClick={
													loadProfile
														? () => handleLoadEntityDetails(entity)
														: null
												}
												id={id}
												key={id}
												name={name}
												type={widgetExpanded ? (subtype ? subtype : type) : ""}
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
									<Translate value="global.profiles.widgets.proximity.proximityCard.noEntities"/>
								</Typography>
							)
							}
						</div>
					</CardContent>
				</Collapse>
			</Card>
		);
	}
}

ProximityCard.propTypes = propTypes;

export default ProximityCard;
