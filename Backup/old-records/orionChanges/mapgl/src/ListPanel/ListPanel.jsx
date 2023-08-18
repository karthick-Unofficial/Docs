import React, { PureComponent, Fragment } from "react";
import ErrorBoundary from "orion-components/ErrorBoundary";
import { ContextPanel } from "orion-components/ContextPanel";
import EntityCollectionContainer from "./EntityCollection/EntityCollectionContainer";
import SearchResultsContainer from "./SearchResults/SearchResultsContainer";
import EntityProfileContainer from "./EntityProfile/EntityProfileContainer";
import RobotDogProfileContainer from "./RobotDogProfile/RobotDogProfileContainer";
import GISProfileContainer from "./GISProfile/GISProfileContainer";
import FacilityProfileContainer from "./FacilityProfile/FacilityProfileContainer";
import EventCardContainer from "./EventCard/EventCardContainer";
import EventProfileContainer from "./EventProfile/EventProfileContainer";
import CameraProfileContainer from "./CameraProfile/CameraProfileContainer";
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
import { Translate } from "orion-components/i18n/I18nContainer";
import { renderToStaticMarkup } from "react-dom/server";

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

class ListPanel extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			search: {},
			tab: "collections",
			exclusionDialogOpen: false
		};
	}

	handleSearch = event => {
		const { tab, search } = this.state;
		const { value } = event.target;
		this.setState({
			search: {
				...search,
				[tab]: value.toLowerCase()
			}
		});
	};

	handleClearSearch = () => {
		const { tab, search } = this.state;
		this.setState({
			search: {
				...search,
				[tab]: ""
			}
		});
	};

	handleTabSelect = tab => {
		const { openPrimary } = this.props;

		this.setState({
			tab: tab
		});

		openPrimary();
	};

	toggleExclusionDialog = () => {
		const { exclusionDialogOpen } = this.state;

		this.setState({
			exclusionDialogOpen: !exclusionDialogOpen
		});
	}

	renderProfile = (mode, context) => {
		const { collections } = this.props;

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
			case "track":
				if (context.entity && context.entity.entityData && context.entity.entityData.properties && context.entity.entityData.properties.type === "Robot Track") {
					return (
						<ErrorBoundary>
							<RobotDogProfileContainer collections={collections} />
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

	placeholderConverter = (value) => {
		const placeholderTxt = renderToStaticMarkup(<Translate value={value}/>);
		let placeholderString = placeholderTxt.toString().replace(/<\/?[^>]+(>|$)/g, "");
		return placeholderString;
	};

	render() {
		const {
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
		} = this.props;
		const { 
			search, 
			tab, 
			exclusionDialogOpen 
		} = this.state;

		let canViewEvents = false;
		user.applications.forEach(app => {
			if(app.appId === "events-app"){
				return canViewEvents = true;
			}
		});

		const panelActions = [
			// <Satellite onClick={() => this.handleTabSelect("gis")} />,
			<Event onClick={() => this.handleTabSelect("events")} />,
			<Search onClick={() => this.handleTabSelect("search")} />
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
						inkBarStyle= {dir == "rtl" ? {right: tab == "collections" ? 0 : tab == "events" ? "33.3333%" : "66.6667%", transition: "right 1s cubic-bezier(0.23, 1, 0.32, 1) 0ms"} : {}}
					>
						<Tab
							label={<Translate value="listPanel.listPanel.tabLabel.collections"/>}
							value="collections"
							onActive={() => this.handleTabSelect("collections")}
						>
							{tab === "collections" && (
								<Fragment>
									<SearchField
										id="collections-search"
										handleChange={this.handleSearch}
										handleClear={this.handleClearSearch}
										placeholder={this.placeholderConverter("listPanel.listPanel.placeholder.searchColl")}
										value={search["collections"] || ""}
										filters={filterCount}
										handleClearFilters={clearMapFilters}
										dir={dir}
									/>
									<div
										style={{ paddingTop: "1rem", height: `calc(100vh - ${WavCamOpen ? "430px " : "190px"})` }}
										className={dir == "rtl" ? "dockItemsRTL scrollbar" : "dockItems scrollbar"}
									>
										<Typography variant="h6"><Translate value="listPanel.listPanel.myCollections"/></Typography>
										<List>
											<EntityCollectionContainer
												key="shared-items"
												id="shared"
												collection={{ id: "shared", name: <Translate value={"listPanel.entityCollection.sharedWithMe"}/>}}
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
												<Translate value="listPanel.listPanel.collectionsShared"/>
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
													<Translate value="listPanel.listPanel.hiddenItems"/>
												</Typography>
												<List>
													<ErrorBoundary key={"hidden-items"}>
														<Collection
															primaryText={<Translate value="listPanel.listPanel.hiddenItems"/>}
															secondaryText={
																<Fragment>
																	<Button
																		onClick={this.toggleExclusionDialog}
																		size="small"
																		variant="text"
																		color="primary"
																		style={dir == "rtl" ? styles.textRTL : styles.text}
																		disableRipple
																	>
																	<Translate value="listPanel.listPanel.manageBtn"/>
																	</Button>
																	{exclusions.length === 1 ? <Translate value="listPanel.listPanel.item"/> : <Translate value="listPanel.listPanel.items" count={exclusions.length}/>}
																</Fragment>
															}
															dir={dir}
														/>
													</ErrorBoundary>
												</List>
												<HiddenEntityDialog 
													open={exclusionDialogOpen}
													toggleDialog={this.toggleExclusionDialog}
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
								label={<Translate value="listPanel.listPanel.tabLabel.events"/>}
								value="events"
								onActive={() => this.handleTabSelect("events")}
							>
								<SearchField
									id="events-search"
									handleChange={this.handleSearch}
									handleClear={this.handleClearSearch}
									placeholder={this.placeholderConverter("listPanel.listPanel.placeholder.searchEvents")}
									value={search["events"] || ""}
									dir={dir}
								/>
								{tab === "events" && (
									<div
										style={{ paddingTop: "1rem", height: `calc(100vh - ${WavCamOpen ? "430px " : "190px"})` }}
										className={dir == "rtl" ? "dockItemsRTL scrollbar" : "dockItems scrollbar"}
									>
										<Typography variant="h6"><Translate value="listPanel.listPanel.myEvents"/></Typography>
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
												<Translate value="listPanel.listPanel.eventsShared"/>
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
							label={<Translate value="listPanel.listPanel.tabLabel.search"/>}
							value="search"
							onActive={() => this.handleTabSelect("search")}
						>
							{tab === "search" && (
								<Fragment>
									<SearchField
										id="search-all"
										handleChange={this.handleSearch}
										handleClear={this.handleClearSearch}
										placeholder={this.placeholderConverter("listPanel.listPanel.placeholder.wantToFind")}
										value={search["search"] || ""}
										dir={dir}
									/>
									<div
										style={{ paddingTop: "1rem", height: `calc(100vh - ${WavCamOpen ? "430px ": "190px"})`}}
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
					this.renderProfile(profileMode, context)
				) : (
					<div style={progressStyle.outer}>
						<CircularProgress size={200} />
					</div>
				)}
			</ContextPanel>
		);
	}
}

export default ListPanel;
