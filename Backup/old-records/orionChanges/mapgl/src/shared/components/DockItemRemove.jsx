import React, { PureComponent } from "react";

class DockItemRemove extends PureComponent {
	render() {
		const { onClick } = this.props;
		return (
			<div className="removeTarget" onClick={onClick}>
				<i className="material-icons">close</i>
			</div>
		);
	}
}
export default DockItemRemove;
