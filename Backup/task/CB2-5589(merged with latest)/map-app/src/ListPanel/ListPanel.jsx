import React, { useState, Fragment } from "react";
import ErrorBoundary from "orion-components/ErrorBoundary";
import { ContextPanel } from "orion-components/ContextPanel";
import EntityCollection from "./EntityCollection/EntityCollection";
import SearchResults from "./SearchResults/SearchResults";
import { EventCard } from "orion-components/Events";
import {
	AccessPointProfile,
	CameraProfile,
	EntityProfile,
	EventProfile,
	FacilityProfile,
	GISProfile,
	RobotProfile
} from "orion-components/Profiles";
import HiddenEntityDialog from "./components/HiddenEntityDialog";
import { SearchField, Collection, TabPanel } from "orion-components/CBComponents";
// TODO: Update to most recent Material UI Tabs
import { makeStyles } from "@mui/styles";
import { Tabs, Tab, Typography, List, CircularProgress, Button, Checkbox, FormControlLabel } from "@mui/material";
import { Event, Search } from "@mui/icons-material";
import { Translate, getTranslation } from "orion-components/i18n";

import {
	collectionsSelector,
	userExclusionSelector,
	activeEventsSelector,
	closedEventsSelector,
	scheduledEventsSelector
} from "orion-components/GlobalData/Selectors";
import { listPanelState } from "orion-components/ContextPanel/Selectors";
import { selectedContextSelector, selectedEntityState } from "orion-components/ContextPanel/Selectors";

import { getDir } from "orion-components/i18n/Config/selector";
import { useDispatch, useSelector } from "react-redux";

import { openPrimary, clearMapFilters, unignoreEntities, updateCamera } from "./listPanelActions";
import { appData } from "../shared/utility/utilities";
import * as eventCardActionCreators from "./EventCard/eventCardActions";
import * as eventProfileActionCreators from "./EventProfile/eventProfileActions";
import * as pinnedItemsActions from "./EventProfile/actions/pinned-items-dialog-actions";
import * as facilityProfileActionCreators from "./FacilityProfile/facilityProfileActions";
import { addToCollection, addAllToMyItems, removeFromMyItems } from "./EntityCollection/entityCollectionActions";
import { updateEventSearch } from "orion-components/ContextPanel/Actions";

import size from "lodash/size";
import map from "lodash/map";
import orderBy from "lodash/orderBy";
import filter from "lodash/filter";

const useStyles = makeStyles({
	selected: {
		color: "#fff!important",
		opacity: 1
	},
	formControlLabel: {
		display: "inherit!important",
		margin: 0,
		height: "24px"
	},
	label: {
		fontSize: 13,
		color: "#828283",
		lineHeight: "13px",
		letterSpacing: 0
	}
});

