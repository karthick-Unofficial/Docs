import React from "react";
import { TextField, Checkbox } from "@mui/material";
import { Translate } from "orion-components/i18n";

const AudioSettings = ({ audioSettings, handleChangeAudioSettings, audioSettingErrorText, dir }) => {

	const inputTextStyle = {
		paddingLeft: 12,
		fontSize: 14
	};
	const inputTextStyleRTL = {
		paddingRight: 12,
		fontSize: 14
	};

	if (!audioSettings.speakAlertText)
		inputTextStyle["color"] = "#b5b9be";

	return (
		<div className="row">
			<div className="row-item fullwidth">
				<div className="rule-audio-settings-section">
					<div className="rule-audio-attribute-row">
						<div className="rule-audio-attribute">
							<div className="rule-audio-attribute-line">
								<i
									className="material-icons"
									style={{
										padding: 3,
										opacity: `${audioSettings.speakAlertText ? "100%" : "50%"}`
									}}>record_voice_over
								</i>
								<div className="rulesCheckBox" style={{ width: 30, padding: 3 }}>
									<Checkbox
										checked={audioSettings.speakAlertText}
										onChange={() => handleChangeAudioSettings(
											{ ...audioSettings, speakAlertText: !audioSettings.speakAlertText }
										)}
										sx={{ padding: "0px" }}
									/>
								</div>
								<span
									className="b1-white"
									style={{
										padding: 3,
										alignSelf: "center",
										opacity: `${audioSettings.speakAlertText ? "100%" : "50%"}`
									}}><Translate value="createEditRule.components.audioSettings.speakAlertText" /></span>
							</div>
							<div>
								<TextField
									className="disableOutlined"
									id="audio-settings"
									style={{
										width: "100%",
										borderRadius: 5,
										background: "rgb(31, 31, 33)"
									}}
									inputStyle={dir && dir == "rtl" ? inputTextStyleRTL : inputTextStyle}
									value={audioSettings.alertText}
									onChange={(event) =>
										handleChangeAudioSettings(
											{ ...audioSettings, alertText: event.target.value }
										)
									}
									disabled={!audioSettings.speakAlertText}
									inputProps={{
										style: {
											padding: "0 12px",
											height: 48,
											color: "#fff"
										}
									}}
								/>
							</div>
						</div>
						<div className="rule-audio-attribute">
							<div className="rule-audio-attribute-line">
								<i
									className="material-icons"
									style={{
										padding: 3,
										opacity: `${audioSettings.speakAlertNotification ? "100%" : "50%"}`
									}}>record_voice_over
								</i>
								<div className="rulesCheckBox" style={{ width: 30, padding: 3 }}>
									<Checkbox
										checked={audioSettings.speakAlertNotification}
										onChange={() => handleChangeAudioSettings(
											{ ...audioSettings, speakAlertNotification: !audioSettings.speakAlertNotification }
										)}
										sx={{ padding: "0px" }}
									/>
								</div>
								<span
									className="b1-white"
									style={{
										padding: 3,
										alignSelf: "center",
										opacity: `${audioSettings.speakAlertNotification ? "100%" : "50%"}`
									}}><Translate value="createEditRule.components.audioSettings.speakAlertNotification" />
								</span>
							</div>
							<div>
								<span className="b2-bright-gray">
									<Translate value="createEditRule.components.audioSettings.selectingThisRule" />
								</span>
							</div>
						</div>
					</div>
					<div className="rule-audio-attribute-row">
						<div className="rule-audio-attribute">
							<div className="rule-audio-attribute-line">
								<i className="material-icons">info</i>
								<span
									className="b2-bright-gray"
									style={dir == "rtl" ? { paddingRight: 20 } : { paddingLeft: 20 }}
								>
									<Translate value="createEditRule.components.audioSettings.note" />
									<br /><Translate value="createEditRule.components.audioSettings.example" />
								</span>
							</div>
						</div>
					</div>
					<div className="rule-audio-attribute-row error-msg">{audioSettingErrorText}</div>
				</div>
			</div>
		</div>
	);
};

export default AudioSettings;