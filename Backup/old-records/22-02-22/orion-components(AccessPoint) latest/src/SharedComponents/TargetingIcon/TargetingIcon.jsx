import React, { Component } from "react";
import { IconButton } from "@material-ui/core";
import TargetingLine from "./TargetingLine";
import { Target } from "orion-components/CBComponents/Icons";

import $ from "jquery";

class TargetingIcon extends Component {
	constructor(props) {
		super(props);
		this.state = {
			draw: false,
			x: null,
			y: null,
			rerender: null
		};
	}

	mouseEnter = e => {
		const { map } = this.props;
		const pos = e.target.getBoundingClientRect();

		this.setState({
			draw: true,
			x: pos.right - pos.width / 2 - 6,
			y: pos.top - 36
		});

		const rerender = setInterval(
			() =>
				this.setState({
					draw: true
				}),
			10
		);

		this.setState({
			rerender: rerender
		});

		map.on("move", () => rerender);
		map.on("moveend", () => {
			clearInterval(rerender);
		});
	};

	mouseLeave = () => {
		const { rerender } = this.state;
		clearInterval(rerender);

		this.setState({
			draw: false,
			x: null,
			y: null,
			rerender: null
		});
	};

	render() {
		const {
			map,
			mapVisible,
			geometry,
			movement,
			moveToTarget,
			config,
			id,
			filters
		} = this.props;
		const { x, y, draw } = this.state;

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
						onClick={e => moveToTarget(e, geometry, map, movement)}
					>
						<Target
							handleMouseEnter={this.mouseEnter}
							handleMouseLeave={this.mouseLeave}
						/>
					</IconButton>
				</React.Fragment>
			) : null
		);
	}
}

export default TargetingIcon;
