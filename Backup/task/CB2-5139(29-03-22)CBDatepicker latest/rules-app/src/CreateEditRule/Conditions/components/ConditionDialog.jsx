import React, { Component } from "react";
import FlatButton from "material-ui/FlatButton";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";
import TextField from "material-ui/TextField";
import TimeInput from "./TimeInput";
import MomentTZ from "moment-timezone";

import Dialog from "material-ui/Dialog";
import { DatePicker } from "orion-components/CBComponents";
import RadioButtonGroup from "material-ui/RadioButton/RadioButtonGroup";
import RadioButton from "material-ui/RadioButton/RadioButton";

import moment from "moment";

import { timeConversion } from "client-app-core";
import { Translate, getTranslation } from "orion-components/i18n/I18nContainer";

const parseDate = date => {
	return moment(date).set({ hour: 0, minute: 0, second: 0 })._d;
};

class ConditionDialog extends Component {
	constructor(props) {
		super(props);
		const { timeFormatPreference } = this.props;

		const endOfYear = new Date();
		endOfYear.setMonth(11);
		endOfYear.setDate(31);
		this.state = {
			conditionTypeValue: null,
			dialogError: "",
			minSpeedValue: "",
			durationValue: 0,
			maxSpeedValue: "",
			collectionValue: "",
			conditionIndefiniteValue: true,
			conditionAnyTimeValue: true,
			startDateValue: parseDate(new Date()),
			endDateValue: endOfYear,
			weekdaysValue: [1, 2, 3, 4, 5],
			beforeTimeValue: timeFormatPreference === "24-hour" ? "6:00" : "6:00 AM",
			afterTimeValue: timeFormatPreference === "24-hour" ? "18:00" : "6:00 PM",
			speedUnit: "kn",
			conditionIndefiniteState: "",
			conditionAnyTimeState: ""
		};
	}

	UNSAFE_componentWillMount() {
		document.addEventListener("keydown", this._handleKeyDown.bind(this));
	}

	componentWillUnmount() {
		document.removeEventListener("keydown", this._handleKeyDown.bind(this));
	}

