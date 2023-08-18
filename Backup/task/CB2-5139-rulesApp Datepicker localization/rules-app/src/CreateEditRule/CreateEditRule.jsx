import React, { Component } from "react";

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

class CreateEditRule extends Component {
	constructor(props) {
		super(props);
		this.state = {
			assignments: {},
			title: "",
			desc: "",
			audioSettings: {
				speakAlertText: true,
				alertText: "Alert, Alert",
				speakAlertNotification: true
			},
			dismissForOrg: true
		};
	}

	UNSAFE_componentWillMount() {
		if (this.props.editMode) {
			const ruleId = this.props.params.id;
			const rule = this.props.rules.filter(rule => {
				if (rule.id === ruleId) {
					return JSON.parse(JSON.stringify(rule));
				}
			})[0];

			const assignments = this.props.orgUsers.map(member => {
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

			const audioSetting = rule.audioSettings ? rule.audioSettings : this.state.audioSettings;

			this.setState({
				assignments: reducedAssignments,
				title: rule.title,
				desc: rule.desc,
				audioSettings: audioSetting,
				dismissForOrg: rule.dismissForOrg
			});
		} else {
			const assignments = this.state.assignments;

			// This should be reworked so does not mutate
			this.props.orgUsers.forEach(member => {
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

			this.setState({
				assignments: assignments
			});
		}
	}

	toggleAssignment = (user, alertType) => {
		const assignments = this.state.assignments;
		const member = assignments[user.id];
		member[alertType] = !member[alertType];
		member["shared"] =
			member.isPriority ||
			member.notifyEmail ||
			member.notifySystem ||
			member.notifyPush;
		this.setState({
			assignments: assignments
		});
	};

	handleChangeTitle = event => {
		this.setState({
			title: event.target.value
		});
	};

	handleChangeDesc = event => {
		this.setState({
			desc: event.target.value
		});
	};

	updateTitleErrorMessage = message => {
		this.setState({
			titleErrorText: message
		});
	};

	validateAudioSettings = () => {
		const settings = this.state.audioSettings;
		
		if (!settings.speakAlertText && !settings.speakAlertNotification) {
			this.setState({
				audioSettingErrorText: getTranslation("createEditRule.main.errorText.atLeastTwo")
			});
			return false;
		}

		if (settings.speakAlertText && !settings.alertText) {
			this.setState({
				audioSettingErrorText: getTranslation("createEditRule.main.errorText.alertTextReq")
			});
			return false;
		}

		return true;
	};

	handleChangeAudioSettings = audioSettings => {
		this.setState({
			audioSettings
		});
	};

	handleDismissForOrg = dismissForOrg => {
		this.setState({
			dismissForOrg
		});
	};

	render() {
		let Editor;
		if (this.props.editMode) {
			// Get correct editor for the type of rule we are editing

			const ruleId = this.props.params.id;
			const rule = this.props.rules.filter(rule => {
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

		const {
			location,
			params,
			rules,
			openDialog,
			closeDialog,
			addRule,
			orgUsers,
			updateRule,
			user,
			editMode,
			entityCollections,
			isOpen,
			landUnitSystem,
			timeFormatPreference,
			WavCamOpen,
			dir,
			locale
		} = this.props;

		const myOrgUsers = _.sortBy(orgUsers, user => {
			return user.id === this.props.user.profile.id ? 0 : 1;
		});

		const rulesApp = user.profile.applications.find((app) => { return app.appId === "rules-app"; });
		let canManage = false;
		if(rulesApp) canManage = rulesApp.permissions.includes("manage");	

		const builderProps = {
			params: params,
			openDialog,
			closeDialog,
			isOpen,
			removeContext: this.props.removeContext,
			location: location,
			rules: rules,
			addRule: addRule,
			updateRule: updateRule,
			user: user,
			title: this.state.title,
			desc: this.state.desc,
			audioSettings: this.state.audioSettings,
			dismissForOrg: this.state.dismissForOrg,
			orgUsers: orgUsers,
			updateTitleErrorMessage: this.updateTitleErrorMessage,
			validateAudioSettings: this.validateAudioSettings,
			assignments: this.state.assignments,
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
					title={this.state.title}
					titleErrorText={this.state.titleErrorText}
					desc={this.state.desc}
					handleChangeDesc={this.handleChangeDesc}
					handleChangeTitle={this.handleChangeTitle}
					dir={dir}
				/>

				{this.props.editMode ? (
					<Editor {...builderProps} />
				) : (
					React.cloneElement(location.children, builderProps)
				)}

				<AudioSettings 
					audioSettings={this.state.audioSettings} 
					handleChangeAudioSettings={this.handleChangeAudioSettings} 
					audioSettingErrorText={this.state.audioSettingErrorText}
					dir={dir}
				/>

				<DismissSettings dismissForOrg={this.state.dismissForOrg} handleDismissForOrg={this.handleDismissForOrg} dir={dir}/>

				<AlertTable
					assignments={this.state.assignments}
					canShare={canManage}
					user={user.profile}
					myOrgUsers={myOrgUsers}
					toggleAssignment={this.toggleAssignment}
					dir={dir}
				/>
			</div>
		);
	}
}

export default CreateEditRule;
