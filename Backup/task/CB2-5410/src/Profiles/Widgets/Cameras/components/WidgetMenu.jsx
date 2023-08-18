import React from "react";
import PropTypes from "prop-types";
import { CBMenu } from "orion-components/CBComponents";

const WidgetMenu = ({
	canSlewAll,
	readOnly,
	disableSlew,
	geometry,
	handleSlewAll,
	canLinkCamera,
	linkCamera,
	handleLaunch
}) => {
	const menuItems = [
		{
			label: "global.profiles.widgets.shared.widgetMenu.cameraWallLoad",
			onClick: () => {
				handleLaunch();
			},
			showMenuItem: true,
			disabled: false
		},
		{
			label: "global.profiles.widgets.cameras.main.linkCamera",
			onClick: () => {
				linkCamera();
			},
			showMenuItem: canLinkCamera,
			disabled: false
		},
		{
			label: "global.profiles.widgets.cameras.main.slewAll",
			onClick: () => {
				handleSlewAll();
			},
			showMenuItem: canSlewAll && !readOnly && !disableSlew,
			disabled: !(geometry && geometry.coordinates)
		}
	];

	return (
		<>
			<CBMenu menuItems={menuItems} />
		</>
	);
};

WidgetMenu.propTypes = {
	canSlewAll: PropTypes.bool.isRequired,
	readOnly: PropTypes.bool.isRequired,
	disableSlew: PropTypes.bool.isRequired,
	geometry: PropTypes.object,
	handleSlewAll: PropTypes.func.isRequired,
	canLinkCamera: PropTypes.bool.isRequired,
	linkCamera: PropTypes.func.isRequired,
	handleLaunch: PropTypes.func.isRequired
};

export default WidgetMenu;
