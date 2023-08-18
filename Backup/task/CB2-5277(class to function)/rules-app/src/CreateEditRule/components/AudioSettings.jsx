import React from "react";
import Checkbox from "material-ui/Checkbox";
import TextField from "material-ui/TextField";
import { Translate } from "orion-components/i18n/I18nContainer";

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
								<div style={{ width: 30, padding: 3 }}>
									<Checkbox checked={audioSettings.speakAlertText}
										onClick={() => handleChangeAudioSettings(
											{ ...audioSettings, speakAlertText: !audioSettings.speakAlertText }
										)}
										iconStyle={dir == "rtl" ? { marginRight: 0, marginLeft: 16 } : {}}
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
									id="audio-settings"
									style={{
										width: "100%",
										borderRadius: 5
									}}
									inputStyle={dir && dir == "rtl" ? inputTextStyleRTL : inputTextStyle}
									value={audioSettings.alertText}
									onChange={(event) =>
										handleChangeAudioSettings(
											{ ...audioSettings, alertText: event.target.value }
										)
									}
									disabled={!audioSettings.speakAlertText}
									underlineShow={false}
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
								<div style={{ width: 30, padding: 3 }}>
									<Checkbox checked={audioSettings.speakAlertNotification}
										onClick={() => handleChangeAudioSettings(
											{ ...audioSettings, speakAlertNotification: !audioSettings.speakAlertNotification }
										)}
										iconStyle={dir == "rtl" ? { marginRight: 0, marginLeft: 16 } : {}}
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