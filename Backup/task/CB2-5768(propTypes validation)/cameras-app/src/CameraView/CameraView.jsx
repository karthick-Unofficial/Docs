import React from "react";

import ErrorBoundary from "orion-components/ErrorBoundary";
import CamerasMap from "../CamerasMap/CamerasMap";
import {
	Activities,
	FileWidget,
	LinkedItemsWidget,
	PhoenixDropzone,
	LiveCameraWidget
} from "orion-components/Profiles/Widgets";

import { Button } from "@mui/material";

import { Translate, getTranslation } from "orion-components/i18n";
import { useDispatch, useSelector } from "react-redux";
import { contextPanelState, primaryContextSelector } from "orion-components/ContextPanel/Selectors";
import { getDir } from "orion-components/i18n/Config/selector";
import { checkPermissionBasedOnFeedId } from "orion-components/Profiles/Selectors";

const CameraView = ({
	attachFilesToCamera,
	openDialog,
	openPinDialog
}) => {
	const dispatch = useDispatch();

	const view = useSelector((state) => state.userAppState.cameraView);
	const contextualData = useSelector((state) => state.contextualData);
	const primaryId = useSelector((state) => primaryContextSelector(state));
	const context = contextualData[primaryId];
	const entity = context?.entity;
	const sidebarOpen = useSelector((state) => state.appState.dock.dockData.isOpen);
	const WavCamOpen = useSelector((state) => state.appState.dock.dockData.WavCam);
	const dir = useSelector((state) => getDir(state));

	let viewWidth;

	const camera = entity;
	const contextId = entity?.id;
	const canAccess = useSelector((state) => checkPermissionBasedOnFeedId(state)(camera?.feedId, "config"));
	const canManageCamera = useSelector((state) => checkPermissionBasedOnFeedId(state)(camera?.feedId, "permissions", "manage"));
	const canControlCamera = useSelector((state) => checkPermissionBasedOnFeedId(state)(camera?.feedId, "permissions", "control"));


	// Set view width based on which panels are open
	useSelector((state) => {
		if (view === "map-view") {
			viewWidth = "full";
		} else if (!contextPanelState(state).primaryOpen) {
			viewWidth = "wide";
		} else if (
			state.appState.contextPanel.contextPanelData.secondaryOpen &&
			state.appState.contextPanel.contextPanelData.secondaryExpanded
		) {
			viewWidth = "secondaryExpanded";
		} else if (contextPanelState(state).secondaryOpen) {
			viewWidth = "narrow";
		} else if (contextPanelState(state).primaryOpen) {
			viewWidth = "normal";
		}
	});

	const getCameraView = (view) => {
		if (view === "map-view") {
			return <CamerasMap />;
		} else if (context) {
			const { attachments, activities, liveCamera, fovItems, fovEvents, linkedEntities } = context;
			const { entityType } = camera;
			switch (view) {
				case "Activity Timeline":
					return (
						activities && (
							<ErrorBoundary>
								<Activities
									expanded={true}
									pageSize={10}
									canManage={canManageCamera}
									activities={activities}
									contextId={contextId}
									subscriberRef="profile"
									entity={camera}
								/>
							</ErrorBoundary>
						)
					);

				case "Files":
					return (
						attachments && (
							<ErrorBoundary>
								<FileWidget
									expanded={true}
									contextId={contextId}
									attachments={attachments}
									canDelete={canManageCamera}
									hasAccess={canAccess}
									subscriberRef="profile"
									entityType={entityType}
								/>
							</ErrorBoundary>
						)
					);

				case "Linked Items":
					return (
						<ErrorBoundary>
							<LinkedItemsWidget
								expanded={true} // for styling differences between profile and expanded widget views
								items={[...(fovItems || []), ...(linkedEntities || [])]}
								events={fovEvents || []}
								entity={camera}
								canLink={canManageCamera}
								contextId={contextId}
								subscriberRef="profile"
							/>
						</ErrorBoundary>
					);

				case "Live Camera":
					return (
						liveCamera && (
							<ErrorBoundary>
								<LiveCameraWidget
									expanded={true} // for styling differences between profile and expanded widget views
									camera={camera}
									sidebarOpen={sidebarOpen}
									canControl={canControlCamera}
									subscriberRef="profile"
								/>
							</ErrorBoundary>
						)
					);

				default:
					break;
			}
		}
	};

	const getViewAction = (view) => {
		switch (view) {
			case "Pinned Items": {
				return canManageCamera ? (
					<div className="widget-option-button">
						<Button variant="text" primary={true} onClick={openPinDialog}>
							{getTranslation("cameraView.pinItem")}
						</Button>
					</div>
				) : null;
			}

			case "Files": {
				return canManageCamera ? (
					<div className="widget-option-button">
						<PhoenixDropzone
							targetEntityId={camera.id}
							targetEntityType={"camera"}
							attachAction={attachFilesToCamera}
						/>
					</div>
				) : null;
			}

			case "Linked Items": {
				return canManageCamera ? (
					<div className="widget-option-button">
						<Button variant="text" onClick={() => dispatch(openDialog("link-entity-dialog"))}>
							{getTranslation("cameraView.linkItems")}
						</Button>
					</div>
				) : null;
			}

			default:
				return;
		}
	};

	const getViewHeaderTranslation = (view) => {
		// cSpell:ignore hrms
		switch (view) {
			case "Pinned Items":
				return "global.profiles.widgets.pinnedItems.main.title";
			case "Files":
				return "global.profiles.widgets.files.title";
			case "Linked Items":
				return "global.profiles.widgets.linkedItems.title";
			case "Activity Timeline":
				return "global.profiles.widgets.activities.main.activityTimeline";
			case "Live Camera":
				return "global.profiles.widgets.liveCam.title";
			case "Notes":
				return "global.profiles.widgets.notes.title";
			case "Resources":
				return "global.profiles.widgets.hrms.resourcesWidget.resources";
			case "Proximity":
				return "global.profiles.widgets.proximity.main.title";
			case "Equipment":
				return "global.profiles.widgets.hrms.equipmentsWidget.equipment";
			case "Event Lists":
				return "global.profiles.widgets.list.main.eventLists";
			default:
				return view;
		}
	};

	const showHeader = view !== "map-view";

	const styles = {
		viewContent: {
			height: `calc(100vh - ${WavCamOpen ? "288px" : "48px"})`,
			...(dir === "rtl" ? { left: 0, right: null } : { left: null, right: 0 })
		}
	};

	return (
		<div style={{ height: `calc(100vh - ${WavCamOpen ? "288px" : "48px"})` }} className="view-wrapper">
			<div style={styles.viewContent} className={`view-content ${viewWidth}`}>
				{camera && view && showHeader && (
					<div className={`view-header cb-font-b1 ${viewWidth}`}>
						<Translate value={getViewHeaderTranslation(view)} />
						{getViewAction(view)}
					</div>
				)}
				{getCameraView(camera ? view : "map-view")}
			</div>
		</div>
	);
};

export default CameraView;
