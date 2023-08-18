import React, { PureComponent } from "react";
import { Translate } from "orion-components/i18n/I18nContainer";

class ListPanelMobileToggle extends PureComponent {
	render() {
		const { onClick, isOpen } = this.props;
		return (
			<div onClick={onClick} className={`toggleMobile ${(isOpen ? "open" : "closed")}`}>
				{isOpen ? (
					<a className="open">
						<div className="close-panel-text"><Translate value="listPanel.listPanelMobileToggle.viewMap"/></div>
					</a>
				) : (
					<a className="closed">
						<div className="open-panel-text"><Translate value="listPanel.listPanelMobileToggle.openlistPanel"/></div>
					</a>
				)}
				
			</div>
		);
	}
}

export default ListPanelMobileToggle;