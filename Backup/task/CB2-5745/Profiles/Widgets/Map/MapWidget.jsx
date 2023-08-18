import React from "react";
import { BaseWidget } from "../shared";
import { Map } from "@mui/icons-material";
import { useDispatch } from "react-redux";

const MapWidget = ({ selectWidget, title, order, enabled, expanded, dir }) => {
	const dispatch = useDispatch();

	const handleExpand = () => {
		dispatch(selectWidget("map-view"));
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
