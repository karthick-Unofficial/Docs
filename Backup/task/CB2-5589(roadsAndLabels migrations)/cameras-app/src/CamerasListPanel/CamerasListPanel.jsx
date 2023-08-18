import React, { useEffect, memo } from "react";
import { ContextPanel } from "orion-components/ContextPanel";
import ErrorBoundary from "orion-components/ErrorBoundary";
import { SearchField } from "orion-components/CBComponents";
import CameraCollection from "./CameraCollection/CameraCollection";
import {
	AccessPointProfile,
	CameraProfile,
	EntityProfile,
	EventProfile
} from "orion-components/Profiles";
import AccessPointCollection from "./AccessPointCollection/AccessPointCollection";
import { List, CircularProgress } from "@mui/material";
import { Translate, getTranslation } from "orion-components/i18n";
import { useSelector, useDispatch } from "react-redux";
import {
	clearMapFilters,
	loadProfile,
	setWidgetLaunchData,
	selectWidget,
	updateSearchValue
} from "./camerasListPanelActions";
import { getDir } from "orion-components/i18n/Config/selector";
import {
	selectedContextSelector,
	selectedEntityState,
	listPanelState,
	searchValueSelector
} from "orion-components/ContextPanel/Selectors";
import {
	collectionsSelector,
	feedEntitiesByTypeSelector
} from "orion-components/GlobalData/Selectors";
import * as camerasActions from "./CameraProfile/cameraProfileActions";
import * as entityActions from "./EntityProfile/entityProfileActions";
import * as eventActions from "./EventProfile/eventProfileActions";
import size from "lodash/size";
import filter from "lodash/filter";
import includes from "lodash/includes";
import { appData } from "../shared/utility/utilities";

