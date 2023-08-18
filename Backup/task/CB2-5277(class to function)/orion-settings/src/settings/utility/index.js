import React from "react";
import { SvgIcon } from "@material-ui/core";
import { mdiAccessPoint } from "@mdi/js";

export const capitalize = (string) => {
	return string.charAt(0).toUpperCase() + string.slice(1);
};

export const getFullName = (firstName, lastName) => {
	return capitalize(firstName) + " " + capitalize(lastName);
};

export const formatPhone = (phone) => {
	return "(" + phone.substr(0, 3) + ") " + phone.substr(3, 3) + "-" + phone.substr(6, 4);
};

export const getFirstName = (fullName) => {
	return fullName.split(" ")[0];
};

export const getLastName = (fullName) => {
	return fullName.split(" ")[1];
};

export const transformRole = (role) => {
	return role
		.split("-")
		.map((word) => word[0].toUpperCase() + word.substr(1))
		.join(" ");
};

export const getSafely = (fn) => {
	try {
		return fn();
	}
	catch (err) {
		console.log("Avoided a null reference, returning undefined instead:");
		console.log(err);
		return undefined;
	}
};

// Use this with .sort to alphabetically sort an array of objects by object property
// dogs.sort(dynamicSort("breeds"))   --->   Dog is an array of objects, sorts alphabetically by the "breeds" property
// dogs.sort(dynamicSort("-breeds"))  --->   Dog is an array of objects, sorts reverse alphabetically by the "breeds" property
export const dynamicSort = (property) => {
	let sortOrder = 1;
	if (property[0] === "-") {
		sortOrder = -1;
		property = property.substr(1);
	}
	return function (a, b) {
		const result = (a[property].replace(/\s/g, "").toLowerCase() < b[property].replace(/\s/g, "").toLowerCase()) ?
			-1
			: (a[property].replace(/\s/g, "").toLowerCase() > b[property].replace(/\s/g, "").toLowerCase()) ?
				1
				: 0;
		return result * sortOrder;
	};
};

export const getIntegrationIcon = (type, fontSize = "2rem") => {
	let icon;
	let materialUI = false;
	let mdiIcon = false;
	switch (type) {
		case "Shapes":
			icon = "../static/icons/shapes-white.svg";
			break;
		case "Track":
			icon = "../static/icons/vessel-white-01.svg";
			break;
		case "Vehicle":
			materialUI = true;
			icon = "directions_car";
			break;
		case "Camera":
			icon = "../static/icons/camera.svg";
			break;
		case "Person":
			icon = "../static/icons/person.svg";
			break;
		case  "accessPoint":
		case "Access point":
			mdiIcon = true;
			icon = mdiAccessPoint; 
			break;
		default:
			icon = null;
			break;

	}
	if (!icon) {
		return false;
	}
	if (materialUI) {
		return (
			<i className="material-icons" style={{ fontSize, color: "#B5B9BE" }}>
				{icon}
			</i>
		);
	} else if (mdiIcon) {
		return (
			<SvgIcon style={{ width: 34, height: 34, color: "#fff" }}>
				<path d={icon} />
			</SvgIcon>
			);
	} else {
		return (
			<div className="int-icon"
				style={
					{
						fontSize,
						color: "#B5B9BE",
						backgroundImage: `url(${icon})`
					}
				}>
			</div>
		);
	}
};