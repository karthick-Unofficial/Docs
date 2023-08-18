import React, { Component, Fragment } from "react";
import { ShapeEdit } from "orion-components/SharedComponents";

class ShapePanel extends Component {
	handleCreateShape = properties => {
		const { createShape, mapTools, setMapTools } = this.props;
		const { geometry } = mapTools.feature;
		createShape({ properties, geometry });
		setMapTools({ type: null });
	};

	handleUpdateShape = properties => {
		const { updateShape, mapTools, setMapTools } = this.props;
		const { id, geometry } = mapTools.feature;

		updateShape(id, { properties, geometry });
		setMapTools({ type: null });
	};

	render() {
		const { setMapTools, mapTools, baseMap, editing, dir } = this.props;
		return (
			<Fragment>
				{mapTools.type === "drawing" && (
					<ShapeEdit
						map={baseMap.mapRef}
						handleSave={
							editing ? this.handleUpdateShape : this.handleCreateShape
						}
						mapTools={mapTools}
						open={mapTools.type === "drawing"}
						setMapTools={setMapTools}
						dir={dir}
					/>
				)}
			</Fragment>
		);
	}
}

export default ShapePanel;
