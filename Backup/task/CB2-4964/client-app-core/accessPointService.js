import { RealtimeClient } from "./RealtimeClient";
import { RestClient } from "./restClient";

export class AccessPointService {
	constructor(options) {
		this._options = options;
		this._restClient = new RestClient();
		this._rc = new RealtimeClient();
	}

	/**
     * Create a facility
     * @param {object} accessPoint -- Facility data. Ex: { name: "Facility 1", description: "Facility in Boston", geometry: { coordinates: [], type: "polygon" } }
     * @param {function} callback 
     */
	create(accessPoint, callback) {
		const url = "/ecosystem/api/accessPoint";
		const body = JSON.stringify({
			accessPoint
		});
		this._restClient.exec_post(url, body, callback);
	}

	/**
     * Update a facility
     * @param {string} facilityId 
     * @param {object} update 
     * @param {function} callback 
     */
	update(facilityId, update, callback) {
		const url = `/ecosystem/api/facilities/${facilityId}`;
		const body = JSON.stringify({
			update
		});
		this._restClient.exec_put(url, body, callback);
	}

	/**
     * Delete a facility
     * @param {string} facilityId 
     * @param {function} callback 
     */
	delete(facilityId, callback) {
		const url = `/ecosystem/api/facilities/${facilityId}`;
		this._restClient.exec_delete(url, callback);
	}

	/**
	 * Get all floor plans for a facility
	 * @param {string} facilityId 
	 * @param {function} callback 
	 */
	getFacilityFloorplans(facilityId, callback) {
		const url = `/ecosystem/api/facilities/${facilityId}/floorplan`;
		this._restClient.exec_get(url, callback);
	}

	getFacility(facilityId, callback) {
		const url = `/ecosystem/api/facilities/facility/${facilityId}`;
		this._restClient.exec_get(url, callback);
	}

	/**
	 * Get a floorPlan by its id
	 * @param {string} floorPlanId
	 * @param {function} callback 
	 */
	getFloorPlan(floorPlanId, callback) {
		const url = `/ecosystem/api/facilities/floorPlan/${floorPlanId}`;
		this._restClient.exec_get(url, callback);
	}

	/**
     * Create a floor plan within the context of a facility
     * @param {string} facilityId 
     * @param {object} floorplan -- Floorplan data. Ex: { name: "Ground Floor", geometry: { coordinates: [], type: "polygon" } }
     * @param {function} callback 
     */
	createFloorplan(facilityId, floorplan, callback) {
		const url = `/ecosystem/api/facilities/${facilityId}/floorplan`;
		const body = JSON.stringify({
			floorplan
		});
		this._restClient.exec_post(url, body, callback);
	}

	/**
	* Delete a floor plan image file if floor plan creation/updating goes wrong
	* @param {string} facilityId
	* @param {object} attachmentId
	* @param {function} callback
	*/
	deleteFloorPlanFile(facilityId, attachmentId, callback) {
		const url = `/ecosystem/api/facilities/${facilityId}/deleteFloorPlanAttachment/${attachmentId}`;
		this._restClient.exec_delete(url, callback);
	}

	/**
     * Update a floor plan
     * @param {string} facilityId 
     * @param {string} floorplanId 
     * @param {object} update 
     * @param {function} callback 
     */
	updateFloorplan(facilityId, floorplanId, update, callback) {
		const url = `/ecosystem/api/facilities/${facilityId}/floorplan/${floorplanId}`;
		const body = JSON.stringify({
			update
		});
		this._restClient.exec_put(url, body, callback);
	}

	/**
	 * Reorder all floor plans on a facility
	 * @param {string} facilityId 
	 * @param {array} floorplans 
	 * @param {function} callback 
	 */
	reorderFloorplans(facilityId, floorplans, callback) {
		const url = `/ecosystem/api/facilities/${facilityId}/reorderFloorplan`;
		const body = JSON.stringify({
			floorplans
		});
		this._restClient.exec_put(url, body, callback);
	}

	/**
     * Delete a floor plan. Also delete any files that are attached to it from Minio as well as attachment tables.
     * @param {string} facilityId 
     * @param {string} floorplanId 
     * @param {function} callback 
     */
	deleteFloorplan(facilityId, floorplanId, callback) {
		const url = `/ecosystem/api/facilities/${facilityId}/floorplan/${floorplanId}`;
		this._restClient.exec_delete(url, callback);
	}

	/**
	 * Get all cameras a user is able to place on a facility's floor plan
	 * @param {function} callback 
	 */
	getCamerasForPlacing(callback) {
		const url = "/ecosystem/api/facilities/floorplanCameras";
		this._restClient.exec_get(url, callback);
	}

	/**
	 * Add a camera to a floorplan
	 * @param {string} facilityId 
	 * @param {string} floorplanId 
	 * @param {string} cameraId 
	 * @param {object} geo -- { coordinates: [], type: "" }
	 * @param {function} callback 
	 */
	addCameraToFloorplan(facilityId, floorplanId, cameraId, geo, callback) {
		const url = `/ecosystem/api/facilities/${facilityId}/floorplan/${floorplanId}/camera/${cameraId}`;
		const body = JSON.stringify({
			geo
		});
		this._restClient.exec_put(url, body, callback);
	}

	/**
     * Stream authorized facilities
     * @param {function} callback 
     */
	streamFacilities(callback) {
		this._rc.subscribe("ecosystem", "/facilities", null, function (msg) {
			const response = JSON.parse(msg);
			if (response) {
				callback(null, response);
			}
		});
	}

	/**
	 * Stream all cameras that have been placed on a specific floor plan
	 * @param {string} facilityId 
	 * @param {string} floorplanId 
	 * @param {function} callback 
	 */
	streamFloorplanCameras(facilityId, floorplanId, callback) {
		const args = {
			"facilityId": facilityId,
			"floorplanId": floorplanId
		};
		return this._rc.subscribe("ecosystem", "/floorplanCameras", args, function (msg) {
			const response = JSON.parse(msg);
			if (response) {
				callback(null, response);
			}
		});
	}
}
