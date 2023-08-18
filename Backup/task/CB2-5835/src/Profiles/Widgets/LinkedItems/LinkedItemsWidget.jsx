import React, { useEffect, useState } from "react";
import { CollectionCard, CollectionCardItem } from "orion-components/CBComponents";
import { IconButton, SvgIcon } from "@mui/material";
import Expand from "@mui/icons-material/ZoomOutMap";
import { LinkDialog } from "orion-components/SharedComponents";
import { Translate, getTranslation } from "orion-components/i18n";
import PropTypes from "prop-types";
import { facilityService } from "client-app-core";
import { useDispatch, useSelector } from "react-redux";
import { getWidgetState } from "orion-components/Profiles/Selectors";
import { getDir } from "orion-components/i18n/Config/selector";
import { openDialog, closeDialog } from "orion-components/AppState/Actions";
import { unlinkEntities } from "orion-components/SharedActions/accessPointProfileActions";
import { unsubscribeFromFeed } from "orion-components/ContextualData/Actions";
import { loadProfile } from "orion-components/ContextPanel/Actions";
import { contextPanelState } from "orion-components/ContextPanel/Selectors";
import { userFeedsSelector } from "orion-components/GlobalData/Selectors";
import { getSelectedContextData } from "orion-components/Profiles/Selectors";
import { getGlobalWidgetState } from "../Selectors";
import { mdiCollapseAll, mdiExpandAll } from "@mdi/js";
import WidgetMenu from "../List/components/WidgetMenu";
import isEqual from "lodash/isEqual";

const propTypes = {
	selectFloor: PropTypes.func,
	facilityFeedId: PropTypes.string
};

const defaultProps = {
	selectFloor: () => { },
	facilityFeedId: ""
};

const widgetName = "linkedItems";

