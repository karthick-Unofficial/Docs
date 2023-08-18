import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { FloorPlan } from "orion-components/Map/Layers";
import { shallowEqual, useSelector } from "react-redux";
import {
	primaryContextSelector
} from "orion-components/ContextPanel/Selectors";
import {
	persistedState
} from "orion-components/AppState/Selectors";
import { contextualDataByKey } from "orion-components/ContextualData/Selectors";
import _ from "lodash";

const ActiveFloorPlans = () => {

	const primaryId = useSelector(state => primaryContextSelector(state));
	const contextualData = useSelector(state => state.contextualData);
	const primary = contextualData[primaryId];
	
	let pinnedItems;
	pinnedItems = useSelector(state => primary && primary.entity ? contextualDataByKey(primaryId, "pinnedItems")(state) || [] : []);
	const { selectedFloors } = useSelector(state => persistedState(state));

	const filteredSelectedFloors = {};
	const pinnedItemsById = _.groupBy(pinnedItems, "id");
	if (pinnedItems.length && selectedFloors) {
		Object.keys(selectedFloors).forEach(facilityId => {
			if (pinnedItemsById[facilityId] && selectedFloors[facilityId]) {
				filteredSelectedFloors[facilityId] = selectedFloors[facilityId];
			}
		});
	}
	const SelectedFloors = filteredSelectedFloors;

	return SelectedFloors && Object.keys(SelectedFloors).length ? (
		<Fragment>
			{Object.keys(SelectedFloors).map(facilityId => {
				return (
					<FloorPlan
						key={`selected-floorplan-${SelectedFloors[facilityId].id}`}
						id={SelectedFloors[facilityId].id}
						coordinates={SelectedFloors[facilityId].geometry.coordinates[0]}
						image={`/_download?handle=${SelectedFloors[facilityId].handle}`}
						editing={false}
					/>
				);
			})}
		</Fragment>)
		: null;
};



export default ActiveFloorPlans;
