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

import isObject from "lodash/isObject";
import { Translate, getTranslation } from "orion-components/i18n";
import { useDispatch, useSelector } from "react-redux";
import { persistedState } from "orion-components/AppState/Selectors";
import {
	contextPanelState,
	primaryContextSelector
} from "orion-components/ContextPanel/Selectors";
import { userFeedsSelector } from "orion-components/GlobalData/Selectors";
import { getDir } from "orion-components/i18n/Config/selector";

const CameraView = ({
	updateActivityFilters,
	attachmentDeleteOpen,
	attachFilesToCamera,
	linkEntities,
	unlinkEntities,
	openDialog,
	closeDialog,
	loadProfile,
	unsubscribeFromFeed,
	openPinDialog
}) => {
	const dispatch = useDispatch();

	const user = useSelector((state) => state.session.user.profile);
	const view = useSelector((state) => state.userAppState.cameraView);
	const contextualData = useSelector((state) => state.contextualData);
	const primaryId = useSelector((state) => primaryContextSelector(state));
	const context = contextualData[primaryId];
	const isLoaded = isObject(context) && context.entity;
	const { activityFilters } = useSelector((state) => persistedState(state));
	const dockedCameras = useSelector(
		(state) => state.appState.dock.cameraDock.dockedCameras
	);
	const sidebarOpen = useSelector(
		(state) => state.appState.dock.dockData.isOpen
	);
	const WavCamOpen = useSelector(
		(state) => state.appState.dock.dockData.WavCam
	);
	const dir = useSelector((state) => getDir(state));
	const dialog = useSelector((state) => state.appState.dialog.openDialog);

	let viewWidth;

	const entity = isLoaded && context.entity;
	const camera = isLoaded && entity;
	const contextId = isLoaded && entity.id;
	const isPrimary = useSelector(
		(state) =>
			isLoaded &&
			contextId === contextPanelState(state).selectedContext.primary
	);
	const feeds = useSelector((state) => isLoaded && userFeedsSelector(state));

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
			const {
				attachments,
				activities,
				liveCamera,
				fovItems,
				fovEvents,
				linkedEntities
			} = context;
			const { entityType } = camera;
			const canManageCamera =
				user.integrations &&
				user.integrations.find((int) => int.intId === camera.feedId) &&
				user.integrations.find((int) => int.intId === camera.feedId)
					.permissions &&
				user.integrations
					.find((int) => int.intId === camera.feedId)
					.permissions.includes("manage");
			const canControlCamera =
				user.integrations &&
				user.integrations.find((int) => int.intId === camera.feedId) &&
				user.integrations.find((int) => int.intId === camera.feedId)
					.permissions &&
				user.integrations
					.find((int) => int.intId === camera.feedId)
					.permissions.includes("control");
			switch (view) {
				case "Activity Timeline":
					return (
						activities && (
							<ErrorBoundary>
								<Activities
									expanded={true}
									enabled={true}
									pageSize={10}
									canManage={canManageCamera}
									activities={activities}
									updateActivityFilters={
										updateActivityFilters
									}
									activityFilters={activityFilters}
									unsubscribeFromFeed={unsubscribeFromFeed}
									contextId={contextId}
									subscriberRef="profile"
									openDialog={openDialog}
									closeDialog={closeDialog}
									dialog={dialog}
									entity={camera}
									isPrimary={isPrimary}
									dir={dir}
								/>
							</ErrorBoundary>
						)
					);

				case "Files":
					return (
						attachments && (
							<ErrorBoundary>
								<FileWidget
									id="files"
									expanded={true}
									enabled={true}
									contextId={contextId}
									attachments={attachments}
									deleteOpen={attachmentDeleteOpen}
									canDelete={canManageCamera}
									hasAccess={
										user &&
										user.integrations &&
										user.integrations.find(
											(int) => int.intId === camera.feedId
										) &&
										user.integrations.find(
											(int) => int.intId === camera.feedId
										).config &&
										user.integrations.find(
											(int) => int.intId === camera.feedId
										).config.canView
									}
									attachFiles={attachFilesToCamera}
									openDialog={openDialog}
									closeDialog={closeDialog}
									dialog={dialog}
									unsubscribeFromFeed={unsubscribeFromFeed}
									subscriberRef="profile"
									entityType={entityType}
									dir={dir}
								/>
							</ErrorBoundary>
						)
					);

				case "Linked Items":
					return (
						<ErrorBoundary>
							<LinkedItemsWidget
								expanded={true} // for styling differences between profile and expanded widget views
								enabled={true}
								dialog={dialog}
								openDialog={openDialog}
								closeDialog={closeDialog}
								linkEntities={linkEntities}
								unlinkEntities={unlinkEntities}
								items={[
									...(fovItems || []),
									...(linkedEntities || [])
								]}
								events={fovEvents || []}
								feeds={feeds}
								entity={camera}
								canLink={canManageCamera}
								loadProfile={loadProfile}
								contextId={contextId}
								unsubscribeFromFeed={unsubscribeFromFeed}
								subscriberRef="profile"
								isPrimary={isPrimary}
								dir={dir}
							/>
						</ErrorBoundary>
					);

				case "Live Camera":
					return (
						liveCamera && (
							<ErrorBoundary>
								<LiveCameraWidget
									expanded={true} // for styling differences between profile and expanded widget views
									enabled={true}
									camera={camera}
									dockedCameras={dockedCameras}
									sidebarOpen={sidebarOpen}
									canControl={canControlCamera}
									unsubscribeFromFeed={unsubscribeFromFeed}
									subscriberRef="profile"
									dir={dir}
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
		const canContribute =
			user.integrations &&
			user.integrations.find((int) => int.intId === camera.feedId) &&
			user.integrations.find((int) => int.intId === camera.feedId)
				.permissions &&
			user.integrations
				.find((int) => int.intId === camera.feedId)
				.permissions.includes("manage");

		switch (view) {
			case "Pinned Items": {
				return canContribute ? (
					<div className="widget-option-button">
						<Button
							variant="text"
							primary={true}
							onClick={openPinDialog}
						>
							{getTranslation("cameraView.pinItem")}
						</Button>
					</div>
				) : null;
			}

			case "Files": {
				return canContribute ? (
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
				return canContribute ? (
					<div className="widget-option-button">
						<Button
							variant="text"
							onClick={() =>
								dispatch(openDialog("link-entity-dialog"))
							}
						>
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
			...(dir === "rtl"
				? { left: 0, right: null }
				: { left: null, right: 0 })
		}
	};

	return (
		<div
			style={{ height: `calc(100vh - ${WavCamOpen ? "288px" : "48px"})` }}
			className="view-wrapper"
		>
			<div
				style={styles.viewContent}
				className={`view-content ${viewWidth}`}
			>
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
