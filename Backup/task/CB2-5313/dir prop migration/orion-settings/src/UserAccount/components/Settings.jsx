import React, { useState, memo } from "react";

// material-ui
import {
	Divider,
	FormControl,
	FormControlLabel,
	MenuItem,
	Radio,
	RadioGroup,
	Typography
} from "@mui/material";
import { SelectField, UnitParser } from "orion-components/CBComponents";
import { AccountVoice, RulerSquareCompass, History, ClockCheckOutline, Web } from "mdi-material-ui";
import { timeConversion } from "client-app-core";
// Components
import ArticleContainer from "../../shared/components/ArticleContainer";

import { Translate, getTranslation } from "orion-components/i18n";
import { supportedLocales } from "orion-components/i18n";
import { useDispatch } from "react-redux";

const handleSettingsUpdate = (setting, updateUserAppSettings, globalState, setlocale, dispatch) => e => {
	const { value } = e.target;
	const newGlobalState = { ...globalState };
	const newUnits = { ...newGlobalState.unitsOfMeasurement };
	switch (setting) {
		case "tts":
			if (value === "off") {
				newGlobalState[setting] = {
					enabled: false
				};
			} else {
				newGlobalState[setting] = {
					enabled: true
				};
			}
			break;
		case "trackHistory":
			newGlobalState[setting] = {
				duration: value
			};
			break;
		case "coordinateSystem":
			newUnits.coordinateSystem = value;
			newGlobalState.unitsOfMeasurement = newUnits;
			break;
		case "landUnitSystem":
			newUnits.landUnitSystem = value;
			newGlobalState.unitsOfMeasurement = newUnits;
			break;
		case "timeFormat":
			newGlobalState[setting] = value;
			break;
		case "locale":
			newGlobalState[setting] = value;
			dispatch(setlocale(value));
			break;
		default:
			break;
	}

	dispatch(updateUserAppSettings(newGlobalState));
};


