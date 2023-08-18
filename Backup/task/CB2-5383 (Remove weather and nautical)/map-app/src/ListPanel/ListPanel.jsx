import React, { useState, Fragment } from "react";
import ErrorBoundary from "orion-components/ErrorBoundary";
import { ContextPanel } from "orion-components/ContextPanel";
import EntityCollectionContainer from "./EntityCollection/EntityCollectionContainer";
import SearchResultsContainer from "./SearchResults/SearchResultsContainer";
import EntityProfileContainer from "./EntityProfile/EntityProfileContainer";
import RobotProfileContainer from "./RobotProfile/RobotProfileContainer";
import GISProfileContainer from "./GISProfile/GISProfileContainer";
import FacilityProfileContainer from "./FacilityProfile/FacilityProfileContainer";
import EventCardContainer from "./EventCard/EventCardContainer";
import EventProfileContainer from "./EventProfile/EventProfileContainer";
import CameraProfileContainer from "./CameraProfile/CameraProfileContainer";
import AccessPointProfileContainer from "./AccessPointProfile/AccessPointProfileContainer";
import HiddenEntityDialog from "./components/HiddenEntityDialog";
import {
	SearchField,
	Collection,
	Dialog
} from "orion-components/CBComponents";
// TODO: Update to most recent Material UI Tabs
import { Tabs, Tab } from "material-ui/Tabs";
import { Typography, List, CircularProgress, Button } from "@material-ui/core";
import { Event, Search, Satellite } from "@material-ui/icons";
import _ from "lodash";
import { Translate, getTranslation } from "orion-components/i18n/I18nContainer";


