import React, { Fragment, useState, memo } from "react";
import EntityCollectionEdit from "./components/EntityCollectionEdit";
import { Button } from "@material-ui/core";
import { Collection, CollectionItem } from "orion-components/CBComponents";
import MapFilterContainer from "./MapFilter/MapFilterContainer";
import _ from "lodash";
import { Translate } from "orion-components/i18n/I18nContainer";

const EntityCollection = memo(({
	loadProfile,
	entities,
	collection,
	unshareCollectionToOrg,
	shareCollectionToOrg,
	search,
	profileIconTemplates,
	floorPlansWithFacilityFeed,
	selectFloorPlanOn,
	manageable,
	groupId,
	orgId,
	activeAlerts,
	searchActive,
	user,
	selectedEntity,
	dir,
	removeFromCollection,
	deleteCollection,
	restoreCollection,
	createCollection,
	renameCollection,
	addToCollection,
	createUserFeedback,
	removeFromMyItems
}) => {

	const [editDialogOpen, setEditDialogOpen] = useState(false);

	const handleEdit = () => {
		setEditDialogOpen(true);
	};


	const handleEditClose = () => {
		setEditDialogOpen(false);
	};

	const handleEntityClick = entity => {
		const { id } = entity;
		const member = entities[id];
		loadProfile(
			member.id,
			member.entityData.properties.name,
			member.entityType,
			"profile"
		);
	};

	const handleShareClick = () => {
		if (collection.sharedWith[orgId]) {
			unshareCollectionToOrg(collection.id, orgId);
		} else {
			shareCollectionToOrg(collection.id, orgId);
		}
	};

	const getCollectionMembers = () => {
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

	const showFloorPlanOnTargetClick = (value) => {
		const { id } = value;
		let selectedEntity = {};

		Object.keys(entities).some((entityId) => {
			if (entityId.includes(id)) {
				selectedEntity = entities[entityId];
			}
		});
		const { entityData } = selectedEntity;

		if (entityData.displayType === "facility" && floorPlansWithFacilityFeed !== null) {
			const floorPlanData = floorPlansWithFacilityFeed[entityData.displayTargetId];
			if (floorPlanData.id === entityData.displayTargetId) {
				selectFloorPlanOn(floorPlanData, floorPlanData.facilityFeedId);
			}
		}
	};

	const { isOwner, sharedWith } = collection;
	const mapApp = _.find(
		user.applications,
		app => app.appId === "map-app"
	);
	const canEditCollections = mapApp && mapApp.permissions.includes("manage");
	const members = getCollectionMembers();
	const childSelected = selectedEntity && Object.keys(members).indexOf(selectedEntity.id) >= 0;
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
								onClick={handleEdit}
								size="small"
								variant="text"
								color="primary"
								style={dir == "rtl" ? styles.textRTL : styles.text}
								disableRipple
							>
								<Translate value="listPanel.entityCollection.manage" />
							</Button>
						)}
						{_.size(members) === 1 ? <Translate value="listPanel.entityCollection.item" count={_.size(members)} /> : <Translate value="listPanel.entityCollection.items" count={_.size(members)} />}
					</Fragment>
				}
				alerts={alerts.length > 0}
				filterButton={<MapFilterContainer id={id} items={members} />}
				childSelected={childSelected}
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
							handleSelect={handleEntityClick}
							selected={selectedEntity && selectedEntity.id === id}
							geometry={true}
							type={subtype ? subtype : type}
							alert={alert}
							dir={dir}
							selectFloor={showFloorPlanOnTargetClick}
						/>
					);
				})}
			</Collection>
			{/* TODO: Clean up and update this dialog to use reusable CB Components */}
			{(groupId === "my-entities" || manageable) && (
				<EntityCollectionEdit
					label={name}
					collectionMembers={members}
					close={handleEditClose}
					open={editDialogOpen}
					removeFromCollection={removeFromCollection}
					groupId={collection.id}
					isOwner={isOwner}
					canRemoveFromThisCollection={isOwner || canEditCollections}
					deleteCollection={deleteCollection}
					restoreCollection={restoreCollection}
					createCollection={createCollection}
					renameCollection={renameCollection}
					addToCollection={addToCollection}
					shared={sharedWith && sharedWith[orgId]}
					handleShare={handleShareClick}
					createUserFeedback={createUserFeedback}
					removeFromMyItems={removeFromMyItems}
					user={user}
					dir={dir}
				/>
			)}
		</Fragment>
	);
});

export default EntityCollection;


