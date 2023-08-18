import React, { useEffect, useState } from "react";
import { restClient } from "client-app-core";

// Error Handling
import ErrorBoundary from "orion-components/ErrorBoundary";
import EscalationAttributes from "../Escalations/EscalationAttributes";
import GenericAttribute from "../GenericAttribute/GenericAttribute";
import CircularProgress from "material-ui/CircularProgress";
import { useNavigate } from "react-router-dom";

// misc
import _ from "lodash";
import SubmitControls from "../components/SubmitControls";
import ruleBuilder from "orion-components/rule-builder";
import { default as filterAssignments } from "../utils/filterAssignments";
import { Translate, getTranslation } from "orion-components/i18n";
import { useSelector, useDispatch } from "react-redux";
import * as actionCreators from "./alarmActions";
import { getDir } from "orion-components/i18n/Config/selector";

const Alarm = ({
	params,
	isOpen,
	removeContext,
	rules,
	addRule,
	updateRule,
	user,
	title,
	desc,
	audioSettings,
	dismissForOrg,
	updateTitleErrorMessage,
	validateAudioSettings,
	assignments,
	editMode,
	entityCollections
}) => {
	const dispatch = useDispatch();

	const {
		openDialog,
		closeDialog
	} = actionCreators;

	const timeFormatPreference = useSelector(state => state.appState.global.timeFormat);
	const dir = useSelector(state => getDir(state));

	const navigate = useNavigate();

	const [alarmFeeds, setAlarmFeeds] = useState([]);
	const [feed, setFeed] = useState("");
	const [filter, setFilter] = useState("");
	const [subFilter, setSubFilter] = useState("");
	const [conditions, setConditions] = useState([]);
	const [escalationEvent, setEscalationEvent] = useState("");
	const [loading, setLoading] = useState(false);

	// -- will run on first render
	useEffect(() => {
		setLoading(true);
		restClient.exec_get("/ecosystem/api/externalSystem", (err, response) => {
			const options = [];
			if (err) {
				console.log(err);
			} else {
				if (response.length > 0) {
					response.forEach((externalSystem) => {
						if (externalSystem.type && externalSystem.type === "alarm" && externalSystem.config) {
							const config = externalSystem.config;

							// -- grab all filters and subFilters
							const filters = [];
							if (config.filters && config.filters.length > 0) {
								config.filters.forEach((filter) => {
									const subFilters = [];
									if (filter.subFilters && filter.subFilters.length > 0) {
										filter.subFilters.forEach((subFilter) => {
											const subFilterOption = {
												value: subFilter.id,
												label: subFilter.label
											};
											subFilters.push(subFilterOption);
										});
									}

									const filterOption = {
										value: filter.id,
										label: filter.label,
										subFilters
									};
									filters.push(filterOption);
								});
							}

							// -- build out alarm feed object
							const alarmFeedOption = {
								value: externalSystem.externalSystemId,
								label: externalSystem.name || externalSystem.externalSystemId,
								filters
							};
							options.push(alarmFeedOption);
						}
					});
				}
			}
			setAlarmFeeds(options);

			if (editMode) {
				// -- make a copy of the rule to keep from updating existing global state rules
				const rule = _.cloneDeep(rules.find(rule => rule.id === params.id));

				setFeed(rule.subject[0].feed);
				setFilter(rule.subject[0].filter);
				setSubFilter(rule.subject[0].subFilter);
				setConditions(rule.conditions);
				setEscalationEvent(rule.escalationEvent);
			}

			setLoading(false);
		});
	}, []);

	const _addEscalation = selectedEvent => {
		setEscalationEvent(selectedEvent.id);
	};

	const _updateEscalation = selectedEvent => {
		setEscalationEvent(selectedEvent.id);
	};

	const _deleteEscalation = () => {
		setEscalationEvent("");
	};

	const handleSaveClick = () => {
		if (editMode) {
			_updateRule();
		} else {
			_addRule();
		}
	};

	const _updateRule = () => {
		const { assignments: oldAssignments } = rules.find(
			rule => rule.id === params.id
		);
		if (_.isEmpty(title)) {
			updateTitleErrorMessage("This field is Required");
		} else if (validateAudioSettings()) {
			const filteredAssignments = filterAssignments(
				oldAssignments,
				assignments
			);
			dispatch(updateRule(
				params.id,
				title,
				desc,
				audioSettings,
				dismissForOrg,
				document.getElementById("rule-string").textContent,
				[{
					externalSystemId: feed,
					feed,
					filter,
					subFilter
				}], // subject
				"alarm", // trigger
				[], // targets
				conditions,
				escalationEvent,
				filteredAssignments
			));
			dispatch(removeContext(params.id));
			navigate("/");
		}
	};

	const _addRule = () => {
		if (_.isEmpty(title)) {
			updateTitleErrorMessage("This field is Required");
		} else if (validateAudioSettings()) {
			const filteredAssignments = filterAssignments({}, assignments);
			dispatch(addRule(
				title,
				desc,
				audioSettings,
				dismissForOrg,
				document.getElementById("rule-string").textContent,
				[{
					externalSystemId: feed,
					feed,
					filter,
					subFilter
				}], // subject
				"alarm", // trigger
				[], // targets
				conditions,
				escalationEvent,
				filteredAssignments,
				user.profile.id,
				user.profile.orgId,
				"alarm",
				user.profile.name
			));
			navigate("/");
		}
	};

	const _cancelAndHome = () => {
		if (editMode && params.id) {
			dispatch(removeContext(params.id));
		}
		navigate("/");
	};

	const setProperty = (key) => (value) => {

		if (key === "feed") {
			// -- reset filter and subFilter if feed changed
			setFeed(value);
			setFilter("");
			setSubFilter("");
		}
		else if (key === "filter") {
			// -- reset subFilter if filter changed
			setFilter(value);
			setSubFilter("");
		}
		else if (key === "subFilter") {
			setSubFilter(value);
		}
		else if (key === "conditions") {
			setConditions(value);
		}
	};

	const isMobile = window.matchMedia("(max-width: 600px)").matches;
	const styles = {
		contentContainerStyle: { marginBottom: "6px" },
		tabButton: { textTransform: "normal" },
		inkBar: { height: 0 },
		dialogStyles: {
			border: "none",
			maxHeight: "500px",
			maxWidth: "500px"
		},
		buttonStyles: isMobile ? { fontSize: "13px" } : {},
		listItemStyles: { backgroundColor: "#41454A" }
	};

	// -- build out feed, filter and subFilter options based on current selections
	const feedOptions = [{ value: "", label: getTranslation("createEditRule.genericAttribute.type.none") }], filterOptions = [{ value: "", label: getTranslation("createEditRule.genericAttribute.type.none") }], subFilterOptions = [{ value: "", label: getTranslation("createEditRule.genericAttribute.type.none") }];
	alarmFeeds.forEach((alarmFeed) => {
		const feedOption = {
			value: alarmFeed.value,
			label: alarmFeed.label
		};
		feedOptions.push(feedOption);

		if (feed === alarmFeed.value) {
			alarmFeed.filters.forEach((_filter) => {
				const filterOption = {
					value: _filter.value,
					label: _filter.label
				};
				filterOptions.push(filterOption);

				if (filter === _filter.value) {
					_filter.subFilters.forEach((_subFilter) => {
						const subFilterOption = { ..._subFilter };
						subFilterOptions.push(subFilterOption);
					});
				}
			});
		}
	});

	const disableSave = feed === "" || filter === "";
	const disableFilter = feed === "";
	const disableSubFilter = disableFilter || filter === "";

	return (
		<div>
			<SubmitControls
				cancelAndHome={_cancelAndHome}
				disabled={disableSave}
				handleSaveClick={handleSaveClick}
				dir={dir}
			/>

			<div className="mobile-content-divider" />

			<div style={{ position: "relative" }}>
				{loading && (
					<div className="blur-overlay-body">
						<CircularProgress size={150} thickness={10} />
					</div>
				)}

				<div className={loading ? "blur-overlay" : null}>
					<div>
						<div className="row">
							<div className="row-item fullwidth">
								<div className="rule-states" style={dir == "rtl" ? { textAlign: "right" } : {}}>
									<span><Translate value="createEditRule.alarm.ruleStates" /></span>
									<h2 id="rule-string">
										{ruleBuilder(
											{
												alarmFeeds,
												feed,
												filter,
												subFilter,
												conditions,
												escalationEvent,
												type: "alarm",
												timeFormatPreference
											},
											entityCollections,
											null,
											false
										)}
									</h2>
								</div>
							</div>
						</div>

						<div className="mobile-content-divider" />

						<div className="row">
							<div className="row-item fullwidth">
								<div className="rule-attributes-section">
									<div className="rule-attribute-col">
										<div className="rule-attribute-row">
											<ErrorBoundary>
												<GenericAttribute
													type={"feed"}
													description={getTranslation("createEditRule.alarm.chooseFeed")}
													inputType={"dropdown"}
													inputOptions={feedOptions}
													setProperty={setProperty("feed")}
													value={feed}
													dir={dir}
												/>
											</ErrorBoundary>
										</div>
										<div className={"rule-attribute-row" + (disableFilter ? " disabled" : "")}>
											<ErrorBoundary>
												<GenericAttribute
													type={"filterType"}
													description={getTranslation("createEditRule.alarm.chooseAlarmType")}
													inputType={"dropdown"}
													inputOptions={filterOptions}
													setProperty={setProperty("filter")}
													value={filter}
													dir={dir}
												/>
											</ErrorBoundary>
										</div>
										<div className={"rule-attribute-row last-row" + (disableSubFilter ? " disabled" : "")}>
											<ErrorBoundary>
												<GenericAttribute
													type={"filterSubType"}
													description={getTranslation("createEditRule.alarm.chooseAlarmSubType")}
													inputType={"dropdown"}
													inputOptions={subFilterOptions}
													setProperty={setProperty("subFilter")}
													value={subFilter}
													dir={dir}
												/>
											</ErrorBoundary>
										</div>
									</div>
									<div className="rule-attribute-col last-col">
										<div className="rule-attribute-row">
											<ErrorBoundary>
												<GenericAttribute
													type={"conditions"}
													inputType={"conditions"}
													inputOptions={["time"]}
													setProperty={setProperty("conditions")}
													openDialog={openDialog}
													value={conditions}
													dir={dir}
												/>
											</ErrorBoundary>
										</div>
										<div className="rule-attribute-row last-row">
											<ErrorBoundary>
												<EscalationAttributes
													isOpen={isOpen}
													openDialog={openDialog}
													closeDialog={closeDialog}
													styles={styles}
													addEscalation={_addEscalation}
													escalationEvent={escalationEvent}
													deleteEscalation={_deleteEscalation}
													updateEscalation={_updateEscalation}
												/>
											</ErrorBoundary>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Alarm;
