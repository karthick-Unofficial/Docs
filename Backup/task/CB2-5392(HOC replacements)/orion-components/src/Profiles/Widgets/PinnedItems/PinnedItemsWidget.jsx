import React, { useEffect, useState } from "react";
import { eventService, facilityService } from "client-app-core";
import {
	CollectionCard,
	CollectionCardItem
} from "orion-components/CBComponents";
import { IconButton, Button, Typography } from "@material-ui/core";
import Expand from "@material-ui/icons/ZoomOutMap";
import LaunchIcon from "@material-ui/icons/Launch";
import PropTypes from "prop-types";
import PinnedItemsDialog from "./components/PinnedItemsDialog";
import { Translate } from "orion-components/i18n";
import { useDispatch } from "react-redux";

const propTypes = {
	selectFloor: PropTypes.func,
	floorPlansWithFacilityFeed: PropTypes.object
};
const defaultProps = {
	selectFloor: () => { },
	floorPlansWithFacilityFeed: null
};

const PinnedItemsWidget = ({
	contextId,
	subscriberRef,
	isPrimary,
	unsubscribeFromFeed,
	openDialog,
	selectWidget,
	entityType,
	loadProfile,
	items, feeds,
	floorPlansWithFacilityFeed,
	canManage,
	selected,
	order,
	event,
	enabled,
	widgetsExpandable,
	widgetsLaunchable,
	dialog,
	closeDialog,
	eventEnded,
	readOnly,
	isAlertProfile,
	dir,
	selectFloor
}) => {
	const dispatch = useDispatch();

	const [expandedCards, setExpandedCards] = useState();

	useEffect(() => {
		return () => {
			if (!isPrimary && unsubscribeFromFeed)
				dispatch(unsubscribeFromFeed(contextId, "pinnedItems", subscriberRef));
		};
	}, []);

	const handleOpenDialog = () => {
		dispatch(openDialog("pinnedItemDialog"));
	};

	const handleExpand = () => {
		dispatch(selectWidget("Pinned Items"));
	};

	const handleLaunch = () => {
		// -- different actions based on entity type: ["track", "shapes", "event", "camera", "facility"]
		if (entityType === "event") {
			window.open(`/events-app/#/entity/${contextId}/widget/pinned-items`);
		}
	};

	const handleUnpin = (itemType, itemId) => {
		eventService.unpinEntity(contextId, itemType, itemId);

		// Give the unpin a little time to finish
		setTimeout(() => {
			// Fake an update to cause the pinned item array to update on the changefeed
			eventService.mockUpdateEvent(contextId, (err, response) => {
				if (err) {
					console.log(err);
				}
			});
		}, 200);
	};

	const handleLoadEntityDetails = item => {
		dispatch(loadProfile(
			item.id,
			item.entityData.properties.name,
			item.entityType,
			"profile",
			"secondary"
		));
	};

	const getCategories = () => {
		const itemIds = items ? items.map(item => item.feedId) : [];
		const categories = feeds
			.filter(feed => itemIds.includes(feed.feedId))
			.map(feed => {
				return { name: feed.name, id: feed.feedId };
			});
		return categories;
	};

	const handleExpandCard = id => {
		let updatedCards;
		if (expandedCards.includes(id)) {
			updatedCards = expandedCards.filter(value => value !== id);
		} else {
			updatedCards = [...expandedCards, id];
		}
		setExpandedCards(updatedCards);
	};


	const showFloorPlanOnTargetClick = (entity) => {
		const { entityData, entityType } = entity;

		if (entityType === "camera" || "accessPoint" && entityData.displayType === "facility" && floorPlansWithFacilityFeed !== null) {
			const floorPlanData = floorPlansWithFacilityFeed[entityData.displayTargetId];
			if (floorPlanData.id === entityData.displayTargetId) {
				selectFloor(floorPlanData, floorPlanData.facilityFeedId);

			}
		}
	};

	const categories = getCategories();
	let canPinItems = false;
	let canRemoveItems = false;
	if (canManage) {
		canPinItems = true;
		canRemoveItems = true;
	}

	return selected || !enabled ? (
		<div />
	) : (
		<div
			className={`widget-wrapper collapsed ${"index-" + order}`}
		>
			{!isAlertProfile && (
				<div className="widget-header">
					<div className="cb-font-b2"><Translate value="global.profiles.widgets.pinnedItems.main.title" /></div>
					{canPinItems && !eventEnded && (
						<div className="widget-option-button">
							<Button color="primary" onClick={handleOpenDialog}>
								<Translate value="global.profiles.widgets.pinnedItems.main.pinItem" />
							</Button>
						</div>
					)}
					<div className="widget-header-buttons">
						{widgetsExpandable ? (
							<div className="widget-expand-button">
								<IconButton
									style={dir == "rtl" ? { paddingLeft: 0, width: "auto" } : { paddingRight: 0, width: "auto" }}
									onClick={handleExpand}
								>
									<Expand />
								</IconButton>
							</div>
						) : null}
						{widgetsLaunchable ? (
							<div className="widget-expand-button">
								<IconButton
									style={dir == "rtl" ? { paddingLeft: 0, width: "auto" } : { paddingRight: 0, width: "auto" }}
									onClick={handleLaunch}
								>
									<LaunchIcon />
								</IconButton>
							</div>
						) : null}
					</div>
				</div>
			)}
			<div className="widget-content">
				{categories.length > 0 ? (
					categories.map(category => {
						const { id, name } = category;
						return (
							<CollectionCard key={id} name={name} dir={dir}>
								{items
									.filter(item => {
										return item.feedId === id;
									})
									.map(item => {
										const {
											entityData,
											entityType,
											feedId,
											id,
											isDeleted
										} = item;
										const { name, type, subtype } = entityData.properties;
										return (
											<CollectionCardItem
												canRemove={canRemoveItems}
												disabled={isDeleted || eventEnded}
												selectFloor={() => showFloorPlanOnTargetClick(item)}
												feedId={feedId}
												handleClick={
													loadProfile
														? () => handleLoadEntityDetails(item)
														: null
												}
												handleRemove={() => handleUnpin(entityType, id)}
												id={id}
												key={id}
												name={name}
												readOnly={readOnly}
												type={""}
											/>
										);
									})}
							</CollectionCard>
						);
					})
				) : (
					<Typography
						style={{ padding: 12 }}
						align="center"
						variant="caption"
						component="p"
					>
						<Translate value="global.profiles.widgets.pinnedItems.main.noAssocEntities" />
					</Typography>
				)}
			</div>
			<div>
				<PinnedItemsDialog
					closeDialog={closeDialog}
					dialog={dialog}
					contextId={contextId}
					feeds={feeds}
					dir={dir}
				/>
			</div>
		</div>
	);
};


PinnedItemsWidget.propTypes = propTypes;
PinnedItemsWidget.defaultProps = defaultProps;

export default PinnedItemsWidget;
