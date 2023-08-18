import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Dialog, SelectField } from "orion-components/CBComponents";
import { eventService, timeConversion } from "client-app-core";
import { MenuItem, Typography } from "@mui/material";
import { point } from "@turf/helpers";
import { Translate, getTranslation } from "orion-components/i18n";
import { withStyles } from "@mui/styles";
import moment from "moment";
import { useDispatch } from "react-redux";
import isEmpty from "lodash/isEmpty";
import concat from "lodash/concat";

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
	classes: PropTypes.object.isRequired,
	locale: PropTypes.string,
	dir: PropTypes.string
};

const defaultProps = {
	lngLat: null,
	timeFormatPreference: "12-hour",
	locale: "en"
};

const NewEventDialog = ({
	open,
	close,
	lngLat,
	loadProfile,
	timeFormatPreference,
	dir,
	locale
}) => {
	const dispatch = useDispatch();

	const [templates, setTemplates] = useState([]);
	const [template, setTemplate] = useState({});
	const now = new Date();
	const date = timeConversion.convertToUserTime(now, "MMM D, YYYY HH:mm z");
	const dateTimeFormat = `MMM D, YYYY ${
		timeFormatPreference === "24-hour" ? "HH" : "hh"
	}:mm ${timeFormatPreference === "24-hour" ? "" : "A "}z`;
	const formattedDateString = timeConversion.convertToUserTime(
		now,
		dateTimeFormat,
		locale
	);
	useEffect(() => {
		eventService.getAllTemplates((err, response) => {
			if (err) {
				console.log("ERROR", err);
			} else {
				response.splice(0, 0, {});
				setTemplates(response);
			}
		});
		return () => {};
	}, []);
	const handleClose = () => {
		setTemplate({});
		close();
	};
	const handleChangeTemplate = (e) => {
		setTemplate(
			templates.find((template) => template.id === e.target.value)
		);
	};
	const handleSave = () => {
		const entityData = point([lngLat.lng, lngLat.lat], {
			name: `${
				isEmpty(template)
					? getTranslation(
							"mapBase.contextMenu.newEventDialog.newEvent"
					  )
					: template.name
			} - ${formattedDateString}`
		});
		const { coordinates } = entityData.geometry;
		entityData.geometry.coordinates = Object.values(coordinates);
		const event = {
			name: `${
				isEmpty(template)
					? getTranslation(
							"mapBase.contextMenu.newEventDialog.newEvent"
					  )
					: template.name
			} - ${formattedDateString}`,
			startDate: moment(date),
			entityData,
			template: template.id
		};
		eventService.createEvent(event, (err, response) => {
			if (err) {
				console.log("ERROR", err);
			} else {
				const { id, name, entityType } = response;
				dispatch(loadProfile(id, name, entityType));
			}
		});
		handleClose();
	};
	return (
		<Dialog
			title={getTranslation(
				"mapBase.contextMenu.newEventDialog.createEvent"
			)}
			open={open}
			confirm={{
				label: getTranslation(
					"mapBase.contextMenu.newEventDialog.create"
				),
				action: handleSave
			}}
			abort={{
				label: getTranslation(
					"mapBase.contextMenu.newEventDialog.cancel"
				),
				action: handleClose
			}}
		>
			<div style={{ display: "flex", flexDirection: "column" }}>
				{!!lngLat && (
					<Fragment>
						<Typography variant="caption">
							<Translate value="mapBase.contextMenu.newEventDialog.eventName" />
						</Typography>
						{isEmpty(template) ? (
							<Typography variant="h6">
								{" "}
								<Translate value="mapBase.contextMenu.newEventDialog.newEvent" />
								- {formattedDateString}{" "}
							</Typography>
						) : (
							<Typography variant="h6">
								{concat(template.name, [
									" - ",
									formattedDateString
								])}
							</Typography>
						)}
					</Fragment>
				)}
				<SelectField
					label={getTranslation(
						"mapBase.contextMenu.newEventDialog.selectTemplate"
					)}
					handleChange={handleChangeTemplate}
					value={template.id || ""}
					dir={dir}
				>
					{templates.map((template) => {
						return (
							<MenuItem
								key={template.id ? template.id : "blank"}
								value={template.id}
							>
								{isEmpty(template) ? (
									<Translate value="mapBase.contextMenu.newEventDialog.blank" />
								) : (
									template.name
								)}
							</MenuItem>
						);
					})}
				</SelectField>
			</div>
		</Dialog>
	);
};

NewEventDialog.propTypes = propTypes;
NewEventDialog.defaultProps = defaultProps;

export default withStyles(styles)(NewEventDialog);
