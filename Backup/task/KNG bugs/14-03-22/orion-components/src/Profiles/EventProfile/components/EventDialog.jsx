import React, { Component, Fragment } from "react";
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

// TODO: Add PropTypes
class EventDialog extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: "",
			description: "",
			startDate: null,
			endDate: null,
			isTemplate: false,
			template: -1
		};
	}
	componentDidUpdate(prevProps, prevState) {
		const { open, selectedEvent } = this.props;
		if (!prevProps.open && open && selectedEvent) {
			const { name, desc, startDate, endDate, isTemplate, template } = selectedEvent;
			this.setState({
				name,
				description: desc,
				startDate: startDate ? moment(startDate) : null,
				endDate: endDate ? moment(endDate) : null,
				isTemplate: isTemplate ? isTemplate : false,
				template: template ? template : -1
			});
		}
	}
	handleChange = name => event => {
		// Date Picker event does not have target prop, returns a moment date object
		const value =
			event && event.target && !_.isNil(event.target.value)
				? event.target.value
				: event;
		this.setState({ [name]: value });
	};
	handleSave = () => {
		const { selectedEvent = {}, editing } = this.props;
		const { name, description, startDate, endDate, isTemplate, template } = this.state;
		const event = {
			...selectedEvent,
			name,
			desc: description,
			startDate: startDate ? startDate.toISOString() : null,
			endDate: endDate ? endDate.toISOString() : null,
			isTemplate
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
		this.handleClose();
	};
	handleClose = () => {
		const { closeDialog, editing } = this.props;
		closeDialog(editing ? "eventEditDialog" : "eventCreateDialog");
		this.setState({
			name: "",
			description: "",
			startDate: null,
			endDate: null,
			isTemplate: false,
			template: -1
		});
	};
	render() {
		const { width, open, editing, allTemplates, selectedEvent, timeFormatPreference, dir, locale } = this.props;
		const { name, description, startDate, endDate, isTemplate, template } = this.state;
		const newTemplate = this.props.isTemplate;
		if (isTemplate === false && newTemplate === true) {
			this.setState({ isTemplate: true }); 
		}

		// -- minDate prop on TimePicker doesnt work in the current stable release of material-ui-pickers
		// -- so we are checking the values manually
		const validEndDate = !endDate || endDate > startDate;

		// StartDate is required for Events but not for Templates
		const disabled =
			Boolean((!name && isTemplate) || ((!name || !startDate) && !isTemplate) || !validEndDate);

		const styles = {
			pickers: {
				display: "flex",
				justifyContent: "space-between"
			},
			spacer: {
				padding: 16
			}
		};

		return (
			<Dialog
				open={open}
				confirm={{
					label: editing ? getTranslation("global.profiles.eventProfile.eventDialog.update") : getTranslation("global.profiles.eventProfile.eventDialog.create"),
					action: this.handleSave,
					disabled
				}}
				abort={{ label: getTranslation("global.profiles.eventProfile.eventDialog.cancel"), action: this.handleClose }}
				dir={dir}
			>
				<div style={{ width: width === "xs" ? "auto" : 500 }}>
					<TextField
						id="name"
						key="name"
						label={isTemplate ? getTranslation("global.profiles.eventProfile.eventDialog.fieldLabel.templateName") : getTranslation("global.profiles.eventProfile.eventDialog.fieldLabel.eventName")}
						value={name}
						handleChange={this.handleChange("name")}
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
						handleChange={this.handleChange("description")}
						fullWidth={true}
						dir={dir}
					/>
					{!selectedEvent && !isTemplate ? (
						<SelectField
							id="template"
							key="template"
							label={getTranslation("global.profiles.eventProfile.eventDialog.fieldLabel.template")}
							value={template}
							handleChange={this.handleChange("template")}
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
					{!isTemplate && (
						<Fragment>
							<div style={styles.pickers}>
								<DatePicker
									id="start-date"
									key="start-date"
									label={getTranslation("global.profiles.eventProfile.eventDialog.fieldLabel.startDate")}
									value={startDate}
									handleChange={this.handleChange("startDate")}
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
									handleChange={this.handleChange("startDate")}
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
									handleChange={this.handleChange("endDate")}
									minDate={startDate || "1900-01-01"}
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
									handleChange={this.handleChange("endDate")}
									minDate={startDate}
									format={`time_${timeFormatPreference}`}
									dir={dir}
									locale={locale}
									okLabel={getTranslation("global.profiles.eventProfile.eventDialog.dateLabel.ok")}
									cancelLabel={getTranslation("global.profiles.eventProfile.eventDialog.dateLabel.cancel")}
									clearLabel={getTranslation("global.profiles.eventProfile.eventDialog.dateLabel.clear")}
				
								/>
							</div>
							{!validEndDate && <p style={dir == "rtl" ? {color: "red", fontSize: 12, marginRight: 266} : {color: "red", fontSize: 12, marginLeft: 266}}><Translate value="global.profiles.eventProfile.eventDialog.fieldLabel.endTimeText" /></p>}
						</Fragment>
					)}
				</div>
			</Dialog>
		);
	}
}

export default withWidth()(EventDialog);
