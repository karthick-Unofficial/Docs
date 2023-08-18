import React from "react";
import PropTypes from "prop-types";
import { CBMenu } from "orion-components/CBComponents";

const WidgetMenu = ({ canAddRule, addRule }) => {
	const menuItems = [
		{
			label: "global.profiles.widgets.shared.widgetMenu.newRule",
			onClick: () => {
				addRule();
			},
			disabled: false,
			showMenuItem: canAddRule
		}
	];

	return (
		<>
			<CBMenu menuItems={menuItems} />
		</>
	);
};

WidgetMenu.propTypes = {
	canAddRule: PropTypes.bool.isRequired,
	addRule: PropTypes.func.isRequired
};

export default WidgetMenu;
