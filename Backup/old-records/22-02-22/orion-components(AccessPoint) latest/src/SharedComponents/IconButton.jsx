import React, { Component } from "react";

class IconButton extends Component {
	render() {
		const { onClick, iconName } = this.props;
		return (
			<button 
				onClick={onClick}
				style={{backgroundColor: "transparent", color: "white", border: "none"}}
			>
				<i className="material-icons">{iconName}</i>
			</button>
		);
	}
}

export default IconButton;