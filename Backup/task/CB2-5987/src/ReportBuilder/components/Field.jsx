import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

// Material UI
import { DateTimePicker } from "orion-components/CBComponents";
import { CircularProgress, IconButton } from "@mui/material";
import { ThemeProvider, StyledEngineProvider } from "@mui/material/styles";

import SuperSelectField from "../../shared/components/SuperSelectField/SuperSelectField";

import { Cancel } from "@mui/icons-material";
import debounce from "lodash/debounce";
import { getTranslation } from "orion-components/i18n";
import reportsDatePickerTheme from "../../shared/theme/reportsDatePickerTheme";

const Field = ({ field, fetchFieldData, values, sendValues, wipeFieldData, timeFormatPreference, dir, fieldData }) => {
	const maxDateInitValue = new Date();
	const minDateInitValue = new Date();

	// Set default date range to 1 month
	minDateInitValue.setMonth(minDateInitValue.getMonth() - 1);

	const [valuesState, setValuesState] = useState([]);
	const [maxDate, setMaxDate] = useState(maxDateInitValue);
	const [minDate, setMinDate] = useState(minDateInitValue);
	const [startDateValue, setStartValue] = useState(minDateInitValue);
	const [endDateValue, setEndDateValue] = useState(maxDateInitValue);
	const [queryString, setQueryString] = useState("");
	const [selectAll, setSelectAll] = useState(false);
	const [isQuerying, setIsQuerying] = useState(false);

	const dispatch = useDispatch();

	const styles = {
		clearButton: {
			position: "absolute",
			top: 13,
			...(dir === "ltr" && { right: "20px" }),
			...(dir === "rtl" && { left: "20px" }),
			zIndex: 9999,
			padding: 0,
			color: "#B5B9BE"
		}
	};

	useEffect(() => {
		if (field.endpoint && !field.endpoint.template) {
			dispatch(fetchFieldData(field.name, field.endpoint.basePath));
		}
		if (values.length > 0) {
			setValuesState(values);
		}
	}, []);

	useEffect(() => {
		setIsQuerying(false);
	}, [fieldData]);

	const handleClear = () => {
		//document.getElementsByClassName("type-ahead-popover")[0].blur();
		setTimeout(() => {
			setQueryString("");
		}, 10);
	};

	const handleChangeMinDate = (date) => {
		setValuesState(date);
		setStartValue(date);
		setMinDate(date);
		sendValues(field.name, date);
	};

	const handleChangeMaxDate = (date) => {
		setValuesState(date);
		setEndDateValue(date);
		setMaxDate(date);
		sendValues(field.name, date);
	};

	const handleSelection = (values) => {
		const closing = false;
		//if (closing) {
		//	handleClear();
		//}

		let newValues;
		let valuesArr = [];
		if (values) {
			if (!Array.isArray(values)) {
				valuesArr.push(values);
			} else valuesArr = values;
		}

		// Check if user has chosen Select All
		const selectAllChecked = valuesArr.some((el) => {
			return el.value === "select_all";
		});
		if (selectAllChecked) {
			newValues = [
				{
					value: "select_all",
					label: getTranslation("reportBuilder.components.field.selectAll")
				}
			];
			setValuesState(newValues);
			setSelectAll(true);
		} else {
			newValues = valuesArr;
			setValuesState(newValues);
			setSelectAll(false);
		}

		// If Select All, send all the data in the correct format
		const payload = selectAllChecked
			? "SELECT_ALL"
			: newValues.map((value) => {
				return {
					id: value.value.id ? value.value.id : value.value,
					entityType: value.value.entityType,
					feedId: value.value.feedId,
					name: value.label
				};
			});
		const wipeCheck = closing ? true : field.typeAheadClear ? (queryString ? false : true) : false;
		sendValues(field.name, payload, wipeCheck);
	};

	const handleQuery = (text) => {
		setIsQuerying(true);
		if (!text || text.length < 1) {
			console.log("WIPING");
			wipeFieldData(field.name);
			setQueryString("");
			return;
		}

		// This is likely more complex than it needs to be...
		// Will there ever be an instance where we need more than a single dynamic query param?
		// I don't think so.
		let path = field.endpoint.basePath;
		path += path.indexOf("?") > -1 ? "&" : "?";

		for (const p in field.endpoint.params) {
			// eslint-disable-next-line no-prototype-builtins
			if (field.endpoint.params.hasOwnProperty(p)) {
				path += p + "=" + text + "&";
			}
		}
		path = path.slice(0, -1);
		dispatch(fetchFieldData(field.name, path));
		setQueryString(text);
	};

	const generateField = (field) => {
		let generatedField;

		switch (field.type) {
			case "select-field":
			case "drop-down-menu":
				{
					let menuItems = [];
					// Don't render other menu options if Select All is chosen
					if (!selectAll || field.noMultiple || field.singleSelection) {
						menuItems = fieldData && typeof fieldData === "object"
							? // Sort alphabetically
							fieldData
								.sort((a, b) => {
									const nameA = a.name || a.description || a.entityData.properties.name || a.id;
									const nameB = b.name || b.description || b.entityData.properties.name || b.id;
									if (nameA < nameB) return -1;
									if (nameA > nameB) return 1;
									return 0;
								})
								.map((item) => {
									const key = item.id;
									const label =
										item.name || item.description || item.entityData.properties.name || item.id;
									const value = item.id;
									const children =
										item.name || item.description || item.entityData.properties.name || item.id;

									const menuItem = {
										key,
										label,
										value,
										children
									};
									return menuItem;
								})
							: [];
					}
					// Add Select All to top of the menu items
					if (!field.noMultiple) {
						const key = "select_all";
						const value = "select_all";
						const label = getTranslation("reportBuilder.components.field.selectAll");
						const children = getTranslation("reportBuilder.components.field.selectAll");
						menuItems.unshift({
							key,
							value,
							label,
							children
						});
					}

					generatedField = (
						<SuperSelectField
							label={getTranslation(field.desc)}
							options={menuItems}
							onChange={handleSelection}
							multiple={field.noMultiple || field.singleSelection ? false : true}
							selectedValue={valuesState}
							autoCompletePlaceHolder={getTranslation("reportBuilder.components.field.search")}
							dynamicSearch={false}
						/>

						//<SuperSelectField
						//	errorText={
						//		errorMessage[field.name] ? errorMessage[field.name].data : ""
						//	}

						//	onSelect={selectedValues => handleSelection(selectedValues)} // Disables other menu options while SelectField menu is still open
						//	checkPosition={checkPosition}
						//	showAutocompleteThreshold="always"
						//>
					);
				}
				break;
			case "type-ahead-search":
				{
					let menuItems = [];

					// Don't render other menu options if Select All is chosen
					if (!selectAll) {
						menuItems = fieldData && typeof fieldData === "object"
							? fieldData.map((item) => {
								const key = item.id;
								const label = item.name ? item.name : item.entityData.properties.name;
								const value = item;
								const children = item.name ? item.name : item.entityData.properties.name;
								const menuItem = {
									key,
									label,
									value,
									children
								};
								return menuItem;
							})
							: [];
					}

					// Add Select All to top of the menu items
					if (!field.noMultiple) {
						const key = "select_all";
						const value = "select_all";
						const label = getTranslation("reportBuilder.components.field.selectAll");
						const children = getTranslation("reportBuilder.components.field.selectAll");
						menuItems.unshift({
							key,
							value,
							label,
							children
						});
					}
					generatedField = (
						<div style={{ position: "relative" }}>
							<SuperSelectField
								label={getTranslation(field.desc)}
								options={menuItems}
								onChange={handleSelection}
								multiple={true}
								selectedValue={valuesState}
								autoCompletePlaceHolder={getTranslation("reportBuilder.components.field.search")}
								dynamicSearch={true}
								onAutoCompleteTyping={debounce(handleQuery, 300, { maxWait: 1000 })}
							/>
							{!!queryString && !isQuerying && (
								<IconButton id="clear-button" onClick={handleClear} style={styles.clearButton}>
									<Cancel />
								</IconButton>
							)}
							{isQuerying && (
								<div style={styles.clearButton}>
									<CircularProgress size={20} thickness={3} />
								</div>
							)}
						</div>
					);
				}
				break;
			case "date-picker":
				if (field.name === "startDate")
					generatedField = (
						<StyledEngineProvider injectFirst>
							<ThemeProvider theme={reportsDatePickerTheme}>
								<DateTimePicker
									value={startDateValue}
									handleChange={handleChangeMinDate}
									clearable={false}
									format={`full_${timeFormatPreference}`}
									theme="light"
								/>
							</ThemeProvider>
						</StyledEngineProvider>
					);
				else if (field.name === "endDate") {
					generatedField = (
						<StyledEngineProvider injectFirst>
							<ThemeProvider theme={reportsDatePickerTheme}>
								<DateTimePicker
									value={endDateValue}
									handleChange={handleChangeMaxDate}
									clearable={false}
									theme="light"
									minDate={values && values.startDate ? values.startDate : minDate}
									format={`full_${timeFormatPreference}`}
								/>
							</ThemeProvider>
						</StyledEngineProvider>
					);
				}
				break;

			default:
				break;
		}

		return generatedField;
	};

	return <div>{generateField(field)}</div>;
};

export default Field;
