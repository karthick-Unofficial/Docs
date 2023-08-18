import { shapeService, eventService, restClient } from "client-app-core";
import { createUserFeedback } from "orion-components/Dock/Actions/index.js";
export { createShape, updateShape, setMapTools } from "orion-components/Map/Tools/Actions";

export const createAndPinShape = (eventId, eventName, inScope, entityData) => {
	return (dispatch, getState) => {
		const { orgId } = getState().session.user.profile;

		const { type, name } = entityData.properties;
		const shape = {
			entityData: {
				type,
				...entityData
			},
			inScope: inScope
		};

		// Set correct properties.type for lines, if needed
		if (shape.entityData.properties.type === "LineString") {
			shape.entityData.properties.type = "Line";
		}

		shapeService.create(shape, (err, response) => {
			if (err) {
				console.log(err);
			} else {
				const { id } = response;
				eventService.pinEntities(eventId, [{ id, feedId: `${orgId}_shapes` }], (err) => {
					if (err) {
						console.log(err);
					} else {
						const undoFunc = () => {
							eventService.unpinEntity(eventId, "shapes", id);
							shapeService.delete(id, (err) => {
								if (err) {
									console.log(err);
								}
							});
						};
						dispatch(createUserFeedback(`${name} has been created and pinned to ${eventName}.`, undoFunc));
					}
				});
			}
		});
	};
};

// TODO: Move call to client-app-core
export const mockUpdatePinnedItem = (eventId, entityId) => {
	return () => {
		restClient.exec_put(`/ecosystem/api/events/${entityId}/${eventId}/mock`, (err) => {
			if (err) {
				console.log(err);
			}
		});
	};
};
