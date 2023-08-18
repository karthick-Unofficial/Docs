import React, { Fragment } from "react";
import { ShapeEdit } from "orion-components/SharedComponents";

const ShapePanel = ({ createShape, mapTools, setMapTools, updateShape, baseMap, editing, dir }) => {
	const handleCreateShape = properties => {
		const { geometry } = mapTools.feature;
		createShape({ properties, geometry });
		setMapTools({ type: null });
	};

	const handleUpdateShape = properties => {
		const { id, geometry } = mapTools.feature;
		updateShape(id, { properties, geometry });
		setMapTools({ type: null });
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
