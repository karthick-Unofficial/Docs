import React, { useEffect, useState } from "react";

import AlertTable from "./components/AlertTable";
import TrackMovement from "./TrackMovement/TrackMovement";
import SystemHealthContainer from "./SystemHealth/SystemHealthContainer.js";
import VesselEventContainer from "./VesselEvent/VesselEventContainer";
import AlarmContainer from "./Alarm/AlarmContainer";
import CreateEventContainer from "./CreateEvent/CreateEventContainer";

import RuleFields from "./components/RuleFields";
import AudioSettings from "./components/AudioSettings";
import DismissSettings from "./components/DismissSettings";

// misc
import _ from "lodash";
import { getTranslation } from "orion-components/i18n/I18nContainer";

const CreateEditRule = ({ location, params, rules, openDialog, closeDialog, addRule, orgUsers, updateRule, user, editMode, entityCollections, isOpen, landUnitSystem, timeFormatPreference, WavCamOpen, dir, locale, removeContext }) => {
	const [assignmentsState, setAssignmentsState] = useState({});
	const [title, setTitle] = useState("");
	const [desc, setDesc] = useState("");
	const [audioSettings, setAudioSettings] = useState({
		speakAlertText: true,
		alertText: "Alert, Alert",
		speakAlertNotification: true
	});
	const [dismissForOrg, setDismissForOrg] = useState(true);
	const [titleErrorText, setTitleErrorText] = useState(null);
	const [audioSettingErrorText, setAudioSettingErrorText] = useState(null);

	useEffect(() => {
		console.log("!!!", user);
		if (editMode) {
			const ruleId = params.id;
			const rule = rules.filter(rule => {
				if (rule.id === ruleId) {
					return JSON.parse(JSON.stringify(rule));
				}
			})[0];

			const assignments = orgUsers.map(member => {
				if (typeof rule.assignments[member.id] === "undefined") {
					return {
						user: member.name,
						id: member.id,
						shared: false,
						isPriority: false,
						notifyPush: false,
						notifySystem: false,
						notifyEmail: false
					};
				} else {
					return rule.assignments[member.id];
				}
			});

			const reducedAssignments = assignments.reduce((a, c) => {
				a[c.id] = c;
				return a;
			}, {});

			const audioSetting = rule.audioSettings ? rule.audioSettings : audioSettings;

			setAssignmentsState(reducedAssignments);
			setTitle(rule.title);
			setDesc(rule.desc);
			setAudioSettings(audioSetting);
			setDismissForOrg(rule.dismissForOrg);
		} else {
			const assignments = assignmentsState;

			// This should be reworked so does not mutate
			orgUsers.forEach(member => {
				return (assignments[member.id] = {
					user: member.name,
					id: member.id,
					shared: false,
					isPriority: false,
					notifyPush: false,
					notifySystem: false,
					notifyEmail: false
				});
			});

			setAssignmentsState(assignments);
		}

	}, []);

	const toggleAssignment = (user, alertType) => {
		const assignments = assignmentsState;
		const member = assignments[user.id];
		member[alertType] = !member[alertType];
		member["shared"] =
			member.isPriority ||
			member.notifyEmail ||
			member.notifySystem ||
			member.notifyPush;
		setAssignmentsState(assignments);
	};

	const handleChangeTitle = event => {
		setTitle(event.target.value);
	};

	const handleChangeDesc = event => {
		setDesc(event.target.value);
	};

	const updateTitleErrorMessage = message => {
		setTitleErrorText(message);
	};

	const validateAudioSettings = () => {
		const settings = audioSettings;

		if (!settings.speakAlertText && !settings.speakAlertNotification) {
			setAudioSettingErrorText(getTranslation("createEditRule.main.errorText.atLeastTwo"));
			return false;
		}

		if (settings.speakAlertText && !settings.alertText) {
			setAudioSettingErrorText(getTranslation("createEditRule.main.errorText.alertTextReq"));
			return false;
		}

		return true;
	};

	const handleChangeAudioSettings = audioSettings => {
		setAudioSettings(audioSettings);
	};

	const handleDismissForOrg = dismissForOrg => {
		setDismissForOrg(dismissForOrg);
	};

	let Editor;
	if (editMode) {
		// Get correct editor for the type of rule we are editing

		const ruleId = params.id;
		const rule = rules.filter(rule => {
			return rule.id === ruleId;
		})[0];

		switch (rule.type) {
			case "track-movement":
				Editor = TrackMovement;
				break;
			case "system-health":
				Editor = SystemHealthContainer;
				break;
			case "vessel-event":
				Editor = VesselEventContainer;
				break;
			case "alarm":
				Editor = AlarmContainer;
				break;
			case "create-event":
				Editor = CreateEventContainer;
				break;
			default:
				Editor = TrackMovement;
		}
	}

	const myOrgUsers = _.sortBy(orgUsers, orgUser => {
		return orgUser.id === user.profile.id ? 0 : 1;
	});

	const rulesApp = user.profile.applications.find((app) => { return app.appId === "rules-app"; });
	let canManage = false;
	if (rulesApp) canManage = rulesApp.permissions.includes("manage");

	const builderProps = {
		params: params,
		openDialog,
		closeDialog,
		isOpen,
		removeContext: removeContext,
		location: location,
		rules: rules,
		addRule: addRule,
		updateRule: updateRule,
		user: user,
		title: title,
		desc: desc,
		audioSettings: audioSettings,
		dismissForOrg: dismissForOrg,
		orgUsers: orgUsers,
		updateTitleErrorMessage: updateTitleErrorMessage,
		validateAudioSettings: validateAudioSettings,
		assignments: assignmentsState,
		editMode: editMode,
		entityCollections: entityCollections,
		landUnitSystem,
		timeFormatPreference,
		dir,
		locale
	};

	//////////////////////////////////////////////////////

	return (
		<div className="rules-wrapper" style={{ overflowY: "scroll", height: `calc(100vh - ${WavCamOpen ? "308px" : "48px"})` }}>
			<div className="row">
				<div className="row-item fullwidth" id="portal-to-submit-buttons">
					{/*  Submit/Cancel buttons are appended here via a Portal in the rule-type component  */}
				</div>
			</div>
			<RuleFields
				title={title}
				titleErrorText={titleErrorText}
				desc={desc}
				handleChangeDesc={handleChangeDesc}
				handleChangeTitle={handleChangeTitle}
				dir={dir}
			/>

			{editMode ? (
				<Editor {...builderProps} />
			) : (
				React.cloneElement(location.children, builderProps)
			)}

			<AudioSettings
				audioSettings={audioSettings}
				handleChangeAudioSettings={handleChangeAudioSettings}
				audioSettingErrorText={audioSettingErrorText}
				dir={dir}
			/>

			<DismissSettings dismissForOrg={dismissForOrg} handleDismissForOrg={handleDismissForOrg} dir={dir} />

			<AlertTable
				assignments={assignmentsState}
				canShare={canManage}
				user={user.profile}
				myOrgUsers={myOrgUsers}
				toggleAssignment={toggleAssignment}
				dir={dir}
			/>
		</div>
	);
};

export default CreateEditRule;
