import React, { PureComponent } from "react";

class DockItemLabel extends PureComponent {
	render() {
		const { onClick, primary, secondary } = this.props;
		return (
			<div className="text" onClick={onClick}>
				<div className="cb-font-b2 primaryName">{primary}</div>
				<div className="itemType">{secondary}</div>
			</div>
		);
	}
}
export default DockItemLabel;
