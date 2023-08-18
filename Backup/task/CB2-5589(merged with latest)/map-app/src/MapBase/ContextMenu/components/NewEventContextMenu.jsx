import React, { Fragment, useEffect, useState } from "react";
import { ListItemText } from "@mui/material";
import NestedMenuItem from "orion-components/Map/ContextMenu/components/NestedMenuItem";
import ContextMenuItem from "orion-components/Map/ContextMenu/components/ContextMenuItem";
import { getTranslation } from "orion-components/i18n";
import { eventService, timeConversion } from "client-app-core";
import isEmpty from "lodash/isEmpty";
import { point } from "@turf/helpers";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { getDir } from "orion-components/i18n/Config/selector";
import { loadProfile } from "../contextMenuActions";

const propTypes = {
	anchorPosition: PropTypes.shape({
		top: PropTypes.number,
		left: PropTypes.number
	}),
	lngLat: PropTypes.shape({
		lng: PropTypes.number,
		lat: PropTypes.number
	}),
	closeContextMenu: PropTypes.func
};

const defaultProps = {
	lngLat: null
};

function orderBy(items, fields, directions) {
	const start = items.slice(0, 1);
	const end = items.slice(1);
	const sorted = end.sort(function (a, b) {
		for (let i = 0; i < fields.length; i++) {
			const field = fields[i];
			const direction = directions[i] === "asc" ? 1 : -1;
			if (a[field] > b[field]) {
				return direction;
			}
			if (a[field] < b[field]) {
				return -direction;
			}
		}
		return 0;
	});
	return start.concat(sorted);
}

const NewEventContextMenu = ({ anchorPosition, lngLat, closeContextMenu }) => {
	const dir = useSelector((state) => getDir(state));
	const locale = useSelector((state) => state.i18n.locale);
	const timeFormatPreference = useSelector((state) => state.appState.global.timeFormat);

	const [eventTemplates, setEventTemplates] = useState([
		{
			id: "0",
			name: getTranslation("mapBase.contextMenu.newEventContextMenu.noTemplate")
		}
	]);

	const now = new Date();
	const date = timeConversion.convertToUserTime(now, "MMM D, YYYY HH:mm z");
	const dateTimeFormat = `MMM D, YYYY ${timeFormatPreference === "24-hour" ? "HH" : "hh"}:mm ${
		timeFormatPreference === "24-hour" ? "" : "A "
	}z`;
	const formattedDateString = timeConversion.convertToUserTime(now, dateTimeFormat, locale);

	const dispatch = useDispatch();

	useEffect(() => {
		eventService.getAllTemplates((err, response) => {
			if (err) {
				console.log("ERROR", err);
			} else {
				setEventTemplates([...eventTemplates, ...response]);
			}
		});
	}, []);

	const handleSave = (template) => {
		const entityData = point([lngLat.lng, lngLat.lat], {
			name: `${
				isEmpty(template) ? getTranslation("mapBase.contextMenu.newEventContextMenu.newEvent") : template.name
			} - ${formattedDateString}`
		});
		const { coordinates } = entityData.geometry;
		entityData.geometry.coordinates = Object.values(coordinates);
		const event = {
			name: `${
				isEmpty(template) ? getTranslation("mapBase.contextMenu.newEventContextMenu.newEvent") : template.name
			} - ${formattedDateString}`,
			startDate: moment(date),
			entityData,
			...(!isEmpty(template) && { template: template.id })
		};
		eventService.createEvent(event, (err, response) => {
			if (err) {
				console.log("ERROR", err);
			} else {
				const { id, name, entityType } = response;
				dispatch(loadProfile(id, name, entityType));
			}
		});
	};

	return (
		<NestedMenuItem
			key="events"
			label={getTranslation("mapBase.contextMenu.appContextMenu.createEvent")}
			parentMenuOpen={!!anchorPosition}
			dir={dir}
			isUsedForEventCreation={true}
		>
			{orderBy(eventTemplates, ["name"], ["asc"]).map((template, index) => {
				return (
					<Fragment key={`item-group-${template.id}`}>
						<ContextMenuItem
							key={template.id}
							onClick={() => {
								handleSave(index !== 0 ? template : {});
								closeContextMenu();
							}}
						>
							<ListItemText primary={template.name} style={dir == "rtl" ? { textAlign: "right" } : {}} />
						</ContextMenuItem>
						{index === 0 && (
							<div
								key="newEventContextMenu-divider"
								style={{
									height: 1,
									width: "100%",
									backgroundColor: "#8b8d91"
								}}
							/>
						)}
					</Fragment>
				);
			})}
		</NestedMenuItem>
	);
};

NewEventContextMenu.propTypes = propTypes;
NewEventContextMenu.defaultProps = defaultProps;

export default NewEventContextMenu;
