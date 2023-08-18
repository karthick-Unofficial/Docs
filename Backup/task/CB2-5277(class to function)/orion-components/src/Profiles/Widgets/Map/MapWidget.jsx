import React, { Component } from "react";
import { BaseWidget } from "../shared";
import { Map } from "@material-ui/icons";

const MapWidget = ({ selectWidget, title, order, enabled, expanded, dir }) => {

	const handleExpand = () => {
		selectWidget("map-view");
	};

	return (
		<BaseWidget
			order={order}
			enabled={enabled}
			title={title}
			expanded={expanded}
			expandable={true}
			handleExpand={handleExpand}
			icon={<Map fontSize="large" />}
			dir={dir}
		/>
	);
};

export default MapWidget;