const Settings = ({
	globalState,
	updateGlobalUserAppSettings,
	setLocaleWithFallback,
	dir,
	lngLocale
}) => {
	const dispatch = useDispatch();
	const [currentTime, setCurrentTime] = useState(new Date());
	const twelveHourFormat = timeConversion.convertToUserTime(currentTime, "full_12-hour", lngLocale);
	const twentyFourHourFormat = timeConversion.convertToUserTime(currentTime, "full_24-hour", lngLocale);

	const { tts, trackHistory, unitsOfMeasurement, timeFormat, locale } = globalState;

	const styles = {
		leftText: {
			display: "flex",
			flex: "0 0 380px",
			alignItems: "center",
			...(dir === "rtl" ? { paddingRight: 24 } : { paddingLeft: 24 })
		},
		middleText: {
			flex: "1 1 328px",
			marginRight: 24
		},
		section: {
			padding: "10px 16px",
			...(dir === "rtl" ? { paddingRight: 0 } : { paddingLeft: 0 }),
			display: "flex"
		},
		formLabel: {
			cursor: "pointer",
			display: "inline-flex",
			alignItems: "center",
			marginLeft: -11,
			marginRight: 16,
			marginBottom: 12,
			verticalAlign: "middle",
			WebkitTapHighlightColor: "transparent"
		},
		icons: {
			color: "white",
			...(dir === "rtl" ? { marginLeft: 15 } : { marginRight: 15 }),
			marginTop: 25
		},
		menuListRTL: {
			direction: "ltr",
			justifyContent: "end"
		}
	};

	return (
		<ArticleContainer
			headerTitle={getTranslation("mainContent.accountSettings.settings.title")}
			headerDescription={getTranslation("mainContent.accountSettings.settings.settingsText")}
			dir={dir}
		>
			<section style={{ ...styles.section, marginTop: 30, marginBottom: 115 }}>
				<div style={styles.leftText}>
					<AccountVoice style={styles.icons} />
					<div style={{ marginTop: 25 }}>
						<Typography style={{ color: "white" }} variant="h4"><Translate value="mainContent.accountSettings.settings.alertAudio" /></Typography>
						<Typography variant="body2"><Translate value="mainContent.accountSettings.settings.alertAudioText" /></Typography>
					</div>
				</div>
				<FormControl component="fieldset">
					<RadioGroup
						aria-label="Alert Audio"
						name="alertAudio"
						style={{
							position: "absolute",
							width: 204,
							top: 20
						}}
						value={tts.enabled ? "on" : "off"}
						onChange={handleSettingsUpdate("tts", updateGlobalUserAppSettings, null, null, dispatch)}
					>
						<label style={styles.formLabel}>
							<Radio value="on" color="primary" />
							<div style={{ marginLeft: 24 }}>
								<p className="b1-white"><Translate value="mainContent.accountSettings.settings.on" /></p>
							</div>
						</label>
						<label style={styles.formLabel}>
							<Radio value="off" color="primary" />
							<div style={{ marginLeft: 24 }}>
								<p className="b1-white"><Translate value="mainContent.accountSettings.settings.off" /></p>
							</div>
						</label>
					</RadioGroup>
				</FormControl>
			</section>
			<Divider style={{ position: "absolute", left: 24, right: 24 }} />
			<section style={{ ...styles.section, marginTop: 20, marginBottom: 20 }}>
				<div style={styles.leftText}>
					<History style={styles.icons} />
					<div style={{ marginTop: 25 }}>
						<Typography style={{ color: "white" }} variant="h4"><Translate value="mainContent.accountSettings.settings.trackHistory" /></Typography>
					</div>
				</div>
				<div style={{ width: 280 }}>
					<SelectField
						id="track-history-duration"
						value={trackHistory.duration}
						handleChange={handleSettingsUpdate("trackHistory", updateGlobalUserAppSettings, globalState, null, dispatch)}
						label={getTranslation("mainContent.accountSettings.settings.duration")}
						dir={dir}
						formControlProps={{ style: { direction: "ltr" } }}
					>
						<MenuItem value={15} >
							<Translate value="mainContent.accountSettings.settings.menuItem.quarterMin" />
						</MenuItem>
						<MenuItem value={30} >
							<Translate value="mainContent.accountSettings.settings.menuItem.halfMin" />
						</MenuItem>
						<MenuItem value={60} >
							<Translate value="mainContent.accountSettings.settings.menuItem.hour" />
						</MenuItem>
						<MenuItem value={360} >
							<Translate value="mainContent.accountSettings.settings.menuItem.quarterDay" />
						</MenuItem>
						<MenuItem value={720} >
							<Translate value="mainContent.accountSettings.settings.menuItem.halfDay" />
						</MenuItem>
						<MenuItem value={1440} >
							<Translate value="mainContent.accountSettings.settings.menuItem.day" />
						</MenuItem>
					</SelectField>
				</div>

			</section>
			<Divider style={{ position: "absolute", left: 24, right: 24 }} />
			<section style={{ ...styles.section, marginBottom: 175, marginTop: 25 }}>
				<div style={styles.leftText}>
					<RulerSquareCompass style={styles.icons} />
					<div style={{ marginTop: 25 }}>
						<Typography style={{ color: "white" }} variant="h4"><Translate value="mainContent.accountSettings.settings.units" /></Typography>
						<Typography variant="body2"><Translate value="mainContent.accountSettings.settings.unitsText" /></Typography>
					</div>
				</div>
				<div style={{
					display: "flex",
					flexDirection: "column",
					width: 280,
					position: "relative"
				}}>
					<div style={{
						position: "absolute",
						width: "100%"
					}}>
						<SelectField
							id="coordinate-system"
							value={unitsOfMeasurement.coordinateSystem}
							handleChange={handleSettingsUpdate("coordinateSystem", updateGlobalUserAppSettings, globalState, null, dispatch)}
							label={getTranslation("mainContent.accountSettings.settings.coordinateSystem")}
							helperText={
								<UnitParser
									value={{ x: -81.0348, y: 34.0007 }}
									sourceUnit="decimal-degrees"
								/>
							}
							dir={dir}
						>
							<MenuItem value="decimal-degrees">
								<Translate value="mainContent.accountSettings.settings.menuItem.decimalDegrees" />
							</MenuItem>
							<MenuItem value="degrees-min-sec">
								<Translate value="mainContent.accountSettings.settings.menuItem.degreesMinsSecs" />
							</MenuItem>
							<MenuItem value="degrees-decimal-min">
								<Translate value="mainContent.accountSettings.settings.menuItem.degreesDecimalMins" />
							</MenuItem>
						</SelectField>
						<div style={{ marginTop: 30 }}>
							<SelectField
								id="land-unit-system"
								value={unitsOfMeasurement.landUnitSystem}
								handleChange={handleSettingsUpdate("landUnitSystem", updateGlobalUserAppSettings, globalState, null, dispatch)}
								label={getTranslation("mainContent.accountSettings.settings.groundSpeed")}
								helperText={
									unitsOfMeasurement.landUnitSystem === "metric"
										? getTranslation("mainContent.accountSettings.settings.helperText.metric")
										: getTranslation("mainContent.accountSettings.settings.helperText.nonMetric")
								}
								dir={dir}
							>
								<MenuItem value="imperial">
									<Translate value="mainContent.accountSettings.settings.menuItem.imperial" />
								</MenuItem>
								<MenuItem value="metric">
									<Translate value="mainContent.accountSettings.settings.menuItem.metric" />
								</MenuItem>
							</SelectField>
						</div>

					</div>
				</div>
			</section>
			<Divider style={{ position: "absolute", left: 24, right: 24 }} />
			<section style={{ ...styles.section, marginTop: 30, marginBottom: 115 }}>
				<div style={styles.leftText}>
					<ClockCheckOutline style={styles.icons} />
					<div style={{ marginTop: 25 }}>
						<Typography style={{ color: "white" }} variant="h4"><Translate value="mainContent.accountSettings.settings.timeFormat" /></Typography>
						<Typography variant="body2"><Translate value="mainContent.accountSettings.settings.timeFormatText" /></Typography>
					</div>
				</div>
				<FormControl component="fieldset">
					<RadioGroup
						aria-label="Time Format"
						name="timeFormat"
						style={{
							position: "absolute",
							width: 204,
							top: 20
						}}
						value={timeFormat ? timeFormat : "12-hour"}
						onChange={handleSettingsUpdate("timeFormat", updateGlobalUserAppSettings, globalState, null, dispatch)}
					>
						<label style={styles.formLabel}>
							<Radio value="12-hour" color="primary" />
							<div style={{ marginLeft: 24 }}>
								<p className="b1-white"><Translate value="mainContent.accountSettings.settings.hourFormat1" /></p>
								<p className="b2-bright-gray" style={{ width: "150px" }}>{twelveHourFormat}</p>
							</div>
						</label>
						<label style={styles.formLabel}>
							<Radio value="24-hour" color="primary" />
							<div style={{ marginLeft: 24 }}>
								<p className="b1-white"><Translate value="mainContent.accountSettings.settings.hourFormat2" /></p>
								<p className="b2-bright-gray" style={{ width: "150px" }}>{twentyFourHourFormat}</p>
							</div>
						</label>
					</RadioGroup>
				</FormControl>
			</section>
			<Divider style={{ position: "absolute", left: 24, right: 24 }} />
			<section style={{ ...styles.section, marginTop: 30, marginBottom: 50 }}>
				<div style={styles.leftText}>
					<Web style={styles.icons} />
					<div style={{ marginTop: 25 }}>
						<Typography style={{ color: "white" }} variant="h4"><Translate value="mainContent.accountSettings.settings.localeLabel" /></Typography>
						<Typography variant="body2"><Translate value="mainContent.accountSettings.settings.localeText" /></Typography>
					</div>
				</div>
				<div style={{
					display: "flex",
					flexDirection: "column",
					width: 280,
					position: "relative"
				}}>
					<div style={{
						position: "absolute",
						width: "100%"
					}}>
						<SelectField
							id="languagePreference"
							value={locale}
							handleChange={handleSettingsUpdate("locale", updateGlobalUserAppSettings, globalState, setLocaleWithFallback, dispatch)}
							label={getTranslation("mainContent.accountSettings.settings.userLocale")}
							dir={dir}
						>
							{Object.keys(supportedLocales).map(code => (
								<MenuItem value={code}>{supportedLocales[code]}</MenuItem>
							))}
						</SelectField>
					</div>
				</div>
			</section>
		</ArticleContainer>
	);
};

export default memo(Settings);