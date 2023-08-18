import React, { useState } from "react";
import { Checkbox, FormControlLabel, Typography } from "@mui/material";
import { Dialog as CBDialog } from "orion-components/CBComponents";
import { useDispatch } from "react-redux";
import { setWidgetState } from "orion-components/SharedActions/commonActions";
import { Translate, getTranslation } from "orion-components/i18n";
import { CBMenu } from "orion-components/CBComponents";
import PropTypes from "prop-types";

const checkboxStyle = {
	"&.Mui-checked": {
		position: "relative",
		"&:after": {
			content: '""',
			left: 13,
			top: 13,
			height: 15,
			width: 15,
			position: "absolute",
			backgroundColor: "#fff",
			zIndex: -1
		}
	}
};

const WidgetMenu = ({
	dir,
	createProximity,
	canCreateProximityArea,
	eventEnded,
	collapsed,
	widgetState,
	widgetName
}) => {
	const expandedState = widgetState?.autoExpand && !collapsed;
	const [dialog, setDialog] = useState("");
	const [autoExpand, setAutoExpand] = useState(expandedState);

	const dispatch = useDispatch();

	const toggleAutoExpand = () => {
		setAutoExpand(!autoExpand);
	};

	const saveWidgetSettings = () => {
		const updatedWidgetState = widgetState;
		updatedWidgetState.autoExpand = autoExpand;
		dispatch(setWidgetState(widgetName, updatedWidgetState));
		setDialog("");
	};

	const handleDialogClose = () => {
		setDialog("");
	};

	const styles = {
		header: {
			color: "#FFFFF",
			fontFamily: "Roboto",
			fontSize: 14
		},
		note: {
			color: "#fff",
			fontFamily: "Roboto",
			marginTop: "8px",
			opacity: "0.69"
		}
	};

	const menuItems = [
		{
			label: "global.profiles.widgets.proximity.main.createProxZone",
			onClick: () => {
				createProximity();
			},
			disabled: false,
			showMenuItem: canCreateProximityArea && !eventEnded
		},
		{
			label: "global.profiles.widgets.shared.widgetMenu.title",
			onClick: () => {
				setDialog("widgetMenuProximity");
			},
			disabled: false,
			showMenuItem: true
		}
	];

	return (
		<>
			<CBMenu menuItems={menuItems} />

			<CBDialog
				open={dialog === "widgetMenuProximity"}
				confirm={{
					label: getTranslation("global.profiles.widgets.shared.widgetMenu.ok"),
					action: saveWidgetSettings,
					style: { color: "#5594B9" }
				}}
				abort={{
					label: getTranslation("global.profiles.widgets.shared.widgetMenu.cancel"),
					action: handleDialogClose,
					style: "#B4B9BF"
				}}
				dir={dir}
				paperPropStyles={{
					width: "607px",
					padding: "1.5% 0.75%"
				}}
			>
				<div>
					<Typography fontSize="16px" style={styles.header}>
						<Translate
							value={"global.profiles.widgets.shared.widgetMenu.header"}
							count={getTranslation("global.profiles.widgets.proximity.main.title")}
						/>
					</Typography>

					<Typography fontSize="11px" style={styles.note}>
						<Translate value={"global.profiles.widgets.shared.widgetMenu.note"} />
					</Typography>
					<FormControlLabel
						className="themedCheckBox"
						control={
							<Checkbox
								style={{
									transform: "scale(1.1)"
								}}
								checked={autoExpand}
								onChange={toggleAutoExpand}
								name="autoExpand"
								sx={checkboxStyle}
							/>
						}
						label={getTranslation("global.profiles.widgets.shared.widgetMenu.autoExpand")}
						sx={{ color: "#FFFFF", marginTop: "6.5%", marginBottom: "4%" }}
					/>
				</div>
			</CBDialog>
		</>
	);
};

WidgetMenu.propTypes = {
	dir: PropTypes.oneOf(["rtl", "ltr"]).isRequired,
	createProximity: PropTypes.func.isRequired,
	canCreateProximityArea: PropTypes.bool.isRequired,
	eventEnded: PropTypes.bool.isRequired,
	collapsed: PropTypes.bool.isRequired,
	widgetState: PropTypes.object.isRequired,
	widgetName: PropTypes.string.isRequired
};

export default WidgetMenu;
