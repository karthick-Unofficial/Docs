import { attachmentService, accessPointService } from "client-app-core";

export { linkEntities, unlinkEntities } from "./entityProfileActions";
export {
	addRemoveFromCollections,
	addRemoveFromEvents,
	updateActivityFilters,
	createCollection
} from "./commonActions";

export const attachFilesToAccessPoint = (accessPointId, entityType, files) => {
	return () => {
		attachmentService.uploadFiles(accessPointId, "accessPoint", files, (err, result) => {
			if (err) {
				console.log(err);
			}
			console.log(result);
		});
	};
};

export const updateAccesspoint = (accessPointId, accessPoint) => {
	return () => {
		accessPointService.update(accessPointId, accessPoint, (err, response) => {
			if (err) {
				console.log(err, response);
			}
		});
	};
};
