import { shapeService, attachmentService, linkedEntitiesService } from "client-app-core";
import { selectedEntityState } from "orion-components/ContextPanel/Selectors";
import { createUserFeedback } from "orion-components/Dock/actions";
import { loadProfile, closeSecondary } from "orion-components/ContextPanel/Actions";
import { restoreShape } from "orion-components/Map/Tools/Actions";
import { clearSelectedEntity } from "orion-components/AppState/Actions";

export { addRemoveFromCollections, addRemoveFromEvents, createCollection } from "./commonActions";

export const linkEntities = (entity, linkType, added) => {
	return dispatch => {
		for (let i = 0; i < added.length; i++) {
			linkedEntitiesService.create(
				{
					type: linkType,
					entities: [{ id: entity.id, type: entity.entityType }, added[i]]
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

export function shareEntityToOrg(entityId) {
	return dispatch => {
		shapeService.share(entityId, (err, result) => {
			if (err) {
				console.log(err);
			}
		});
	};
}

export function unshareEntityToOrg(entityId) {
	return dispatch => {
		shapeService.unshareEntity(entityId, (err, result) => {
			if (err) {
				console.log(err);
			}
		});
	};
}

export function attachFilesToEntity(entityId, entityType, files) {
	return function (dispatch) {
		attachmentService.uploadFiles(entityId, entityType, files, function (
			err,
			result
		) {
			if (err) {
				console.log(err);
			}
		});
	};
}

export const deleteShape = (id, name, undoing) => {
	return (dispatch, getState) => {
		const state = getState();
		shapeService.delete(id, (err, response) => {
			if (err) {
				console.log(err);
			} else {
				if (!undoing) {
					const undoFunc = () => {
						dispatch(restoreShape(id));
					};
					dispatch(createUserFeedback(name + " has been deleted.", undoFunc));
					if (state.appId && state.appId === "cameras-app") {
						dispatch(closeSecondary());
						dispatch(clearSelectedEntity());
					}
				}
				if (state.appId && state.appId === "events-app") {
					dispatch(
						loadProfile(
							selectedEntityState(state).id,
							selectedEntityState(state).name,
							selectedEntityState(state).entityType,
							"profile"
						)
					);
				}
			}
		});
	};
};