const LinkedItemsWidget = ({
	id,
	contextId,
	subscriberRef,
	expanded,
	selectWidget,
	facilityFeedId,
	selectFloor,
	canLink,
	selected,
	disabledTypes,
	widgetsExpandable
}) => {
	const entity = useSelector((state) => getSelectedContextData(state)(contextId, "entity")) || {};
	const entityType = entity?.entityType || "";

	const enabled = useSelector((state) => expanded || getWidgetState(state)(id, "enabled"));
	const dir = useSelector((state) => getDir(state));
	const isPrimary = useSelector((state) => entity && contextId === contextPanelState(state).selectedContext.primary);
	const feeds = useSelector((state) => entity && userFeedsSelector(state));
	const dialog = useSelector((state) => entity && state.appState?.dialog?.openDialog);
	const linkedItems = useSelector((state) => getSelectedContextData(state)(contextId, "linkedEntities"), isEqual) ?? [];
	const fovItems = useSelector((state) => entityType === "camera" ? getSelectedContextData(state)(contextId, "fovItems") ?? [] : [], isEqual);
	const items = [...fovItems, ...linkedItems];

	const events = useSelector((state) => getSelectedContextData(state)(contextId, "fovEvents")) || [];
	const widgetState = useSelector((state) => getGlobalWidgetState(state)(widgetName)) || {};
	const [collapsed, setCollapsed] = useState(!widgetState?.autoExpand);
	const [tempCollapsed, setTempCollapsed] = useState(null);
	const [expandedChildren, setExpandedChildren] = useState([]);
	const [triggered, setTriggered] = useState(false);
	const [childKey, setChildKey] = useState(0); //Used for forcibly updating the  card child component when the same collapse value is required to be passed as a prop.

	const dispatch = useDispatch();
	const styles = {
		widgetExpandButton: {
			width: "auto",
			...(dir === "rtl" && { paddingLeft: 0 }),
			...(dir === "ltr" && { paddingRight: 0 })
		},
		svgIcon: {
			width: "24px",
			height: "24px",
			color: "#FCFDFD",
			cursor: "pointer",
			...(dir === "rtl" && { marginLeft: "2.5%" }),
			...(dir === "ltr" && { marginRight: "2.5%" })
		}
	};
	useEffect(() => {
		return () => {
			if (!isPrimary && !expanded) {
				dispatch(unsubscribeFromFeed(contextId, "fov", subscriberRef));
				dispatch(unsubscribeFromFeed(contextId, "fovItems", subscriberRef));
				dispatch(unsubscribeFromFeed(contextId, "linkedEntities", subscriberRef));
			}
		};
	}, []);

	const handleExpand = () => {
		dispatch(selectWidget("Linked Items"));
	};

	const handleLoadDetails = (item) => {
		switch (item.feedId) {
			case "cameras":
				// Cameras in another camera's FOV are set as secondary context
				dispatch(loadProfile(item.id, item.entityData.properties.name, "camera", "profile", "secondary"));
				break;

			default:
				dispatch(
					loadProfile(item.id, item.entityData.properties.name, item.entityType, "profile", "secondary")
				);

				break;
		}
	};

	const showFloorPlanOnTargetClick = (entityData) => {
		const { displayType, displayTargetId } = entityData;
		if (displayType === "facility") {
			facilityService.getFloorPlan(displayTargetId, (err, response) => {
				if (err) {
					console.log("ERROR Floor plan not found:", err);
				} else {
					dispatch(selectFloor(response.result, facilityFeedId));
				}
			});
		} else {
			return null;
		}
	};

	const getCategories = () => {
		const itemIds = items.map((item) => item.feedId);
		const categories = feeds
			.filter((feed) => itemIds.includes(feed.feedId))
			.map((feed) => {
				return { name: feed.name, id: feed.feedId };
			});
		return categories;
	};

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
				if (getCategories().length === expandedChildren.length) {
					setCollapsed(false);
					setTempCollapsed(null);
				} else {
					// Setting temporary collapse here when the list cards are not completely collapsed or expanded.
					// Another reason for using temporary collapse is that it will not be passed to the proximity card component, while the collapsed `useState` variable or hook will be passed.
					setTempCollapsed(true);
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
			setTempCollapsed(null);
			const listChildren = getCategories()?.map((element) => element.id);
			setExpandedChildren(listChildren);
		} else {
			setTempCollapsed(null);
			setExpandedChildren([]);
		}
	}, [collapsed, fovItems, linkedItems]);

	const linkItems = () => {
		dispatch(openDialog("link-entity-dialog"));
	};

	return selected || !enabled ? (
		<div />
	) : (
		<div className={`widget-wrapper ${expanded ? "expanded" : "collapsed"}`}>
			{!expanded && (
				<div className="widget-header">
					<SvgIcon
						style={styles.svgIcon}
						onClick={() => {
							if (tempCollapsed) {
								setCollapsed(false);
								setTempCollapsed(null);
								setChildKey(childKey + 1);
							} else {
								setCollapsed(!collapsed);
							}
						}}
					>
						{tempCollapsed === null && <path d={collapsed ? mdiExpandAll : mdiCollapseAll} />}
						{tempCollapsed !== null && <path d={tempCollapsed ? mdiExpandAll : mdiCollapseAll} />}
					</SvgIcon>
					<div className="cb-font-b2">
						<Translate value="global.profiles.widgets.linkedItems.title" />
					</div>
					<div className="widget-header-buttons">
						{widgetsExpandable && (
							<div className="widget-expand-button">
								<IconButton style={styles.widgetExpandButton} onClick={handleExpand}>
									<Expand />
								</IconButton>
							</div>
						)}
						<WidgetMenu
							canLink={canLink}
							linkItems={linkItems}
							dir={dir}
							widgetState={widgetState}
							widgetName={widgetName}
							collapsed={collapsed}
						/>
					</div>
				</div>
			)}
			<div className="widget-content">
				{!!items.length &&
					getCategories().map((category) => {
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
										return item.feedId === category.id;
									})
									.map((item) => {
										const { entityData, feedId, id, isDeleted, entityType } = item;
										const { name, type, subtype } = entityData.properties;
										const disabled = (disabledTypes || []).indexOf(entityType) > -1;
										return (
											<CollectionCardItem
												disabled={isDeleted || disabled}
												feedId={feedId}
												handleClick={() => handleLoadDetails(item)}
												handleRemove={() =>
													dispatch(
														unlinkEntities([
															{
																id,
																type: item.entityType
															},
															{
																id: entity.id,
																type: "camera"
															}
														])
													)
												}
												canRemove={item.linkedWith ? true : false}
												id={id}
												key={id}
												name={name}
												type={expanded ? (subtype ? subtype : type) : ""}
												dir={dir}
												selectFloor={() => showFloorPlanOnTargetClick(entityData)}
											/>
										);
									})}
							</CollectionCard>
						);
					})}
				{!!events.length && (
					<CollectionCard key="events" name="Events" dir={dir}>
						{events.map((item) => {
							const { entityData, id, isDeleted } = item;
							const { name, type, subtype } = entityData.properties;
							const disabled = (disabledTypes || []).indexOf("event") > -1;
							return (
								<CollectionCardItem
									disabled={isDeleted || disabled}
									geometry={entityData.geometry}
									handleClick={() => handleLoadDetails(item)}
									id={id}
									key={id}
									name={name}
									type={expanded ? (subtype ? subtype : type) : ""}
									dir={dir}
								/>
							);
						})}
					</CollectionCard>
				)}
			</div>
			<LinkDialog
				dialog={dialog || ""}
				title={getTranslation("global.profiles.widgets.linkedItems.linkItem")}
				closeDialog={closeDialog}
				entity={entity}
				dir={dir}
			></LinkDialog>
		</div>
	);
};

LinkedItemsWidget.propTypes = propTypes;
LinkedItemsWidget.defaultProps = defaultProps;

export default LinkedItemsWidget;
