import React from "react";
import { withSpan } from "../../../Apm";
import PropTypes from "prop-types";
import { FontIconButton } from "orion-components/CBComponents";
import { TargetingIcon, getIcon, getIconByTemplate } from "orion-components/SharedComponents";
import { IconButton, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { MoreHoriz } from "@mui/icons-material";
import getButtons from "./getButtons";
import getAction from "./getAction";
import toUpper from "lodash/toUpper";
import { getTranslation } from "orion-components/i18n";
import { useSelector } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";

const propTypes = {
	context: PropTypes.object.isRequired,
	id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	name: PropTypes.string,
	displayType: PropTypes.string,
	type: PropTypes.string,
	description: PropTypes.string,
	geometry: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
	actions: PropTypes.array,
	scrolledUp: PropTypes.bool,
	handleExpand: PropTypes.func,
	appId: PropTypes.string,
	isHiding: PropTypes.bool,
	profileIconTemplate: PropTypes.string,
	readOnly: PropTypes.bool,
	selectFloor: PropTypes.func,
	zetronPhoneVisible: PropTypes.bool
};

const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

const defaultProps = {
	name: "",
	displayType: "",
	type: "",
	description: "",
	geometry: null,
	actions: null,
	scrolledUp: false,
	handleExpand: null,
	isHiding: false,
	profileIconTemplate: null,
	dir: "ltr",
	selectFloor: () => {}
};

const SummaryWidget = ({
	context,
	id,
	name,
	displayType,
	type,
	description,
	geometry,
	actions,
	scrolledUp,
	handleExpand,
	profileIconTemplate,
	readOnly,
	selectFloor,
	zetronPhoneVisible
}) => {
	const appId = useSelector((state) => state?.appId);
	const entity = context?.entity;
	const ownerName = entity?.ownerName;
	const feedId = entity?.feedId;
	const user = useSelector((state) => state.session.user.profile);
	if (zetronPhoneVisible) user["zetronSystemAvailable"] = true;
	const buttons = entity && getButtons(user, context, appId, actions, readOnly);
	const dir = useSelector((state) => getDir(state));

	if (buttons) {
		buttons.map((button) => {
			actions.forEach((action) => {
				if (action.name === button.name) {
					button.action = action.action;
					if (hasOwn(action, "disabled")) {
						button.disabled = action.disabled;
					}
				}

				// Prevents multiple simultaneous clicks
				// On-click, set flag in parent profile, pass down as action.debounce
				if (action.debounce) {
					button.disabled = true;
				}
			});
			if (!button.action) {
				button.viewable = false;
			}
			return button;
		});
	}

	const localizeType = (type) => {
		switch (type) {
			case "Facility":
			case "Track":
			case "Line":
			case "Polygon":
			case "Camera":
			case "Template":
			case "Planned":
			case "Emergent":
				return getTranslation(`global.profiles.widgets.summary.${type}`);
			default:
				return type;
		}
	};
	return (
		<div className={`summary-wrapper ${scrolledUp ? "scrolled-up" : ""} `}>
			<ListItem className="summary-info" disableGutters>
				{geometry && (
					<TargetingIcon id={id} feedId={feedId} geometry={geometry || null} selectFloor={selectFloor} />
				)}
				{type && getIconByTemplate(type, entity, "2rem", profileIconTemplate) && (
					<ListItemIcon
						style={{
							color: "#828283",
							fontSize: "2rem",
							minWidth: 0,
							marginLeft: 8,
							marginRight: 8
						}}
					>
						{getIconByTemplate(type, entity, "2rem", profileIconTemplate)}
					</ListItemIcon>
				)}
				<ListItemText
					className={` ${scrolledUp ? "MuiTypography-noWrap" : ""}`}
					primary={toUpper(name || id)}
					secondary={
						ownerName
							? getTranslation(
									"global.profiles.widgets.summary.createdBy",
									"",
									localizeType(displayType || type),
									ownerName
							  )
							: localizeType(displayType || type)
					}
					primaryTypographyProps={{
						style: {
							color: "#FFF",
							lineHeight: 1,
							textOverflow: "ellipsis",
							overflow: "hidden",
							wordWrap: "break-word",
							direction: dir
						},
						variant: "h6"
					}}
					secondaryTypographyProps={{
						style: { color: "#828283", direction: dir },
						noWrap: scrolledUp
					}}
					style={{ marginRight: 8, marginLeft: 8 }}
				/>
				{scrolledUp && (buttons || description) && (
					<IconButton onClick={handleExpand}>
						<MoreHoriz style={{ color: "#FFF" }} />
					</IconButton>
				)}
			</ListItem>

			{!scrolledUp && (buttons || description) && (
				<div style={{ padding: "0 10px" }}>
					<div
						className="summary-description"
						style={dir === "rtl" ? { textAlign: "right", marginRight: "5px" } : {}}
					>
						<p>{description}</p>
					</div>
					<div
						style={{
							display: "flex",
							alignItems: "flex-start",
							justifyContent: "flex-end",
							flexWrap: "nowrap"
						}}
					>
						{buttons &&
							buttons
								.filter((button) => {
									return button.viewable;
								})
								.map((button) => {
									const { name, toggled, disabled, action, icon, toggleColor } = button;
									return (
										<FontIconButton
											key={name}
											label={name}
											icon={icon}
											action={action}
											toggled={toggled}
											disabled={disabled}
											toggleColor={toggleColor}
										/>
									);
								})}
						{entity.actions &&
							entity.actions.map((action) => {
								const { label, type } = action;
								return (
									<FontIconButton
										key={label}
										label={label}
										icon={getIcon(type, 24)}
										action={getAction(action)}
									/>
								);
							})}
					</div>
				</div>
			)}
		</div>
	);
};

SummaryWidget.propTypes = propTypes;
SummaryWidget.defaultProps = defaultProps;

export default withSpan("summary-widget", "profile-widget")(SummaryWidget);
