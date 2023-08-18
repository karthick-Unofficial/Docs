import React, { useEffect } from "react";
import { CollectionCard, CollectionCardItem } from "orion-components/CBComponents";
import { IconButton, Button } from "@mui/material";
import Expand from "@mui/icons-material/ZoomOutMap";
import LaunchIcon from "@mui/icons-material/Launch";
import { LinkDialog } from "orion-components/SharedComponents";
import { Translate, getTranslation } from "orion-components/i18n";
import PropTypes from "prop-types";
import { facilityService } from "client-app-core";
import { useDispatch, useSelector } from "react-redux";
import { getWidgetState, isWidgetLaunchableAndExpandable } from "orion-components/Profiles/Selectors";
import { getDir } from "orion-components/i18n/Config/selector";
import { openDialog, closeDialog } from "orion-components/AppState/Actions";
import { unlinkEntities } from "orion-components/SharedActions/accessPointProfileActions";
import { unsubscribeFromFeed } from "orion-components/ContextualData/Actions";
import { loadProfile } from "orion-components/ContextPanel/Actions";
import { contextPanelState } from "orion-components/ContextPanel/Selectors";
import { userFeedsSelector } from "orion-components/GlobalData/Selectors";
import { getSelectedContextData } from "orion-components/Profiles/Selectors";

const propTypes = {
	selectFloor: PropTypes.func,
	facilityFeedId: PropTypes.string
};

const defaultProps = {
	selectFloor: () => {},
	facilityFeedId: ""
};

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
	autoFocus
}) => {
	const entity = useSelector((state) => getSelectedContextData(state)(contextId, "entity")) || {};
	const entityType = entity?.entityType || "";

	const enabled = useSelector((state) => expanded || getWidgetState(state)(id, "enabled"));
	const dir = useSelector((state) => getDir(state));
	const isPrimary = useSelector((state) => entity && contextId === contextPanelState(state).selectedContext.primary);
	const feeds = useSelector((state) => entity && userFeedsSelector(state));
	const launchableAndExpandable = useSelector((state) => isWidgetLaunchableAndExpandable(state));
	const { widgetsExpandable, widgetsLaunchable } = launchableAndExpandable;
	const dialog = useSelector((state) => entity && state.appState?.dialog?.openDialog);
	const linkedItems = useSelector((state) => getSelectedContextData(state)(contextId, "linkedEntities")) || [];
	const fovItems =
		entityType === "camera" ? useSelector((state) => getSelectedContextData(state)(contextId, "fovItems")) : [];
	const items = [...fovItems, ...linkedItems];
	const events = useSelector((state) => getSelectedContextData(state)(contextId, "fovEvents")) || [];

	const dispatch = useDispatch();
	const styles = {
		widgetExpandButton: {
			width: "auto",
			...(dir === "rtl" && { paddingLeft: 0 }),
			...(dir === "ltr" && { paddingRight: 0 })
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

	const handleLaunch = () => {
		// -- different actions based on entity type: ["track", "shapes", "event", "camera", "facility"]
		if (entityType === "camera") {
			window.open(`/cameras-app/#/entity/${contextId}/widget/linked-items`);
		}
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

	return selected || !enabled ? (
		<div />
	) : (
		<div className={`widget-wrapper ${expanded ? "expanded" : "collapsed"}`}>
			{!expanded && (
				<div className="widget-header">
					<div className="cb-font-b2">
						<Translate value="global.profiles.widgets.linkedItems.title" />
					</div>
					{canLink && (
						<div className="widget-option-button" style={{ marginLeft: "auto" }}>
							<Button
								onClick={() => dispatch(openDialog("link-entity-dialog"))}
								style={{
									textTransform: "none"
								}}
								color="primary"
							>
								<Translate value="global.profiles.widgets.linkedItems.linkItems" />
							</Button>
						</div>
					)}
					<div className="widget-header-buttons">
						{widgetsExpandable && (
							<div className="widget-expand-button">
								<IconButton style={styles.widgetExpandButton} onClick={handleExpand}>
									<Expand />
								</IconButton>
							</div>
						)}
						{widgetsLaunchable && (
							<div className="widget-expand-button">
								<IconButton style={styles.widgetExpandButton} onClick={handleLaunch}>
									<LaunchIcon />
								</IconButton>
							</div>
						)}
					</div>
				</div>
			)}
			<div className="widget-content">
				{!!items.length &&
					getCategories().map((category) => {
						const { id, name } = category;
						return (
							<CollectionCard key={id} name={name} dir={dir}>
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
				autoFocus={autoFocus}
				dir={dir}
			></LinkDialog>
		</div>
	);
};

LinkedItemsWidget.propTypes = propTypes;
LinkedItemsWidget.defaultProps = defaultProps;

export default LinkedItemsWidget;
