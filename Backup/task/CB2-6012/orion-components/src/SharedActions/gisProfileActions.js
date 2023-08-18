import { openSecondary, updateSelectedContext, updateViewingHistory } from "orion-components/ContextPanel/Actions";
import { setSelectedEntity, clearSelectedEntity, setLoading } from "orion-components/AppState/Actions";
import { addContext, subscriptionReceived } from "orion-components/ContextualData/Actions";

export const loadGISProfile = (entity, context = "primary") => {
	return (dispatch, getState) => {
		const state = getState();
		const history = state.userAppState.viewingHistory;

		dispatch(clearSelectedEntity());

		dispatch(openSecondary());

		// Load while subscriptions are being set
		dispatch(setLoading("profile", true));

		Promise.all([
			dispatch(addContext(entity)),
			dispatch(
				setSelectedEntity({
					name: entity.properties.name || entity.properties.state_name || "GIS Feature",
					id: entity.id,
					entityType: "gis-feature"
				})
			)
		])
			.then(() => {
				dispatch(subscriptionReceived(entity.id, null, "entity", "profile"));
			})
			.then(() => {
				dispatch(updateSelectedContext(entity.id, context));

				dispatch(setLoading("profile", false));
			});

		if (history.length < 1 || history[history.length - 1].id !== entity.id) {
			dispatch(
				updateViewingHistory(entity.id, "gis-feature", entity.properties.name || entity.properties.state_name)
			);
		}
	};
};
