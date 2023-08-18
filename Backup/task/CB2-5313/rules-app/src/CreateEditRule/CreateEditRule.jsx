import React, { useEffect, useState } from "react";

import AlertTable from "./components/AlertTable";
import TrackMovement from "./TrackMovement/TrackMovement";
import SystemHealth from "./SystemHealth/SystemHealth";
import VesselEvent from "./VesselEvent/VesselEvent";
import Alarm from "./Alarm/Alarm";
import CreateEvent from "./CreateEvent/CreateEvent";

import RuleFields from "./components/RuleFields";
import AudioSettings from "./components/AudioSettings";
import DismissSettings from "./components/DismissSettings";

// misc
import _ from "lodash";
import { getTranslation } from "orion-components/i18n";
import { useSelector } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";
import { openDialog, closeDialog } from "orion-components/AppState/Actions";
import * as actionCreators from "./createRuleActions";

const CreateEditRule = ({
	location,
	navigate,
	params,
	editMode,
	children
}) => {
	const { addRule, updateRule, removeContext } = actionCreators;
	const rules = useSelector(state => Object.keys(state.globalData.rules).map(key => {
		return state.globalData.rules[key];
	}));
	const landUnitSystem = useSelector(state => state.appState.global.unitsOfMeasurement.landUnitSystem);
	const timeFormatPreference = useSelector(state => state.appState.global.timeFormat);
	const orgUsersSelector = useSelector(state => state.globalData.org.orgUsers);
	const orgUsers = _.filter(orgUsersSelector, u => {
		return (!u.disabled);
	});
	const dir = useSelector(state => getDir(state));
	const locale = useSelector(state => state.i18n.locale);
	const user = useSelector(state => state.session.user);
	const entityCollections = useSelector(state => state.globalData.collections);
	const isOpen = useSelector(state => state.appState.dialog.openDialog);
	const WavCamOpen = useSelector(state => state.appState.dock.dockData.WavCam);

	const [assignmentsState, setAssignmentsState] = useState({});
	const [title, setTitle] = useState("");
	const [desc, setDesc] = useState("");
	const [audioSettings, setAudioSettings] = useState({
		speakAlertText: true,
		alertText: "Alert, Alert",
		speakAlertNotification: true
	});
	const [dismissForOrg, setDismissForOrg] = useState(true);
	const [titleErrorText, setTitleErrorText] = useState("");
	const [audioSettingErrorText, setAudioSettingErrorText] = useState("");
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
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
		setMounted(true);
	}

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
				Editor = SystemHealth;
				break;
			case "vessel-event":
				Editor = VesselEvent;
				break;
			case "alarm":
				Editor = Alarm;
				break;
			case "create-event":
				Editor = CreateEvent;
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
		locale,
		navigate: navigate
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
				React.cloneElement(children, builderProps)
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
