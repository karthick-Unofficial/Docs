import React, { Component, Fragment, useEffect, useState } from "react";
import { eventService } from "client-app-core";
import {
	Dialog,
	SelectField,
	TextField,
	DatePicker,
	TimePicker
} from "orion-components/CBComponents";
import { withWidth, MenuItem } from "@material-ui/core";
import _ from "lodash";
import moment from "moment";
import { Translate, getTranslation } from "orion-components/i18n/I18nContainer";
import { InsertEmoticonSharp } from "@material-ui/icons";

// TODO: Add PropTypes
const EventDialog = ({
	editing,
	closeDialog,
	width,
	open,
	allTemplates,
	selectedEvent,
	timeFormatPreference,
	dir,
	locale,
	isTemplate
}) => {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);
	const [checkTemplate, setCheckTemplate] = useState(false);
	const [template, setTemplate] = useState(-1);

	const handleChange = (name, setState) => event => {
		// Date Picker event does not have target prop, returns a moment date object
		const value =
			event && event.target && !_.isNil(event.target.value)
				? event.target.value
				: event;
		setState(value);
	};

	const handleSave = () => {

		const event = {
			...selectedEvent,
			name,
			desc: description,
			startDate: startDate ? startDate.toISOString() : null,
			endDate: endDate ? endDate.toISOString() : null,
			isTemplate: checkTemplate
		};
		if (template && template !== -1) event["template"] = template;

		if (event.entityData && event.entityData.properties) {
			event.entityData.properties.name = name;
		}
		editing
			? eventService.updateEvent(selectedEvent.id, event, (err, response) => {
				if (err) console.log(err);
			})
			: eventService.createEvent(event, (err, response) => {
				if (err) console.log(err);
			});
		handleClose();
	};

	const handleClose = () => {

		closeDialog(editing ? "eventEditDialog" : "eventCreateDialog");
		setName("");
		setDescription("");
		setStartDate(null);
		setEndDate(null);
		setCheckTemplate(false);
		setTemplate(-1);
	};

	const newTemplate = isTemplate;
	if (checkTemplate === false && newTemplate === true) {
		setCheckTemplate(true);
	}

	// -- minDate prop on TimePicker doesnt work in the current stable release of material-ui-pickers
	// -- so we are checking the values manually
	const validEndDate = !endDate || endDate > startDate;

	// StartDate is required for Events but not for Templates
	const disabled =
		Boolean((!name && checkTemplate) || ((!name || !startDate) && !checkTemplate) || !validEndDate);

	const styles = {
		pickers: {
			display: "flex",
			justifyContent: "space-between"
		},
		spacer: {
			padding: 16
		}
	};

	useEffect(() => {
		if (open && selectedEvent) {
			const { name, desc, startDate, endDate, isTemplate, template } = selectedEvent;
			setName(name);
			setDescription(desc);
			setStartDate(startDate ? moment(startDate) : null);
			setEndDate(endDate ? moment(endDate) : null);
			setCheckTemplate(isTemplate ? isTemplate : false);
			setTemplate(template ? template : -1);
		}

	}, [open, selectedEvent]);

	return (
		<Dialog
			open={open}
			confirm={{
				label: editing ? getTranslation("global.profiles.eventProfile.eventDialog.update") : getTranslation("global.profiles.eventProfile.eventDialog.create"),
				action: handleSave,
				disabled
			}}
			abort={{ label: getTranslation("global.profiles.eventProfile.eventDialog.cancel"), action: handleClose }}
			dir={dir}
		>
			<div style={{ width: width === "xs" ? "auto" : 500 }}>
				<TextField
					id="name"
					key="name"
					label={checkTemplate ? getTranslation("global.profiles.eventProfile.eventDialog.fieldLabel.templateName") : getTranslation("global.profiles.eventProfile.eventDialog.fieldLabel.eventName")}
					value={name}
					handleChange={handleChange("name", setName)}
					fullWidth={true}
					required={true}
					autoFocus={!editing}
					dir={dir}
				/>
				<TextField
					id="description"
					key="description"
					label={getTranslation("global.profiles.eventProfile.eventDialog.fieldLabel.description")}
					value={description}
					handleChange={handleChange("description", setDescription)}
					fullWidth={true}
					dir={dir}
				/>
				{!selectedEvent && !checkTemplate ? (
					<SelectField
						id="template"
						key="template"
						label={getTranslation("global.profiles.eventProfile.eventDialog.fieldLabel.template")}
						value={template}
						handleChange={handleChange("template", setTemplate)}
						dir={dir}
					>
						<MenuItem key={"0"} value={-1} style={{ display: "flex" }}><Translate value="global.profiles.eventProfile.eventDialog.fieldLabel.none" /></MenuItem>
						{/* TODO: Update CB SelectField to take a clearable prop and move "None" option to component */}
						{_.map(allTemplates, template => {
							return (
								<MenuItem
									key={template.id}
									value={template.id}
									style={{ display: "flex" }}
								>
									{template.name}
								</MenuItem>
							);
						})}
					</SelectField>
				) : (
					""
				)}
				{!checkTemplate && (
					<Fragment>
						<div style={styles.pickers}>
							<DatePicker
								id="start-date"
								key="start-date"
								label={getTranslation("global.profiles.eventProfile.eventDialog.fieldLabel.startDate")}
								value={startDate}
								handleChange={handleChange("startDate", setStartDate)}
								dir={dir}
								locale={locale}
								okLabel={getTranslation("global.profiles.eventProfile.eventDialog.dateLabel.ok")}
								cancelLabel={getTranslation("global.profiles.eventProfile.eventDialog.dateLabel.cancel")}
								clearLabel={getTranslation("global.profiles.eventProfile.eventDialog.dateLabel.clear")}

							/>
							<div style={styles.spacer} />
							<TimePicker
								id="start-time"
								key="start-time"
								label={getTranslation("global.profiles.eventProfile.eventDialog.fieldLabel.startTime")}
								value={startDate}
								handleChange={handleChange("startDate", setStartDate)}
								format={`time_${timeFormatPreference}`}
								dir={dir}
								locale={locale}
								okLabel={getTranslation("global.profiles.eventProfile.eventDialog.dateLabel.ok")}
								cancelLabel={getTranslation("global.profiles.eventProfile.eventDialog.dateLabel.cancel")}
								clearLabel={getTranslation("global.profiles.eventProfile.eventDialog.dateLabel.clear")}

							/>
						</div>
						<div style={styles.pickers}>
							<DatePicker
								id="end-date"
								key="end-date"
								label={getTranslation("global.profiles.eventProfile.eventDialog.fieldLabel.endDate")}
								value={endDate}
								handleChange={handleChange("endDate", setEndDate)}
								dir={dir}
								locale={locale}
								okLabel={getTranslation("global.profiles.eventProfile.eventDialog.dateLabel.ok")}
								cancelLabel={getTranslation("global.profiles.eventProfile.eventDialog.dateLabel.cancel")}
								clearLabel={getTranslation("global.profiles.eventProfile.eventDialog.dateLabel.clear")}

							/>
							<div style={styles.spacer} />
							<TimePicker
								id="end-time"
								key="end-time"
								label={getTranslation("global.profiles.eventProfile.eventDialog.fieldLabel.endTime")}
								value={endDate}
								handleChange={handleChange("endDate", setEndDate)}
								minDate={startDate}
								format={`time_${timeFormatPreference}`}
								dir={dir}
								locale={locale}
								okLabel={getTranslation("global.profiles.eventProfile.eventDialog.dateLabel.ok")}
								cancelLabel={getTranslation("global.profiles.eventProfile.eventDialog.dateLabel.cancel")}
								clearLabel={getTranslation("global.profiles.eventProfile.eventDialog.dateLabel.clear")}

							/>
						</div>
						{!validEndDate && <p style={dir === "rtl" ? { color: "red", fontSize: 12, marginRight: 266 } : { color: "red", fontSize: 12, marginLeft: 266 }}><Translate value="global.profiles.eventProfile.eventDialog.fieldLabel.endTimeText" /></p>}
					</Fragment>
				)}
			</div>
		</Dialog>
	);
};
export default withWidth()(EventDialog);
