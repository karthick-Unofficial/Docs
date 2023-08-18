import { shapeService, attachmentService, linkedEntitiesService } from "client-app-core";
// Need to retain the index.js path here to prevent file/folder conflicts when importing
export {
	createUserFeedback,
	closeNotification,
	addCameraToDockMode,
	setCameraPriority,
	removeDockedCameraAndState
} from "orion-components/Dock/Actions/index.js";
export {
	addRemoveFromCollections,
	addRemoveFromEvents,
	setWidgetOrder,
	updateActivityFilters
} from "../CameraProfile/cameraProfileActions";
export {
	addToCollection,
	createCollection,
	addAllToMyItems,
	removeFromMyItems
} from "../EntityCollection/entityCollectionActions";
export { deleteShape } from "orion-components/Map/Tools/Actions";
export { setDrawingMode } from "orion-components/AppState/Actions";
export { loadProfile } from "orion-components/ContextPanel/Actions";
export { openDialog, closeDialog } from "orion-components/AppState/Actions";
export {
	unsubscribeFromFeed,
	startAttachmentStream,
	startActivityStream,
	startCamerasInRangeStream,
	startCameraInRangeVideoStream,
	startTrackHistoryStream,
	startRulesStream,
	removeSubscriber
} from "orion-components/ContextualData/Actions";
export { ignoreEntity } from "orion-components/GlobalData/Actions";

export { setMapTools } from "orion-components/Map/Tools/Actions";

export function shareEntityToOrg(entityId, orgId) {
	return dispatch => {
		shapeService.share(entityId, (err, result) => {
			if (err) {
				console.log(err);
			}
		});
	};
}

export function unshareEntityToOrg(entityId, orgId) {
	return dispatch => {
		shapeService.unshareEntity(entityId, (err, result) => {
			if (err) {
				console.log(err);
			}
		});
	};
}

export function attachFilesToEntity(entityId, entityType, files) {
	return function(dispatch) {
		attachmentService.uploadFiles(entityId, entityType, files, function(
			err,
			result
		) {
			if (err) {
				console.log(err);
			}
		});
	};
}

export const linkEntities = (entity, linkType, added) => {
	return dispatch => {
		for (let i=0; i<added.length; i++) {
			linkedEntitiesService.create(
				{
					type: linkType,
					entities: [{id: entity.id, type: entity.entityType}, added[i]]
				},
				(err, response) => {
					if (err) {
						console.log(err);
					}
				}
			);
		}
	};
};

export const unlinkEntities = (entities, linkType) => {
	return dispatch => {
		linkedEntitiesService.delete(
			entities,
			linkType,
			(err, response) => {
				if (err) {
					console.log(err);
				}
			}
		);
		
	};
};
