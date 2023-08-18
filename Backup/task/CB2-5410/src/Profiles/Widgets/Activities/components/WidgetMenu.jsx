import React from "react";
import PropTypes from "prop-types";
import { CBMenu } from "orion-components/CBComponents";

const WidgetMenu = ({ openFilterDialog }) => {
	const menuItems = [
		{
			label: "global.profiles.widgets.shared.widgetMenu.timelineFilters",
			onClick: () => {
				openFilterDialog();
			},
			disabled: false,
			showMenuItem: true
		}
	];

	return (
		<>
			<CBMenu menuItems={menuItems} />
		</>
	);
};

WidgetMenu.propTypes = {
	openFilterDialog: PropTypes.func.isRequired
};

export default WidgetMenu;
