import React, { useEffect } from "react";
import { eventService } from "client-app-core";
import { CollectionCard, CollectionCardItem } from "orion-components/CBComponents";
import { IconButton, Button, Typography } from "@mui/material";
import Expand from "@mui/icons-material/ZoomOutMap";
import LaunchIcon from "@mui/icons-material/Launch";
import PropTypes from "prop-types";
import PinnedItemsDialog from "./components/PinnedItemsDialog";
import { Translate } from "orion-components/i18n";
import { useDispatch } from "react-redux";
import { getWidgetState, isWidgetLaunchableAndExpandable } from "orion-components/Profiles/Selectors";
import { useSelector } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";
import { loadProfile } from "orion-components/ContextPanel/Actions";
import { openDialog, closeDialog } from "orion-components/AppState/Actions";
import { userFeedsSelector } from "orion-components/GlobalData/Selectors";
import { unsubscribeFromFeed } from "orion-components/ContextualData/Actions";
import { contextPanelState } from "orion-components/ContextPanel/Selectors";

const propTypes = {
	selectFloor: PropTypes.func,
	floorPlansWithFacilityFeed: PropTypes.object,
	contextId: PropTypes.string,
	subscriberRef: PropTypes.any,
	selectWidget: PropTypes.func,
	entityType: PropTypes.string,
	items: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
	canManage: PropTypes.bool,
	selected: PropTypes.bool,
	eventEnded: PropTypes.bool,
	readOnly: PropTypes.bool,
	isAlertProfile: PropTypes.bool,
	id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	expanded: PropTypes.bool
};
const defaultProps = {
	selectFloor: () => { },
	floorPlansWithFacilityFeed: null
};

const PinnedItemsWidget = ({
	contextId,
	subscriberRef,
	selectWidget,
	entityType,
	items,
	floorPlansWithFacilityFeed,
	canManage,
	selected,
	eventEnded,
	readOnly,
	isAlertProfile,
	selectFloor,
	id,
	expanded
}) => {
	const dispatch = useDispatch();

	const enabled = useSelector((state) => isAlertProfile || expanded || getWidgetState(state)(id, "enabled"));
	const userFeeds = useSelector((state) => userFeedsSelector(state) || []);
	const launchableAndExpandable = useSelector((state) => isWidgetLaunchableAndExpandable(state));
	const { widgetsExpandable, widgetsLaunchable } = launchableAndExpandable;
	const dir = useSelector((state) => getDir(state));
	const dialog = useSelector((state) => state.appState?.dialog?.openDialog || "");
	const isPrimary = useSelector((state) => items && contextId === contextPanelState(state).selectedContext.primary);

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
					console.log(err, response);
				}
			});
		}, 200);
	};

	const handleLoadEntityDetails = (item) => {
		dispatch(loadProfile(item.id, item.entityData.properties.name, item.entityType, "profile", "secondary"));
	};

	const getCategories = () => {
		const itemIds = items ? items.map((item) => item.feedId) : [];
		const categories = userFeeds
			.filter((feed) => itemIds.includes(feed.feedId))
			.map((feed) => {
				return { name: feed.name, id: feed.feedId };
			});
		return categories;
	};

	const showFloorPlanOnTargetClick = (entity) => {
		const { entityData, entityType } = entity;

		if (
			entityType === "camera" ||
			("accessPoint" && entityData.displayType === "facility" && floorPlansWithFacilityFeed !== null)
		) {
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
		<div className="widget-wrapper collapsed">
			{!isAlertProfile && !expanded && (
				<div className="widget-header">
					<div className="cb-font-b2">
						<Translate value="global.profiles.widgets.pinnedItems.main.title" />
					</div>
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
									style={{
										width: "auto",
										...(dir === "rtl" && {
											paddingLeft: 0
										}),
										...(dir === "ltr" && {
											paddingRight: 0
										})
									}}
									onClick={handleExpand}
								>
									<Expand />
								</IconButton>
							</div>
						) : null}
						{widgetsLaunchable ? (
							<div className="widget-expand-button">
								<IconButton
									style={{
										width: "auto",
										...(dir === "rtl" && {
											paddingLeft: 0
										}),
										...(dir === "ltr" && {
											paddingRight: 0
										})
									}}
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
					categories.map((category) => {
						const { id, name } = category;
						return (
							<CollectionCard key={id} name={name} dir={dir}>
								{items
									.filter((item) => {
										return item.feedId === id;
									})
									.sort((a, b) => {
										return a.entityData.properties.name > b.entityData.properties.name ? 1 : -1;
									})
									.map((item) => {
										const { entityData, entityType, feedId, id, isDeleted } = item;
										const { name } = entityData.properties;
										return (
											<CollectionCardItem
												canRemove={canRemoveItems}
												disabled={isDeleted || eventEnded}
												selectFloor={() => showFloorPlanOnTargetClick(item)}
												feedId={feedId}
												handleClick={loadProfile ? () => handleLoadEntityDetails(item) : null}
												handleRemove={() => handleUnpin(entityType, id)}
												id={id}
												key={id}
												name={name}
												readOnly={readOnly}
												type={""}
												dir={dir}
											/>
										);
									})}
							</CollectionCard>
						);
					})
				) : (
					<Typography style={{ padding: 12, color: "#fff" }} align="center" variant="caption" component="p">
						<Translate value="global.profiles.widgets.pinnedItems.main.noAssocEntities" />
					</Typography>
				)}
			</div>
			<div>
				<PinnedItemsDialog
					closeDialog={closeDialog}
					dialog={dialog}
					contextId={contextId}
					userFeeds={userFeeds}
					dir={dir}
				/>
			</div>
		</div>
	);
};

PinnedItemsWidget.propTypes = propTypes;
PinnedItemsWidget.defaultProps = defaultProps;

export default PinnedItemsWidget;
