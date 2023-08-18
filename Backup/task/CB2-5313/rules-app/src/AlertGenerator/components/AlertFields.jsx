import React, { useState } from "react";
import PropTypes from "prop-types";

import { TextField, Button, Popover, MenuItem } from "@mui/material";
import { getTranslation } from "orion-components/i18n";
import {useStyles} from "../../shared/styles/overrides";

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
	const classes = useStyles();

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

	const styles = {
		type: {
			backgroundColor: "rgb(0, 188, 212)",
			borderRadius: "2px",
			color: "#fff",
			height: "36px",
			minWidth: "88px",
			lineHeight: "unset",
			padding: "0px",
			...(isMenuOpen ? { opacity: 0.4 } : { opacity: 1 }),
			"&:hover": {
				backgroundColor: "rgb(102 215 229)"
			}
		},
		typeOption: {
			lineHeight: "48px",
			padding: "0px 16px",
			letterSpacing: 0,
			"&:hover": {
				backgroundColor: "rgba(255, 255, 255, 0.1)"
			}
		}
	};

	return (
		<div>
			<div className="row">
				<div className="row-item fullwidth">
					<div className="edit-rule-input">
						<Button
							onClick={openMenu}
							sx={styles.type}
						>
							<span style={{ padding: "0 16px", letterSpacing: 0, fontSize: 14 }}>{typeButtonText}</span>
						</Button>
						<Popover
							open={isMenuOpen}
							anchorEl={anchorEl}
							anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
							anchorPosition={{ horizontal: "left", vertical: "top" }}
							targetOrigin={{ horizontal: "left", vertical: "top" }}
							onClose={closeMenu}
							style={{
								backgroundColor: "transparent"
							}}
							PaperProps={{
								style: {
									width: "168px",
									padding: "8px 0",
									boxShadow: "rgb(0 0 0 / 12%) 0px 1px 6px, rgb(0 0 0 / 12%) 0px 1px 4px"
								}
							}}
						>
							{alertTypes.map((alertType, index) =>
								<MenuItem
									key={alertType.id}
									onClick={() => selectAlertTypeClick(alertType)}
									sx={styles.typeOption}>
									{alertType.label}
								</MenuItem>
							)}
						</Popover>
					</div>
				</div>
			</div>
			<div className="row">
				<div className="row-item fullwidth">
					<div className="edit-rule-input">
						<TextField
							placeholder={getTranslation("alertGenerator.alertFields.summary")}
							onChange={changeSummary}
							value={summary}
							fullWidth={true}
							style={{
								borderRadius: 5
							}}
							inputProps={{
								style: { padding: "0 12px", height: 48, fontSize: 16 }
							}}
							variant="standard"
							InputProps={{ classes: { input: classes.input }, disableUnderline: true }}
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