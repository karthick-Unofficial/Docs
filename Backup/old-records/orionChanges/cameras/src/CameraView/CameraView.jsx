import React, { PureComponent } from "react";

import ErrorBoundary from "orion-components/ErrorBoundary";
import CamerasMapContainer from "../CamerasMap/CamerasMapContainer";
import { Activities } from "orion-components/Profiles/Widgets";
import { FileWidget } from "orion-components/Profiles/Widgets";
import { LinkedItemsWidget } from "orion-components/Profiles/Widgets";
import { PhoenixDropzone } from "orion-components/Profiles/Widgets";
import { LiveCameraWidget } from "orion-components/Profiles/Widgets";

import { FlatButton } from "material-ui";

import _ from "lodash";
import { Translate } from "orion-components/i18n/I18nContainer";

class CameraView extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {};
	}

	getCameraView = view => {
		const {
			camera,
			activityFilters,
			updateActivityFilters,
			attachmentDeleteOpen,
			attachFilesToCamera,
			dockedCameras,
			sidebarOpen,
			linkEntities,
			unlinkEntities,
			context,
			openDialog,
			closeDialog,
			dialog,
			loadProfile,
			user,
			isPrimary,
			contextId,
			unsubscribeFromFeed,
			feeds,
			dir
		} = this.props;

		if (view === "Map Location and FOV") {
			return <CamerasMapContainer />;
		} else if (context) {
			const { attachments, activities, liveCamera, fovItems, fovEvents, linkedEntities } = context;
			const { entityType } = camera;
			const canManageCamera = user.integrations
				&& user.integrations.find(int => int.intId === camera.feedId)
				&& user.integrations.find(int => int.intId === camera.feedId).permissions
				&& user.integrations.find(int => int.intId === camera.feedId).permissions.includes("manage");
			const canControlCamera = user.integrations
				&& user.integrations.find(int => int.intId === camera.feedId)
				&& user.integrations.find(int => int.intId === camera.feedId).permissions
				&& user.integrations.find(int => int.intId === camera.feedId).permissions.includes("control");
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
									updateActivityFilters={updateActivityFilters}
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
									hasAccess={user
										&& user.integrations
										&& user.integrations.find(int => int.intId === camera.feedId)
										&& user.integrations.find(int => int.intId === camera.feedId).config
										&& user.integrations.find(int => int.intId === camera.feedId).config.canView}
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
								items={[...(fovItems || []), ...(linkedEntities || [])]}
								events={fovEvents || []}
								feeds={feeds}
								entity={camera}
								canLink={
									canManageCamera
								}
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

	getViewAction = view => {
		const {
			user,
			openPinDialog,
			openDialog,
			camera,
			attachFilesToCamera,
			dir
		} = this.props;
		const canContribute = user.integrations
			&& user.integrations.find(int => int.intId === camera.feedId)
			&& user.integrations.find(int => int.intId === camera.feedId).permissions
			&& user.integrations.find(int => int.intId === camera.feedId).permissions.includes("manage");

		switch (view) {
			case "Pinned Items": {
				return canContribute ? (
					<div className="widget-option-button">
						<FlatButton
							label={<Translate value="cameraView.pinItem"/>}
							primary={true}
							onClick={openPinDialog}
						/>
					</div>
				) : (
					null
				);
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
				) : (
					null
				);
			}

			case "Linked Items": {
				return canContribute ? (
					<div className="widget-option-button">
						<FlatButton
							label={<Translate value="cameraView.linkItems"/>}
							primary={true}
							onClick={() => openDialog("link-entity-dialog")}
						/>
					</div>
				) : (
					null
				);
			}

			default:
				return;
		}
	};

	render() {
		const { viewWidth, view, camera, WavCamOpen } = this.props;
		const showHeader = view !== "Map Location and FOV";
		return (
			<div style={{ height: `calc(100vh - ${WavCamOpen ? "288px" : "48px"})` }} className="view-wrapper">
				<div style={{ height: `calc(100vh - ${WavCamOpen ? "288px" : "48px"})`}} className={`view-content ${viewWidth}`}>
					{camera && view && showHeader && (
						<div className={`view-header cb-font-b1 ${viewWidth}`}>
							{view}
							{this.getViewAction(view)}
						</div>
					)}
					{this.getCameraView(camera ? view : <Translate value="cameraView.mapLocation"/>)}
				</div>
			</div>
		);
	}
}

export default CameraView;
