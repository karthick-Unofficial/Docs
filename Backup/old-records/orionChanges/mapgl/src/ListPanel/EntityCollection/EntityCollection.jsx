import React, { Fragment } from "react";
import EntityCollectionEdit from "./components/EntityCollectionEdit";
import { Button } from "@material-ui/core";
import { Collection, CollectionItem } from "orion-components/CBComponents";
import MapFilterContainer from "./MapFilter/MapFilterContainer";
import _ from "lodash";
import isEqual from "react-fast-compare";
import { Translate } from "orion-components/i18n/I18nContainer";

class EntityCollection extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			editDialogOpen: false
		};
	}

	handleEdit = () => {
		this.setState({
			editDialogOpen: true
		});
	};

	handleEditClose = () => {
		this.setState({
			editDialogOpen: false
		});
	};

	handleEntityClick = entity => {
		const { loadProfile, entities } = this.props;
		const { id } = entity;
		const member = entities[id];
		loadProfile(
			member.id,
			member.entityData.properties.name,
			member.entityType,
			"profile"
		);
	};

	handleShareClick = () => {
		const { collection } = this.props;
		if (collection.sharedWith[this.props.orgId]) {
			this.props.unshareCollectionToOrg(collection.id, this.props.orgId);
		} else {
			this.props.shareCollectionToOrg(collection.id, this.props.orgId);
		}
	};

	/**
	 * shouldComponentUpdate is being implemented in order to prevent re-renders when an
	 * entity is dropped or added to the map that is not referenced in the collection
	 */
	shouldComponentUpdate(nextProps, nextState) {
		return (
			!isEqual(this.props, nextProps) || !isEqual(this.state, nextState)
		);
	}

	getCollectionMembers = () => {
		const { entities, search, profileIconTemplates } = this.props;
		const filteredMembers = _.pickBy(entities, member => {
			const { entityData, id } = member;
			if (entityData) {
				const { properties } = entityData;
				const { name, description, type } = properties;

				// -- set profileIconTemplate to pass to CollectionItem
				properties.profileIconTemplate = profileIconTemplates[member.feedId];

				return `${name}|${description}|${type}|${id}`.toLowerCase().includes(search);
			} else {
				return false;
			}
		});
		return filteredMembers;
	};

	render() {
		const {
			manageable,
			groupId,
			orgId,
			activeAlerts,
			collection,
			searchActive,
			user,
			dir
		} = this.props;
		const { editDialogOpen } = this.state;
		
		const { isOwner, sharedWith } = collection;
		const mapApp = _.find(
			user.applications,
			app => app.appId === "map-app"
		);
		const canEditCollections = mapApp && mapApp.permissions.includes("manage");
		const members = this.getCollectionMembers();
		const alerts = _.filter(members, member => {
			return activeAlerts.includes(member.id);
		});
		const { id, name } = collection;

		const styles = {
			text: {
				"&:hover": {
					backgroundColor: "transparent"
				},
				textTransform: "none",
				padding: 0,
				justifyContent: "flex-start",
				minHeight: 0,
				height: "auto",
				minWidth: 0,
				marginRight: 6
			},
			textRTL: {
				"&:hover": {
					backgroundColor: "transparent"
				},
				textTransform: "none",
				padding: 0,
				justifyContent: "flex-start",
				minHeight: 0,
				height: "auto",
				minWidth: 0,
				marginLeft: 6
			}
		};

		return !_.size(members) && searchActive ? (
			<div />
		) : (
			<Fragment>
				<Collection
					primaryText={name}
					secondaryText={
						// TODO: Create a reusable Button component
						<Fragment>
							{manageable && (
								<Button
									onClick={this.handleEdit}
									size="small"
									variant="text"
									color="primary"
									style={dir == "rtl" ? styles.textRTL : styles.text}
									disableRipple
								>
									<Translate value="listPanel.entityCollection.manage"/>
								</Button>
							)}
							{_.size(members) === 1 ? <Translate value="listPanel.entityCollection.item" count= {_.size(members)}/> : <Translate value="listPanel.entityCollection.items" count= {_.size(members)}/>}
						</Fragment>
					}
					alerts={alerts.length > 0}
					filterButton={<MapFilterContainer id={id} items={members} />}
					dir={dir}
				>
					{_.map(members, member => {
						const { entityData } = member;
						const { properties } = entityData;
						const { name, type, subtype } = properties;
						const id = member.id ? member.id : properties.id ? properties.id : "";
						const alert = alerts.map(alert => alert.id).includes(id);
						return (
							<CollectionItem
								key={id}
								primaryText={name ? name : id ? id.toUpperCase() : ""}
								secondaryText={subtype ? subtype : type}
								item={member}
								handleSelect={this.handleEntityClick}
								geometry={true}
								type={subtype ? subtype : type}
								alert={alert}
								dir={dir}
							/>
						);
					})}
				</Collection>
				{/* TODO: Clean up and update this dialog to use reusable CB Components */}
				{(groupId === "my-entities" || manageable) && (
					<EntityCollectionEdit
						label={name}
						collectionMembers={members}
						close={this.handleEditClose}
						open={editDialogOpen}
						removeFromCollection={this.props.removeFromCollection}
						groupId={collection.id}
						isOwner={isOwner}
						canRemoveFromThisCollection={isOwner || canEditCollections}
						deleteCollection={this.props.deleteCollection}
						restoreCollection={this.props.restoreCollection}
						createCollection={this.props.createCollection}
						renameCollection={this.props.renameCollection}
						addToCollection={this.props.addToCollection}
						shared={sharedWith && sharedWith[orgId]}
						handleShare={this.handleShareClick}
						createUserFeedback={this.props.createUserFeedback}
						removeFromMyItems={this.props.removeFromMyItems}
						user={user}
						dir={dir}
					/>
				)}
			</Fragment>
		);
	}
}

export default EntityCollection;
