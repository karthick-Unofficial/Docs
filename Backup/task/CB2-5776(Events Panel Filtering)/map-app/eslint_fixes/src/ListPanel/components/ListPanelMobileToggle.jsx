import React from "react";
import { Translate } from "orion-components/i18n";
import PropTypes from "prop-types";

const propTypes = {
	onClick: PropTypes.func,
	isOpen: PropTypes.bool
};

const ListPanelMobileToggle = ({ onClick, isOpen }) => {
	return (
		<div onClick={onClick} className={`toggleMobile ${isOpen ? "open" : "closed"}`}>
			{isOpen ? (
				<a className="open">
					<div className="close-panel-text">
						<Translate value="listPanel.listPanelMobileToggle.viewMap" />
					</div>
				</a>
			) : (
				<a className="closed">
					<div className="open-panel-text">
						<Translate value="listPanel.listPanelMobileToggle.openListPanel" />
					</div>
				</a>
			)}
		</div>
	);
};

ListPanelMobileToggle.propTypes = propTypes;

export default ListPanelMobileToggle;
