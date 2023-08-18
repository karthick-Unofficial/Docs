import React, { useState, Fragment } from "react";
import ErrorBoundary from "orion-components/ErrorBoundary";
import { ContextPanel } from "orion-components/ContextPanel";
import EntityCollection from "./EntityCollection/EntityCollection";
import SearchResults from "./SearchResults/SearchResults";
import { EventCard } from "orion-components/Events";
import { AccessPointProfile, CameraProfile, EntityProfile, EventProfile, FacilityProfile, GISProfile, RobotProfile } from "orion-components/Profiles";
import HiddenEntityDialog from "./components/HiddenEntityDialog";
import {
	SearchField,
	Collection,
	TabPanel
} from "orion-components/CBComponents";
// TODO: Update to most recent Material UI Tabs
import { makeStyles } from "@mui/styles";
import { Tabs, Tab, Typography, List, CircularProgress, Button } from "@mui/material";
import { Event, Search, Satellite } from "@mui/icons-material";
import { Translate, getTranslation } from "orion-components/i18n";

import {
	collectionsSelector,
	activeOwnedEventsSelector,
	activeSharedEventsSelector,
	userExclusionSelector
} from "orion-components/GlobalData/Selectors";
import { listPanelState } from "orion-components/ContextPanel/Selectors";
import {
	selectedContextSelector,
	selectedEntityState
} from "orion-components/ContextPanel/Selectors";

import { getDir } from "orion-components/i18n/Config/selector";
import { useDispatch, useSelector } from "react-redux";

import {
	openPrimary,
	clearMapFilters,
	unignoreEntities
} from "./listPanelActions";
import { appData } from "../shared/utility/utilities";
import { makeGetPinnedItems } from "orion-components/GlobalData/Selectors";
import * as accessPointProfileActions from "./AccessPointProfile/AccessPointProfileActions";
import * as gisProfileActionCreators from "./GISProfile/gisProfileActions";
import * as cameraProfileActionCreators from "./CameraProfile/cameraProfileActions";
import * as entityProfileActionCreators from "./EntityProfile/entityProfileActions";
import * as eventCardActionCreators from "./EventCard/eventCardActions";
import * as eventProfileActionCreators from "./EventProfile/eventProfileActions";
import * as pinnedItemsActions from "./EventProfile/actions/pinned-items-dialog-actions";
import * as facilityProfileActionCreators from "./FacilityProfile/facilityProfileActions";
import * as robotProfileActionCreators from "./RobotProfile/robotProfileActions";

import size from "lodash/size";
import map from "lodash/map";
import orderBy from "lodash/orderBy";
import filter from "lodash/filter";

const useStyles = makeStyles({
	selected: {
		color: "#fff!important",
		opacity: 1
	}
});

