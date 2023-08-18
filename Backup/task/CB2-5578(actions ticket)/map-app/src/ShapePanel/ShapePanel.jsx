import React, { Fragment } from "react";
import { ShapeEdit } from "orion-components/SharedComponents";
import { useDispatch, useSelector } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";
import { selectedContextSelector } from "orion-components/ContextPanel/Selectors";
import {
	createShape,
	updateShape,
	setMapTools
} from "./shapePanelActions";
import { useState } from "react";
import { useEffect } from "react";

const ShapePanel = () => {
	const dispatch = useDispatch();
	const { mapTools, baseMap } = useSelector(state => state.mapState);
	const dir = useSelector(state => getDir(state));
	const context = useSelector(state => selectedContextSelector(state));
	const [editing, setEditing] = useState(null);

	useEffect(() => {
		if (context)
			setEditing(context && context.entity && context.entity.entityType === "shapes" && mapTools.mode && !mapTools.mode.includes("draw_"));
	}, [context]);

	const handleCreateShape = properties => {
		const { geometry } = mapTools.feature;
		dispatch(createShape({ properties, geometry }));
		dispatch(setMapTools({ type: null }));
	};

	const handleUpdateShape = properties => {
		const { id, geometry } = mapTools.feature;
		dispatch(updateShape(id, { properties, geometry }));
		dispatch(setMapTools({ type: null }));
	};

	return (
		<Fragment>
			{mapTools.type === "drawing" && (
				<ShapeEdit
					map={baseMap.mapRef}
					handleSave={
						editing ? handleUpdateShape : handleCreateShape
					}
					mapTools={mapTools}
					open={mapTools.type === "drawing"}
					setMapTools={setMapTools}
					dir={dir}
				/>
			)}
		</Fragment>
	);
};

export default ShapePanel;
