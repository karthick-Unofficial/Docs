import {
	attachmentService,
	accessPointService
} from "client-app-core";

export { createCollection } from "./entityCollectionActions";
export { linkEntities, unlinkEntities } from "./entityProfileActions";
export { addRemoveFromCollections, addRemoveFromEvents, setWidgetOrder, updateActivityFilters } from "./commonActions";


export const attachFilesToAccessPoint = (accessPointId, entityType, files) => {
	return dispatch => {
		attachmentService.uploadFiles(accessPointId, "accessPoint", files, (err, result) => {
			if (err) {
				console.log(err);
			}
			console.log(result);
		});
	};
};

export const updateAccesspoint = (accessPointId, accessPoint) => {
	return dispatch => {
		accessPointService.update(accessPointId, accessPoint, (err, response) => {
			if (err) {
				console.log(err);
			}
		});
	};
};