const ListPanel = (props) => {
	const dispatch = useDispatch();

	const classes = useStyles();

	const user = useSelector(state => state.session.user.profile);
	const collections = useSelector(state => collectionsSelector(state));
	const profileMode = useSelector(state => selectedEntityState(state)
		? selectedEntityState(state).type
		: null);
	const profileLoaded = useSelector(state =>
		!state.appState.loading.profileLoading &&
		Boolean(selectedContextSelector(state)));
	const context = useSelector(state => selectedContextSelector(state));
	const drawingToolsActive = useSelector(state => state.mapState.mapTools.type === "drawing");
	const ownedEvents = useSelector(state => activeOwnedEventsSelector(state));
	const sharedEvents = useSelector(state => activeSharedEventsSelector(state));
	const exclusions = useSelector(state => userExclusionSelector(state));
	const filterCount = useSelector(state => size(listPanelState(state).mapFilters));
	const WavCamOpen = useSelector(state => state.appState.dock.dockData.WavCam);
	const dir = useSelector(state => getDir(state));
	const getPinnedItems = makeGetPinnedItems();

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

	const handleTabSelect = (event, tab) => {
		setTab(tab);
		dispatch(openPrimary());
	};

	const toggleExclusionDialog = () => {
		setExclusionDialogOpen(!exclusionDialogOpen);
	};

	const renderProfile = (mode, context) => {
		switch (mode) {
			case "camera":
				return (
					<ErrorBoundary>
						<CameraProfile
							{...cameraProfileActionCreators}
							collections={collections}
							widgetsExpandable={false}
							widgetsLaunchable={true}
							floorPlansWithFacFeed={true}
							mapstatus={true}
							appData={appData} />
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
							{...entityProfileActionCreators}
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
							{...accessPointProfileActions}
							collections={collections}
							widgetsExpandable={false}
							widgetsLaunchable={true}
							floorPlansWithFacFeed={true}
							appData={appData}
						/>
					</ErrorBoundary>
				);

			case "track":
				if (context.entity && context.entity.entityData && context.entity.entityData.properties && context.entity.entityData.properties.type === "Robot Track") {
					return (
						<ErrorBoundary>
							<RobotProfile
								{...robotProfileActionCreators}
								collections={collections}
								widgetsLaunchable={true}
								appData={appData}
							/>
						</ErrorBoundary>
					);
				}
				else {
					return (
						<ErrorBoundary>
							<EntityProfile
								{...entityProfileActionCreators}
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
						<GISProfile {...gisProfileActionCreators} />
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
							appData={appData} />
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
		<Event onClick={(e) => handleTabSelect(e, "events")} />,
		<Search onClick={(e) => handleTabSelect(e, "search")} />
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
								style={{ paddingTop: "1rem", height: `calc(100vh - ${WavCamOpen ? "430px " : "190px"})` }}
								className={dir == "rtl" ? "dockItemsRTL scrollbar" : "dockItems scrollbar"}
							>
								<Typography variant="h6"><Translate value="listPanel.listPanel.myCollections" /></Typography>
								<List className="customList">
									<EntityCollection
										key="shared-items"
										id="shared"
										collection={{ id: "shared", name: getTranslation("listPanel.entityCollection.sharedWithMe") }}
										search={search["collections"] || ""}
									/>
									{collections
										.filter(collection => collection.isOwner)
										.map(collection => (
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
											.filter(collection => !collection.isOwner)
											.map(collection => (
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
				</TabPanel>
				{canViewEvents && (
					<TabPanel value={"events"} selectedTab={tab}>
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
									<List className="customList">
										{map(
											orderBy(
												filter(ownedEvents, event => {
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
														<EventCard
															{...eventCardActionCreators}
															event={event}
															key={id}
															id={id}
															getPinnedItems={getPinnedItems}
															profileIconTemplate={true}
														/>
													</ErrorBoundary>
												);
											}
										)}
									</List>
									<Typography variant="h6">
										<Translate value="listPanel.listPanel.eventsShared" />
									</Typography>
									<List className="customList">
										{map(
											orderBy(
												filter(sharedEvents, event => {
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
														<EventCard
															{...eventCardActionCreators}
															event={event}
															key={id}
															id={id}
															getPinnedItems={getPinnedItems}
															profileIconTemplate={true}
														/>
													</ErrorBoundary>
												);
											}
										)}
									</List>
								</ErrorBoundary>
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
								style={{ paddingTop: "1rem", height: `calc(100vh - ${WavCamOpen ? "430px " : "190px"})` }}
								className={dir == "rtl" ? "dockItemsRTL scrollbar" : "dockItems scrollbar"}
							>
								{Boolean(search["search"]) && (
									<SearchResults
										searchTerms={search["search"] || ""}
									/>
								)}
							</div>
						</Fragment>
					)}
				</TabPanel>
			</div>
			{
				profileLoaded ? (
					renderProfile(profileMode, context)
				) : (
					<div style={progressStyle.outer}>
						<CircularProgress size={200} />
					</div>
				)
			}
		</ContextPanel >
	);
};

export default ListPanel;
