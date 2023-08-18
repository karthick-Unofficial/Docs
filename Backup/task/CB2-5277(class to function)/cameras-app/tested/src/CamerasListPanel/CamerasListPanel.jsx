import React, { useEffect, memo } from "react";
import { ContextPanel } from "orion-components/ContextPanel";
import ErrorBoundary from "orion-components/ErrorBoundary";
import { SearchField } from "orion-components/CBComponents";
import CameraProfileContainer from "./CameraProfile/CameraProfileContainer";
import EntityProfileContainer from "./EntityProfile/EntityProfileContainer";
import EventProfileContainer from "./EventProfile/EventProfileContainer";
import CameraCollectionContainer from "./CameraCollection/CameraCollectionContainer";
import AccessPointProfileContainer from "./AccessPointProfile/AccessPointProfileContainer";
import AccessPointCollectionContainer from "./AccessPointCollection/AccessPointCollectionContainer";
import { List, CircularProgress } from "@material-ui/core";
import _ from "lodash";
import { Translate, getTranslation } from "orion-components/i18n/I18nContainer";


const CamerasListPanel = ({
	searchValue,
	cameras,
	accessPoints,
	profileMode,
	collections,
	filterCount,
	clearMapFilters,
	profileLoaded,
	drawingToolsActive,
	WavCamOpen,
	dir,
	widgetLaunchData,
	loadProfile,
	setWidgetLaunchData,
	selectWidget,
	updateSearchValue
}) => {

	useEffect(() => {
		if (widgetLaunchData) {
			const { entityId, widget } = widgetLaunchData;
			if (entityId) {
				const camera = cameras[entityId];
				if (camera) {
					// -- load profile if entityId is present in widgetLaunchData (passed in through URL)
					loadProfile(
						camera.id,
						camera.entityData.properties.name ? camera.entityData.properties.name : camera.id,
						camera.entityType,
						"profile",
						"primary"
					);

					// -- remove entityId from widgetLaunchData
					const data = { widget };
					setWidgetLaunchData(data);
				}
				else if (Object.keys(cameras).length > 0) {
					// -- if events list has been populated and no matching entity found, drop launch data
					setWidgetLaunchData(null);
				}
			}
			else if (widget && profileLoaded) {
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
					case "event-lists":
					// selectedWidget = "Event Lists";
					case "cameras":
					// selectedWidget = "Cameras";
					case "live-camera":
					// selectedWidget = "Live Camera";
					case "secureshare-settings":
					//selectedWidget = "SecureShare Settings";
					default:
				}
				selectWidget(selectedWidget);

				// -- remove all data from widgetLaunchData
				setWidgetLaunchData(null);
			}
			else if (!entityId && !widget) {
				// -- empty entityId and widget data, reset widgetLaunchData
				setWidgetLaunchData(null);
			}
		}
	}, [widgetLaunchData, profileLoaded, cameras]);


	const handleSearch = event => {
		const value = event ? event.target.value : "";
		updateSearchValue(value);
	};

	const renderProfile = mode => {
		switch (mode) {
			case "camera":
				return (
					<ErrorBoundary>
						<CameraProfileContainer collections={collections} />
					</ErrorBoundary>
				);

			case "shapes":
			case "track":
				return (
					<ErrorBoundary>
						<EntityProfileContainer collections={collections} />
					</ErrorBoundary>
				);
			case "event":
				return (
					<ErrorBoundary>
						<EventProfileContainer />
					</ErrorBoundary>
				);
			case "accessPoint":
				return (
					<ErrorBoundary>
						<AccessPointProfileContainer />
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
				<div id="cameras-list-wrapper" style={{
					height: `calc(100vh - ${WavCamOpen ? "288px" : "48px"})`
				}}>
					<div id="cameras-list" style={{
						height: `calc(100vh - ${WavCamOpen ? "288px" : "48px"})`
					}}>
						<SearchField
							id="collections-search"
							handleChange={handleSearch}
							handleClear={() => handleSearch("")}
							placeholder={getTranslation("camerasListPanel.placeholder.searchColl")}
							value={searchValue}
							filters={filterCount}
							handleClearFilters={clearMapFilters}
							dir={dir}
						/>
						{_.size(cameras) < 1 ? (
							<div className="cb-font-b2 empty-message">
								<Translate value="camerasListPanel.noCamerasAvailable" />
							</div>
						) : (
							<div id="camera-list">
								<section>
									<List>
										<ErrorBoundary>
											<CameraCollectionContainer
												collection={{
													id: "all_cameras",
													name: getTranslation("camerasListPanel.allCams")
												}}
												id="all_cameras"
												cameras={Object.keys(cameras)}
												searchValue={searchValue}
											/>
										</ErrorBoundary>
										{_.size(accessPoints) >= 1 && (
											<ErrorBoundary>
												<AccessPointCollectionContainer
													collection={{
														id: "all_accessPoints",
														name: getTranslation("camerasListPanel.allAccessPoints")
													}}
													id="all_accessPoints"
													accessPoints={Object.keys(accessPoints)}
													searchValue={searchValue}
												/>
											</ErrorBoundary>
										)}
										{collections.map(collection => {
											const { members, id } = collection;
											const cams = _.filter(members, member =>
												_.includes(Object.keys(cameras), member)
											);
											const filtered = cams.length > 0;
											return filtered ? (
												<ErrorBoundary key={id}>
													<CameraCollectionContainer
														collection={collection}
														cameras={cams}
														id={id}
														searchValue={searchValue}
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
