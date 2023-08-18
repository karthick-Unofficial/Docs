// See below export for example of use

/**
 * Transform an array of entities into a format that can be accepted by CBList
 * @param {array} entities -- Array of entity objects
 * @param {boolean} initials -- Show user avatars as initials instead of user avatar, default false
 * @param {function} method -- Method to be called with entity's ID as first argument on click, defaults to none
 * @param {string} firstArgProperty -- The TOP LEVEL property you would like bound to the first argument of the onClick function you pass
 */
import { getTranslation } from "orion-components/i18n";

const transformEntities = (entities, initials = false, method = null, firstArgProperty = null) => {
	const data = entities.map((ent) => {
		let avatar = "";
		let name = "";
		let id = "";
		let action = null;

		// SHAPES
		if (ent.entityType === "shape" || ent.entityType === "shapes") {
			const properties = ent.entityData.properties;
			const shapeType = properties.type;

			// set avatar
			if (shapeType === "Polygon") {
				avatar = "polygon";
			} else if (shapeType === "Point") {
				avatar = "point";
			} else if (shapeType === "Line") {
				avatar = "line";
			}

			// Set name and id
			name = properties.name;
			id = ent.id;

			if (method && firstArgProperty) {
				const curriedMethod = () => {
					method(ent[firstArgProperty]);
				};

				action = curriedMethod;
			}
		}

		// EVENTS
		if (ent.entityType === "event") {
			avatar = "event";
			name = ent.name;
			id = ent.id;

			if (method && firstArgProperty) {
				const curriedMethod = () => {
					method(ent[firstArgProperty]);
				};

				action = curriedMethod;
			}
		}

		// USERS
		// TODO: Find a better property to check for users
		if (!ent.entityType && ent.username) {
			if (!initials) {
				avatar = "user";
			} else {
				const getInitials = ent.name.match(/\b(\w)/g);
				const initials = getInitials.slice(0, 2).join("");
				avatar = initials;
			}

			name = ent.name;
			id = ent.id;

			// Set action
			if (method && firstArgProperty) {
				const curriedMethod = () => {
					method(ent[firstArgProperty]);
				};

				action = curriedMethod;
			}
		}

		// TRACKS
		if (ent.entityType === "track") {
			const properties = ent.entityData.properties;

			// TODO: Find a better fallback & check correct properties
			avatar = "track";
			name = properties.name
				? properties.name
				: getTranslation("global.CBComponents.CBList.helpers.nameNotFound");
			id = ent.id;

			if (method && firstArgProperty) {
				const curriedMethod = () => {
					method(ent[firstArgProperty]);
				};

				action = curriedMethod;
			}
		}

		// CAMERAS
		if (ent.entityType == "camera") {
			const properties = ent.entityData.properties;

			avatar = "camera";
			name = properties.name;
			id = ent.id;

			if (method && firstArgProperty) {
				const curriedMethod = () => {
					method(ent[firstArgProperty]);
				};

				action = curriedMethod;
			}
		}

		return {
			avatar,
			name,
			id,
			action
		};
	});

	return data;
};

export default transformEntities;

// ------------------------- EXAMPLE OF USE -------------------------

// --- Import in the list component
//
// import { List } from "orion-components/CBComponents";

// --- Any array of CB data (users, shapes, tracks, events, etc) will work
//
// const data = [
//	{
// 		"createdDate": Fri Nov 02 2018 14:43:55 GMT+00:00 ,
// 		"entityData": {
// 			"geometry": { ... } ,
// 			"properties": { ... } ,
// 			"type":  "Polygon"
// 		} ,
// 		"entityType":  "shapes" ,
// 		"feedId":  "ares_security_corporation_shapes" ,
// 		"id":  "90235f8f-1f18-4ea6-9651-58c44858ee45" ,
// 		"isDeleted": false ,
// 		"isPublic": false ,
// 		"lastModifiedDate": Fri Nov 02 2018 14:43:55 GMT+00:00 ,
// 		"owner":  "2c9c0362-345b-4f33-9976-219a4566b9c3" ,
// 		"ownerOrg":  "ares_security_corporation"
// 	}
// ]

// -- Optional: Create a method you'd like to be called on list item click
//
// const openProfile = (id) => {
// 	this.openProfile(id);
// };

// --- Transform your data.
// --- Pass true to 2nd argument if you want user initials instead of icons,
// --- Pass function to 3rd argument if you want something called on each list item click
// --- If you passed a function to 3rd argument, pass a string to 4th argument of the entity property
// ------ that you want bound to the first argument of your passed in function
//
// const transformedData = listTransform(data, true, logShapeId, "id");

// Pass your data to the CB list
//
// <List listItems={transformedData} />

// In this case, each list item clicked will open their entity profile!
