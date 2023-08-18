import React, { Component, useEffect } from "react";
import {
	CollectionCard,
	CollectionCardItem
} from "orion-components/CBComponents";
import { IconButton, Button } from "@material-ui/core";
import Expand from "@material-ui/icons/ZoomOutMap";
import LaunchIcon from "@material-ui/icons/Launch";
import { LinkDialog } from "orion-components/SharedComponents";
import { Translate, getTranslation } from "orion-components/i18n/I18nContainer";
import PropTypes from "prop-types";
import { facilityService } from "client-app-core";

const propTypes = {
	selectFloor: PropTypes.func,
	facilityFeedId: PropTypes.string
};

const defaultProps = {
	selectFloor: () => null,
	facilityFeedId: ""
};


const LinkedItemsWidget = ({
	contextId,
	unsubscribeFromFeed,
	subscriberRef,
	isPrimary,
	expanded,
	selectWidget,
	entityType,
	loadProfile,
	facilityFeedId,
	selectFloor,
	items, feeds,
	canLink,
	selected,
	entity,
	events,
	openDialog,
	closeDialog,
	linkEntities,
	unlinkEntities,
	disabledTypes,
	dialog,
	order,
	enabled,
	widgetsExpandable,
	widgetsLaunchable,
	autoFocus,
	dir
}) => {

	useEffect(() => {
		return () => {
			if (!isPrimary && !expanded) {
				unsubscribeFromFeed(contextId, "fov", subscriberRef);
				unsubscribeFromFeed(contextId, "fovItems", subscriberRef);
				unsubscribeFromFeed(contextId, "linkedEntities", subscriberRef);
			}
		};
	});

	const handleExpand = () => {
		selectWidget("Linked Items");
	};

	const handleLaunch = () => {
		// -- different actions based on entity type: ["track", "shapes", "event", "camera", "facility"]
		if (entityType === "camera") {
			window.open(`/cameras-app/#/entity/${contextId}/widget/linked-items`);
		}
	};

	const handleLoadDetails = item => {
		switch (item.feedId) {
			case "cameras":
				// Cameras in another camera's FOV are set as secondary context
				loadProfile(
					item.id,
					item.entityData.properties.name,
					"camera",
					"profile",
					"secondary"
				);
				break;

			default:
				loadProfile(
					item.id,
					item.entityData.properties.name,
					item.entityType,
					"profile",
					"secondary"
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
				}
				else {
					selectFloor(response.result, facilityFeedId);
				}
			});
		}
		else {
			return null;
		}
	};

	const getCategories = () => {
		const itemIds = items.map(item => item.feedId);
		const categories = feeds
			.filter(feed => itemIds.includes(feed.feedId))
			.map(feed => {
				return { name: feed.name, id: feed.feedId };
			});
		return categories;
	};

	return selected || !enabled ? (
		<div />
	) : (
		<div className={`widget-wrapper ${expanded ? "expanded" : "collapsed"} ${"index-" + order}`}>
			{!expanded && (
				<div className="widget-header">
					<div className="cb-font-b2"><Translate value="global.profiles.widgets.linkedItems.title" /></div>
					{canLink && (<div className="widget-option-button" style={{ marginLeft: "auto" }}>
						<Button onClick={() => openDialog("link-entity-dialog")} style={{
							textTransform: "none"
						}}
						color="primary" >
							<Translate value="global.profiles.widgets.linkedItems.linkItems" />
						</Button>
					</div>)}
					<div className="widget-header-buttons">
						{widgetsExpandable && (
							<div className="widget-expand-button">
								<IconButton
									style={dir == "rtl" ? { paddingLeft: 0, width: "auto" } : { paddingRight: 0, width: "auto" }}
									onClick={handleExpand}
								>
									<Expand />
								</IconButton>
							</div>
						)}
						{widgetsLaunchable && (
							<div className="widget-expand-button">
								<IconButton
									style={dir == "rtl" ? { paddingLeft: 0, width: "auto" } : { paddingRight: 0, width: "auto" }}
									onClick={handleLaunch}
								>
									<LaunchIcon />
								</IconButton>
							</div>
						)}
					</div>
				</div>
			)}
			<div className="widget-content">
				{!!items.length && getCategories().map(category => {
					const { id, name } = category;
					return (
						<CollectionCard key={id} name={name} dir={dir}>
							{items
								.filter(item => {
									return item.feedId === category.id;
								})
								.map(item => {
									const { entityData, feedId, id, isDeleted, entityType } = item;
									const { name, type, subtype } = entityData.properties;
									const disabled = (disabledTypes || []).indexOf(entityType) > -1;
									return (
										<CollectionCardItem
											disabled={isDeleted || disabled}
											feedId={feedId}
											handleClick={() => handleLoadDetails(item)}
											handleRemove={() => unlinkEntities([{ id, type: item.entityType }, { id: entity.id, type: "camera" }])}
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
						{events.map(item => {
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
				linkEntities={linkEntities}
				autoFocus={autoFocus}
				dir={dir}
			>
			</LinkDialog>

		</div>
	);

};


LinkedItemsWidget.propTypes = propTypes;
LinkedItemsWidget.defaultProps = defaultProps;

export default LinkedItemsWidget;