const ListPanel = () => {
	const dispatch = useDispatch();

	const classes = useStyles();

	const user = useSelector((state) => state.session.user.profile);
	const collections = useSelector((state) => collectionsSelector(state));
	const profileMode = useSelector((state) => (selectedEntityState(state) ? selectedEntityState(state).type : null));
	const profileLoaded = useSelector(
		(state) => !state.appState.loading.profileLoading && Boolean(selectedContextSelector(state))
	);
	const context = useSelector((state) => selectedContextSelector(state));
	const drawingToolsActive = useSelector((state) => state.mapState.mapTools.type === "drawing");
	const activeEvents = useSelector((state) => activeEventsSelector(state));
	const closedEvents = useSelector((state) => closedEventsSelector(state));
	const scheduledEvents = useSelector((state) => scheduledEventsSelector(state));
	const exclusions = useSelector((state) => userExclusionSelector(state));
	const filterCount = useSelector((state) => size(listPanelState(state).mapFilters));
	const WavCamOpen = useSelector((state) => state.appState.dock.dockData.WavCam);
	const dir = useSelector((state) => getDir(state));

	const [search, setSearch] = useState({});
	const [tab, setTab] = useState("collections");
	const [exclusionDialogOpen, setExclusionDialogOpen] = useState(false);
	const [eventFilters, setEventFilters] = useState([
		{ name: "active", checked: true },
		{ name: "scheduled", checked: true },
		{ name: "closed", checked: true }
	]);

	const handleSearch = (event) => {
		const { value } = event.target;
		setSearch({
			...search,
			[tab]: value.toLowerCase()
		});
		if (tab === "events")
			dispatch(updateEventSearch(value));
	};

	const handleClearSearch = () => {
		setSearch({
			...search,
			[tab]: ""
		});
		if (tab === "events")
			dispatch(updateEventSearch(""));
	};

	const handleTabSelect = (event, tab) => {
		setTab(tab);
		dispatch(openPrimary());
	};

	const toggleExclusionDialog = () => {
		setExclusionDialogOpen(!exclusionDialogOpen);
	};

	const renderProfile = (mode, context) => {
		// cSpell:ignore mapstatus
		switch (mode) {
			case "camera":
				return (
					<ErrorBoundary>
						<CameraProfile
							selectFloorPlan={facilityProfileActionCreators.selectFloorPlan}
							collections={collections}
							widgetsExpandable={false}
							widgetsLaunchable={true}
							floorPlansWithFacFeed={true}
							mapstatus={true}
							appData={appData}
							updateCamera={updateCamera}
						/>
					</ErrorBoundary>
				);
			case "facility":
				return (
					<ErrorBoundary>
						<FacilityProfile
							{...facilityProfileActionCreators}
							actionOptions={["hide"]}
							widgetsLaunchable={true}
							appData={appData}
						/>
					</ErrorBoundary>
				);
			case "shapes":
				return (
					<ErrorBoundary>
						<EntityProfile
							selectFloorPlan={facilityProfileActionCreators.selectFloorPlan}
							collections={collections}
							widgetsLaunchable={true}
							floorPlansWithFacFeed={true}
							mapstatus={true}
							appData={appData}
						/>
					</ErrorBoundary>
				);

			case "accessPoint":
				return (
					<ErrorBoundary>
						<AccessPointProfile
							selectFloorPlan={facilityProfileActionCreators.selectFloorPlan}
							collections={collections}
							widgetsExpandable={false}
							widgetsLaunchable={true}
							floorPlansWithFacFeed={true}
							appData={appData}
						/>
					</ErrorBoundary>
				);

			case "track":
				if (
					context.entity &&
					context.entity.entityData &&
					context.entity.entityData.properties &&
					context.entity.entityData.properties.type === "Robot Track"
				) {
					return (
						<ErrorBoundary>
							<RobotProfile
								addToCollection={addToCollection}
								addAllToMyItems={addAllToMyItems}
								removeFromMyItems={removeFromMyItems}
								collections={collections}
								widgetsLaunchable={true}
								appData={appData}
							/>
						</ErrorBoundary>
					);
				} else {
					return (
						<ErrorBoundary>
							<EntityProfile
								selectFloorPlan={facilityProfileActionCreators.selectFloorPlan}
								collections={collections}
								widgetsLaunchable={true}
								floorPlansWithFacFeed={true}
								mapstatus={true}
								appData={appData}
							/>
						</ErrorBoundary>
					);
				}

			case "gis":
				return (
					<ErrorBoundary>
						<GISProfile />
					</ErrorBoundary>
				);

			case "event":
				return (
					<ErrorBoundary>
						<EventProfile
							{...eventProfileActionCreators}
							{...pinnedItemsActions}
							widgetsLaunchable={true}
							floorPlansWithFacFeed={true}
							appData={appData}
						/>
					</ErrorBoundary>
				);

			default:
				break;
		}
	};

	let canViewEvents = false;
	user.applications.forEach((app) => {
		if (app.appId === "events-app") {
			return (canViewEvents = true);
		}
	});

	const panelActions = [
		// <Satellite onClick={() => this.handleTabSelect("gis")} />,
		<Event onClick={(e) => handleTabSelect(e, "events")} key="events-action-button" />,
		<Search onClick={(e) => handleTabSelect(e, "search")} key="search-action-button" />
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
			...(dir === "rtl" && { marginLeft: 6 }),
			...(dir === "ltr" && { marginRight: 6 })
		},
		contentContainerStyleRTL: {
			backgroundColor: "transparent",
			marginLeft: 16,
			width: "100%"
		},
		tabStyle: {
			color: "#fff!important",
			opacity: 0.7,
			width: "33.3%",
			fontSize: 14,
			letterSpacing: "normal",
			padding: 0,
			"&:hover": {
				opacity: 1
			}
		},
		checkBoxRoot: {
			padding: "0px",
			...(dir === "rtl" && { marginLeft: "5px" }),
			...(dir === "ltr" && { marginRight: "5px" })
		},
		formControlLabel: {
			...(dir === "rtl" && { marginLeft: "20px" }),
			...(dir === "ltr" && { marginRight: "20px" })
		},
		eventIcon: {
			flexDirection: "column",
			alignItems: "center",
			...(dir === "ltr" && { marginRight: 12 }),
			...(dir === "rtl" && { marginLeft: 12 })
		}
	};

	const handleEventFilter = (name) => {
		const update = eventFilters.filter((filter) => {
			if (name === filter.name) {
				filter.checked = !filter.checked
			}
			return filter;
		});
		setEventFilters(update);
	};

	const activeEnabled = eventFilters.find(filter => filter.name === "active" && filter.checked);
	const scheduledEnabled = eventFilters.find(filter => filter.name === "scheduled" && filter.checked);
	const closedEnabled = eventFilters.find(filter => filter.name === "closed" && filter.checked);

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
					TabIndicatorProps={{
						sx: {
							backgroundColor: "rgb(53, 183, 243)"
						}
					}}
					onChange={handleTabSelect}
				>
					<Tab
						label={getTranslation("listPanel.listPanel.tabLabel.collections")}
						value="collections"
						sx={styles.tabStyle}
						classes={{ selected: classes.selected }}
					/>
					<Tab
						label={getTranslation("listPanel.listPanel.tabLabel.events")}
						value="events"
						sx={styles.tabStyle}
						classes={{ selected: classes.selected }}
					/>
					<Tab
						label={getTranslation("listPanel.listPanel.tabLabel.search")}
						value="search"
						sx={styles.tabStyle}
						classes={{ selected: classes.selected }}
					/>
				</Tabs>
				<TabPanel value={"collections"} selectedTab={tab}>
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
								style={{
									paddingTop: "1rem",
									height: `calc(100vh - ${WavCamOpen ? "430px " : "190px"})`
								}}
								className={dir == "rtl" ? "dockItemsRTL scrollbar" : "dockItems scrollbar"}
							>
								<Typography variant="h6">
									<Translate value="listPanel.listPanel.myCollections" />
								</Typography>
								<List className="customList">
									<EntityCollection
										key="shared-items"
										id="shared"
										collection={{
											id: "shared",
											name: getTranslation("listPanel.entityCollection.sharedWithMe")
										}}
										search={search["collections"] || ""}
									/>
									{collections
										.filter((collection) => collection.isOwner)
										.map((collection) => (
											<ErrorBoundary key={collection.id}>
												<EntityCollection
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
									<List className="customList">
										{collections
											.filter((collection) => !collection.isOwner)
											.map((collection) => (
												<ErrorBoundary key={collection.id}>
													<EntityCollection
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
										<List className="customList">
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
																style={styles.text}
																disableRipple
															>
																<Translate value="listPanel.listPanel.manageBtn" />
															</Button>
															{exclusions.length === 1
																? getTranslation("listPanel.listPanel.item")
																: getTranslation(
																	"listPanel.listPanel.items",
																	exclusions.length
																)}
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
				</TabPanel>
				{canViewEvents && (
					<TabPanel value={"events"} selectedTab={tab}>
						<div style={{ display: "flex", marginTop: 20 }}>
							{eventFilters.map((filter, index) => {
								return <FormControlLabel
									className="eventFilterCheckbox"
									key={index}
									control={<Checkbox
										onChange={() => handleEventFilter(filter.name)}
										sx={styles.checkBoxRoot}
										checked={filter.checked}
									/>}
									label={getTranslation(`listPanel.listPanel.eventFilters.${filter.name}`)}
									classes={{ root: classes.formControlLabel, label: classes.label }}
									style={styles.formControlLabel}
								/>
							})}
						</div>
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
								style={{
									paddingTop: "1rem",
									height: `calc(100vh - ${WavCamOpen ? "430px " : "200px"})`
								}}
								className={dir == "rtl" ? "dockItemsRTL scrollbar" : "dockItems scrollbar"}
							>
								{activeEnabled && <section style={{ marginBottom: 20 }}>
									<Typography variant="h6" style={{ marginBottom: 5 }}>
										<Translate value="listPanel.listPanel.eventFilters.active" />
									</Typography>
									{activeEvents && size(activeEvents) > 0 ?
										<ErrorBoundary key="active-events">
											<List className="customList">
												{map(
													orderBy(
														filter(activeEvents, (event) => {
															const { name, desc, id } = event;
															return `${name}|${desc}|${id}`
																.toLowerCase()
																.includes(
																	search["events"] ||
																	""
																);
														}),
														"startDate",
														"desc"
													),
													(event) => {
														const { id } = event;
														return (
															<ErrorBoundary key={id}>
																<EventCard
																	{...eventCardActionCreators}
																	event={event}
																	key={id}
																	id={id}
																	filterType={"active"}
																	eventIconStyles={styles.eventIcon}
																/>
															</ErrorBoundary>
														);
													}
												)}
											</List>
										</ErrorBoundary>
										:
										<Typography style={{ opacity: "0.5" }}>
											<Translate value={search["events"] ? "listPanel.listPanel.eventFilters.noResults" : "listPanel.listPanel.eventFilters.noActive"} />
										</Typography>
									}
								</section>
								}
								{scheduledEnabled && <section style={{ marginBottom: 20 }}>
									<Typography variant="h6">
										<Translate value="listPanel.listPanel.eventFilters.scheduled" />
									</Typography>
									{scheduledEvents && size(scheduledEvents) > 0 ?
										<ErrorBoundary key="active-events">
											<List className="customList">
												{map(
													orderBy(
														filter(scheduledEvents, (event) => {
															const { name, desc, id } = event;
															return `${name}|${desc}|${id}`
																.toLowerCase()
																.includes(
																	search["events"] ||
																	""
																);
														}),
														"startDate",
														"desc"
													),
													(event) => {
														const { id } = event;
														return (
															<ErrorBoundary key={id}>
																<EventCard
																	{...eventCardActionCreators}
																	event={event}
																	key={id}
																	id={id}
																	filterType={"scheduled"}
																	eventIconStyles={styles.eventIcon}
																	targetingEnabled={false}
																/>
															</ErrorBoundary>
														);
													}
												)}
											</List>
										</ErrorBoundary>
										:
										<Typography style={{ opacity: "0.5" }}>
											<Translate value={search["events"] ? "listPanel.listPanel.eventFilters.noResults" : "listPanel.listPanel.eventFilters.noScheduled"} />
										</Typography>
									}
								</section>}
								{closedEnabled && <section style={{ marginBottom: 20 }}>
									<Typography variant="h6">
										<Translate value="listPanel.listPanel.eventFilters.closed" />
									</Typography>
									{closedEvents && size(closedEvents) > 0 ?
										<ErrorBoundary key="active-events">
											<List className="customList">
												{map(
													orderBy(
														filter(closedEvents, (event) => {
															const { name, desc, id } = event;
															return `${name}|${desc}|${id}`
																.toLowerCase()
																.includes(
																	search["events"] ||
																	""
																);
														}),
														"endDate",
														"asc"
													),
													(event) => {
														const { id } = event;
														return (
															<ErrorBoundary key={id}>
																<EventCard
																	{...eventCardActionCreators}
																	event={event}
																	key={id}
																	id={id}
																	filterType={"closed"}
																	eventIconStyles={styles.eventIcon}
																	targetingEnabled={false}
																/>
															</ErrorBoundary>
														);
													}
												)}
											</List>
										</ErrorBoundary>
										:
										<Typography style={{ opacity: "0.5" }}>
											<Translate value={search["events"] ? "listPanel.listPanel.eventFilters.noResults" : "listPanel.listPanel.eventFilters.noClosed"} />
										</Typography>
									}
								</section>}
							</div>
						)}
					</TabPanel>
				)}
				<TabPanel value={"search"} selectedTab={tab}>
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
								style={{
									paddingTop: "1rem",
									height: `calc(100vh - ${WavCamOpen ? "430px " : "190px"})`
								}}
								className={dir == "rtl" ? "dockItemsRTL scrollbar" : "dockItems scrollbar"}
							>
								{Boolean(search["search"]) && <SearchResults searchTerms={search["search"] || ""} />}
							</div>
						</Fragment>
					)}
				</TabPanel>
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
