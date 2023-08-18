import React, { Fragment } from "react";
import { ShapeEdit } from "orion-components/SharedComponents";
import { useDispatch, useSelector } from "react-redux";
import { updateShape, setMapTools, createAndPinShape, mockUpdatePinnedItem } from "./shapePanelActions.js";
import { primaryContextSelector, selectedContextSelector } from "orion-components/ContextPanel/Selectors";
import { getDir } from "orion-components/i18n/Config/selector";

const ShapePanel = () => {
	const dispatch = useDispatch();

	const context = useSelector((state) => selectedContextSelector(state));
	const contextualData = useSelector((state) => state.contextualData);
	const mapState = useSelector((state) => state.mapState);
	const { mapTools } = mapState;
	const { baseMap } = mapState;
	const primaryId = useSelector((state) => primaryContextSelector(state));
	const primary = contextualData[primaryId];
	let event;
	if (primary && primary.entity) {
		const { entity } = primary;
		event = entity;
	}
	const editing = context && context.entity && context.entity.id !== primaryId;
	const dir = useSelector((state) => getDir(state));

	const handleCreateShape = (properties) => {
		const { id, name } = event;
		const { geometry } = mapTools.feature;
		let inScope = true;
		if (properties.displayOnEventActive && (!event.isActive || event.isTemplate)) inScope = false;
		dispatch(createAndPinShape(id, name, inScope, { properties, geometry }));
		dispatch(setMapTools({ type: null }));
	};

	const handleUpdateShape = (properties) => {
		const { id, geometry } = mapTools.feature;
		// Set correct properties.type for lines, if needed
		if (properties.type === "LineString") {
			properties.type = "Line";
		}

		let inScope = true;
		if (properties.displayOnEventActive && (!event.isActive || event.isTemplate)) {
			inScope = false;
		}
		dispatch(updateShape(id, { properties, geometry }, inScope));
		dispatch(
			mockUpdatePinnedItem(event.id, id, (err) => {
				if (err) {
					console.log(err);
				}
			})
		);
		dispatch(setMapTools({ type: null }));
	};
	const { type } = mapTools;
	return (
		<Fragment>
			{type === "drawing" && (
				<ShapeEdit
					map={baseMap.mapRef}
					handleSave={editing ? handleUpdateShape : handleCreateShape}
					mapTools={mapTools}
					open={true}
					setMapTools={setMapTools}
					app="events-app"
					dir={dir}
				/>
			)}
		</Fragment>
	);
};

export default ShapePanel;
