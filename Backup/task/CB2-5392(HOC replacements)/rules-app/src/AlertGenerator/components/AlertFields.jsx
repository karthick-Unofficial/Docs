import React, { useState } from "react";
import PropTypes from "prop-types";

import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";
import Popover from "material-ui/Popover";
import MenuItem from "material-ui/MenuItem";
import Menu from "material-ui/Menu";
import { getTranslation } from "orion-components/i18n";

const propTypes = {
	alertTypes: PropTypes.array.isRequired,
	changeSummary: PropTypes.func.isRequired,
	selectAlertType: PropTypes.func.isRequired,
	summary: PropTypes.string,
	dir: PropTypes.string
};
const defaultProps = {
	alertTypes: [],
	dir: "ltr"
};

const AlertFields = ({
	alertTypes,
	changeSummary,
	selectAlertType,
	summary,
	typeButtonText,
	setTypeButtonText,
	dir
}) => {

	const [anchorEl, setAnchorEl] = useState();
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const openMenu = e => {
		setIsMenuOpen(true);
		setAnchorEl(e.currentTarget);
	};

	const closeMenu = () => {
		setIsMenuOpen(false);
	};

	const selectAlertTypeClick = (type) => {
		selectAlertType(type);
		setTypeButtonText(type.label + " \u23f7");
		setAnchorEl(null);
		setIsMenuOpen(false);
	};

	return (
		<div>
			<div className="row">
				<div className="row-item fullwidth">
					<div className="edit-rule-input">
						<RaisedButton
							label={typeButtonText}
							secondary={true}
							onClick={openMenu}
							style={isMenuOpen ? { opacity: 0.4 } : { opacity: 1 }}
						/>
						<Popover
							open={isMenuOpen}
							anchorEl={anchorEl}
							anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
							targetOrigin={{ horizontal: "left", vertical: "top" }}
							onRequestClose={closeMenu}
						>
							<Menu>
								{alertTypes.map((alertType, index) =>
									<MenuItem
										key={alertType.id}
										primaryText={alertType.label}
										onClick={() => selectAlertTypeClick(alertType)}
									/>
								)}
							</Menu>
						</Popover>
					</div>
				</div>
			</div>
			<div className="row">
				<div className="row-item fullwidth">
					<div className="edit-rule-input">
						<TextField
							hintText={getTranslation("alertGenerator.alertFields.summary")}
							onChange={changeSummary}
							value={summary}
							fullWidth={true}
							style={{
								borderRadius: 5
							}}
							hintStyle={dir =="rtl" ? {
								color: "#828283",
								paddingRight: 12,
								fontFamily: "roboto",
								fontWeight: "normal"
							} : {
								color: "#828283",
								paddingLeft: 12,
								fontFamily: "roboto",
								fontWeight: "normal"
							}}
							inputStyle={dir == "rtl" ? {
								paddingRight: 12
							} : {
								paddingLeft: 12
							}}
							errorStyle={{
								margin: 0,
								padding: "10px 0 0 0"
							}}
							underlineShow={false}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

AlertFields.propTypes = propTypes;
AlertFields.defaultProps = defaultProps;

export default AlertFields;