	// Enter to submit
	_handleKeyDown = event => {
		if (event.key === "Enter" && this.state.conditionTypeValue !== null) {
			this.handleCondition();
		}
	};

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (nextProps.editing) {
			const { timeFormatPreference } = this.props;

			const endOfYear = new Date();
			endOfYear.setMonth(11);
			endOfYear.setDate(31);
			const editingCondition = nextProps.conditions[nextProps.editingIndex];
			const type = editingCondition.type;

			// Handle timezone conversion
			let startTime = "6:00",
				endTime = "18:00";
			if (type === "time") {
				const timeFormat = timeFormatPreference === "24-hour" ? "H:mm" : "h:mm A";
				if (editingCondition.startTime) {
					startTime = MomentTZ.utc(editingCondition.startTime, "h:mm A")
						.tz(MomentTZ.tz.guess())
						.format(timeFormat);
				}
				if (editingCondition.endTime)
					endTime = MomentTZ.utc(editingCondition.endTime, "h:mm A")
						.tz(MomentTZ.tz.guess())
						.format(timeFormat);
			}

			this.setState({
				// These properties will only exist on the existing condition object depending on the type
				conditionTypeValue: editingCondition.type,
				dialogError: "",
				minSpeedValue: type === "speed" ? editingCondition.minSpeed : "",
				maxSpeedValue: type === "speed" ? editingCondition.maxSpeed : "",
				collectionValue:
					type === "in-collection" || "not-in-collection"
						? editingCondition.id
						: "",
				conditionIndefiniteValue:
					type === "time" ?
						(this.state.conditionIndefiniteState != "set-range" && editingCondition.indefinite == true ? true : false)
						: true,
				conditionAnyTimeValue:
					type === "time" ?
						(this.state.conditionAnyTimeState != "set-period" && editingCondition.anyTimeOfDay == true ? true : false)
						: true,
				// Dates and times can get saved as null, so we need a fallback value
				startDateValue:
					type === "time"
						? editingCondition.startDate || parseDate(new Date())
						: parseDate(new Date()),
				endDateValue:
					type === "time" ? editingCondition.endDate || endOfYear : endOfYear,
				beforeTimeValue: startTime,
				afterTimeValue: endTime,
				weekdaysValue:
					type === "time" ? editingCondition.weekdays : [1, 2, 3, 4, 5],
				durationValue: type === "duration" ? editingCondition.duration : 0,
				speedUnit: editingCondition.unit || "kn"
			});
		}
	}

	_capitalize = string => {
		return string.slice(0, 1).toUpperCase() + string.slice(1, string.length);
	};

	handleConditionDialogClose = () => {
		const { timeFormatPreference } = this.props;

		const endOfYear = new Date();
		endOfYear.setMonth(11);
		endOfYear.setDate(31);
		this.setState({
			conditionTypeValue: "",
			dialogError: "",
			minSpeedValue: "",
			maxSpeedValue: "",
			collectionValue: "",
			durationValue: 0,
			weekdaysValue: [1, 2, 3, 4, 5],
			beforeTimeValue: timeFormatPreference === "24-hour" ? "6:00" : "6:00 AM",
			afterTimeValue: timeFormatPreference === "24-hour" ? "18:00" : "6:00 PM",
			startDateValue: parseDate(new Date()),
			endDateValue: endOfYear,
			conditionIndefiniteValue: true,
			conditionAnyTimeValue: true,
			conditionIndefiniteState: "",
			conditionAnyTimeState: ""
		});
		this.props.closeDialog();
	};

	selectConditionType = (e, index, value) => {
		if (value === this.state.conditionTypeValue) {
			return;
		}
		const { timeFormatPreference } = this.props;

		const endOfYear = new Date();
		endOfYear.setMonth(11);
		endOfYear.setDate(31);
		this.setState({
			conditionTypeValue: value,
			dialogError: "",
			minSpeedValue: "",
			maxSpeedValue: "",
			collectionValue: "",
			weekdaysValue: [1, 2, 3, 4, 5],
			beforeTimeValue: timeFormatPreference === "24-hour" ? "6:00" : "6:00 AM",
			afterTimeValue: timeFormatPreference === "24-hour" ? "18:00" : "6:00 PM",
			startDateValue: parseDate(new Date()),
			endDateValue: endOfYear,
			conditionIndefiniteValue: true,
			conditionAnyTimeValue: true,
			conditionIndefiniteState: "",
			conditionAnyTimeState: ""
		});
	};

	// Speed condition

	handleMinSpeedInput = e => {
		let newValue = e.target.value;
		while (newValue.length > 0 && isNaN(newValue)) {
			newValue = newValue.substring(0, newValue.length - 1);
		}
		this.setState({
			minSpeedValue: newValue
		});
	};

	handleMaxSpeedInput = e => {
		let newValue = e.target.value;
		while (newValue.length > 0 && isNaN(newValue)) {
			newValue = newValue.substring(0, newValue.length - 1);
		}
		this.setState({
			maxSpeedValue: newValue
		});
	};

	// Collection Condition

	selectCollection = (e, index, value) => {
		this.setState({
			collectionValue: value
		});
	};

	// Time Condition

	checkIndefinite = value => {
		this.setState({
			conditionIndefiniteValue: value === "indefinite" ? true : false,
			conditionIndefiniteState: value
		});
	};

	checkAnyTime = value => {
		this.setState({
			conditionAnyTimeValue: value === "all-day" ? true : false,
			conditionAnyTimeState: value
		});
	};

	handleStartDateSelect = (date) => {
		let value = timeConversion.convertToUserTime(date, "L");
		this.setState({
			startDateValue: parseDate(value)
		});
	};

	handleEndDateSelect = (date) => {
		let value = timeConversion.convertToUserTime(date, "L");
		this.setState({
			endDateValue: parseDate(value)
		});
	};

	handleDurationInput = (event, minutes) => {
		let newValue = parseFloat(minutes);
		if (!minutes || minutes < 1) {
			newValue = 1;
		}
		this.setState({
			durationValue: newValue
		});
	};

	toggleWeekday = value => {
		let newState = [...this.state.weekdaysValue];
		if (newState.includes(value)) {
			newState = newState.filter(item => item !== value);
		} else {
			newState = [...newState, value].sort((a, b) => a - b);
		}
		this.setState({
			weekdaysValue: newState
		});
	};

	handleBeforeTimeChange = newValue => {
		this.setState({
			beforeTimeValue: newValue
		});
	};

	handleAfterTimeChange = newValue => {
		this.setState({
			afterTimeValue: newValue
		});
	};

	handleCondition = () => {
		const { speedUnit } = this.state;
		const { timeFormatPreference } = this.props;

		switch (this.state.conditionTypeValue) {
			case "time": {
				const timeRuleExists = !this.props.editing
					? this.props.conditions.filter(item => item.type === "time")[0]
					: false;

				const timeFormat = timeFormatPreference === "24-hour" ? "H:mm" : "h:mm A";
				const beforeTime = MomentTZ.tz(this.state.beforeTimeValue, timeFormat, MomentTZ.tz.guess());
				const afterTime = MomentTZ.tz(this.state.afterTimeValue, timeFormat, MomentTZ.tz.guess());

				if (timeRuleExists) {
					this.setState({
						dialogError: getTranslation("createEditRule.conditions.conditionDialog.dialogError.onlyOneAllowed")
					});
				} else if (!afterTime || !beforeTime) {
					// Check to see if user entered a valid time
					this.setState({
						dialogError: getTranslation("createEditRule.conditions.conditionDialog.dialogError.validTimeValue")
					});
				} else if (!this.state.conditionAnyTimeValue && afterTime._i === beforeTime._i) {
					//Check to see if times are different.
					this.setState({
						dialogError: getTranslation("createEditRule.conditions.conditionDialog.dialogError.startEndTimeDiff")
					});
				} else if (this.state.weekdaysValue.length === 1 && beforeTime.isAfter(afterTime)) {
					//Check to see if start time is before the end time value, if there is only 1 day selected.
					this.setState({
						dialogError: getTranslation("createEditRule.conditions.conditionDialog.dialogError.startBeforeEndTime")
					});
				} else if (
					!this.state.conditionIndefiniteValue &&
					moment(this.state.startDateValue).unix() > moment(this.state.endDateValue).unix()
				) {
					this.setState({
						dialogError:
							getTranslation("createEditRule.conditions.conditionDialog.dialogError.fallAfterStart")
					});
				} else if (this.state.weekdaysValue.length === 0) {
					this.setState({
						dialogError:
							getTranslation("createEditRule.conditions.conditionDialog.dialogError.atleastOneDay")
					});
				} else if (
					this.state.weekdaysValue.length === 7 &&
					this.state.conditionAnyTimeValue &&
					this.state.conditionIndefiniteValue
				) {
					// Your condition does nothing
					this.setState({
						dialogError:
							getTranslation("createEditRule.conditions.conditionDialog.dialogError.atleastOneLimitingFactor")
					});
				} else {
					const newCondition = {
						type: "time",
						indefinite: this.state.conditionIndefiniteValue,
						anyTimeOfDay: this.state.conditionAnyTimeValue,
						startDate: this.state.conditionIndefiniteValue
							? null
							: this.state.startDateValue,
						endDate: this.state.conditionIndefiniteValue
							? null
							: this.state.endDateValue,
						weekdays: this.state.weekdaysValue,
						// -- not updating time format here because we want to store the times in a consistent format
						startTime: this.state.conditionAnyTimeValue
							? null
							: beforeTime.tz("UTC").format("h:mm A"),
						endTime: this.state.conditionAnyTimeValue
							? null
							: afterTime.tz("UTC").format("h:mm A")
					};
					if (this.props.editing) {
						this.props.updateCondition(newCondition);
					} else {
						this.props.addCondition(newCondition);
					}
					const endOfYear = new Date();
					endOfYear.setMonth(11);
					endOfYear.setDate(31);

					this.setState({
						conditionTypeValue: "",
						dialogError: "",
						weekdaysValue: [1, 2, 3, 4, 5],
						beforeTimeValue: timeFormatPreference === "24-hour" ? "6:00" : "6:00 AM",
						afterTimeValue: timeFormatPreference === "24-hour" ? "18:00" : "6:00 PM",
						startDateValue: new Date(),
						endDateValue: endOfYear,
						conditionIndefiniteValue: true,
						conditionAnyTimeValue: true,
						conditionIndefiniteState: "",
						conditionAnyTimeState: ""
					});
				}
				break;
			}

			case "speed": {
				if (
					this.state.minSpeedValue === "" &&
					this.state.maxSpeedValue === ""
				) {
					this.setState({
						dialogError:
							getTranslation("createEditRule.conditions.conditionDialog.dialogError.slowerFasterThanVal")
					});
				} else if (
					+this.state.maxSpeedValue > 0 &&
					+this.state.minSpeedValue > 0 &&
					+this.state.minSpeedValue >= +this.state.maxSpeedValue
				) {
					this.setState({
						dialogError:
							getTranslation("createEditRule.conditions.conditionDialog.dialogError.fasterThanGreater")
					});
				} else {
					const newCondition = {
						type: "speed",
						minSpeed: +this.state.minSpeedValue,
						maxSpeed: +this.state.maxSpeedValue,
						unit: speedUnit
					};
					if (this.props.editing) {
						this.props.updateCondition(newCondition);
					} else {
						this.props.addCondition(newCondition);
					}
					this.setState({
						conditionTypeValue: "",
						dialogError: "",
						conditionDialogIsOpen: false,
						minSpeedValue: "",
						maxSpeedValue: ""
					});
				}
				break;
			}

			case "in-collection": {
				if (!this.state.collectionValue) {
					this.setState({
						dialogError: getTranslation("createEditRule.conditions.conditionDialog.dialogError.selectAColl")
					});
				} else {
					const newCondition = {
						type: "in-collection",
						id: this.state.collectionValue
					};
					if (this.props.editing) {
						this.props.updateCondition(newCondition);
					} else {
						this.props.addCondition(newCondition);
					}
					this.setState({
						conditionTypeValue: "",
						dialogError: "",
						collectionValue: "",
						conditionDialogIsOpen: false
					});
				}
				break;
			}

			case "not-in-collection": {
				if (!this.state.collectionValue) {
					this.setState({
						dialogError: getTranslation("createEditRule.conditions.conditionDialog.dialogError.selectAColl")
					});
				} else {
					const newCondition = {
						type: "not-in-collection",
						id: this.state.collectionValue
					};
					if (this.props.editing) {
						this.props.updateCondition(newCondition);
					} else {
						this.props.addCondition(newCondition);
					}
					this.setState({
						conditionTypeValue: "",
						dialogError: "",
						collectionValue: "",
						conditionDialogIsOpen: false
					});
				}
				break;
			}

			case "duration": {
				const durationRuleExists = !this.props.editing
					? this.props.conditions.filter(item => item.type === "duration")[0]
					: false;

				if (durationRuleExists) {
					this.setState({
						dialogError: getTranslation("createEditRule.conditions.conditionDialog.dialogError.onlyOneDuration")
					});
				} else {
					const newCondition = {
						type: "duration",
						duration: this.state.durationValue
					};
					if (this.props.editing) {
						this.props.updateCondition(newCondition);
					} else {
						this.props.addCondition(newCondition);
					}

					this.setState({
						conditionTypeValue: "",
						dialogError: "",
						durationValue: "",
						conditionDialogIsOpen: false
					});
				}
				break;
			}

			default:
				this.handleConditionDialogClose();
				break;
		}
	};

	getConditionText = condition => {
		switch (condition) {
			case "time":
				return <Translate value="createEditRule.conditions.conditionDialog.time" />;
			case "speed":
				return <Translate value="createEditRule.conditions.conditionDialog.speed" />;
			case "duration":
				return <Translate value="createEditRule.conditions.conditionDialog.duration" />;
			case "in-collection":
				return <Translate value="createEditRule.conditions.conditionDialog.inCollection" />;
			case "not-in-collection":
				return <Translate value="createEditRule.conditions.conditionDialog.notInCollection" />;
			default:
				return null;
		}
	};

	handleChangeTrigger = (event, index, value) =>
		this.setState({ trigger: value });

	handleChangeSpeedUnit = (e, i, v) => {
		this.setState({ speedUnit: v });
	};

	render() {
		const { editing, conditions, isOpen, landUnitSystem, timeFormatPreference, dir, locale } = this.props;
		const { speedUnit } = this.state;

		const isMobile = window.matchMedia("(max-width: 600px)").matches;
		const buttonStyles = isMobile
			? {
				fontSize: "13px"
			}
			: {};

		const datePickerStyles = {
			display: "inline-block",
			margin: "16px 6px"
		};

		const inputStyles = {
			fontSize: 11,
			backgroundColor: "rgb(31, 31, 33)",
			width: 90,
			height: 34,
			padding: "0 10px",
			letterSpacing: 1,
			fontFamily: "Roboto, sans-serif",
			display: "inline-block",
			position: "relative",
			cursor: "pointer"
		};

		const datePickerTextStyles = {
			cursor: "pointer",
			height: "34px",
			width: "90px",
			letterSpacing: "1px",
			fontSize: "11px",
			padding: "0 10px"
		};

		const datePickerTextStylesDisabled = {
			cursor: "default",
			height: "34px",
			width: "90px",
			fontSize: "11px",
			padding: "0 10px"
		};

		const dialogStyles = {
			border: "none",
			maxWidth: "500px"
		};

		const conditionsAddActions = [
			<FlatButton
				style={buttonStyles}
				label={getTranslation("createEditRule.conditions.conditionDialog.cancel")}
				onClick={this.handleConditionDialogClose}
				primary={true}
			/>,
			<FlatButton
				style={buttonStyles}
				label={editing ? getTranslation("createEditRule.conditions.conditionDialog.update") : getTranslation("createEditRule.conditions.conditionDialog.add")}
				onClick={this.handleCondition}
				primary={true}
				keyboardFocused={true}
				disabled={this.state.conditionTypeValue === null}
			/>
		];

		let entityCollections = [];

		if (this.props.entityCollections) {
			entityCollections = Object.keys(this.props.entityCollections).map(
				key => {
					return this.props.entityCollections[key];
				}
			);
		}

		const conditionIds = conditions.map(item => {
			return item.id;
		});
		// Prevent conflicting collection conditions
		const filteredCollections = entityCollections.filter(item => {
			return !conditionIds.includes(item.id);
		});
		const unitOptions = [
			{ id: "kn", value: "kn", label: getTranslation("createEditRule.conditions.conditionDialog.kn") },
			{
				id: landUnitSystem === "metric" ? "kph" : "mph",
				value: landUnitSystem === "metric" ? "kph" : "mph",
				label: landUnitSystem === "metric" ? getTranslation("createEditRule.conditions.conditionDialog.kph") : getTranslation("createEditRule.conditions.conditionDialog.mph")
			}
		];

		return (
			<Dialog
				contentStyle={dialogStyles}
				open={isOpen}
				autoScrollBodyContent={true}
				actions={conditionsAddActions}
				title={getTranslation("createEditRule.conditions.conditionDialog.addCondition")}
				onRequestClose={this.handleConditionDialogClose}
				style={{ zIndex: 1200 }}
			>
				<div className="condition-dialog">
					<SelectField
						value={this.state.conditionTypeValue}
						onChange={this.selectConditionType}
						className={`condition-select ${dir == "rtl" && "rtlIcon"}`}
						hintText={getTranslation("createEditRule.conditions.conditionDialog.selectCondition")}
						hintStyle={dir == "rtl" ? { color: "#828283", marginRight: "24px" } : { color: "#828283", marginLeft: "24px" }}
						listStyle={{ backgroundColor: "#1f1f21" }}
						labelStyle={dir == "rtl" ? { marginRight: "24px", paddingRight: 0, paddingLeft: 56 } : { marginLeft: "24px" }}
						underlineStyle={{ opacity: 0 }}
					>
						{this.props.availableConditions.map(condition => {
							return (
								<MenuItem
									key={condition}
									value={condition}
									primaryText={this.getConditionText(condition)}
								/>
							);
						})}
					</SelectField>

					{/*Speed Condition*/}

					{this.state.conditionTypeValue === "speed" && (
						<div className="speed-condition">
							<div className="speed-wrapper">
								<h4 style={{ width: 136 }}><Translate value="createEditRule.conditions.conditionDialog.travellingSlowerThan" /></h4>
								<TextField
									value={this.state.minSpeedValue}
									onChange={this.handleMinSpeedInput}
									style={{
										height: 48,
										width: "70px",
										padding: "0 8px",
										margin: "0 8px",
										display: "inline-block"
									}}
								/>
								<SelectField
									className={dir == "rtl" && "rtlIcon"}
									style={{ width: "auto" }}
									value={speedUnit}
									onChange={this.handleChangeSpeedUnit}
									hintText={getTranslation("createEditRule.conditions.conditionDialog.unit")}
									hintStyle={dir == "rtl" ? { color: "#828283", marginRight: "24px" } : { color: "#828283", marginLeft: "24px" }}
									listStyle={{ backgroundColor: "#1f1f21" }}
									labelStyle={dir == "rtl" ? { marginRight: "24px", paddingRight: 0, paddingLeft: 56 } : { marginLeft: "24px" }}
									underlineStyle={{ opacity: 0 }}
								>
									{unitOptions.map(option => {
										return (
											<MenuItem
												key={option.id}
												value={option.value}
												primaryText={option.label}
											/>
										);
									})}
								</SelectField>
							</div>
							<div className="speed-wrapper">
								<h4 style={{ width: 136 }}><Translate value="createEditRule.conditions.conditionDialog.travellingFasterThan" /></h4>
								<TextField
									value={this.state.maxSpeedValue}
									onChange={this.handleMaxSpeedInput}
									style={{
										height: 48,
										width: "70px",
										padding: "0 8px",
										margin: "0 8px",
										display: "inline-block"
									}}
								/>
								<SelectField
									className={dir == "rtl" && "rtlIcon"}
									style={{ width: "auto" }}
									value={speedUnit}
									onChange={this.handleChangeSpeedUnit}
									hintText={getTranslation("createEditRule.conditions.conditionDialog.unit")}
									hintStyle={dir == "rtl" ? { color: "#828283", marginRight: "24px" } : { color: "#828283", marginLeft: "24px" }}
									listStyle={{ backgroundColor: "#1f1f21" }}
									labelStyle={dir == "rtl" ? { marginRight: "24px", paddingRight: 0, paddingLeft: 56 } : { marginLeft: "24px" }}
									underlineStyle={{ opacity: 0 }}
								>
									{unitOptions.map(option => {
										return (
											<MenuItem
												key={option.id}
												value={option.value}
												primaryText={option.label}
											/>
										);
									})}
								</SelectField>
							</div>
						</div>
					)}

					{/*Time Condition*/}

					{this.state.conditionTypeValue === "time" && (
						<div className="time-condition">
							<h3 className="condition-subheader"><Translate value="createEditRule.conditions.conditionDialog.dateRange" /></h3>
							<RadioButtonGroup
								name="date-range"
								onChange={e => this.checkIndefinite(e.target.value)}
								defaultSelected={
									this.state.conditionIndefiniteValue
										? "indefinite"
										: "set-range"
								}
								style={{ display: "flex", flexWrap: "wrap" }}
							>
								<RadioButton
									label={getTranslation("createEditRule.conditions.conditionDialog.indefinite")}
									value="indefinite"
									labelStyle={{
										color: this.state.conditionIndefiniteValue
											? "white"
											: "#828283"
									}}
									iconStyle={{
										fill: this.state.conditionIndefiniteValue
											? "#00bcd4"
											: "#828283"
									}}
									style={{ width: "auto", minWidth: "150px" }}
								/>
								<RadioButton
									label={getTranslation("createEditRule.conditions.conditionDialog.setRange")}
									value="set-range"
									labelStyle={{
										color: !this.state.conditionIndefiniteValue
											? "white"
											: "#828283"
									}}
									iconStyle={{
										fill: !this.state.conditionIndefiniteValue
											? "#00bcd4"
											: "#828283"
									}}
									style={{ width: "auto", minWidth: "150px" }}
								/>
							</RadioButtonGroup>

							<div className="date-pickers-wrapper">
								<div
									className={
										this.state.conditionIndefiniteValue
											? "disabled date-wrapper"
											: "date-wrapper"
									}
								>
									<DatePicker
										style={datePickerStyles}
										value={moment(this.state.startDateValue)._d}
										handleChange={date => this.handleStartDateSelect(moment(date).locale("en"))}
										minDate={new Date()}
										disabled={this.state.conditionIndefiniteValue}
										dir={dir}
										locale={locale}
										fullWidth={false}
										InputProps={{
											style: inputStyles,
											disableUnderline: true
										}}
										autoOk={true}
										okLabel={""}
										cancelLabel={<span style={{ color: "rgb(0, 188, 212)" }}>{getTranslation("global.profiles.eventProfile.eventDialog.dateLabel.cancel")}</span>}
										clearable={false}
									/>
									<span><Translate value="createEditRule.conditions.conditionDialog.to" /></span>
									<DatePicker
										style={datePickerStyles}
										value={moment(this.state.endDateValue)._d}
										handleChange={date => this.handleEndDateSelect(moment(date).locale("en"))}
										disabled={this.state.conditionIndefiniteValue}
										dir={dir}
										locale={locale}
										fullWidth={false}
										InputProps={{
											style: inputStyles,
											disableUnderline: true
										}}
										autoOk={true}
										okLabel={""}
										cancelLabel={<span style={{ color: "rgb(0, 188, 212)" }}>{getTranslation("global.profiles.eventProfile.eventDialog.dateLabel.cancel")}</span>}
										clearable={false}
									/>
								</div>
								<h3 className="condition-subheader"><Translate value="createEditRule.conditions.conditionDialog.days" /></h3>
								<div className="weekday-selector">
									{["Su", "M", "T", "W", "Th", "F", "Sa"].map((day, index) => {
										return (
											<div
												key={index}
												className={
													this.state.weekdaysValue.includes(index)
														? "weekday toggled"
														: "weekday"
												}
												onClick={() => this.toggleWeekday(index)}
											>
												{day}
											</div>
										);
									})}
								</div>
								<h3 className="condition-subheader"><Translate value="createEditRule.conditions.conditionDialog.timePeriod" /></h3>
								<RadioButtonGroup
									name="date-range"
									onChange={e => this.checkAnyTime(e.target.value)}
									defaultSelected={
										this.state.conditionAnyTimeValue ? "all-day" : "set-period"
									}
									style={{ display: "flex", flexWrap: "wrap" }}
								>
									<RadioButton
										label={getTranslation("createEditRule.conditions.conditionDialog.allDay")}
										value="all-day"
										labelStyle={{
											color: this.state.conditionAnyTimeValue
												? "white"
												: "#828283"
										}}
										iconStyle={{
											fill: this.state.conditionAnyTimeValue
												? "#00bcd4"
												: "#828283"
										}}
										style={{ width: "auto", minWidth: "150px" }}
									/>
									<RadioButton
										label={<Translate value="createEditRule.conditions.conditionDialog.setPeriod" />}
										value="set-period"
										labelStyle={{
											color: !this.state.conditionAnyTimeValue
												? "white"
												: "#828283"
										}}
										iconStyle={{
											fill: !this.state.conditionAnyTimeValue
												? "#00bcd4"
												: "#828283"
										}}
										style={{ width: "auto", minWidth: "150px" }}
									/>
								</RadioButtonGroup>
								<div
									className={
										this.state.conditionAnyTimeValue
											? "disabled time-wrapper"
											: "time-wrapper"
									}
								>
									<TimeInput
										disabled={this.state.conditionAnyTimeValue}
										onChange={this.handleBeforeTimeChange}
										value={this.state.beforeTimeValue}
										timeFormatPreference={timeFormatPreference}
									/>
									<span><Translate value="createEditRule.conditions.conditionDialog.to" /></span>
									<TimeInput
										disabled={this.state.conditionAnyTimeValue}
										onChange={this.handleAfterTimeChange}
										value={this.state.afterTimeValue}
										timeFormatPreference={timeFormatPreference}
									/>
								</div>
							</div>
						</div>
					)}

					{/*Duration*/}

					{this.state.conditionTypeValue === "duration" && (
						<div className="duration-condition">
							<h4><Translate value="createEditRule.conditions.conditionDialog.timeAllowed" /></h4>
							<TextField
								value={this.state.durationValue}
								onChange={this.handleDurationInput}
								style={{
									height: "40px",
									width: "70px",
									padding: "0 8px",
									margin: "0 8px",
									display: "inline-block"
								}}
								type={"number"}
							/>
							<span className="speed-units">
								{parseFloat(this.state.durationValue) === 1
									? <Translate value="createEditRule.conditions.conditionDialog.minute" />
									: <Translate value="createEditRule.conditions.conditionDialog.minutes" />}
							</span>
						</div>
					)}

					{/*In Collection*/}

					{this.state.conditionTypeValue === "in-collection" && (
						<div className="collection-dialog">
							<SelectField
								className={`collection-select ${dir == "rtl" && "rtlIcon"}`}
								hintText={getTranslation("createEditRule.conditions.conditionDialog.selectCollection")}
								onChange={this.selectCollection}
								value={this.state.collectionValue}
								hintStyle={dir == "rtl" ? { color: "#828283", marginRight: "24px" } : { color: "#828283", marginLeft: "24px" }}
								listStyle={{ backgroundColor: "#1f1f21" }}
								labelStyle={dir == "rtl" ? { marginRight: "24px", paddingRight: 0, paddingLeft: 56 } : { marginLeft: "24px" }}
								underlineStyle={{ opacity: 0 }}
							>
								<MenuItem value={null} primaryText="" />
								{filteredCollections.map((collection, index) => {
									return (
										<MenuItem
											key={index}
											value={collection.id}
											primaryText={collection.name}
										/>
									);
								})}
							</SelectField>
						</div>
					)}

					{/*Not In Collection*/}

					{this.state.conditionTypeValue === "not-in-collection" && (
						<div className="collection-dialog">
							<SelectField
								className={`collection-select ${dir == "rtl" && "rtlIcon"}`}
								hintText={getTranslation("createEditRule.conditions.conditionDialog.selectCollection")}
								onChange={this.selectCollection}
								value={this.state.collectionValue}
								hintStyle={dir == "rtl" ? { color: "#828283", marginRight: "24px" } : { color: "#828283", marginLeft: "24px" }}
								listStyle={{ backgroundColor: "#1f1f21" }}
								labelStyle={dir == "rtl" ? { marginRight: "24px", paddingRight: 0, paddingLeft: 56 } : { marginLeft: "24px" }}
								underlineStyle={{ opacity: 0 }}
							>
								<MenuItem value={null} primaryText="" />
								{filteredCollections.map((collection, index) => {
									return (
										<MenuItem
											key={index}
											value={collection.id}
											primaryText={collection.name}
										/>
									);
								})}
							</SelectField>
						</div>
					)}

					<span className="dialog-error">{this.state.dialogError}</span>
				</div>
			</Dialog>
		);
	}
}

export default ConditionDialog;
