/* eslint react/prop-types: 0 */
/*eslint no-unused-vars: "warn"*/
import React, { Fragment, useEffect, useState } from "react";
import moment from "moment-timezone";
import { toast } from "react-toastify";
import { restClient } from "client-app-core";
import { queryAssignment, checkVesselReport, submitVesselReport } from "../lookups/lookups";
import { default as countries } from "./nationalityCodes/nationalityCodes";

import Typeahead from "../BerthRequestForm/Typeahead/Typeahead";
import { TextField } from "orion-components/CBComponents";
import VesselReportCargoTable from "./VesselReportCargoTable/VesselReportCargoTable";
import { Translate } from "orion-components/i18n";
import { useSelector } from "react-redux";

import {
	Button
} from "@mui/material";


const VesselReportForm = ({ id, header, dir, timezone, vesselReportDisclaimer, vesselReportManifestDisclaimer }) => {
	const locale = useSelector(state => state.i18n.locale || "en");
	const now = moment().locale(locale).format("MMMM Do YYYY, h:mm:ss a");
	const [state, setState] = useState({
		width: 1080,
		vesselTypes: [],
		stevedores: [],
		countriesState: [],

		assignmentId: null,

		// Agent - Lookup
		agentId: null,
		agent: {
			name: null,
			company: null,
			email: null,
			phone: null
		},

		// Vessel - Lookup
		vesselId: null,
		vessel: {
			name: null,
			mmsid: null,
			imo: null,
			type: null,
			loa: 0,
			grt: 0,
			draft: 0,
			voyageNumber: null,
			nationality: null,
			nationalityCode: null
		},

		// Schedule
		ata: null,
		atd: null,

		// Berth
		berthId: null,
		berth: {
			name: null
		},

		submitter: {
			name: null,
			title: null,
			phone: null
		},

		stevedoreId: null,
		stevedore: {
			company: null
		},

		owner: null,

		addedCargo: [],
		cargoDirection: null,
		completed: false,
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

	const assignmentQuery = async (id) => {
		const result = await queryAssignment(id);
		setState(prevState => ({ ...prevState, ...result }));
	};

	useEffect(() => {
		setState(prevState => ({ ...prevState, assignmentId: id }));

		// If vessel report has already been completed with this assignmentId, show the success page
		// to prevent duplicates
		checkVesselReport(id, (err, res) => {
			if (err) {
				console.log("Error checking vessel report status", err);
			}
			else {
				if (res && res.exists) {
					setState(prevState => ({ ...prevState, completed: true }));
				}
			}
		});

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
					assignmentQuery(id);
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

	const checkSubmit = () => {
		const {
			addedCargo,
			submitter
		} = state;

		// Ensure cargo has at least one filled property
		if (addedCargo && addedCargo.length) {
			const cargoFilled = addedCargo.every(item => {
				if (
					item.commodity
					|| item.weight
					|| item.cargoDirection
				) {
					return true;
				}
				return false;
			});

			if (!cargoFilled) {
				return true;
			}
		}
		if (submitter) {
			return (
				(!submitter.name || !submitter.title || !submitter.phone)
			);
		}
		else {
			return true;
		}

	};

	// Set result of lookup select to state via ID and full data
	const handleSelectLookup = type => data => {
		const newData = {};

		switch (type) {
			case "stevedore": {
				newData.name = `${data.name.firstName} ${data.name.lastName}`;
				break;
			}
			default:
				break;
		}
		setState(prevState => ({
			...prevState,
			[`${type}Id`]: data.id,
			[type]: data
		}));
	};

	// Set nested state property
	const handleSelectNested = (field, property) => data => {
		const targetProperties = ["name", "company", "phone", "position", "type", "title", "voyageNumber", "nationality"];
		let value = data;

		if (targetProperties.includes(property)) {
			value = data.target.value;
		}

		setState(prevState => ({
			...prevState,
			[field]: {
				...state[field],
				[property]: value
			}
		}));
	};

	// Set top level state property
	const handleSelect = field => data => {
		const targetFields = ["owner"];
		let value = data;

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

	const queryStevedore = (searchString) => {
		if (searchString !== "") {
			restClient.exec_get(
				`/berth-request-app/api/request/queryStevedore?searchProps=company&searchString=${searchString}`,
				(err, res) => {
					if (err) {
						console.log("Stevedore query err", err);
					}
					else {
						const result = {};
						res.forEach(stevedore => {
							result[stevedore.id] = {
								searchString: stevedore.company,
								label: `${stevedore.company} - ${stevedore.name.firstName} ${stevedore.name.lastName}`,
								id: stevedore.id,
								fullData: stevedore
							};
						});
						setState(prevState => ({
							...prevState,
							stevedores: result
						}));
					}
				}
			);
		}
		else {
			setState(prevState => ({
				...prevState,
				stevedores: {}
			}));
		}
	};

	const handleQuery = (searchString) => {
		debounce(() => {
			//this.queryStevedore(searchProps, searchString); searchProps is undefined
			queryStevedore(null, searchString);
		}, 400);
	};

	const queryCountries = (searchString) => {
		if (searchString !== "") {
			const countryOpts = {};
			countries.forEach(country => {
				const lowerName = country.name.toLowerCase();
				const lowerSearch = searchString.toLowerCase();

				if (lowerName.includes(lowerSearch)) {
					countryOpts[country.code] = {
						searchString: `${country.name}${country.code}`,
						label: `${country.name}`,
						id: country.code,
						fullData: country
					};
				}
			});

			setState(prevState => ({ ...prevState, countriesState: countryOpts }));
		}
	};

	// Countries work slightly different than other typeahead selects, so they need their own method
	const handleSelectCountry = (country) => {
		setState(prevState => ({ ...prevState, vessel: { ...state.vessel, nationality: country.name, nationalityCode: country.code } }));
	};

	const submitRequest = async () => {
		const {
			assignmentId,
			vessel,
			submitter,
			stevedore,
			owner,
			addedCargo
		} = state;

		const data = {
			submitter,
			stevedore,
			owner,
			vesselVoyageNumber: vessel.voyageNumber,
			vesselNationality: vessel.nationalityCode,
			cargo: addedCargo,
			totalCargoWeight: addedCargo.reduce((cur, acc) => { return cur + acc.weight; }, 0),
			assignmentId: assignmentId
		};

		submitVesselReport(data, (err, res) => {
			if (err) {
				console.log("Error submitting vessel report:", err);
				toast.error("There was an error creating your vessel report");
			}
			else {
				if (res.inserted) {
					setState(prevState => ({ ...prevState, completed: true }));
				}
			}
		});
	};

	const {
		width,
		vesselTypes,
		stevedores,
		countriesState,
		agent,
		vessel,
		ata,
		atd,
		berth,
		stevedoreId,
		stevedore,
		owner,
		addedCargo,
		cargoDirection,
		submitter,
		completed
	} = state;

	const anchorElement = document.getElementById("header-anchor");
	if (anchorElement) {
		anchorElement.innerHTML = header;
	}

	const disableSave = checkSubmit();
	const vesselType = vessel && vessel.type ? vesselTypes.find(item => item.id === vessel.type).name : "";
	const styles = {
		mainContainer: {
			width: "90%",
			margin: "auto",
			marginBottom: "40px"
		},
		center: {
			textAlign: "center"
		},
		pageHeaderFirst: {
			marginBottom: "20px"
		},
		cargoTable: {
			border: "1px solid black",
			borderCollapse: "collapse"
		},
		fields: {
			textAlign: "center",
			color: "black",
			margin: "8px 0px",
			fontSize: "16px"
		},
		flexContainer: {
			display: "flex",
			flexWrap: "wrap",
			justifyContent: "space-between",
			margin: "10px"
		},
		halfWidth: {
			display: "flex",
			width: "47%",
			justifyContent: "space-between",
			marginRight: "5px",
			alignItems: "flex-end"
		},
		totalLb: {
			textAlign: "end",
			fontWeight: "800",
			paddingRight: "10px"
		},
		tablePadding: {
			padding: "5px"
		},
		fieldLines: {
			width: "70%"
		}
	};

	return (
		<Fragment>
			<div style={styles.mainContainer}>
				<div id="header-anchor" style={{ marginBottom: "40px" }}></div>
				{completed
					? (
						<Fragment>
							<h2 style={{ textAlign: "center", color: "black", margin: "50px" }}>
								<Translate value="vesselReport.main.vesselReceived" />
							</h2>
						</Fragment>
					)
					: (
						<Fragment>
							<div>
								<h4 style={{ ...styles.center, ...styles.fields }}><Translate value="vesselReport.main.vesselReport" /></h4>
							</div>
							<div>
								<hr />
								<hr />
								<div style={styles.flexContainer}>
									<div style={styles.halfWidth}>
										<h4 style={styles.fields}><Translate value="vesselReport.main.fieldLabel.date" /></h4>
										<div style={styles.fieldLines}>
											<TextField
												id="date"
												value={now}
												handleChange={() => { }}
												disabled={true}
												dir={dir}
											/>
										</div>
									</div>
									<div style={styles.halfWidth}>
										<h4 style={styles.fields}><Translate value="vesselReport.main.fieldLabel.vessel" /></h4>
										<div style={styles.fieldLines}>
											<TextField
												id="vessel-name"
												value={vessel && vessel.name ? vessel.name : ""}
												handleChange={() => { }}
												disabled={true}
												dir={dir}
											/>
										</div>
									</div>
									<div style={styles.halfWidth}>
										<h4 style={styles.fields}><Translate value="vesselReport.main.fieldLabel.agent" /></h4>
										<div style={styles.fieldLines}>
											<TextField
												id="agent-name"
												value={agent && agent.name ? agent.name : ""}
												handleChange={() => { }}
												disabled={true}
												dir={dir}
											/>
										</div>
									</div>
									<div style={styles.halfWidth}>
										<h4 style={styles.fields}><Translate value="vesselReport.main.fieldLabel.registryNum" /></h4>
										<div style={styles.fieldLines}>
											<TextField
												id="vessel-mmsid"
												value={vessel && vessel.mmsid ? vessel.mmsid : ""}
												handleChange={() => { }}
												disabled={true}
												dir={dir}
											/>
										</div>
									</div>
									<div style={styles.halfWidth}>
										<h4 style={styles.fields}><Translate value="vesselReport.main.fieldLabel.owner" /></h4>
										<div style={styles.fieldLines}>
											<TextField
												id="owner"
												value={owner ? owner : ""}
												handleChange={handleSelect("owner")}
												dir={dir}
											/>
										</div>
									</div>
									<div style={styles.halfWidth}>
										<h4 style={styles.fields}><Translate value="vesselReport.main.fieldLabel.vesselType" /></h4>
										<div style={styles.fieldLines}>
											<TextField
												id="vessel-type"
												value={vesselType}
												handleChange={() => { }}
												disabled={true}
												dir={dir}
											/>
										</div>
									</div>
									<div style={styles.halfWidth}>
										<h4 style={styles.fields}><Translate value="vesselReport.main.fieldLabel.steveadore" /></h4>
										<div style={styles.fieldLines}>
											<Typeahead
												closeOnSelect={true}
												id="stevedore"
												items={stevedores}
												selected={stevedore && stevedore.company ? stevedore.company : ""}
												updateState={handleSelectNested("stevedore", "company")}
												handleSelect={handleSelectLookup("stevedore")}
												clearSelected={() => {
													clearSelected("stevedoreId")();
													clearNested("stevedore", { name: { firstName: null, lastName: null }, company: null, email: null, phone: null });
												}}
												queryTypeahead={handleQuery}
												maxResults={5}
												// placeholder="Stevedore"
												clearOnClickAway={true}
												disabled={!!stevedoreId}
												dir={dir}
											/>
										</div>
									</div>
									<div style={styles.halfWidth}>
										<h4 style={styles.fields}>G.R.T.:</h4>
										<div style={styles.fieldLines}>
											<TextField
												id="grt"
												type="number"
												value={vessel && vessel.grt ? vessel.grt : 0}
												handleChange={() => { }}
												disabled={true}
												dir={dir}
											/>
										</div>
									</div>
									<div style={styles.halfWidth}>
										<h4 style={styles.fields}><Translate value="vesselReport.main.fieldLabel.berth" /></h4>
										<div style={styles.fieldLines}>
											<TextField
												id="berth-name"
												value={berth && berth.name ? berth.name : 0}
												handleChange={() => { }}
												disabled={true}
												dir={dir}
											/>
										</div>
									</div>
									<div style={styles.halfWidth}>
										<h4 style={styles.fields}><Translate value="vesselReport.main.fieldLabel.length" /></h4>
										<div style={styles.fieldLines}>
											<TextField
												id="loa"
												type="number"
												value={vessel && vessel.loa ? vessel.loa : 0}
												handleChange={() => { }}
												disabled={true}
												dir={dir}
											/>
										</div>
									</div>
									<div style={styles.halfWidth}>
										<h4 style={styles.fields}><Translate value="vesselReport.main.fieldLabel.arrivalDate" /></h4>
										<div style={styles.fieldLines}>
											<TextField
												id="ata"
												value={ata ? moment.tz(ata, timezone).locale(locale).format("MMMM Do YYYY, h:mm:ss a") : ""}
												handleChange={() => { }}
												disabled={true}
												dir={dir}
											/>
										</div>
									</div>
									<div style={styles.halfWidth}>
										<h4 style={styles.fields}><Translate value="vesselReport.main.fieldLabel.nationality" /></h4>
										<div style={styles.fieldLines}>
											<Typeahead
												closeOnSelect={true}
												id="vessel-country"
												items={countriesState}
												selected={vessel && vessel.nationality ? vessel.nationality : ""}
												updateState={handleSelectNested("vessel", "nationality")}
												handleSelect={handleSelectCountry}
												clearSelected={() => {
													clearNested("vessel", { nationality: null, nationalityCode: null });
												}}
												queryTypeahead={queryCountries}
												maxResults={4}
												clearOnClickAway={true}
												dir={dir}
											/>
										</div>
									</div>
									<div style={styles.halfWidth}>
										<h4 style={styles.fields}><Translate value="vesselReport.main.fieldLabel.departureDate" /></h4>
										<div style={styles.fieldLines}>
											<TextField
												id="atd"
												value={atd ? moment.tz(atd, timezone).locale(locale).format("MMMM Do YYYY, h:mm:ss a") : ""}
												handleChange={() => { }}
												disabled={true}
												dir={dir}
											/>
										</div>
									</div>
									<div style={styles.halfWidth}>
										<h4 style={styles.fields}><Translate value="vesselReport.main.fieldLabel.voyageNum" /></h4>
										<div style={styles.fieldLines}>
											<TextField
												id="voyage-number"
												value={vessel && vessel.voyageNumber ? vessel.voyageNumber : ""}
												handleChange={handleSelectNested("vessel", "voyageNumber")}
												dir={dir}
											/>
										</div>
									</div>
								</div>
								<hr />
								<hr />

								<div style={{ marginTop: "30px" }}>
									<VesselReportCargoTable
										assignmentCargoDirection={cargoDirection}
										cargo={addedCargo}
										updateCargo={handleUpdateCargo}
										removeCargo={handleRemoveCargo}
										dir={dir}
									/>
								</div>

								<div>
									{vesselReportDisclaimer && (
										<p style={{ marginBottom: "10px" }}>
											<b style={{ color: "red" }}><Translate value="vesselReport.main.vesselReport" /></b> - {vesselReportDisclaimer}
										</p>
									)}
									{vesselReportManifestDisclaimer && (
										<p>
											<b style={{ color: "red" }}><Translate value="vesselReport.main.vesselManifest" /></b> - {vesselReportManifestDisclaimer}
										</p>
									)}
									{(vesselReportDisclaimer || vesselReportManifestDisclaimer) && (
										<p><Translate value="vesselReport.main.certifyStmt" /></p>
									)}
								</div>

								<section style={{ display: "flex", justifyContent: "space-between" }}>
									<div style={{ width: "80%" }}>
										<div style={styles.halfWidth}>
											<h4 style={styles.fields}><Translate value="vesselReport.main.fieldLabel.submittedBy" /></h4>
											<div style={styles.fieldLines}>
												<TextField
													id="submitter-name"
													value={submitter && submitter.name ? submitter.name : ""}
													handleChange={handleSelectNested("submitter", "name")}
													dir={dir}
												/>
											</div>
										</div>
										<div style={styles.halfWidth}>
											<h4 style={styles.fields}><Translate value="vesselReport.main.fieldLabel.title" /></h4>
											<div style={styles.fieldLines}>
												<TextField
													id="submitter-title"
													value={submitter && submitter.title ? submitter.title : ""}
													handleChange={handleSelectNested("submitter", "title")}
													dir={dir}
												/>
											</div>
										</div>
										<div style={styles.halfWidth}>
											<h4 style={styles.fields}><Translate value="vesselReport.main.fieldLabel.phone" /></h4>
											<div style={styles.fieldLines}>
												<TextField
													id="submitter-phone"
													value={submitter && submitter.phone ? submitter.phone : ""}
													handleChange={handleSelectNested("submitter", "phone")}
													dir={dir}
												/>
											</div>
										</div>
									</div>

									<div>
										<Button
											variant="contained"
											color="primary"
											disabled={disableSave}
											onClick={submitRequest}
										>
											<Translate value="vesselReport.main.submitRequest" />
										</Button>
									</div>
								</section>
							</div>
						</Fragment>
					)}
			</div>
		</Fragment>
	);
};

export default VesselReportForm;