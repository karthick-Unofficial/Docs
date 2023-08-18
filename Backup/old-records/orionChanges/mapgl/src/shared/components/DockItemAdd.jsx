import React, { PureComponent } from "react";

class DockItemAdd extends PureComponent {
	render() {
		const { onClick, isDock } = this.props;
		return (
			<div className="removeTarget" onClick={onClick}>
				{isDock ? (
					<i className="material-icons">check</i>
				) : (
					<div className="add-wrapper">
						<i className="material-icons">add_box</i>
					</div>
				)}
			</div>
		);
	}
}
export default DockItemAdd;
