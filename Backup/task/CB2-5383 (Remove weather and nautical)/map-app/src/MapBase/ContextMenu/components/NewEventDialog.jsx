import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Dialog } from "orion-components/CBComponents";
import {
	eventService,
	timeConversion
} from "client-app-core";
import {
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Typography
} from "@material-ui/core";
import { point } from "@turf/helpers";
import _ from "lodash";
import { Translate, getTranslation } from "orion-components/i18n/I18nContainer";
import { withStyles } from "@material-ui/core/styles";

const styles = {
	select: {
		paddingRight: "0!important"
	},
	icon: {
		right: "unset!important",
		left: "0!important"
	}
};

const propTypes = {
	open: PropTypes.bool.isRequired,
	close: PropTypes.func.isRequired,
	lngLat: PropTypes.shape({
		lng: PropTypes.number,
		lat: PropTypes.number
	}),
	loadProfile: PropTypes.func.isRequired,
	timeFormatPreference: PropTypes.string,
	classes: PropTypes.object.isRequired
};

const defaultProps = {
	lngLat: null,
	timeFormatPreference: "12-hour"
};

const NewEventDialog = ({ open, close, lngLat, loadProfile, timeFormatPreference, dir, classes }) => {
	const [templates, setTemplates] = useState([]);
	const [template, setTemplate] = useState({});
	const now = new Date();
	const date = timeConversion.convertToUserTime(
		now,
		"MMM D, YYYY HH:mm z"
	);
	const dateTimeFormat = `MMM D, YYYY ${timeFormatPreference === "24-hour" ? "HH" : "hh"}:mm ${timeFormatPreference === "24-hour" ? "" : "A "}z`;
	const formattedDateString = timeConversion.convertToUserTime(now, dateTimeFormat);
	useEffect(() => {
		eventService.getAllTemplates((err, response) => {
			if (err) {
				console.log("ERROR", err);
			} else {
				response.splice(0, 0, {});
				setTemplates(response);
			}
		});
		return () => { };
	}, []);
	const handleClose = () => {
		setTemplate({});
		close();
	};
	const handleChangeTemplate = e => {
		setTemplate(templates.find(template => template.id === e.target.value));
	};
	const handleSave = () => {
		const entityData = point([lngLat.lng, lngLat.lat], {
			name: `${_.isEmpty(template) ? "New Event" : template.name} - ${formattedDateString}`
		});
		const { coordinates } = entityData.geometry;
		entityData.geometry.coordinates = Object.values(coordinates);
		const event = {
			name: `${_.isEmpty(template) ? "New Event" : template.name} - ${formattedDateString}`,
			startDate: date,
			entityData,
			template: template.id
		};
		eventService.createEvent(event, (err, response) => {
			if (err) {
				console.log("ERROR", err);
			} else {
				const { id, name, entityType } = response;
				loadProfile(id, name, entityType);
			}
		});
		handleClose();
	};
	return (
		<Dialog
			title={getTranslation("mapBase.contextMenu.newEventDialog.createEvent")}
			open={open}
			confirm={{ label: getTranslation("mapBase.contextMenu.newEventDialog.create"), action: handleSave }}
			abort={{ label: getTranslation("mapBase.contextMenu.newEventDialog.cancel"), action: handleClose }}
		>
			<div style={{ display: "flex", flexDirection: "column" }}>
				{!!lngLat && (
					<Fragment>
						<Typography variant="caption"><Translate value="mapBase.contextMenu.newEventDialog.eventName" /></Typography>
						<Typography variant="h6">{`${_.isEmpty(template) ? getTranslation("mapBase.contextMenu.newEventDialog.newEvent") : template.name
							} - ${formattedDateString}`}</Typography>
					</Fragment>
				)}
				<FormControl margin="normal" style={{ minWidth: 150 }}>
					<InputLabel style={dir && dir == "rtl" ? { left: "unset", transformOrigin: "top right" } : {}}><Translate value="mapBase.contextMenu.newEventDialog.selectTemplate" /></InputLabel>
					<Select fullWidth value={template.id || ""} onChange={handleChangeTemplate} inputProps={{
						classes: (dir && dir == "rtl" ? { icon: classes.icon } : {})
					}}>
						{templates
							.map(template => {
								return (
									<MenuItem key={!!template.id ? template.id : "blank"} value={template.id}>
										{_.isEmpty(template) ? <Translate value="mapBase.contextMenu.newEventDialog.blank" /> : template.name}
									</MenuItem>
								);
							})}
					</Select>
				</FormControl>
			</div>
		</Dialog>
	);
};

NewEventDialog.propTypes = propTypes;
NewEventDialog.defaultProps = defaultProps;

export default withStyles(styles)(NewEventDialog);
