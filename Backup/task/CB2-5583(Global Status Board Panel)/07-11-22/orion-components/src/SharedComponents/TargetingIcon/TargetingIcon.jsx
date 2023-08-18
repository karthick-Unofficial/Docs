import React, { useState } from "react";
import { IconButton } from "@mui/material";
import TargetingLine from "./TargetingLine";
import { Target } from "orion-components/CBComponents/Icons";
import PropTypes from "prop-types";
import $ from "jquery";
import { useSelector, useDispatch } from "react-redux";
import { moveToTarget } from "../../AppState/Actions";
import { mapState as mapRef } from "orion-components/AppState/Selectors";
import { mapFiltersById } from "orion-components/ContextPanel/Selectors";
import { makeGetEntity } from "orion-components/GlobalData/Selectors";
import { disabledFeedsSelector } from "orion-components/AppState/Selectors";

const propTypes = {
	selectFloor: PropTypes.func,
	iconContainerStyle: PropTypes.object
};

const defaultProps = {
	selectFloor: () => { },
	iconContainerStyle: { }
};

const TargetingIcon = (props) => {
	const {
		selectFloor,
		iconContainerStyle,
		movement,
		config,
		id
	} = props;

	const dispatch = useDispatch();

	const getEntity = makeGetEntity();
	const mapAppState = useSelector(state => mapRef(state));
	const map = useSelector(state => props.map ? props.map : state.replayMapState ? state.replayMapState.replayBaseMap.mapRef : state.mapState ? state.mapState.baseMap.mapRef : null);
	const filters = useSelector(state => mapAppState ? mapFiltersById(state) : null);
	const disabledFeeds = useSelector(state => disabledFeedsSelector(state));

	let geometry = useSelector(state => state.replayMapState ? null : props.geometry);
	//Get entity
	const entity = useSelector(state => mapAppState && mapAppState.entities[props.feedId] ? getEntity(state, props) : null);
	//Check if entity's displayType is map (or not set)
	if (entity && entity.entityData && ["map", "facility"].includes((entity.entityData.displayType || "map").toLowerCase())) {
		if (!geometry || typeof geometry !== "object") {
			geometry = entity.entityData.geometry;
		}
	} else if (typeof geometry !== "object") {
		geometry = false;
	}
	const mapVisible = useSelector(state => state.replayMapState ? state.replayMapState.replayBaseMap.visible : state.mapState ? state.mapState.baseMap.visible : false);

	const [draw, setDraw] = useState(false);
	const [x, setX] = useState(null);
	const [y, setY] = useState(null);
	const [rerender, setRerender] = useState(null);

	const mouseEnter = e => {
		const pos = e.target.getBoundingClientRect();
		setDraw(true);
		setX(pos.right - pos.width / 2 - 6);
		setY(pos.top - 36);
		const rerender = setInterval(
			() =>
				setDraw(true),
			10
		);
		setRerender(rerender);
		map.on("move", () => rerender);
		map.on("moveend", () => {
			clearInterval(rerender);
		});
	};

	const mouseLeave = () => {
		clearInterval(rerender);
		setDraw(false);
		setX(null);
		setY(null);
		setRerender(null);
	};

	const onTargetClick = (e, geometry, map, movement) => {
		dispatch(moveToTarget(e, geometry, map, movement));
		if (selectFloor !== null) {
			dispatch(selectFloor(props));
		}
	};

	const isDisabled = !entity
		? false 
		: entity.entityType === "shapes" 
			? disabledFeeds.includes(entity.entityData.properties.type === "LineString" ? "Line" : entity.entityData.properties.type)
			:  disabledFeeds.includes(entity.feedId);
	const shouldRender = !isDisabled && map && mapVisible && geometry && (!filters || !filters.length || filters.includes(id));

	return (
		shouldRender ? (
			<React.Fragment>
				{draw && $(window).width() > 1023 && (
					<TargetingLine
						draw={draw}
						x={x}
						y={y}
						map={map}
						geometry={geometry}
						config={config || {}}
					/>
				)}
				<IconButton
					style={{...{ opacity: 1 }, ...iconContainerStyle }}
					onClick={e => onTargetClick(e, geometry, map, movement)}
				>
					<Target
						handleMouseEnter={mouseEnter}
						handleMouseLeave={mouseLeave}
					/>
				</IconButton>
			</React.Fragment>
		) : null
	);
};

TargetingIcon.propTypes = propTypes;
TargetingIcon.defaultProps = defaultProps;

export default TargetingIcon;
