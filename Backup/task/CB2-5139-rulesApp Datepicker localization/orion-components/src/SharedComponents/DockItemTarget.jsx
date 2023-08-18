import React, { Component } from "react";

// Material UI
import Target from "material-ui/svg-icons/device/gps-not-fixed";

class DockItemTarget extends Component {
	mouseEnter = e => {
		const pos = e.target.getBoundingClientRect();
		this.props.onMouseEnter(pos.right - pos.width / 2 - 6, pos.top - 36);
	};

	mouseLeave = e => {
		this.props.onMouseExit();
	};

	render() {
		const { onClick } = this.props;
		return (
			<a className="target" onClick={onClick} onMouseLeave={this.mouseLeave}>
				<Target onMouseEnter={this.mouseEnter} />
			</a>
		);
	}
}
export default DockItemTarget;
