import React, { useEffect, useState, Fragment } from "react";

import PropTypes from "prop-types";
import { SelectField } from "orion-components/CBComponents";
import ExerciseContainer from "../../shared/components/ExerciseContainer";
import HeaderContainer from "../../shared/components/HeaderContainer";
import { Translate } from "orion-components/i18n/I18nContainer";
import { CubeOutline } from "mdi-material-ui";
import { Button, MenuItem, Tooltip } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

const styles = {
	leftText: {
		flex: "0 0 0px",
		alignItems: "center",
		paddingLeft: 24
	},
	section: {
		padding: "10px 16px",
		paddingLeft: 0,
		display: "flex"
	},
	icons: {
		color: "white",
		marginRight: 15,
		marginTop: 25,
		fontSize: "48px"
	},
	button: {
		minHeight:"41",
		width:"258px"
	},
	leftTextRTL: {
		flex: "0 0 0px",
		alignItems: "center",
		paddingRight: 24
	},
	sectionRTL: {
		padding: "10px 16px",
		paddingRight: 0,
		display: "flex"
	},
	iconsRTL: {
		color: "white",
		marginLeft: 15,
		marginTop: 25,
		fontSize: "48px"
	}
};

const useStyles = makeStyles((theme) => ({
	flexContainer:{
		display: "flex",
		flexDirection: "column",
		flexWrap:"wrap",
		minHeight: "330px"
	},
	formControl: {
	  margin: theme.spacing(1),
	  marginTop : 0,
	  minHeight: 133.87
	}
}));

const useCheckBoxStyles = makeStyles(() => ({
	root: {
		color: "#828283",
		"&$checked": {
			color: "#4eb5f3"
		}
	},
	checked: {},
	disabled: {
		opacity: 0.5
	}
}));

const propTypes = {
	baseSimulations: PropTypes.array,
	sessionToLoad: PropTypes.object,
	getBaseSimulations: PropTypes.func.isRequired,
	createSession: PropTypes.func.isRequired,
	loadSimulation: PropTypes.func.isRequired,
	displayUserMappings: PropTypes.func.isRequired,
	setBaseSimLoadTriggered: PropTypes.func.isRequired,
	setUserMappingsTriggered: PropTypes.func.isRequired,
	developmentMode: PropTypes.bool,
	dir: PropTypes.string
};

