import React from "react";
import { RhombusSplit, HomeCity, Phone } from "mdi-material-ui";
import { RobotDogIcon } from "orion-components/CBComponents/Icons";

const jsonata = require("jsonata");

export const toTitleCase = str => {
	return str.replace(/\w\S*/g, txt => {
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
			case "external_link":
				icon = "language";
				break;
			case "Collection":
				icon = <RhombusSplit fontSize="large" />;
				break;
			case "Facility":
				icon = <HomeCity fontSize="large" />;
				break;
			case "Zetron":
				icon = <Phone style={{ width: "24px", height: "24px", color: "#FFFFFF" }} />;
			case "Robot Track":
			case "Ghost Robotics Dog":
				icon = <RobotDogIcon />;
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
