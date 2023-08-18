import React, {Component} from "react";

class DockItemTarget extends Component { 

	mouseEnter = (e) => {
		// console.log(e.target.getBoundingClientRect());
		const pos = e.target.getBoundingClientRect();
		// console.log(pos.height);
		this.props.onMouseEnter(pos.right - (pos.width/2) - 6, pos.top - 36);
	}

	mouseLeave = (e) => {
		this.props.onMouseExit();
	}


	render() {
		const { onClick } = this.props;
		return (
			<a className="target-icon-wrapper" onClick={onClick} 
				onMouseLeave={this.mouseLeave}
			>
				<i 
					className="targeting-icon" 
					onMouseEnter={this.mouseEnter}
				></i>
			</a>
		);
	}
}
export default DockItemTarget;