const CreateSession = ({ 
	baseSimulations, 
	sessionToLoad, 
	getBaseSimulations, 
	createSession, 
	loadSimulation, 
	displayUserMappings, 
	setBaseSimLoadTriggered, 
	setUserMappingsTriggered,
	developmentMode,
	dir 
}) => {
	const classes = useStyles();
	const checkBoxclasses = useCheckBoxStyles();
	const [simulationSettings, setSimulationSettings] = useState({
		readOnly: false,
		overwrite: false,
		syncMetrics: false,
		enableAudio: true
	  });

	const simSettingsChange = (event) => {
		setSimulationSettings({ ...simulationSettings, [event.target.name]: event.target.checked });
	};

	//for CheckBoxes
	//const { readOnly, overwrite, syncMetrics } = simulationSettings;
	
	const [ baseSimulation, setBaseSimulation ] = useState("");

	useEffect(() => {
		getBaseSimulations();
		// We dont want to depend on action method change, hence disabling the warning below
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (sessionToLoad && sessionToLoad.newSession) {
			if ((!sessionToLoad.newSessionParams || !sessionToLoad.newSessionParams.baseSimLoadTriggered)
				&& sessionToLoad.avertLoadProgressPct === 100 && sessionToLoad.avertLoadStatus === "COMPLETE"
				&& sessionToLoad.sessionId && !sessionToLoad.simulationData) {
				loadSimulation(sessionToLoad.sessionId, sessionToLoad.baseSimId);
				setBaseSimLoadTriggered();
			}
		
			if (sessionToLoad.simulationData
				&& (!sessionToLoad.newSessionParams || !sessionToLoad.newSessionParams.userMappingsTriggered)) {
				displayUserMappings(true);
				setUserMappingsTriggered();
			}
		}
		// We dont want to depend on action methods change, hence disabling the warning below
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ sessionToLoad ]);

	const initCreateSession = () => {
		if (!baseSimulation) {
			alert("Please select a base simulation.");
			return;
		}

		const session = {
			baseSimName: baseSimulation,
			settings: simulationSettings
		};

		createSession(session);
	};

	return (
		<Fragment>	
			<HeaderContainer
				headerTitle={<Translate value="tableopsessionList.createSession.title" />}
				headerDescription={<Translate value="tableopsessionList.createSession.desc" />}
				dir={dir}>
			</HeaderContainer>

			<ExerciseContainer 
				headerTitle=""
				headerDescription=""
				dir={dir}>
				<section style={dir == "rtl" ? {...styles.sectionRTL, marginTop: 0, marginBottom: 0} : {...styles.section, marginTop: 0, marginBottom: 0}}>
					<div style={dir == "rtl" ? { ...styles.leftTextRTL, display: "flex" } : { ...styles.leftText, display: "flex" }}>
						<CubeOutline style={dir == "rtl" ? styles.iconsRTL : styles.icons}/>
					</div>
					<div style={dir == "rtl" ? { paddingLeft: 24, width:"100%"} : { paddingRight: 24, width:"100%"}}>
						<SelectField
							id="baseSimulationSelector"
							label={<Translate value="tableopsessionList.createSession.base" />}
							value={baseSimulation}
							handleChange={ (e) => setBaseSimulation(e.target.value) }
							dir={dir}>
							{baseSimulations && baseSimulations.map(baseSimulationEntry => {
								return (
									<MenuItem key={baseSimulationEntry} value={baseSimulationEntry}>
										{baseSimulationEntry}
									</MenuItem>
								);
							})}
						</SelectField>
					</div>

				</section>
				
				<section style={dir == "rtl" ? {...styles.sectionRTL, marginTop: 0, marginBottom: 0} : {...styles.section, marginTop: 0, marginBottom: 0}}>
					<div style={dir == "rtl" ?{ paddingRight: 80, width:"100%"} : { paddingLeft: 80, width:"100%"}}>
						<FormControl component="fieldset" className={classes.formControl}>
							<FormGroup>
								<Tooltip title={<Translate value="tableopsessionList.createSession.message" />}>
									<FormControlLabel
										control={
											<Checkbox checked={simulationSettings.readOnly} onChange={simSettingsChange} name="readOnly" 
												color="default"
												disableTouchRipple={true}
												classes={{
													root: checkBoxclasses.root,
													checked: checkBoxclasses.checked,
													disabled: checkBoxclasses.disabled
												}}
											/>
										}
										label={<Translate value="tableopsessionList.createSession.view" />}
									/>
								</Tooltip>
								<Tooltip title={<Translate value="tableopsessionList.createSession.overwritetext" />}>
									<FormControlLabel
										control={
											<Checkbox checked={simulationSettings.overwrite} onChange={simSettingsChange} name="overwrite" 
												color="default"
												disableTouchRipple={true}
												classes={{
													root: checkBoxclasses.root,
													checked: checkBoxclasses.checked,
													disabled: checkBoxclasses.disabled
												}}
											/>
										}
										label={<Translate value="tableopsessionList.createSession.overwrite" />}
									/>
								</Tooltip>
								{
									developmentMode && 
									<Tooltip title={<Translate value="tableopsessionList.createSession.syn" />}>
										<FormControlLabel
											control={
												<Checkbox checked={simulationSettings.syncMetrics} onChange={simSettingsChange} name="syncMetrics" 
													color="default"
													disableTouchRipple={true}
													classes={{
														root: checkBoxclasses.root,
														checked: checkBoxclasses.checked,
														disabled: checkBoxclasses.disabled
													}}
												/>
											}
											label={<Translate value="tableopsessionList.createSession.synlabel" />}
										/>
									</Tooltip>
								}
							</FormGroup>
						</FormControl>
					</div>
				</section>

				<section style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: 0, marginBottom: 0, visibility: `${!sessionToLoad || !sessionToLoad.initializing ? "visible" : "hidden"}`}}>
				
					<Button disabled={!baseSimulation} style={{...styles.button}} variant="contained" color="primary" onClick={initCreateSession}><Translate value="tableopsessionList.createSession.setup" /></Button>
					
				</section>
			</ExerciseContainer>
		</Fragment>
	);
};

CreateSession.propTypes = propTypes;
export default CreateSession;