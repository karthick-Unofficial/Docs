import React, { Component } from "react";
import { eventService } from "client-app-core";
import {
	CollectionCard,
	CollectionCardItem
} from "orion-components/CBComponents";
import { IconButton, Button, Typography } from "@material-ui/core";
import Expand from "@material-ui/icons/ZoomOutMap";
import LaunchIcon from "@material-ui/icons/Launch";

import PinnedItemsDialog from "./components/PinnedItemsDialog";
import { Translate } from "orion-components/i18n/I18nContainer";

class PinnedItemsWidget extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentWillUnmount() {
		const {
			contextId,
			subscriberRef,
			isPrimary,
			unsubscribeFromFeed
		} = this.props;

		if (!isPrimary && unsubscribeFromFeed)
			unsubscribeFromFeed(contextId, "pinnedItems", subscriberRef);
	}

	handleOpenDialog = () => {
		this.props.openDialog("pinnedItemDialog");
	};

	handleExpand = () => {
		this.props.selectWidget("Pinned Items");
	};

	handleLaunch = () => {
		const { contextId, entityType } = this.props;

		// -- different actions based on entity type: ["track", "shapes", "event", "camera", "facility"]
		if (entityType === "event") {
			window.open(`/events-app/#/entity/${contextId}/widget/pinned-items`);
		}
	};

	handleUnpin = (itemType, itemId) => {
		const { contextId } = this.props;

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

	handleLoadEntityDetails = item => {
		const { loadProfile } = this.props;
		loadProfile(
			item.id,
			item.entityData.properties.name,
			item.entityType,
			"profile",
			"secondary"
		);
	};

	getCategories = () => {
		const { items, feeds } = this.props;
		const itemIds = items ? items.map(item => item.feedId) : [];
		const categories = feeds
			.filter(feed => itemIds.includes(feed.feedId))
			.map(feed => {
				return { name: feed.name, id: feed.feedId };
			});
		return categories;
	};

	handleExpandCard = id => {
		const { expandedCards } = this.state;
		let updatedCards;
		if (expandedCards.includes(id)) {
			updatedCards = expandedCards.filter(value => value !== id);
		} else {
			updatedCards = [...expandedCards, id];
		}
		this.setState({ expandedCards: updatedCards });
	};

	render() {
		const {
			canManage,
			selected,
			items,
			order,
			event,
			enabled,
			widgetsExpandable,
			widgetsLaunchable,
			dialog,
			closeDialog,
			contextId,
			eventEnded,
			readOnly,
			loadProfile,
			feeds,
			isAlertProfile,
			dir
		} = this.props;
		const categories = this.getCategories();
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
								<Button color="primary" onClick={this.handleOpenDialog}>
									<Translate value="global.profiles.widgets.pinnedItems.main.pinItem" />
								</Button>
							</div>
						)}
						<div className="widget-header-buttons">
							{widgetsExpandable ? (
								<div className="widget-expand-button">
									<IconButton
										style={dir == "rtl" ? { paddingLeft: 0, width: "auto" } : { paddingRight: 0, width: "auto" }}
										onClick={this.handleExpand}
									>
										<Expand />
									</IconButton>
								</div>
							) : null}
							{widgetsLaunchable ? (
								<div className="widget-expand-button">
									<IconButton
										style={dir == "rtl" ? { paddingLeft: 0, width: "auto" } : { paddingRight: 0, width: "auto" }}
										onClick={this.handleLaunch}
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
													feedId={feedId}
													handleClick={
														loadProfile
															? () => this.handleLoadEntityDetails(item)
															: null
													}
													handleRemove={() => this.handleUnpin(entityType, id)}
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
	}
}

export default PinnedItemsWidget;
