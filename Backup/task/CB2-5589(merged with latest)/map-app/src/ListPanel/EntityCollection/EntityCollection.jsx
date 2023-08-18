import React, { Fragment, useState, memo } from "react";
import EntityCollectionEdit from "./components/EntityCollectionEdit";
import { Button } from "@mui/material";
import { Collection, CollectionItem, MapFilter } from "orion-components/CBComponents";
import * as mapFilterActionCreators from "./MapFilter/mapFilterActions";
import { Translate } from "orion-components/i18n";
import { useSelector, useDispatch } from "react-redux";
import * as actionCreators from "./entityCollectionActions.js";
import {
	activeAlertsSelector,
	sharedEntitiesSelector,
	makeGetCollection,
	makeGetCollectionMembers,
	userFeedsSelector
} from "orion-components/GlobalData/Selectors";
import { selectedEntityState } from "orion-components/ContextPanel/Selectors";
import { getDir } from "orion-components/i18n/Config/selector";
import size from "lodash/size";
import map from "lodash/map";
import pickBy from "lodash/pickBy";
import find from "lodash/find";
import filter from "lodash/filter";
import { loadProfile } from "orion-components/ContextPanel/Actions";
import { createCollection, restoreCollection, deleteCollection } from "orion-components/SharedActions/commonActions";
import { createUserFeedback } from "orion-components/Dock/Actions/index.js";
import PropTypes from "prop-types";

const propTypes = {
	search: PropTypes.string,
	groupId: PropTypes.string,
	id: PropTypes.string || PropTypes.number,
	collection: PropTypes.obj
};

const EntityCollection = (props) => {
	const { search, groupId } = props;
	const dispatch = useDispatch();

	const {
		unshareCollectionToOrg,
		shareCollectionToOrg,
		selectFloorPlanOn,
		removeFromCollection,
		renameCollection,
		addToCollection,
		removeFromMyItems
	} = actionCreators;

	const getCollection = makeGetCollection();
	const getCollectionMember = makeGetCollectionMembers();

	const orgId = useSelector((state) => state.session.user.profile.orgId);
	const collection = useSelector((state) => (props.id === "shared" ? props.collection : getCollection(state, props)));
	const activeAlerts = useSelector((state) => activeAlertsSelector(state));
	const entities = useSelector((state) =>
		props.id === "shared" ? sharedEntitiesSelector(state) : getCollectionMember(state, props)
	);
	const manageable = useSelector(
		(state) =>
			props.id !== "shared" &&
			state.session.user.profile.applications &&
			state.session.user.profile.applications.find((app) => app.appId === "map-app") &&
			state.session.user.profile.applications.find((app) => app.appId === "map-app").permissions &&
			state.session.user.profile.applications
				.find((app) => app.appId === "map-app")
				.permissions.includes("manage")
	);
	const profileIconTemplates = {};
	const userFeeds = useSelector((state) => userFeedsSelector(state));
	Object.values(userFeeds).forEach((feed) => {
		profileIconTemplates[feed.feedId] = feed.profileIconTemplate;
	});
	const user = useSelector((state) => state.session.user.profile);
	const floorPlansWithFacilityFeed = useSelector((state) => state.globalData.floorPlanWithFacilityFeedId.floorPlans);
	const searchActive = !!search;
	const selectedEntity = useSelector((state) => selectedEntityState(state));
	const dir = useSelector((state) => getDir(state));

	const [editDialogOpen, setEditDialogOpen] = useState(false);

	const handleEdit = () => {
		setEditDialogOpen(true);
	};

	const handleEditClose = () => {
		setEditDialogOpen(false);
	};

	const handleEntityClick = (entity) => {
		const { id } = entity;
		const member = entities[id];
		dispatch(loadProfile(member.id, member.entityData.properties.name, member.entityType, "profile"));
	};

	const handleShareClick = () => {
		if (collection.sharedWith[orgId]) {
			dispatch(unshareCollectionToOrg(collection.id, orgId));
		} else {
			dispatch(shareCollectionToOrg(collection.id, orgId));
		}
	};

	const getCollectionMembers = () => {
		const filteredMembers = pickBy(entities, (member) => {
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
				dispatch(selectFloorPlanOn(floorPlanData, floorPlanData.facilityFeedId));
			}
		}
	};

	const { isOwner, sharedWith } = collection;
	const mapApp = find(user.applications, (app) => app.appId === "map-app");
	const canEditCollections = mapApp && mapApp.permissions.includes("manage");
	const members = getCollectionMembers();
	const childSelected = selectedEntity && Object.keys(members).indexOf(selectedEntity.id) >= 0;
	const alerts = filter(members, (member) => {
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
			...(dir === "rtl" && { marginLeft: 6 }),
			...(dir === "ltr" && { marginRight: 6 })
		}
	};

	return !size(members) && searchActive ? (
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
								style={styles.text}
								disableRipple
							>
								<Translate value="listPanel.entityCollection.manage" />
							</Button>
						)}
						{size(members) === 1 ? (
							<Translate value="listPanel.entityCollection.item" count={size(members)} />
						) : (
							<Translate value="listPanel.entityCollection.items" count={size(members)} />
						)}
					</Fragment>
				}
				alerts={alerts.length > 0}
				filterButton={<MapFilter {...mapFilterActionCreators} id={id} items={members} />}
				childSelected={childSelected}
				dir={dir}
			>
				{map(members, (member) => {
					const { entityData } = member;
					const { properties } = entityData;
					const { name, type, subtype } = properties;
					const id = member.id ? member.id : properties.id ? properties.id : "";
					const alert = alerts.map((alert) => alert.id).includes(id);
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
};

EntityCollection.propTypes = propTypes;

export default memo(EntityCollection);