const styles = {
	contentContainerStyle: {
		backgroundColor: "transparent",
		marginRight: 16,
		width: "100%"
	},
	checkbox: {
		paddingLeft: 6,
		marginBottom: 16,
		width: "auto",
		minWidth: 190
	},
	labelStyle: {
		height: 24,
		lineHeight: 1,
		paddingTop: 5,
		color: "#828283"
	},
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
	contentContainerStyleRTL: {
		backgroundColor: "transparent",
		marginLeft: 16,
		width: "100%"
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

const ListPanel = ({
	openPrimary,
	collections,
	ownedEvents,
	sharedEvents,
	clearMapFilters,
	filterCount,
	profileMode,
	profileLoaded,
	context,
	loadProfile,
	drawingToolsActive,
	user,
	exclusions,
	unignoreEntities,
	WavCamOpen,
	dir
}) => {
	const [search, setSearch] = useState({});
	const [tab, setTab] = useState("collections");
	const [exclusionDialogOpen, setExclusionDialogOpen] = useState(false);

	const handleSearch = event => {
		const { value } = event.target;
		setSearch({
			...search,
			[tab]: value.toLowerCase()
		});
	};

	const handleClearSearch = () => {
		setSearch({
			...search,
			[tab]: ""
		});
	};

	const handleTabSelect = tab => {
		setTab(tab);
		openPrimary();
	};

	const toggleExclusionDialog = () => {
		setExclusionDialogOpen(!exclusionDialogOpen);
	};

	const renderProfile = (mode, context) => {
		switch (mode) {
			case "camera":
				return (
					<ErrorBoundary>
						<CameraProfileContainer collections={collections} />
					</ErrorBoundary>
				);
			case "facility":
				return (
					<ErrorBoundary>
						<FacilityProfileContainer />
					</ErrorBoundary>
				);
			case "shapes":
				return (
					<ErrorBoundary>
						<EntityProfileContainer collections={collections} />
					</ErrorBoundary>
				);

			case "accessPoint":
				return (
					<ErrorBoundary>
						<AccessPointProfileContainer collections={collections} />
					</ErrorBoundary>
				);

			case "track":
				if (context.entity && context.entity.entityData && context.entity.entityData.properties && context.entity.entityData.properties.type === "Robot Track") {
					return (
						<ErrorBoundary>
							<RobotProfileContainer collections={collections} />
						</ErrorBoundary>
					);
				}
				else {
					return (
						<ErrorBoundary>
							<EntityProfileContainer collections={collections} />
						</ErrorBoundary>
					);
				}

			case "gis":
				return (
					<ErrorBoundary>
						<GISProfileContainer />
					</ErrorBoundary>
				);

			case "event":
				return (
					<ErrorBoundary>
						<EventProfileContainer />
					</ErrorBoundary>
				);

			default:
				break;
		}
	};

	let canViewEvents = false;
	user.applications.forEach(app => {
		if (app.appId === "events-app") {
			return canViewEvents = true;
		}
	});

	const panelActions = [
		// <Satellite onClick={() => this.handleTabSelect("gis")} />,
		<Event onClick={() => handleTabSelect("events")} />,
		<Search onClick={() => handleTabSelect("search")} />
	];

	const progressStyle = {
		outer: {
			width: "100%",
			height: "100%",
			display: "flex",
			alignItems: "center",
			justifyContent: "center"
		}
	};

	return (
		<ContextPanel
			className="list-panel"
			secondaryClassName="entity-profile"
			hidden={drawingToolsActive}
			actionButtons={panelActions}
			dir={dir}
		>
			<div className={dir == "rtl" ? "tabWrapperRTL" : "tabWrapper"}>
				<Tabs
					value={tab || 0}
					tabItemContainerStyle={dir == "rtl" ? styles.contentContainerStyleRTL : styles.contentContainerStyle}
					inkBarStyle={dir == "rtl" ? { right: tab == "collections" ? 0 : tab == "events" ? "33.3333%" : "66.6667%", transition: "right 1s cubic-bezier(0.23, 1, 0.32, 1) 0ms" } : {}}
				>
					<Tab
						label={getTranslation("listPanel.listPanel.tabLabel.collections")}
						value="collections"
						onActive={() => handleTabSelect("collections")}
					>
						{tab === "collections" && (
							<Fragment>
								<SearchField
									id="collections-search"
									handleChange={handleSearch}
									handleClear={handleClearSearch}
									placeholder={getTranslation("listPanel.listPanel.placeholder.searchColl")}
									value={search["collections"] || ""}
									filters={filterCount}
									handleClearFilters={clearMapFilters}
									dir={dir}
								/>
								<div
									style={{ paddingTop: "1rem", height: `calc(100vh - ${WavCamOpen ? "430px " : "190px"})` }}
									className={dir == "rtl" ? "dockItemsRTL scrollbar" : "dockItems scrollbar"}
								>
									<Typography variant="h6"><Translate value="listPanel.listPanel.myCollections" /></Typography>
									<List>
										<EntityCollectionContainer
											key="shared-items"
											id="shared"
											collection={{ id: "shared", name: getTranslation("listPanel.entityCollection.sharedWithMe") }}
											search={search["collections"] || ""}
										/>
										{collections
											.filter(collection => collection.isOwner)
											.map(collection => (
												<ErrorBoundary key={collection.id}>
													<EntityCollectionContainer
														collection={collection}
														id={collection.id}
														search={search["collections"] || ""}
													/>
												</ErrorBoundary>
											))}
									</List>
									<Fragment>
										<Typography variant="h6">
											<Translate value="listPanel.listPanel.collectionsShared" />
										</Typography>
										<List>
											{collections
												.filter(collection => !collection.isOwner)
												.map(collection => (
													<ErrorBoundary key={collection.id}>
														<EntityCollectionContainer
															collection={collection}
															id={collection.id}
															search={search["collections"] || ""}
														/>
													</ErrorBoundary>
												))}
										</List>
									</Fragment>
									{exclusions.length && !search["collections"] ? (
										<Fragment>
											<Typography variant="h6">
												<Translate value="listPanel.listPanel.hiddenItems" />
											</Typography>
											<List>
												<ErrorBoundary key={"hidden-items"}>
													<Collection
														primaryText={getTranslation("listPanel.listPanel.hiddenItems")}
														secondaryText={
															<Fragment>
																<Button
																	onClick={toggleExclusionDialog}
																	size="small"
																	variant="text"
																	color="primary"
																	style={dir == "rtl" ? styles.textRTL : styles.text}
																	disableRipple
																>
																	<Translate value="listPanel.listPanel.manageBtn" />
																</Button>
																{exclusions.length === 1 ? getTranslation("listPanel.listPanel.item") : getTranslation("listPanel.listPanel.items", exclusions.length)}
															</Fragment>
														}
														dir={dir}
													/>
												</ErrorBoundary>
											</List>
											<HiddenEntityDialog
												open={exclusionDialogOpen}
												toggleDialog={toggleExclusionDialog}
												exclusions={exclusions}
												unignoreEntities={unignoreEntities}
												dir={dir}
											/>
										</Fragment>
									) : null}
								</div>
							</Fragment>
						)}
					</Tab>
					{canViewEvents && (
						<Tab
							label={getTranslation("listPanel.listPanel.tabLabel.events")}
							value="events"
							onActive={() => handleTabSelect("events")}
						>
							<SearchField
								id="events-search"
								handleChange={handleSearch}
								handleClear={handleClearSearch}
								placeholder={getTranslation("listPanel.listPanel.placeholder.searchEvents")}
								value={search["events"] || ""}
								dir={dir}
							/>
							{tab === "events" && (
								<div
									style={{ paddingTop: "1rem", height: `calc(100vh - ${WavCamOpen ? "430px " : "190px"})` }}
									className={dir == "rtl" ? "dockItemsRTL scrollbar" : "dockItems scrollbar"}
								>
									<Typography variant="h6"><Translate value="listPanel.listPanel.myEvents" /></Typography>
									<ErrorBoundary key="my-events">
										<List>
											{_.map(
												_.orderBy(
													_.filter(ownedEvents, event => {
														const { name, desc, id } = event;
														return `${name}|${desc}|${id}`
															.toLowerCase()
															.includes(search["events"] || "");
													}),
													"startDate",
													"desc"
												),
												event => {
													const { id } = event;
													return (
														<ErrorBoundary key={id}>
															<EventCardContainer
																event={event}
																key={id}
																id={id}
															/>
														</ErrorBoundary>
													);
												}
											)}
										</List>
										<Typography variant="h6">
											<Translate value="listPanel.listPanel.eventsShared" />
										</Typography>
										<List>
											{_.map(
												_.orderBy(
													_.filter(sharedEvents, event => {
														const { name, desc, id } = event;
														return `${name}|${desc}|${id}`
															.toLowerCase()
															.includes(search["events"] || "");
													}),
													"startDate",
													"desc"
												),
												event => {
													const { id } = event;
													return (
														<ErrorBoundary key={id}>
															<EventCardContainer
																event={event}
																key={id}
																id={id}
															/>
														</ErrorBoundary>
													);
												}
											)}
										</List>
									</ErrorBoundary>
								</div>
							)}
						</Tab>
					)}
					<Tab
						label={getTranslation("listPanel.listPanel.tabLabel.search")}
						value="search"
						onActive={() => handleTabSelect("search")}
					>
						{tab === "search" && (
							<Fragment>
								<SearchField
									id="search-all"
									handleChange={handleSearch}
									handleClear={handleClearSearch}
									placeholder={getTranslation("listPanel.listPanel.placeholder.wantToFind")}
									value={search["search"] || ""}
									dir={dir}
								/>
								<div
									style={{ paddingTop: "1rem", height: `calc(100vh - ${WavCamOpen ? "430px " : "190px"})` }}
									className={dir == "rtl" ? "dockItemsRTL scrollbar" : "dockItems scrollbar"}
								>
									{Boolean(search["search"]) && (
										<SearchResultsContainer
											searchTerms={search["search"] || ""}
											loadProfile={loadProfile}
											dir={dir}
										/>
									)}
								</div>
							</Fragment>
						)}
					</Tab>
				</Tabs>
			</div>
			{profileLoaded ? (
				renderProfile(profileMode, context)
			) : (
				<div style={progressStyle.outer}>
					<CircularProgress size={200} />
				</div>
			)}
		</ContextPanel>
	);
};

export default ListPanel;
