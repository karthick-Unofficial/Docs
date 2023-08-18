import * as t from "./actionTypes";

/* Sets the entity to view in the profile
 * This will also control which profile is rendered based on type
 * @param: entity -- an entity object (camera, shape, track, event, etc)
 */
export const setSelectedEntity = (entity) => {
	return {
		type: t.SET_SELECTED_ENTITY,
		payload: {
			id: entity.id,
			name: entity.name || entity.entityData.properties.name,
			// This needs to be amended once its decided how flag that the type is an event
			type: entity.entityType || "event"
		}
	};
};

// Clears selectedEntity from state
export const clearSelectedEntity = () => {
	return {
		type: t.CLEAR_SELECTED_ENTITY
	};
};