const CamerasListPanel = () => {
	const dispatch = useDispatch();

	const searchValue = useSelector((state) => searchValueSelector(state));
	const cameras = useSelector((state) =>
		feedEntitiesByTypeSelector("camera")(state)
	);
	const accessPoints = useSelector((state) =>
		feedEntitiesByTypeSelector("accessPoint")(state)
	);
	const collections = useSelector((state) => collectionsSelector(state));
	const filterCount = useSelector((state) =>
		size(listPanelState(state).mapFilters)
	);
	const profileMode = useSelector((state) =>
		selectedEntityState(state) ? selectedEntityState(state).type : null
	);
	const mapTools = useSelector((state) => state.mapState.mapTools);
	const profileLoaded = useSelector(
		(state) =>
			!state.appState.loading.profileLoading &&
			!!selectedContextSelector(state)
	);
	const drawingToolsActive = !!mapTools.type;
	const widgetLaunchData = useSelector(
		(state) => state.userAppState.widgetLaunchData
	);
	const WavCamOpen = useSelector(
		(state) => state.appState.dock.dockData.WavCam
	);
	const dir = useSelector((state) => getDir(state));
	useEffect(() => {
		if (widgetLaunchData) {
			const { entityId, widget } = widgetLaunchData;
			if (entityId) {
				const camera = cameras[entityId];
				if (camera) {
					// -- load profile if entityId is present in widgetLaunchData (passed in through URL)
					dispatch(
						loadProfile(
							camera.id,
							camera.entityData.properties.name
								? camera.entityData.properties.name
								: camera.id,
							camera.entityType,
							"profile",
							"primary"
						)
					);

					// -- remove entityId from widgetLaunchData
					const data = { widget };
					dispatch(setWidgetLaunchData(data));
				} else if (Object.keys(cameras).length > 0) {
					// -- if events list has been populated and no matching entity found, drop launch data
					dispatch(setWidgetLaunchData(null));
				}
			} else if (widget && profileLoaded) {
				// -- load profile if widget is present in widgetLaunchData (passed in through URL) and profile is already loaded
				let selectedWidget = "map-view";
				switch (widget.toLowerCase()) {
					case "linked-items":
						selectedWidget = "Linked Items";
						break;
					case "activity-timeline":
						selectedWidget = "Activity Timeline";
						break;
					case "live-camera":
						selectedWidget = "Live Camera";
						break;
					case "files":
						selectedWidget = "Files";
						break;
					case "pinned-items":
						// selectedWidget = "Pinned Items";
						break;
					case "event-lists":
						// selectedWidget = "Event Lists";
						break;
					case "cameras":
						// selectedWidget = "Cameras";
						break;
					case "secureshare-settings": // cSpell:ignore secureshare
						//selectedWidget = "SecureShare Settings";
						break;
					default:
						break;
				}
				dispatch(selectWidget(selectedWidget));

				// -- remove all data from widgetLaunchData
				dispatch(setWidgetLaunchData(null));
			} else if (!entityId && !widget) {
				// -- empty entityId and widget data, reset widgetLaunchData
				dispatch(setWidgetLaunchData(null));
			}
		}
	}, [widgetLaunchData, profileLoaded, cameras, dispatch]);

	const handleSearch = (event) => {
		const value = event ? event.target.value : "";
		dispatch(updateSearchValue(value));
	};

	const renderProfile = (mode) => {
		// cSpell:ignore launchable
		switch (mode) {
			case "camera":
				return (
					<ErrorBoundary>
						<CameraProfile
							{...camerasActions}
							collections={collections}
							facilityOption={true}
							widgetsExpandable={true}
							widgetsLaunchable={false}
							disabledLinkedItemTypes={["facility"]}
							appData={appData}
						/>
					</ErrorBoundary>
				);

			case "shapes":
			case "track":
				return (
					<ErrorBoundary>
						<EntityProfile
							{...entityActions}
							collections={collections}
							widgetsLaunchable={true}
							appData={appData}
						/>
					</ErrorBoundary>
				);
			case "event":
				return (
					<ErrorBoundary>
						<EventProfile
							{...eventActions}
							widgetsLaunchable={true}
						/>
					</ErrorBoundary>
				);
			case "accessPoint":
				return (
					<ErrorBoundary>
						<AccessPointProfile
							facilityOption={true}
							widgetsExpandable={false}
							widgetsLaunchable={true}
							appData={appData}
						/>
					</ErrorBoundary>
				);

			default:
				break;
		}
	};

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
		<div>
			<ContextPanel
				className="cameras-list-panel"
				secondaryClassName="camera-profile"
				hidden={drawingToolsActive}
				style={{
					height: `calc(100vh - ${WavCamOpen ? "288px" : "48px"})`
				}}
				dir={dir}
			>
				<div
					id="cameras-list-wrapper"
					style={{
						height: `calc(100vh - ${WavCamOpen ? "288px" : "48px"})`
					}}
				>
					<div
						id="cameras-list"
						style={{
							height: `calc(100vh - ${
								WavCamOpen ? "288px" : "48px"
							})`
						}}
					>
						<SearchField
							id="collections-search"
							handleChange={handleSearch}
							handleClear={() => handleSearch("")}
							placeholder={getTranslation(
								"camerasListPanel.placeholder.searchColl"
							)}
							value={searchValue}
							filters={filterCount}
							handleClearFilters={() =>
								dispatch(clearMapFilters())
							}
							dir={dir}
						/>
						{size(cameras) < 1 ? (
							<div className="cb-font-b2 empty-message">
								<Translate value="camerasListPanel.noCamerasAvailable" />
							</div>
						) : (
							<div id="camera-list">
								<section>
									<List>
										<ErrorBoundary>
											<CameraCollection
												collection={{
													id: "all_cameras",
													name: getTranslation(
														"camerasListPanel.allCams"
													)
												}}
												id="all_cameras"
												cameras={Object.keys(cameras)}
												searchValue={searchValue}
											/>
										</ErrorBoundary>
										{size(accessPoints) >= 1 && (
											<ErrorBoundary>
												<AccessPointCollection
													collection={{
														id: "all_accessPoints",
														name: getTranslation(
															"camerasListPanel.allAccessPoints"
														)
													}}
													id="all_accessPoints"
													accessPoints={Object.keys(
														accessPoints
													)}
													searchValue={searchValue}
												/>
											</ErrorBoundary>
										)}
										{collections.map((collection) => {
											const { members, id } = collection;
											const cams = filter(
												members,
												(member) =>
													includes(
														Object.keys(cameras),
														member
													)
											);
											const filtered = cams.length > 0;
											return filtered ? (
												<ErrorBoundary key={id}>
													<CameraCollection
														collection={collection}
														cameras={cams}
														id={id}
														searchValue={
															searchValue
														}
													/>
												</ErrorBoundary>
											) : (
												<div key={id + "_empty"} />
											);
										})}
									</List>
								</section>
							</div>
						)}
					</div>
				</div>
				{profileLoaded ? (
					renderProfile(profileMode)
				) : (
					<div style={progressStyle.outer}>
						<CircularProgress size={200} />
					</div>
				)}
			</ContextPanel>
		</div>
	);
};

export default memo(CamerasListPanel);
