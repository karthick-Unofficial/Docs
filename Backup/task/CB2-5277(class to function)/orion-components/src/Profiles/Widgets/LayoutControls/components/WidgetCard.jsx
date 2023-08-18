import React, { useState } from "react";

// Material UI
import { ListItem } from "material-ui/List";
import Drag from "material-ui/svg-icons/action/reorder";
import IconButton from "material-ui/IconButton";
import Remove from "material-ui/svg-icons/content/remove-circle";
import Add from "material-ui/svg-icons/content/add-circle";

const WidgetCard = ({
	widget,
	enable,
	disable,
	isExpanded
}) => {
	const [widgetState, setWidgetState] = useState(widget);

	const handleEnableClick = id => {
		setWidgetState({ ...widgetState, enabled: true });
		enable(id);
	};

	const handleDisableClick = id => {
		setWidgetState({ ...widgetState, enabled: false });
		disable(id);
	};

	const listItemStyles = {
		backgroundColor: "#1F1F21",
		margin: ".25rem .5rem"
	};

	const getRightIconButton = () => {
		if (isExpanded)
			return null;
		else {
			return (
				widgetState.enabled ? (
					<IconButton onClick={() => handleDisableClick(widget.id)}>
						<Remove color="#E85858" />
					</IconButton>
				) : (
					<IconButton onClick={() => handleEnableClick(widget.id)}>
						<Add color="#A4B966" />
					</IconButton>
				)
			);
		}
	};

	return (
		<ListItem
			style={listItemStyles}
			primaryText={widget.name}
			leftIcon={<Drag />}
			rightIconButton={
				getRightIconButton()
			}
		/>
	);
};

export default WidgetCard;
