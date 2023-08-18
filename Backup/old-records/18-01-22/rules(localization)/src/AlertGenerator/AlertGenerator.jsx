import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import AlertTable from "./components/AlertTable";
import { restClient } from "client-app-core";
import SubmitControls from "./components/SubmitControls";
import AlertFields from "./components/AlertFields";
import ObjectSelection from "./components/ObjectSelection";
import TargetSelection from "./components/TargetSelection";
import LocationSelection from "./components/LocationSelection";
import EscalationSelection from "./components/EscalationSelection";
import ErrorBoundary from "orion-components/ErrorBoundary";
import _ from "lodash";
import { Redirect } from "react-router";

const propTypes = {
	alertTypes: PropTypes.array,
	orgUsers: PropTypes.array.isRequired,
	user: PropTypes.object.isRequired,
	WavCamOpen: PropTypes.bool
};

const defaultProps = {
};

const AlertGenerator = ({
	alertTypes,
	orgUsers,
	user,
	WavCamOpen
}) => {
	const [activity, setActivity] = useState(
		{
			activityDate: "",
			actor: {
				"id": "rules-app",
				"name": "Rules App",
				"type": "application",
				"url": "http://localhost/rules-app"
			},
			contextEntities: [
				{
					"id": "",
					"type": "track"
				},
				{
					"id": "",
					"type": "shapes"
				}
			],
			escalationEvent: "",
			geometry: {
				coordinates: [],
				type: "Point"
			},
			object: {},
			summary: "",
			target: {},
			type: "",
			to: {}
		}
	);
	const [assignments, setAssignments] = useState([]);
	const [showAssignmentsTable, setShowAssignmentsTable] = useState(false);
	const [summaryDirty, setSummaryDirty] = useState(false);
	const [summaryTemplate, setSummaryTemplate] = useState(false);
	const [typeButtonText, setTypeButtonText] = useState("Type \u23f7");

	useEffect(() => {
		const tAssignments = orgUsers.map(member => {
			return {
				user: member.name,
				id: member.id,
				shared: false,
				isPriority: false,
				notifyPush: false,
				notifySystem: false,
				notifyEmail: false
			};
		});
		const reducedAssignments = tAssignments.reduce((a, c) => {
			a[c.id] = c;
			return a;
		}, {});

		setAssignments(reducedAssignments);
		setShowAssignmentsTable(true);
	}, [orgUsers]);

	const handleMapClick = (map, event) => {
		setActivity(prevActivity => ({
			...prevActivity,
			geometry: {
				coordinates: [
					parseFloat(event.lngLat.lng),
					parseFloat(event.lngLat.lat)
				],
				type: "Point"
			}
		}));
	};

	const resetForm = () => {
		const tAssignments = orgUsers.map(member => {
			return {
				user: member.name,
				id: member.id,
				shared: false,
				isPriority: false,
				notifyPush: false,
				notifySystem: false,
				notifyEmail: false
			};
		});
		const reducedAssignments = tAssignments.reduce((a, c) => {
			a[c.id] = c;
			return a;
		}, {});
		setAssignments(reducedAssignments);
		setActivity(
			{
				activityDate: "",
				actor: {
					"id": "rules-app",
					"name": "Rules App",
					"type": "application",
					"url": "http://localhost/rules-app"
				},
				contextEntities: [
					{
						"id": "",
						"type": "track"
					},
					{
						"id": "",
						"type": "shapes"
					}
				],
				escalationEvent: "",
				geometry: {
					coordinates: [],
					type: "Point"
				},
				object: {},
				summary: "",
				target: {},
				type: "",
				to: {}
			}
		);
		setTypeButtonText("Type \u23f7");
	};

	const selectAlertType = (type) => {
		let currentSummary = activity.summary;
		if(!summaryDirty && type.summary)
		{
			currentSummary = type.summary;
			if(activity.object && activity.object.name && currentSummary.includes("[track]"))
			{
				currentSummary = currentSummary.replace("[track]", activity.object.name);
			}
			if(activity.target && activity.target.name && currentSummary.includes("[shape]"))
			{
				currentSummary = currentSummary.replace("[shape]", activity.target.name);
			}
		}
		setActivity({
			...activity,
			summary: currentSummary,
			type: type.id
		});
		setSummaryTemplate(type.summary);
	};

	const handleAlertObjectClick = (object) => {
		if (activity.object.id === object.id)
			setActivity({
				...activity,
				object: {}
			});
		else
		{
			let currentSummary = activity.summary;
			if(!summaryDirty && summaryTemplate && summaryTemplate.includes("[track]"))
			{
				if(activity.target && activity.target.name && summaryTemplate.includes("[shape]"))
				{
					currentSummary = summaryTemplate.replace("[track]", object.entityData.properties.name).replace("[shape]", activity.target.name);
				}
				else
				{
					currentSummary = summaryTemplate.replace("[track]", object.entityData.properties.name);
				}
			}
			setActivity({
				...activity,
				contextEntities: [
					{ "id": object.id, "type": "track"},
					activity.contextEntities[1]
				],
				object: {
					entity: object,
					feedId: object.feedId,
					id: object.id,
					name: object.entityData.properties.name,
					type: object.entityType,
					url: `http://ecosystem/api/entities/${object.id}`
				},
				summary: currentSummary
			});
		}
	};

	const handleAlertTargetClick = (target) => {
		if (activity.target.id === target.id)
			setActivity({
				...activity,
				target: {}
			});
		else
		{
			let currentSummary = activity.summary;
			if(!summaryDirty && summaryTemplate && summaryTemplate.includes("[shape]"))
			{
				if(activity.object && activity.object.name && summaryTemplate.includes("[track]"))
				{
					currentSummary = summaryTemplate.replace("[track]", activity.object.name).replace("[shape]", target.entityData.properties.name);
				}
				else
				{
					currentSummary = summaryTemplate.replace("[shape]", target.entityData.properties.name);
				}
			}
			setActivity({
				...activity,
				contextEntities: [
					activity.contextEntities[0],
					{ "id": target.id, "type": "shapes" }
				],
				summary: currentSummary,
				target: {
					entity: target,
					feedId: target.feedId,
					id: target.id,
					name: target.entityData.properties.name,
					type: target.entityType,
					url: `http://ecosystem/api/entities/${target.id}`
				}
			});
		}
	};

	const handleAlertEventClick = (event) => {
		if (activity.escalationEvent === event.id)
			setActivity({
				...activity,
				escalationEvent: ""
			});
		else
		{
			setActivity({
				...activity,
				escalationEvent: event.id
			});
		}
	};

	const changeSummary = event => {
		setActivity({
			...activity,
			summary: event.target.value
		});
		setSummaryDirty(event.target.value && event.target.value.length !== 0);
	};

	const handleChangeLatitude = event => {
		setActivity({
			...activity,
			geometry: {
				coordinates: [
					activity.geometry.coordinates[0],
					parseFloat(event.target.value)
				],
				type: "Point"
			}
		});
	};

	const handleChangeLongitude = event => {
		setActivity({
			...activity,
			geometry: {
				coordinates: [
					parseFloat(event.target.value),
					activity.geometry.coordinates[1]
				],
				type: "Point"
			}
		});
	};

	const myOrgUsers = _.sortBy(orgUsers, orgUser => {
		return orgUser.id === user.profile.id ? 0 : 1;
	});

	const rulesApp = user.profile.applications.find((app) => { return app.appId === "rules-app"; });
	let canManage = false;
	if(rulesApp) canManage = rulesApp.permissions.includes("manage");


	const toggleAssignment = (user, alertType) => {
		const tAssignments = Object.assign([], assignments);
		const member = tAssignments[user.id];
		member[alertType] = !member[alertType];
		member["shared"] =
			member.isPriority ||
			member.notifyEmail ||
			member.notifySystem ||
			member.notifyPush;
		const alertAssignments = [];
		const users = [];
		Object.keys(tAssignments).forEach((function (user) {
			alertAssignments.push(tAssignments[user]);
		}));
		for (let i = 0; i < alertAssignments.length; i++) {
			users.push({
				token: "user:" + alertAssignments[i].id,
				isPriority: alertAssignments[i].isPriority,
				system: alertAssignments[i].notifySystem,
				email: alertAssignments[i].notifyEmail,
				pushNotification: alertAssignments[i].notifyPush
			});
		}
		setActivity({
			...activity,
			to: users
		});
	};

	const createAlert = (callback) => {
		activity.activityDate = new Date().toISOString();
		const body = JSON.stringify({ activity: activity });
		restClient.exec_post("/ecosystem/api/activities", body, callback);
	};

	const handleGenerateAlert = event => {
		createAlert((err, res) => {
			if (err) {
				console.log(err);
			} else {
				console.log(res);
			}
		});
	};

	const isValidActivity = () => {
		if (activity.summary === "" ||
			activity.type === "" ||
			(Object.entries(activity.object).length === 0 && activity.object.constructor === Object) ||
			(Object.entries(activity.target).length === 0 && activity.target.constructor === Object) ||
			activity.geometry.coordinates.length === 0)
		{
			return false;
		}
		return true;
	};

	const returnBool = user.profile.orgRole.title === "Org Admin";
	if(returnBool)
		return (
			<div className="rules-wrapper" style={{overflowY: "scroll", height: `calc(100vh - ${WavCamOpen ? "308px" : "48px"})`}}>
				<div className="row">
					<div className="row-item fullwidth">
						<SubmitControls
							resetForm={resetForm}
							handleGenerateAlert={handleGenerateAlert}
							isValidActivity={isValidActivity()}
						/>
					</div>
				</div>
				<AlertFields
					alertTypes={alertTypes}
					changeSummary={changeSummary}
					selectAlertType={selectAlertType}
					summary={activity.summary}
					typeButtonText={typeButtonText}
					setTypeButtonText={setTypeButtonText}
				/>
				<div className="row">
					<div className="row-item fullwidth">
						<div className="rule-attributes-section">
							<div className="rule-attribute-col">
								<div className="rule-attribute-row last-row">
									<ErrorBoundary>
										<ObjectSelection
											handleAlertObjectClick={handleAlertObjectClick}
											selectedObject={activity.object}
										/>
									</ErrorBoundary>
								</div>
							</div>
							<div className="rule-attribute-col">
								<div className="rule-attribute-row last-row">
									<ErrorBoundary>
										<TargetSelection
											handleAlertTargetClick={handleAlertTargetClick}
											selectedTarget={activity.target}
										/>
									</ErrorBoundary>
								</div>
							</div>
							<div className="rule-attribute-col last-col">
								<div className="rule-attribute-row">
									<ErrorBoundary>
										<LocationSelection
											handleChangeLatitude={handleChangeLatitude}
											handleChangeLongitude={handleChangeLongitude}
											handleMapClick={handleMapClick}
											latitude={activity.geometry.coordinates[1]}
											longitude={activity.geometry.coordinates[0]}
										/>
									</ErrorBoundary>
								</div>
								<div className="rule-attribute-row last-row">
									<ErrorBoundary>
										<EscalationSelection
											handleAlertEventClick={handleAlertEventClick}
											selectedEvent={activity.escalationEvent}
										/>
									</ErrorBoundary>
								</div>
							</div>
						</div>
					</div>
				</div>
				{showAssignmentsTable ?
					<AlertTable
						assignments={assignments}
						canShare={canManage}
						user={user.profile}
						myOrgUsers={myOrgUsers}
						toggleAssignment={toggleAssignment}
					/> : null}
			</div>
		);
	else{
		return <Redirect to="/" />;
	}
};

AlertGenerator.propTypes = propTypes;
AlertGenerator.defaultProps = defaultProps;

export default AlertGenerator;