import React from "react";
import { RhombusSplit, HomeCity, Phone } from "mdi-material-ui";
import { RobotDogIcon } from "orion-components/CBComponents/Icons";
import { mdiAccessPoint, mdiQuadcopter, mdiHome, mdiGoogleController } from "@mdi/js";
import { DashboardCustomize } from "@mui/icons-material";
import { SvgIcon } from "@mui/material";

const jsonata = require("jsonata");

export const toTitleCase = (str) => {
	return str.replace(/\w\S*/g, (txt) => {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
};

export const getIcon = (type, fontSize = "2rem", icon = null) => {
	if (!icon) {
		switch (type) {
			case "Track":
				icon = "directions_boat";
				break;
			case "Point":
				icon = "place";
				break;
			case "Polygon":
				icon = "layers";
				break;
			case "Line":
				icon = "timeline";
				break;
			case "Vehicle":
				icon = "directions_car";
				break;
			case "Person":
				icon = "person";
				break;
			case "Camera":
				icon = "videocam";
				break;
			case "Planned":
			case "Event":
				icon = "event";
				break;
			case "Emergent":
				icon = "report_problem";
				break;
			case "Template":
				icon = <DashboardCustomize style={{ fontSize }} />;
				break;
			case "external_link":
				icon = "language";
				break;
			case "Collection":
				icon = <RhombusSplit fontSize="large" />;
				break;
			case "Facility":
				icon = <HomeCity fontSize="large" />;
				break;
			case "Access Point":
			case "AccessPoint":
			case "Door":
			case "accessPoint":
				icon = (
					<SvgIcon style={{ width: 34, height: 34 }}>
						<path d={mdiAccessPoint} />
					</SvgIcon>
				);
				break;
			case "Zetron":
				icon = (
					<Phone
						style={{
							width: "24px",
							height: "24px",
							color: "#FFFFFF"
						}}
					/>
				);
				break;
			case "Robot Track":
			case "Ghost Robotics Dog":
				icon = <RobotDogIcon />;
				break;
			case "drone":
				icon = (
					<SvgIcon style={{ width: 34, height: 34 }}>
						<path d={mdiQuadcopter} />
					</SvgIcon>
				);
				break;
			case "drone-controller":
				icon = (
					<SvgIcon style={{ width: 44, height: 44 }}>
						<path d={mdiGoogleController} />
					</SvgIcon>
				);
				break;
			case "drone-home":
				icon = (
					<SvgIcon style={{ width: 34, height: 34 }}>
						<path d={mdiHome} />
					</SvgIcon>
				);
				break;
			case "Buoy":
				icon = <img alt="buoy" style={{ width: 34, height: 34 }} src={require("./Icons/buoy.png")} />;
				break;
			default:
				break;
		}
	}
	if (typeof icon === "string") {
		return (
			<i className="material-icons" style={{ fontSize, color: "#B5B9BE" }}>
				{icon}
			</i>
		);
	} else {
		return icon;
	}
};

export const getIconByTemplate = (type, entity, fontSize = "2rem", profileIconTemplate = null) => {
	let icon = null;

	if (profileIconTemplate && entity.entityData) {
		const expression = jsonata(profileIconTemplate);
		icon = expression.evaluate(entity.entityData);
	}
	return getIcon(type, fontSize, icon);
};
