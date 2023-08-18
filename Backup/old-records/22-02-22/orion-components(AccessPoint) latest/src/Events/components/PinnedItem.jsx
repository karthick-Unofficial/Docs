import React, { Component } from "react";
import { ListItem, Avatar } from "material-ui";

import { TargetingIcon } from "../../SharedComponents";

export default class PinnedItem extends Component {
	// shouldComponentUpdate(nextProps, nextState) {
	// 	const entity = this.props.entity;
	// 	const nextEntity = nextProps.entity;
	// 	const id = this.props.entity.id;
	// 	const nextId = nextProps.entity.id;
	// 	const target = this.props.targetIcon;
	// 	const nextTarget = nextProps.targetIcon;

	// 	// If new item, rerender
	// 	// If new name, rerender
	// 	// If targeting icon becomes null, rerender
	// 	// If targeting icon becomes component from null, rerender
	// 	if (
	// 		nextId !== id ||
	// 		nextEntity.entityData.properties.name !==
	// 			entity.entityData.properties.name ||
	// 		(target === null && nextTarget !== null) ||
	// 		(target !== null && nextTarget === null)
	// 	) {
	// 		return true;
	// 	}

	// 	return false;
	// }

	loadEntityData = (event, entity) => {
		event.stopPropagation();

		switch (entity.entityType) {
			case "track":
			case "shapes":
				this.props.loadProfile(
					entity.id,
					entity.entityData.properties.name,
					entity.entityType,
					"profile"
				);
				break;
			case "camera":
				this.props.loadProfile(
					entity.id,
					entity.entityData.properties.name,
					"camera",
					"profile"
				);
				break;
			default:
				break;
		}
	};

	render() {
		const { entity, dir } = this.props;
		const style = {
			marginBottom: ".75rem",
			backgroundColor: "#41454A",
			width: "90%",
			marginLeft: "10%",
			padding: "none"
		};
		const styleRTL = {
			marginBottom: ".75rem",
			backgroundColor: "#41454A",
			width: "90%",
			marginRight: "10%",
			padding: "none"
		};

		const targetIcon = <TargetingIcon id={entity.id} feedId={entity.feedId} />;

		return (
			<ListItem
				key={entity.id}
				style={dir && dir == "rtl" ? styleRTL : style}
				onClick={e => this.loadEntityData(e, entity)}
				primaryText={entity.entityData.properties.name}
				secondaryText={entity.entityData.properties.type}
				leftAvatar={
					<Avatar backgroundColor={"#41454A"}>
						{
							// Target icon rendered per entity passed down
							targetIcon
						}
					</Avatar>
				}
			/>
		);
	}
}
