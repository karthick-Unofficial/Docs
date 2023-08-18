import { connect } from "react-redux";
import ActiveFloorPlans from "./ActiveFloorPlans";
import {
	primaryContextSelector
} from "orion-components/ContextPanel/Selectors";
import {
	persistedState
} from "orion-components/AppState/Selectors";
import { contextualDataByKey } from "orion-components/ContextualData/Selectors";
import _ from "lodash";

const mapStateToProps = state => {
	const primaryId = primaryContextSelector(state);
	const { contextualData } = state;
	const primary = contextualData[primaryId];
	let pinnedItems = [];
	if (primary && primary.entity) {
		pinnedItems = contextualDataByKey(primaryId, "pinnedItems")(state) || [];
	}
	const { selectedFloors } = persistedState(state);
	const filteredSelectedFloors = {};
	const pinnedItemsById = _.groupBy(pinnedItems, "id");
	if (pinnedItems.length && selectedFloors) {
		Object.keys(selectedFloors).forEach(facilityId => {
			if (pinnedItemsById[facilityId] && selectedFloors[facilityId]) {
				filteredSelectedFloors[facilityId] = selectedFloors[facilityId];
			}
		});
	}

	return { selectedFloors: filteredSelectedFloors };
};

const ActiveFloorPlansContainer = connect(mapStateToProps)(ActiveFloorPlans);

export default ActiveFloorPlansContainer;
