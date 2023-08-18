import React, { useState } from "react";
import { IconButton } from "@material-ui/core";
import TargetingLine from "./TargetingLine";
import { Target } from "orion-components/CBComponents/Icons";
import PropTypes from "prop-types";
import $ from "jquery";

const propTypes = {
	selectFloor: PropTypes.func
};

const defaultProps = {
	selectFloor: null
};

const TargetingIcon = (props) => {
	const {
		map,
		moveToTarget,
		selectFloor,
		mapVisible,
		geometry,
		movement,
		config,
		id,
		filters
	} = props;

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
		moveToTarget(e, geometry, map, movement);
		if (selectFloor !== null) {
			selectFloor(props);
		}
	};

	const shouldRender = map && mapVisible && geometry && (!filters || !filters.length || filters.includes(id));

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
					style={{ opacity: 1 }}
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
