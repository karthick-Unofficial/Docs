import React, { Component, Fragment } from "react";
import { ShapeEdit } from "orion-components/SharedComponents";

class ShapePanel extends Component {
	handleCreateShape = properties => {
		const { createAndPinShape, event, mapTools, setMapTools } = this.props;
		const { id, name } = event;
		const { geometry } = mapTools.feature;
		let inScope = true;
		if (properties.displayOnEventActive && (!event.isActive || event.isTemplate))
			inScope = false;
		createAndPinShape(id, name, inScope, { properties, geometry });
		setMapTools({ type: null });
	};

	handleUpdateShape = properties => {
		const {
			updateShape,
			event,
			mockUpdatePinnedItem,
			mapTools,
			setMapTools
		} = this.props;
		const { id, geometry } = mapTools.feature;
		// Set correct properties.type for lines, if needed
		if (properties.type === "LineString") {
			properties.type = "Line";
		}

		let inScope = true;
		if (properties.displayOnEventActive && (!event.isActive || event.isTemplate)) {
			inScope = false;
		}
		updateShape(id, { properties, geometry }, inScope);
		mockUpdatePinnedItem(event.id, id, err => {
			if (err) {
				console.log(err);
			}
		});
		setMapTools({ type: null });
	};

	render() {
		const { setMapTools, mapTools, baseMap, editing, dir } = this.props;
		const { type } = mapTools;
		return (
			<Fragment>
				{type === "drawing" && (
					<ShapeEdit
						map={baseMap.mapRef}
						handleSave={
							editing ? this.handleUpdateShape : this.handleCreateShape
						}
						mapTools={mapTools}
						open={true}
						setMapTools={setMapTools}
						app="events-app"
						dir={dir}
					/>
				)}
			</Fragment>
		);
	}
}

export default ShapePanel;
