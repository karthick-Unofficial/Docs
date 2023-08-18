/* eslint react/prop-types: 0 */
import React, { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { restClient } from "client-app-core";

import { TextField } from "orion-components/CBComponents";
import { handleUpdateLookupsAndSubmit } from "../lookups/lookups";
import Typeahead from "./Typeahead/Typeahead";
import CargoTable from "./CargoTable/CargoTable";
import ScheduleField from "./ScheduleField/ScheduleField";
import BargeFields from "./BargeFields/BargeFields";
import ServicesFields from "./ServicesFields/ServicesFields";
import NotesField from "./NotesField/NotesField";
import Dialog from "./CBDialog/CBDialog";

import {
	Button,
	Checkbox,
	FormControlLabel,
	FormGroup,
	FormControl,
	InputLabel,
	MenuItem,
	Select
} from "@mui/material";
import { Translate, getTranslation } from "orion-components/i18n";
import PropTypes from "prop-types";
import { validate } from "../shared/utility/validate";
import { makeStyles } from "@mui/styles";

const propTypes = {
	dir: PropTypes.string,
	classes: PropTypes.object.isRequired,
	locale: PropTypes.string
};

const useStyles = makeStyles({
	icon: {
		right: "unset!important",
		left: "0!important"
	},
	select: {
		paddingRight: "0!important"
	}
});

const BerthRequestForm = ({
	services,
	voyageNumberEnabled,
	voyageNumberRequired,
	imoRequired,
	mmsiRequired,
	requestingCompanyDisabled,
	submitDialogProps,
	organizationId,
	timeFormat,
	dir,
	header,
	cargoDirectionLevel,
	notesEnabled,
	servicesConfig,
	locale
}) => {
	const classes = useStyles();

	const [state, setState] = useState({
		width: 1080,
		vesselTypes: [],
		agents: [],
		vessels: [],
		berths: [],
		requestedBy: [],
		vesselActivities: [],

		// Agent - Lookup
		agentId: null,
		agent: {
			name: null,
			company: null,
			email: null,
			phone: null,
			isDirty: false
		},

		// Vessel - Lookup
		vesselId: null,
		cargoDirection: null,
		vessel: {
			name: null,
			mmsid: null,
			imo: null,
			type: null,
			loa: 0,
			grt: 0,
			draft: 0,
			voyageNumber: null
		},

		// Schedule
		eta: null,
		etd: null,

		// Berth
		berth: {
			name: null
		},

		// RequestedBy - Lookup
		requestedId: null,
		requested: {
			name: null,
			company: null,
			email: null,
			phone: null
		},

		addedCargo: [],
		addedBarges: [],
		servicesState: services,
		notes: "",
		primaryActivity: {
			activity: "",
			id: ""
		},

		dialogOpen: false,
		debouncer: null
	});
	// Since the values are assigned dynamically and to avoid complexities, leaving as a single parent state variable.

	const debounce = (fn, delay) => {
		const { debouncer } = state;

		if (debouncer) {
			clearTimeout(debouncer);
		}

		setState(prevState => ({
			...prevState,
			debouncer: setTimeout(() => {
				fn();
				setState(prevState => ({
					...prevState,
					debouncer: null
				}));
			}, delay)
		}));
	};

	useEffect(() => {
		// Grab vessel types
		restClient.exec_get(
			"/berth-request-app/api/request/vesselTypes",
			(err, res) => {
				if (err) {
					console.log("Vessel type query err", err);
				}
				else {
					const result = res.map(item => {
						return {
							name: item.name,
							id: item.id
						};
					});
					setState(prevState => ({
						...prevState,
						vesselTypes: result
					}));
				}
			}
		);

		// Grab berths
		restClient.exec_get(
			"/berth-request-app/api/request/berths",
			(err, res) => {
				if (err) {
					console.log("Berth query err", err);
				}
				else {
					setState(prevState => ({
						...prevState,
						berths: res
					}));
				}
			}
		);

		// Grab vessel activities
		restClient.exec_get(
			"/berth-request-app/api/request/vesselActivities",
			(err, res) => {
				if (err) {
					console.log("Berth query err", err);
				}
				else {
					setState(prevState => ({
						...prevState,
						vesselActivities: res
					}));
				}
			}
		);

		updateWindowDimensions();
		window.addEventListener("resize", updateWindowDimensions);

		return () => {
			window.removeEventListener("resize", updateWindowDimensions);
		};
	}, []);

	const updateWindowDimensions = () => {
		setState(prevState => ({ ...prevState, width: window.innerWidth }));
	};

	// Ensure required fields are populated and allow submit
	const checkSubmit = () => {
		const {
			addedCargo,
			addedBarges,
			agent,
			vessel,
			requested,
			eta,
			etd,
			agentEmailError,
			requestedEmailError
		} = state;

		// Ensure cargo has at least one filled property
		if (addedCargo.length) {
			const cargoFilled = addedCargo.every(item => {
				if (item.commodity) {
					return true;
				}
				return false;
			});

			if (!cargoFilled) {
				return false;
			}
		}

		// Ensure barges are filled with required properties
		if (addedBarges.length) {
			const bargesFilled = addedBarges.every(item => {
				if (!item.name || !item.registry) {
					return false;
				}
				return true;
			});

			if (!bargesFilled) {
				return false;
			}
		}

		const agentValid = agent.name && agent.email && !agentEmailError && agent.phone === null ? true : validate("phone", agent.phone);
		/*
		 * There are some specific rules around IMO validation that we are currently not implementing. One of those being...
		 * """
		 * The integrity of an IMO number can be verified by its check digit, which is the rightmost digit.
		 * This is done by multiplying each of the leftmost six digits by a factor corresponding to their position
		 * from right to left, and adding those products together
		 * . The rightmost digit of this sum is the check digit.
		 * """
		 */
		const imoValid = !imoRequired || (vessel.imo && vessel.imo.toString().length === 7);
		const mmsidValid = !mmsiRequired || (vessel.mmsid && vessel.mmsid.toString().length === 9);
		const vesselValid = vessel.name && mmsidValid && imoValid && (!voyageNumberEnabled || !voyageNumberRequired || !!vessel.voyageNumber);
		const requestedByValid = requestingCompanyDisabled || !(!requested.name || !requested.email || requestedEmailError || !(requested.phone === null ? true : validate("phone", requested.phone)));
		const scheduleValid = eta && etd;

		return agentValid && vesselValid && requestedByValid && scheduleValid;
	};

	// Set result of lookup select to state via ID and full data
	const handleSelectLookup = type => data => {
		const newData = {};

		switch (type) {
			case "agent": {
				newData.name = `${data.name.firstName} ${data.name.lastName}`;
				newData.company = data.company;
				newData.email = data.email;
				newData.phone = data.phone;
				newData.isDirty = false;
				break;
			}
			case "vessel": {
				newData.name = data.name;
				newData.mmsid = data.mmsid;
				newData.type = data.type;
				newData.imo = data.imo;
				newData.loa = data.loa;
				newData.grt = data.grt;
				newData.draft = data.draft;
				newData.voyageNumber = data.voyageNumber;
				newData.isDirty = false;
				break;
			}
			case "berth": {
				newData.name = data.name;
				newData.isDirty = false;
				break;
			}
			case "requested": {
				newData.name = `${data.name.firstName} ${data.name.lastName}`;
				newData.company = data.company;
				newData.email = data.email;
				newData.phone = data.phone;
				newData.isDirty = false;
				break;
			}
			default:
				break;
		}
		setState(prevState => ({
			...prevState,
			[`${type}Id`]: data.id,
			[type]: newData
		}));
	};

	// Set result of company lookup correctly in state
	// -- Company is a special case, as we select it via lookup
	// -- but it works the same as any other field
	const handleSelectCompany = field => data => {
		setState(prevState => ({
			...prevState,
			[field]: {
				...state[field],
				company: data.company
			}
		}));
	};

	// Set nested state property
	const handleSelectNested = (field, property) => data => {
		const targetProperties = ["name", "company", "email", "phone", "mmsid", "imo", "position", "loa", "grt", "type", "draft", "voyageNumber", "activity"];
		const floatProperties = ["imo", "loa", "grt", "draft"];
		let value = data;

		if (targetProperties.includes(property)) {
			value = data.target.value;
		}

		if (floatProperties.includes(property)) {
			value = parseFloat(value);
		}

		// Ensure email follows proper formatting
		if (property === "email") {
			const exp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			const hasError = (value && value.length) ? !exp.test(value.toLowerCase()) : false;

			if (hasError) {
				setState(prevState => ({ ...prevState, [`${field}EmailError`]: true }));
			}
			else {
				setState(prevState => ({ ...prevState, [`${field}EmailError`]: false }));
			}
		}

		setState(prevState => ({
			...prevState,
			[field]: {
				...state[field],
				[property]: value,
				isDirty: !!state[`${field}Id`]
			}
		}));
	};

	// Set top level state property
	const handleSelect = field => data => {
		const targetFields = ["cargoDirection"];
		let value = data;

		// Ensure checkboxes select correct value
		if (targetFields.includes(field)) {
			value = data.target.value;
		}

		setState(prevState => ({
			...prevState,
			[field]: value
		}));
	};

	// Clear nested state property
	const clearNested = (field, data) => {
		setState(prevState => ({
			...prevState,
			[field]: {
				...state[field],
				...data
			}
		}));
	};

	// Clear top level state property
	const clearSelected = field => () => {
		setState(prevState => ({
			...prevState,
			[field]: null
		}));
	};

	const handleUpdateCargo = cargo => {
		setState(prevState => ({
			...prevState,
			addedCargo: cargo
		}));
	};

	const handleRemoveCargo = id => {
		const { addedCargo } = state;
		const newCargo = addedCargo.filter(cargo => cargo.id !== id);
		const reindexedCargo = newCargo.map((cargo, index) => {
			cargo.id = index;
			return cargo;
		});
		setState(prevState => ({
			...prevState,
			addedCargo: reindexedCargo
		}));
	};

	const handleUpdateBarge = barges => {
		setState(prevState => ({
			...prevState,
			addedBarges: barges
		}));
	};

	const handleRemoveBarge = position => {
		const { addedBarges } = state;
		const newBarges = addedBarges.filter(barge => barge.order !== position);
		const reindexedBarges = newBarges.map((barge, index) => {
			barge.order = index;
			return barge;
		});


		setState(prevState => ({
			...prevState,
			addedBarges: reindexedBarges
		}));
	};

	const queryAgent = (searchProps, searchString) => {
		const { agentCompany } = state;

		if (searchString !== "") {
			restClient.exec_get(
				`/berth-request-app/api/request/queryAgent?searchProps=${searchProps}&searchString=${searchString}`,
				(err, res) => {
					if (err) {
						console.log("Agent query err", err);
					}
					else {
						const result = {};
						const isCompany = searchProps === "company";

						// If you're searching by name and already have a company selected, filter only members of that company
						if (!isCompany && agentCompany) {
							res = res.filter(agent => agent.company === agentCompany);
						}

						res.forEach(agent => {

							// If searching by company, ensure only one result per company
							if (
								!isCompany
								|| (!Object.values(result).find(res => res.fullData.company === agent.company))
							) {
								result[agent.id] = {
									searchString: `${agent.name.firstName}${agent.name.lastName}${agent.company}`,
									label: (isCompany ? `${agent.company}` : `${agent.name.firstName} ${agent.name.lastName}`),
									id: agent.id,
									fullData: agent
								};
							}
						});

						setState(prevState => ({
							...prevState,
							agents: result
						}));
					}
				}
			);
		}
		else {
			setState(prevState => ({
				...prevState,
				agents: {}
			}));
		}
	};

	const queryVessel = (searchProps, searchString) => {
		if (searchString !== "") {
			restClient.exec_get(
				`/berth-request-app/api/request/queryVessel?searchProps=${searchProps}&searchString=${searchString}`,
				(err, res) => {
					if (err) {
						console.log("Vessel query err", err);
					}
					else {
						const result = {};
						res.forEach(vessel => {
							result[vessel.id] = {
								searchString: `${vessel.name}${vessel.mmsid}${vessel.imo}`,
								label: `${vessel[searchProps]}`,
								id: vessel.id,
								fullData: vessel
							};
						});
						setState(prevState => ({
							...prevState,
							vessels: result
						}));
					}
				}
			);
		}
		else {
			setState(prevState => ({
				...prevState,
				vessels: {}
			}));
		}
	};

	const queryRequestedBy = (searchProps, searchString) => {
		const { requested } = state;

		if (searchString !== "") {
			restClient.exec_get(
				`/berth-request-app/api/request/queryRequestedBy?searchProps=${searchProps}&searchString=${searchString}`,
				(err, res) => {
					if (err) {
						console.log("RequestedBy query err", err);
					}
					else {
						const result = {};
						const isCompany = searchProps === "company";

						// If you're searching by name and already have a company selected, filter only members of that company
						if (!isCompany && requested.company) {
							res = res.filter(agent => agent.company === requested.company);
						}

						res.forEach(requestedBy => {

							// If searching by company, ensure only one result per company
							if (
								!isCompany
								|| (!Object.values(result).find(res => res.fullData.company === requestedBy.company))
							) {
								result[requestedBy.id] = {
									searchString: `${requestedBy.name.firstName}${requestedBy.name.lastName}${requestedBy.company}`,
									label: (isCompany ? `${requestedBy.company}` : `${requestedBy.name.firstName} ${requestedBy.name.lastName}`),
									id: requestedBy.id,
									fullData: requestedBy
								};
							}
						});

						setState(prevState => ({
							...prevState,
							requestedBy: result
						}));
					}
				}
			);
		}
		else {
			setState(prevState => ({
				...prevState,
				requestedBy: {}
			}));
		}
	};

	const handleQueryAgent = (searchProps) => (searchString) => {
		debounce(() => {
			queryAgent(searchProps, searchString);
		}, 400);
	};

	const handleQueryVessel = (searchProps) => (searchString) => {
		debounce(() => {
			queryVessel(searchProps, searchString);
		}, 400);
	};

	const handleQueryRequestedBy = (searchProps) => (searchString) => {
		debounce(() => {
			queryRequestedBy(searchProps, searchString);
		}, 400);
	};

	const stageSubmitRequest = () => {
		if (submitDialogProps.enabled) {
			setState(prevState => ({
				...prevState,
				dialogOpen: true
			}));
		}
		else {
			submitRequest();
		}
	};

	// TODO: Update this with new state -- Handle creating lookups if necessary
	const submitRequest = async () => {
		const {
			agentId,
			agent,
			vesselId,
			cargoDirection,
			vessel,
			eta,
			etd,
			berths,
			berth,
			requestedId,
			requested,
			addedCargo,
			addedBarges,
			servicesState,
			notes,
			vesselActivities,
			primaryActivity
		} = state;

		const selectedBerth = berths.find(berthObj => berthObj.name === berth.name);
		const berthId = selectedBerth ? selectedBerth.id : null;
		const primaryActivityId = (vesselActivities.find(vesselActivity => vesselActivity.id === primaryActivity.activity) || { id: "" }).id;

		await handleUpdateLookupsAndSubmit(
			agentId,
			agent,
			vesselId,
			vessel,
			cargoDirection,
			requestingCompanyDisabled ? null : requestedId,
			requestingCompanyDisabled ? null : requested,
			berthId,
			addedBarges,
			addedCargo,
			eta,
			etd,
			servicesState,
			notes,
			primaryActivityId,
			organizationId,
			(err, res) => {
				if (err) {
					console.log("An error occurred when submitting the berth request:", err);
					toast.error("An error occurred.");
				}
				else if (res) {
					setState(prevState => ({
						...prevState,
						agents: [],
						vessels: [],
						requestedBy: [],
						agentId: null,
						agent: {
							name: null,
							company: null,
							email: null,
							phone: null,
							isDirty: false
						},
						vesselId: null,
						cargoDirection: null,
						vessel: {
							name: null,
							mmsid: null,
							imo: null,
							type: null,
							loa: 0,
							grt: 0,
							draft: 0,
							voyageNumber: null
						},
						eta: null,
						etd: null,
						berth: {
							name: null
						},
						requestedId: null,
						requested: {
							name: null,
							company: null,
							email: null,
							phone: null
						},
						addedCargo: [],
						addedBarges: [],
						servicesState: services,
						notes: "",
						primaryActivity: {
							activity: "",
							id: ""
						}
					}));
					toast.success("Berth request submitted!");
				}
			}
		);


		setState(prevState => ({
			...prevState,
			dialogOpen: false
		}));
	};

	const {
		width,
		vesselTypes,
		agents,
		vessels,
		berths,
		requestedBy,
		vesselActivities,

		// Agent - Lookup
		agentId,
		agent,

		// Vessel - Lookup
		vesselId,
		cargoDirection,
		vessel,

		// Schedule
		eta,
		etd,

		// Berth - Lookup
		berth,

		// RequestedBy - Lookup
		requestedId,
		requested,

		addedCargo,
		addedBarges,

		servicesState,
		notes,
		primaryActivity,

		// Email errors
		requestedEmailError,
		agentEmailError,

		dialogOpen
	} = state;

	const anchorElement = document.getElementById("header-anchor");
	if (anchorElement) {
		anchorElement.innerHTML = header;
	}

	const formValid = checkSubmit();

	const styles = {
		main: {
			width: "100%"
		},
		fullWidth: {
			width: "100%",
			margin: "35px"
		},
		halfWidth: {
			width: "45%",
			margin: "35px"
		},
		flex: {
			display: "flex",
			flexWrap: "wrap",
			justifyContent: "flex-start"
		},
		text: {
			textAlign: "center",
			padding: "5px",
			fontSize: "20px"
		},
		formGroup: {
			...(dir === "rtl" && { width: "100%", margin: "20px 20px 0px 0px" }),
			...(dir === "ltr" && { width: "100%", margin: "20px 0px 0px 20px" })
		},
		inputLabel: {
			...(dir === "rtl" && { left: "unset", transformOrigin: "top right" })
		},
		submitReq: {
			...(dir === "rtl" && { margin: "35px auto 35px 35px" }),
			...(dir === "ltr" && { margin: "35px 35px 35px auto" })
		}
	};

	return (
		<Fragment>
			<div style={styles.main}>
				<div id="header-anchor" style={{ marginBottom: "40px" }}></div>
				<div style={styles.flex}>

					<div style={{ width: "100%", backgroundColor: "#2c2d2f" }}>
						<h2 style={styles.text}><Translate value="berthRequestForm.main.title.agent" /></h2>
					</div>

					<div style={{ width: width < 1070 ? "100%" : "45%", margin: "20px" }}>
						<Typeahead
							closeOnSelect={true}
							id="agent-name"
							items={agents}
							selected={agent.name ? agent.name : ""}
							updateState={handleSelectNested("agent", "name")}
							handleSelect={handleSelectLookup("agent")}
							clearSelected={() => {
								clearSelected("agentId")();
								clearNested("agent", { name: null });
								setState(prevState => ({ ...prevState, agents: {} }));
							}}
							queryTypeahead={handleQueryAgent("lastName,firstName")}
							maxResults={5}
							placeholder={agent.company ? getTranslation("berthRequestForm.main.fieldLabel.selectAgent") : getTranslation("berthRequestForm.main.fieldLabel.agentName")}
							disabled={!!agentId}
							dir={dir}
						/>
					</div>
					<div style={{ width: width < 1070 ? "100%" : "45%", margin: "20px" }}>
						<Typeahead
							closeOnSelect={true}
							id="agent-company"
							items={agents}
							selected={agent.company ? agent.company : ""}
							updateState={handleSelectNested("agent", "company")}
							handleSelect={handleSelectCompany("agent")}
							clearSelected={() => {
								clearSelected("agentId")();
								clearNested("agent", { company: null });
								setState(prevState => ({ ...prevState, agents: {} }));
							}}
							queryTypeahead={handleQueryAgent("company")}
							maxResults={5}
							placeholder={getTranslation("berthRequestForm.main.fieldLabel.company")}
							disabled={!!agentId}
							dir={dir}
						/>
					</div>
					<div style={{ width: width < 1070 ? "100%" : "45%", margin: "20px" }}>
						<TextField
							id="agent-email"
							label={getTranslation("berthRequestForm.main.fieldLabel.agentEmail")}
							value={agent.email ? agent.email : ""}
							handleChange={handleSelectNested("agent", "email")}
							error={agentEmailError}
							dir={dir}
						/>
					</div>
					<div style={{ width: width < 1070 ? "100%" : "45%", margin: "20px" }}>
						<TextField
							id="agent-phone"
							label={getTranslation("berthRequestForm.main.fieldLabel.agentPhone")}
							value={agent.phone ? agent.phone : ""}
							error={!validate("phone", agent.phone)}
							handleChange={handleSelectNested("agent", "phone")}
							dir={dir}
						/>
					</div>

					<div style={{ width: "100%", marginTop: "20px", backgroundColor: "#2c2d2f" }}>
						<h2 style={styles.text}><Translate value="berthRequestForm.main.title.vesselInfo" /></h2>
					</div>

					{cargoDirectionLevel !== "cargo" && (
						<div style={styles.formGroup}>
							<FormGroup style={{ flexWrap: "nowrap" }} row>
								<FormControlLabel
									control={
										<Checkbox
											value="inward"
											checked={cargoDirection === "inward"}
											color="primary"
											onChange={handleSelect("cargoDirection")}
											style={{
												color: cargoDirection === "inward" ? "#3f51b5" : "rgba(0, 0, 0, 0.54)"
											}}
										/>
									}
									label={getTranslation("berthRequestForm.main.fieldLabel.inward")}
									value={cargoDirection}
								/>
								<FormControlLabel
									control={
										<Checkbox
											value="outward"
											checked={cargoDirection === "outward"}
											color="primary"
											onChange={handleSelect("cargoDirection")}
											style={{
												color: cargoDirection === "outward" ? "#3f51b5" : "rgba(0, 0, 0, 0.54)"
											}}
										/>
									}
									label={getTranslation("berthRequestForm.main.fieldLabel.outward")}
									value={cargoDirection}
								/>
							</FormGroup>
						</div>
					)}
					<div style={{ width: width < 1600 ? "100%" : "40%", margin: "20px" }}>
						<Typeahead
							closeOnSelect={true}
							id="vessel-name"
							items={vessels}
							selected={vessel.name ? vessel.name : null}
							updateState={handleSelectNested("vessel", "name")}
							handleSelect={handleSelectLookup("vessel")}
							clearSelected={() => {
								clearSelected("vesselId")();
								clearNested("vessel", { name: null });
								setState(prevState => ({ ...prevState, vessels: {} }));
							}}
							queryTypeahead={handleQueryVessel("name")}
							maxResults={5}
							placeholder={getTranslation("berthRequestForm.main.fieldLabel.vesselName")}
							disabled={!!vesselId}
							dir={dir}
						/>
					</div>
					<div style={{ width: width < 1600 ? "100%" : "40%", margin: "20px" }}>
						<Typeahead
							closeOnSelect={true}
							id="vessel-imo"
							items={vessels}
							selected={vessel.imo ? vessel.imo.toString() : null}
							updateState={handleSelectNested("vessel", "imo")}
							handleSelect={handleSelectLookup("vessel")}
							clearSelected={() => {
								clearSelected("vesselId")();
								clearNested("vessel", { imo: null });
								setState(prevState => ({ ...prevState, vessels: {} }));
							}}
							queryTypeahead={handleQueryVessel("imo")}
							maxResults={5}
							placeholder={`${getTranslation("berthRequestForm.main.fieldLabel.imoNumber")}${imoRequired ? "*" : ""}`}
							dir={dir}
						/>
					</div>
					<div style={{ width: width < 1600 ? "100%" : "22%", margin: "20px" }}>
						<FormControl margin="normal" fullWidth>
							<InputLabel style={styles.inputLabel}><Translate value="berthRequestForm.main.fieldLabel.vesselType" /></InputLabel>
							<Select
								variant="standard"
								value={vessel.type ? vesselTypes.find(item => item.id === vessel.type).id : ""}
								onChange={handleSelectNested("vessel", "type")}
								inputProps={{
									classes: (dir && dir == "rtl" ? { icon: classes.icon, select: classes.select } : {})
								}}
							// style={dir && dir == "rtl" ? { paddingRight: 0 } : {}}
							>
								{vesselTypes.map(type => {
									const { id, name } = type;
									return (
										<MenuItem key={id} value={id}>
											{name}
										</MenuItem>
									);
								})}
							</Select>
						</FormControl>
					</div>
					<div style={{ width: width < 1600 ? "100%" : (voyageNumberEnabled ? "14%" : "22%"), margin: "20px" }}>
						<TextField
							id="loa"
							label={getTranslation("berthRequestForm.main.fieldLabel.loa")}
							type="number"
							value={vessel.loa || vessel.loa === 0 ? vessel.loa : ""}
							handleChange={handleSelectNested("vessel", "loa")}
							dir={dir}
						/>
					</div>
					<div style={{ width: width < 1600 ? "100%" : (voyageNumberEnabled ? "14%" : "22%"), margin: "20px" }}>
						<TextField
							id="grt"
							label="GRT"
							type="number"
							value={vessel.grt || vessel.grt === 0 ? vessel.grt : ""}
							handleChange={handleSelectNested("vessel", "grt")}
							dir={dir}
						/>
					</div>
					<div style={{ width: width < 1600 ? "100%" : (voyageNumberEnabled ? "14%" : "22%"), margin: "20px" }}>
						<TextField
							id="draft"
							label={getTranslation("berthRequestForm.main.fieldLabel.draft")}
							type="number"
							value={vessel.draft || vessel.draft === 0 ? vessel.draft : ""}
							handleChange={handleSelectNested("vessel", "draft")}
							dir={dir}
						/>
					</div>
					{voyageNumberEnabled && <div style={{ width: width < 1600 ? "100%" : "22%", margin: "20px" }}>
						<TextField
							id="voyage-number"
							label={getTranslation("berthRequestForm.main.fieldLabel.voyageNumber")}
							value={vessel.voyageNumber ? vessel.voyageNumber : ""}
							handleChange={handleSelectNested("vessel", "voyageNumber")}
							required={voyageNumberRequired}
							dir={dir}
						/>
					</div>}
					<div style={{ width: width < 1600 ? "100%" : "30%", margin: "20px" }}>
						<Typeahead
							closeOnSelect={true}
							id="vessel-mmsid"
							items={vessels}
							selected={vessel.mmsid ? vessel.mmsid : null}
							updateState={handleSelectNested("vessel", "mmsid")}
							handleSelect={handleSelectLookup("vessel")}
							clearSelected={() => {
								clearSelected("vesselId")();
								clearNested("vessel", { mmsid: null });
								setState(prevState => ({ ...prevState, vessels: {} }));
							}}
							queryTypeahead={handleQueryVessel("mmsid")}
							maxResults={5}
							placeholder={`${getTranslation("berthRequestForm.main.fieldLabel.mmsiNumber")}${mmsiRequired ? "*" : ""}`}
							disabled={!!vesselId}
							dir={dir}
						/>
					</div>
					<div style={{ width: width < 1600 ? "100%" : "22%", margin: "20px" }}>
						<FormControl fullWidth sx={{ margin: "16px 0px 8px" }}>
							<InputLabel style={styles.inputLabel}><Translate value="berthRequestForm.main.fieldLabel.primaryActivity" /></InputLabel>
							<Select
								variant="standard"
								value={primaryActivity.activity ? vesselActivities.find(vesselActivity => vesselActivity.id === primaryActivity.activity).id : ""}
								onChange={handleSelectNested("primaryActivity", "activity")}
								inputProps={{
									classes: (dir && dir == "rtl" ? { icon: classes.icon, select: classes.select } : {})
								}}
							>
								{vesselActivities.map(vesselActivity => {
									const { id, activity } = vesselActivity;
									return (
										<MenuItem key={id} value={id}>
											{activity}
										</MenuItem>
									);
								})}
							</Select>
						</FormControl>
					</div>

					<div style={{ width: "100%", marginTop: "20px", backgroundColor: "#2c2d2f" }}>
						<h2 style={styles.text}><Translate value="berthRequestForm.main.title.bargeInfo" /></h2>
					</div>

					<BargeFields
						barges={addedBarges}
						updateBarge={handleUpdateBarge}
						removeBarge={handleRemoveBarge}
						vesselTypes={vesselTypes}
						width={width}
						dir={dir}
					/>


					<div style={{ width: "100%", marginTop: "20px", backgroundColor: "#2c2d2f" }}>
						<h2 style={styles.text}><Translate value="berthRequestForm.main.title.schedule" /></h2>
					</div>

					<div style={{ width: width < 1070 ? "100%" : "45%", margin: "20px" }}>
						<ScheduleField
							label={"ETA*"}
							handleSelect={handleSelect("eta")}
							value={eta}
							timeFormat={timeFormat}
							dir={dir}
							locale={locale}
						/>
					</div>
					<div style={{ width: width < 1070 ? "100%" : "45%", margin: "20px" }}>
						<ScheduleField
							label={"ETD*"}
							handleSelect={handleSelect("etd")}
							value={etd}
							timeFormat={timeFormat}
							dir={dir}
							locale={locale}
						/>
					</div>

					<div style={{ width: "100%", marginTop: "20px", backgroundColor: "#2c2d2f" }}>
						<h2 style={styles.text}><Translate value="berthRequestForm.main.title.berth" /></h2>
					</div>

					<div style={{ width: "100%", margin: "20px" }}>
						<FormControl margin="normal" fullWidth>
							<InputLabel style={styles.inputLabel}><Translate value="berthRequestForm.main.fieldLabel.berthName" /></InputLabel>
							<Select
								variant="standard"
								value={berth.name || "<N/A>"}
								onChange={handleSelectNested("berth", "name")}
								inputProps={{
									classes: (dir && dir == "rtl" ? { icon: classes.icon, select: classes.select } : {})
								}}
							>
								<MenuItem value="<N/A>">
									{"<N/A>"}
								</MenuItem>
								{berths.map(berthObj => {
									const { id, name } = berthObj;
									return (
										<MenuItem key={id} value={name}>
											{name}
										</MenuItem>
									);
								})}
							</Select>
						</FormControl>
					</div>

					{!requestingCompanyDisabled && (
						<Fragment>
							<div style={{ width: "100%", marginTop: "20px", backgroundColor: "#2c2d2f" }}>
								<h2 style={styles.text}><Translate value="berthRequestForm.main.title.requestedBy" /></h2>
							</div>

							<div style={{ width: width < 1070 ? "100%" : "45%", margin: "20px" }}>
								<Typeahead
									closeOnSelect={true}
									id="requestedBy-name"
									items={requestedBy}
									selected={requested.name ? requested.name : null}
									updateState={handleSelectNested("requested", "name")}
									handleSelect={handleSelectLookup("requested")}
									clearSelected={() => {
										clearSelected("requestedId")();
										clearNested("requested", { name: null });
										setState(prevState => ({ ...prevState, requestedBy: {} }));
									}}
									queryTypeahead={handleQueryRequestedBy("name,firstName,lastName")}
									maxResults={5}
									placeholder={requestedId ? getTranslation("berthRequestForm.main.fieldLabel.selectRequestor") : getTranslation("berthRequestForm.main.fieldLabel.requestedBy")}
									disabled={!!requestedId}
									dir={dir}
								/>
							</div>
							<div style={{ width: width < 1070 ? "100%" : "45%", margin: "20px" }}>
								<Typeahead
									closeOnSelect={true}
									id="requestedBy-company"
									items={requestedBy}
									selected={requested.company ? requested.company : null}
									updateState={handleSelectNested("requested", "company")}
									handleSelect={handleSelectCompany("requested")}
									clearSelected={() => {
										clearSelected("requestedId")();
										clearNested("requested", { company: null });
										setState(prevState => ({ ...prevState, requestedBy: {} }));
									}}
									queryTypeahead={handleQueryRequestedBy("company")}
									maxResults={5}
									placeholder={getTranslation("berthRequestForm.main.fieldLabel.company")}
									disabled={!!requestedId}
									dir={dir}
								/>
							</div>
							<div style={{ width: width < 1070 ? "100%" : "45%", margin: "20px" }}>
								<TextField
									id="requested-email"
									label={getTranslation("berthRequestForm.main.fieldLabel.contactEmail")}
									value={requested.email ? requested.email : ""}
									handleChange={handleSelectNested("requested", "email")}
									error={requestedEmailError}
									dir={dir}
								/>
							</div>
							<div style={{ width: width < 1070 ? "100%" : "45%", margin: "20px" }}>
								<TextField
									id="requested-phone"
									label={getTranslation("berthRequestForm.main.fieldLabel.contactPhone")}
									value={requested.phone ? requested.phone : ""}
									error={!validate("phone", requested.phone)}
									handleChange={handleSelectNested("requested", "phone")}
									dir={dir}
								/>
							</div>
						</Fragment>
					)}

					<div style={{ width: "100%", marginTop: "20px", backgroundColor: "#2c2d2f" }}>
						<h2 style={styles.text}><Translate value="berthRequestForm.main.title.cargo" /></h2>
					</div>

					<div style={{ width: (notesEnabled || width < 1526) ? "100%" : "75%", margin: "35px" }}>
						<CargoTable
							cargo={addedCargo}
							updateCargo={handleUpdateCargo}
							removeCargo={handleRemoveCargo}
							cargoDirectionEnabled={cargoDirectionLevel === "cargo"}
							dir={dir}
						/>
					</div>

					{servicesConfig && (
						<div style={{ width: "100%", marginTop: "20px", backgroundColor: "#2c2d2f" }}>
							<h2 style={styles.text}><Translate value="berthRequestForm.main.title.services" /></h2>
						</div>
					)}

					{servicesConfig && (
						<ServicesFields
							servicesConfig={servicesConfig}
							services={servicesState}
							updateServices={servicesState => { setState(prevState => ({ ...prevState, servicesState })); }}
							dir={dir}
						/>
					)}

					{notesEnabled && (
						<div style={{ width: "100%", marginTop: "20px", backgroundColor: "#2c2d2f" }}>
							<h2 style={styles.text}><Translate value="berthRequestForm.main.title.additionalInfo" /></h2>
						</div>
					)}

					{notesEnabled && (
						<NotesField
							notes={notes}
							updateNotes={notes => { setState(prevState => ({ ...prevState, notes })); }}
							dir={dir}
						/>
					)}

					<div style={styles.submitReq}>
						<Button
							variant="contained"
							color="primary"
							disabled={!formValid}
							onClick={stageSubmitRequest}
							style={{ padding: "6px 16px", borderRadius: 4, color: formValid && "#fff", backgroundColor: formValid && "#3f51b5" }}
						>
							<Translate value="berthRequestForm.main.submitReq" />
						</Button>
					</div>

				</div>
			</div>
			{submitDialogProps && submitDialogProps.enabled &&
				<Dialog
					open={dialogOpen}
					title={submitDialogProps.title || getTranslation("berthRequestForm.main.dialog.title")}
					textContent={submitDialogProps.body || getTranslation("berthRequestForm.main.dialog.textContent")}
					confirm={{ label: getTranslation("berthRequestForm.main.dialog.confirm"), action: submitRequest }}
					abort={{
						label: getTranslation("berthRequestForm.main.dialog.cancel"), action: () => {
							setState(prevState => ({
								...prevState,
								dialogOpen: false
							}));
						}
					}}
				/>
			}
		</Fragment>
	);
};

BerthRequestForm.propTypes = propTypes;

export default BerthRequestForm;