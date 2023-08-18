import React, { useEffect, useState } from "react";
import { eventService } from "client-app-core";
import { CollectionCard, CollectionCardItem } from "orion-components/CBComponents";
import { IconButton, Typography, SvgIcon } from "@mui/material";
import Expand from "@mui/icons-material/ZoomOutMap";
import PropTypes from "prop-types";
import PinnedItemsDialog from "./components/PinnedItemsDialog";
import { Translate } from "orion-components/i18n";
import { useDispatch } from "react-redux";
import { getWidgetState } from "orion-components/Profiles/Selectors";
import { useSelector } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";
import { loadProfile } from "orion-components/ContextPanel/Actions";
import { openDialog, closeDialog } from "orion-components/AppState/Actions";
import { userFeedsSelector } from "orion-components/GlobalData/Selectors";
import { unsubscribeFromFeed } from "orion-components/ContextualData/Actions";
import { contextPanelState } from "orion-components/ContextPanel/Selectors";
import { getSelectedContextData } from "orion-components/Profiles/Selectors";
import { getGlobalWidgetState } from "../Selectors";
import { mdiExpandAll, mdiCollapseAll } from "@mdi/js";
import WidgetMenu from "./components/WidgetMenu";
import isEqual from "lodash/isEqual";

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
	expanded: PropTypes.bool,
	widgetsExpandable: PropTypes.bool
};
const defaultProps = {
	selectFloor: () => { },
	floorPlansWithFacilityFeed: null
};
const widgetName = "pinnedItems";

const PinnedItemsWidget = ({
	contextId,
	subscriberRef,
	selectWidget,
	floorPlansWithFacilityFeed,
	canManage,
	selected,
	eventEnded,
	readOnly,
	isAlertProfile,
	selectFloor,
	id,
	expanded,
	widgetsExpandable
}) => {
	const dispatch = useDispatch();

	const enabled = useSelector((state) => isAlertProfile || expanded || getWidgetState(state)(id, "enabled"));
	const userFeeds = useSelector((state) => userFeedsSelector(state) || []);
	const dir = useSelector((state) => getDir(state));
	const dialog = useSelector((state) => state.appState?.dialog?.openDialog || "");
	const isPrimary = useSelector((state) => items && contextId === contextPanelState(state).selectedContext.primary);
	const entity = useSelector((state) => getSelectedContextData(state)(contextId, "entity"));
	const widgetState = useSelector((state) => getGlobalWidgetState(state)(widgetName)) || {};
	const [collapsed, setCollapsed] = useState(!widgetState?.autoExpand);
	const [expandedChildren, setExpandedChildren] = useState([]);
	const [triggered, setTriggered] = useState(false);
	const [childKey, setChildKey] = useState(0); //Used for forcibly updating the  card child component when the same collapse value is required to be passed as a prop.

	let items = [];
	if (isAlertProfile) {
		items = entity?.contextEntities;
	} else {
		items = useSelector((state) => getSelectedContextData(state)(contextId, widgetName), isEqual);
	}

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
		dispatch(selectWidget(id));
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

	const handleCollapseAndExpand = (listId, isExpanded) => {
		if (!triggered) {
			setTriggered(true);
		}
		if (expandedChildren.includes(listId) || !isExpanded) {
			const latestExpanded = expandedChildren.filter((value) => value !== listId);
			setExpandedChildren(latestExpanded);
		} else {
			if (!expandedChildren.includes(listId) && isExpanded) {
				setExpandedChildren([...expandedChildren, listId]);
			}
		}
	};

	useEffect(() => {
		if (triggered) {
			if (expandedChildren?.length > 0) {
				if (categories.length === expandedChildren.length) {
					setCollapsed(false);
				}
			} else {
				if (!collapsed) {
					setCollapsed(!collapsed);
				}
			}
		}
	}, [expandedChildren, triggered]);

	useEffect(() => {
		if (!collapsed) {
			const listChildren = categories?.map((element) => element.id);
			setExpandedChildren(listChildren);
		} else {
			setExpandedChildren([]);
		}
	}, [collapsed, items]);

	const styles = {
		svgIcon: {
			width: "20px",
			height: "20px",
			color: "#FCFDFD",
			cursor: "pointer",
			...(dir === "rtl" && { marginLeft: "17px" }),
			...(dir === "ltr" && { marginRight: "17px" })
		}
	};

	return selected || !enabled ? (
		<div />
	) : (
		<div className="widget-wrapper collapsed">
			{!isAlertProfile && !expanded && (
				<div className="widget-header">
					<SvgIcon
						style={styles.svgIcon}
						onClick={() => {
							setChildKey(childKey + 1);
							setCollapsed(!collapsed);
						}}
					>
						<path d={collapsed ? mdiExpandAll : mdiCollapseAll} />
					</SvgIcon>
					<div className="cb-font-b2">
						<Translate value="global.profiles.widgets.pinnedItems.main.title" />
					</div>

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
						<WidgetMenu
							dir={dir}
							widgetName={widgetName}
							widgetState={widgetState}
							canPinItems={canPinItems}
							eventEnded={eventEnded}
							handleOpenDialog={handleOpenDialog}
						/>
					</div>
				</div>
			)}
			<div className="widget-content">
				{categories.length > 0 ? (
					categories.map((category) => {
						const { id, name } = category;
						return (
							<CollectionCard
								key={id + childKey}
								name={name}
								dir={dir}
								collapsed={collapsed}
								id={id}
								handleCollapseAndExpand={handleCollapseAndExpand}
							>
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
