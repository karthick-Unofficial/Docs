import React, { Fragment, useEffect, useState, useRef } from "react";
import { eventService } from "client-app-core";
import {
	Dialog,
	SelectField,
	TextField,
	DatePicker,
	TimePicker
} from "orion-components/CBComponents";
import { useMediaQuery, MenuItem } from "@mui/material";
import { useTheme } from "@mui/styles";
import moment from "moment";
import { Translate, getTranslation } from "orion-components/i18n";
import { useDispatch, useSelector } from "react-redux";
import isNil from "lodash/isNil";
import map from "lodash/map";

// TODO: Add PropTypes
const EventDialog = (props) => {
	const {
		editing,
		closeDialog,
		open,
		allTemplates,
		selectedEvent,
		dir,
		isTemplate
	} = props;
	const dispatch = useDispatch();

	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [startDate, setStartDate] = useState(null);
	const [startTime, setStartTime] = useState(null);
	const [endDate, setEndDate] = useState(null);
	const [endTime, setEndTime] = useState(null);
	const [checkTemplate, setCheckTemplate] = useState(false);
	const [template, setTemplate] = useState(-1);
	const timeFormatPreference = useSelector(
		(state) => state.appState.global.timeFormat
	);

	const theme = useTheme();
	const isXS = useMediaQuery(theme.breakpoints.only("xs"));

	const handleChange = (name, setState) => (event) => {
		// Date Picker event does not have target prop, returns a moment date object
		const value =
			event && event.target && !isNil(event.target.value)
				? event.target.value
				: event;
		if (name === "startDate") {
			setStartTime(new Date());
			setStartDate(value);
		}
		if (name === "endDate") {
			setEndTime(new Date());
			setEndDate(value);
		}
		if (name === "endTime") {
			setEndDate(value);
		}
		if (name === "startTime") {
			setStartDate(value);
		}

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
			? eventService.updateEvent(
					selectedEvent.id,
					event,
					(err, response) => {
						if (err) console.log(err, response);
					}
			  )
			: eventService.createEvent(event, (err, response) => {
					if (err) console.log(err, response);
			  });
		handleClose();
	};

	const handleClose = () => {
		if (editing) {
			dispatch(closeDialog("eventEditDialog"));
		} else {
			closeDialog("eventCreateDialog");
		}
		setName("");
		setDescription("");
		setStartDate(null);
		setEndDate(null);
		setStartTime(null);
		setEndTime(null);
		setCheckTemplate(false);
		setTemplate(-1);
	};

	const newTemplate = isTemplate;
	if (checkTemplate === false && newTemplate === true) {
		setCheckTemplate(true);
	}

	// -- minDate prop on TimePicker doesn't work in the current stable release of material-ui-pickers
	// -- so we are checking the values manually
	const validEndDate = !endDate || endDate > startDate;

	// StartDate is required for Events but not for Templates
	const disabled = Boolean(
		(!name && checkTemplate) ||
			((!name || !startDate) && !checkTemplate) ||
			!validEndDate
	);

	const styles = {
		pickers: {
			display: "flex",
			justifyContent: "space-between"
		},
		spacer: {
			padding: 16
		}
	};

	const usePrevious = (value) => {
		const ref = useRef();
		useEffect(() => {
			ref.current = value;
		}, [value]);
		return ref.current;
	};

	const prevProps = usePrevious(props);

	useEffect(() => {
		if (prevProps && !prevProps.open && open && selectedEvent) {
			const { name, desc, startDate, endDate, isTemplate, template } =
				selectedEvent;
			setName(name);
			setDescription(desc);
			setStartDate(startDate ? moment(startDate) : null);
			setStartTime(startDate ? startDate : null);
			setEndDate(endDate ? moment(endDate) : null);
			setEndTime(endDate ? endDate : null);
			setCheckTemplate(isTemplate ? isTemplate : false);
			setTemplate(template ? template : -1);
		}
	}, [props]);

	return (
		<Dialog
			open={open}
			confirm={{
				label: editing
					? getTranslation(
							"global.profiles.eventProfile.eventDialog.update"
					  )
					: getTranslation(
							"global.profiles.eventProfile.eventDialog.create"
					  ),
				action: handleSave,
				disabled
			}}
			abort={{
				label: getTranslation(
					"global.profiles.eventProfile.eventDialog.cancel"
				),
				action: handleClose
			}}
			dir={dir}
			dialogContentStyles={{ padding: "20px 24px 8px 24px" }}
		>
			<div style={{ width: isXS ? "auto" : 500 }}>
				<TextField
					id="name"
					key="name"
					label={
						checkTemplate
							? getTranslation(
									"global.profiles.eventProfile.eventDialog.fieldLabel.templateName"
							  )
							: getTranslation(
									"global.profiles.eventProfile.eventDialog.fieldLabel.eventName"
							  )
					}
					value={name}
					handleChange={handleChange("name", setName)}
					fullWidth={true}
					required={true}
					autoFocus={!editing}
					dir={dir}
					inputLabelStyle={{
						fontSize: 14,
						color: "rgb(181, 185, 190)"
					}}
				/>
				<TextField
					id="description"
					key="description"
					label={getTranslation(
						"global.profiles.eventProfile.eventDialog.fieldLabel.description"
					)}
					value={description}
					handleChange={handleChange("description", setDescription)}
					fullWidth={true}
					dir={dir}
					inputLabelStyle={{
						fontSize: 14,
						color: "rgb(181, 185, 190)"
					}}
				/>
				{!selectedEvent && !checkTemplate ? (
					<SelectField
						id="template"
						key="template"
						label={getTranslation(
							"global.profiles.eventProfile.eventDialog.fieldLabel.template"
						)}
						value={template}
						handleChange={handleChange("template", setTemplate)}
						dir={dir}
					>
						<MenuItem
							key={"0"}
							value={-1}
							style={{ display: "flex" }}
						>
							<Translate value="global.profiles.eventProfile.eventDialog.fieldLabel.none" />
						</MenuItem>
						{/* TODO: Update CB SelectField to take a clearable prop and move "None" option to component */}
						{map(allTemplates, (template) => {
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
								label={getTranslation(
									"global.profiles.eventProfile.eventDialog.fieldLabel.startDate"
								)}
								value={startDate}
								handleChange={handleChange(
									"startDate",
									setStartDate
								)}
								dir={dir}
							/>
							<div style={styles.spacer} />
							<TimePicker
								id="start-time"
								key="start-time"
								label={getTranslation(
									"global.profiles.eventProfile.eventDialog.fieldLabel.startTime"
								)}
								value={startTime}
								handleChange={handleChange(
									"startTime",
									setStartTime
								)}
								format={`time_${timeFormatPreference}`}
								dir={dir}
							/>
						</div>
						<div style={styles.pickers}>
							<DatePicker
								id="end-date"
								key="end-date"
								label={getTranslation(
									"global.profiles.eventProfile.eventDialog.fieldLabel.endDate"
								)}
								value={endDate}
								handleChange={handleChange(
									"endDate",
									setEndDate
								)}
								minDate={startDate}
								dir={dir}
							/>
							<div style={styles.spacer} />
							<TimePicker
								id="end-time"
								key="end-time"
								label={getTranslation(
									"global.profiles.eventProfile.eventDialog.fieldLabel.endTime"
								)}
								value={endTime}
								handleChange={handleChange(
									"endTime",
									setEndTime
								)}
								minDate={startTime}
								format={`time_${timeFormatPreference}`}
								dir={dir}
							/>
						</div>
						{!validEndDate && (
							<p
								style={
									dir === "rtl"
										? {
												color: "red",
												fontSize: 12,
												marginRight: 266
										  }
										: {
												color: "red",
												fontSize: 12,
												marginLeft: 266
										  }
								}
							>
								<Translate value="global.profiles.eventProfile.eventDialog.fieldLabel.endTimeText" />
							</p>
						)}
					</Fragment>
				)}
			</div>
		</Dialog>
	);
};
export default EventDialog;
