import React from "react";
import { BaseWidget } from "../shared";
import { Map } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { getWidgetState } from "orion-components/Profiles/Selectors";
import { getDir } from "orion-components/i18n/Config/selector";
import PropTypes from "prop-types";

const propTypes = {
	id: PropTypes.string,
	selectWidget: PropTypes.string,
	title: PropTypes.string,
	expanded: PropTypes.bool
};

const MapWidget = ({ id, selectWidget, title, expanded }) => {
	const dispatch = useDispatch();

	const enabled = useSelector((state) => getWidgetState(state)(id, "enabled"));
	const dir = useSelector((state) => getDir(state));

	const handleExpand = () => {
		dispatch(selectWidget("map-view"));
	};

	return (
		<BaseWidget
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

MapWidget.propTypes = propTypes;

export default MapWidget;
