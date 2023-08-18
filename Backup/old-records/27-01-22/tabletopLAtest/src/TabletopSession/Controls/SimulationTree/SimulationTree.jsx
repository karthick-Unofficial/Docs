import _ from "lodash";
import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { Popover, CircularProgress, Tooltip } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Cube, CubeOutline, ChevronDown, ChevronUp, Close, Delete, Plus, Minus } from "mdi-material-ui";
import * as utilities from "../../../shared/utility/utilities";
import ConfirmationDialog from "../../../shared/components/ConfirmationDialog";
import { iconConfig } from "../../../shared/iconConfig";
import ModificationTimerContainer from "./ModificationTimerContainer";
import { Translate } from "orion-components/i18n/I18nContainer";


const propTypes = {
	userInfo: PropTypes.object,
	sessionId: PropTypes.string,
	controller: PropTypes.string,
	currentSimulation: PropTypes.object,
	simulations: PropTypes.object,
	modificationsActive: PropTypes.bool,
	readOnlySession: PropTypes.bool,
	simulationMode: PropTypes.string,
	docksWidth: PropTypes.number,
	simTimePrecision: PropTypes.number,
	loadSimulation: PropTypes.func.isRequired,
	deleteSimulation: PropTypes.func.isRequired,
	markSimulationAsFailed: PropTypes.func.isRequired,
	enableModifications: PropTypes.func.isRequired,
	raiseError: PropTypes.func.isRequired,
	dir:PropTypes.string
};

const popoverStyles = makeStyles({
	paper: {
		background: "#292b30"
	}
});

const SimulationTree = ({
	userInfo,
	sessionId,
	controller,
	currentSimulation,
	simulations,
	modificationsActive,
	readOnlySession,
	simulationMode,
	docksWidth,
	simTimePrecision,
	loadSimulation,
	deleteSimulation,
	markSimulationAsFailed,
	enableModifications,
	raiseError,
	dir
}) => {
	const [displaySimTree, setDisplaySimTree] = useState(false);
	const [baseSimEntry, setBaseSimEntry] = useState(null);
	const [runningSim, setRunningSim] = useState(null);
	const [firstLevelChildSims, setFirstLevelChildSims] = useState([]);
	const [expandedSims, setExpandedSims] = useState([]);

	const [simToDelete, setSimToDelete] = useState(null);

	const containerDivEl = useRef(null);
	const popoverClasses = popoverStyles();

	useEffect(() => {
		if (!baseSimEntry) {
			const base = _.values(simulations).find(simulation => !simulation.parentSimId);
			if (base) {
				setBaseSimEntry({
					simulation: base,
					children: [] // We will leave this empty as we process base's children separately
				});
			}
		}

		let simRunning = null;
		const allSims = _.values(simulations);
		for (let i = 0; i < allSims.length; i++) {
			if (allSims[i].avertStatus === "RUNNING") {
				simRunning = allSims[i];
				break;
			}
		}
		if (simRunning) {
			if (!runningSim || runningSim.simId !== simRunning.simId) {
				setRunningSim(simRunning);
			}
		} else {
			if (runningSim) {
				setRunningSim(null);
			}
		}
	}, [simulations]);

	useEffect(() => {
		// If we are not displaying the sim tree popover, we can exit
		if (!displaySimTree) {
			return;
		}

		const parentSims = {};
		const simList = _.values(simulations);
		const firstLevelChildren = simList
			.filter(sim => sim.parentSimId === baseSimEntry.simulation.simId)
			.map(sim => {
				const treeSim = {
					simulation: sim,
					children: []
				};
				parentSims[sim.simId] = treeSim;
				return treeSim;
			});

		const simsToBeProcessed = simList.filter(
			sim => sim.parentSimId !== baseSimEntry.simulation.simId && sim.simId !== baseSimEntry.simulation.simId);
		// Just to make sure we dont go into an infinite loop for example if a sim from the middle 
		// of the hierarchy gets deleted before its children
		let iterations = 0;
		while (simsToBeProcessed.length > 0 && iterations < 25) {
			for (let i = simsToBeProcessed.length - 1; i >= 0; i--) {
				const sim = simsToBeProcessed[i];
				if (parentSims.hasOwnProperty(sim.parentSimId)) {
					const parent = parentSims[sim.parentSimId];
					const treeSim = {
						simulation: sim,
						children: []
					};
					parent.children.push(treeSim);
					parentSims[sim.simId] = treeSim;
					simsToBeProcessed.splice(i, 1);
				}
			}
			iterations++;
		}

		setFirstLevelChildSims(firstLevelChildren);
	}, [displaySimTree, simulations]);

	useEffect(() => {
		if (displaySimTree && currentSimulation) {
			// Auto-expand the node containing current sim if applicable
			if (currentSimulation.simId === baseSimEntry.simulation.simId
				|| firstLevelChildSims.find(firstLevelSim => currentSimulation.simId === firstLevelSim.simulation.simId)) {
				return; // current simulation is base or first level simulation
			}
			let current = simulations[currentSimulation.simId];
			while (current.parentSimId) {
				current = simulations[current.parentSimId];
				const firstLevelSim = firstLevelChildSims.find(firstLevel => current.simId === firstLevel.simulation.simId);
				if (firstLevelSim) {
					if (!expandedSims.includes(firstLevelSim.simulation.simId)) {
						setExpandedSims([...expandedSims, firstLevelSim.simulation.simId]);
						return;
					}
				}
			}
		}
	}, [displaySimTree, currentSimulation, firstLevelChildSims]);

	const expandCollapseSimEntry = (simEntry) => {
		const newExpandedSims = [...expandedSims];
		if (newExpandedSims.includes(simEntry.simulation.simId)) {
			const index = newExpandedSims.indexOf(simEntry.simulation.simId);
			newExpandedSims.splice(index, 1);
		} else {
			newExpandedSims.push(simEntry.simulation.simId);
		}

		setExpandedSims(newExpandedSims);
	};

	const searchCurrentSim = (simEntry) => {
		if (simEntry.simulation.simId === currentSimulation.simId) {
			return true;
		}

		for (let i = 0; i < simEntry.children.length; i++) {
			if (searchCurrentSim(simEntry.children[i])) {
				return true;
			}
		}

		return false;
	};

	const canDelete = (simEntry) => {
		// Base simulation cannot be deleted
		if (simEntry.simulation.simId === baseSimEntry.simulation.simId) {
			return false;
		}

		// Current simulation or parent of the current simulation cannot be deleted
		if (currentSimulation) {
			if (simEntry.simulation.simId === currentSimulation.simId) {
				return false;
			}

			if (searchCurrentSim(simEntry)) {
				return false;
			}
		}

		if (simEntry.simulation.avertStatus === "RUNNING") {
			return false;
		}

		return true;
	};

	const deleteSim = () => {
		if (simToDelete) {
			deleteSimulation(sessionId, simToDelete.simulation.simId);
			setSimToDelete(null);
		}
	};

	const renderSimulationEntry = (simEntry, indentLevel, recursive = false, RightIcon = false, iconClickHandler = null) => {
		const marginLeft = indentLevel * 40;
		return (
			<div style={{ width: "100%" }}>
				<div className={`simEntry ${currentSimulation && simEntry.simulation.simId === currentSimulation.simId ? "current" : ""}`} style={{ marginLeft }}>
					<div className="simEntryContent">
						<div className="icon">
							{(currentSimulation && currentSimulation.simId === simEntry.simulation.simId
								? <img src={iconConfig["green_check"]} style={{ width: 20 }} />
								: (simEntry.simulation.avertStatus === "RUNNING"
									? <CircularProgress style={{ color: "#fff", width: 20, height: 20 }} />
									: (simEntry.simulation.simId === baseSimEntry.simulation.simId
										? <Cube style={{ color: "#fff", width: 34, height: 38 }} />
										: <CubeOutline style={{ color: "#fff", width: 24 }} />)))
							}
						</div>
						<div className={`b1-white ${simEntry.simulation.avertStatus === "ERROR" ? "error" : ""}`} style={dir == "rtl" ? { marginRight: 17 } : { marginLeft: 17 }}>
							{simEntry.simulation.name}
						</div>
						{userInfo.userId === controller && !readOnlySession && !modificationsActive && simulationMode === "simulation" && currentSimulation.loadStatus !== "loading" && currentSimulation.simId === simEntry.simulation.simId && currentSimulation.playStatus && currentSimulation.playStatus.status === "paused" &&
							<div className="cb-font-link modExerciseLink" onClick={() => {
								if (simEntry.simulation.parentDivergeTime > 0 && currentSimulation.playStatus.simTime < simEntry.simulation.parentDivergeTime) {
									let parent = simulations[simEntry.simulation.parentSimId];
									while (parent && parent.parentDivergeTime > 0 && currentSimulation.playStatus.simTime < parent.parentDivergeTime) {
										parent = simulations[parent.parentSimId];
									}
									raiseError(`The current simulation was spawned from its parent at a later simulation time: ${utilities.truncate(simEntry.simulation.parentDivergeTime, simTimePrecision)}.\nIf you want to create a simulation for the current time, please create it as a child of ${parent.name}.`);
									return;
								}
								enableModifications(sessionId);
								setDisplaySimTree(false);
							}}>
								<Translate value="tableopSession.simulation.simulationTree.load" />
							</div>
						}
						{userInfo.userId === controller && !modificationsActive && currentSimulation.loadStatus !== "loading" && currentSimulation.simId !== simEntry.simulation.simId && simEntry.simulation.avertStatus === "COMPLETE" && currentSimulation.playStatus && currentSimulation.playStatus.status === "paused" &&
							<div className="cb-font-link loadSimLink" onClick={() => {
								loadSimulation(sessionId, simEntry.simulation.simId);
								setDisplaySimTree(false);
							}}>
								<Translate value="tableopSession.simulation.simulationTree.load" />
							</div>
						}
						{simEntry.simulation.avertStatus === "RUNNING" &&
							<div className="b1-white loadingText">
								<Translate value="tableopSession.simulation.simulationTree.running" /> {simEntry.simulation.progress}%
								<div>
									{userInfo.userId === controller && (!simEntry.simulation.createdDate || ((new Date() - simEntry.simulation.createdDate) > 300000)) &&
										<div 
											className="cb-font-link" 
											onClick={() => markSimulationAsFailed(sessionId, simEntry.simulation.simId)} 
										>
											<Translate value="tableopSession.simulation.simulationTree.mark" />
										</div>
									}
								</div>
							</div>
						}
					</div>
					<div style={{ width: 24 }}>
						{userInfo.userId === controller && currentSimulation.loadStatus !== "loading" && canDelete(simEntry) &&
							<Delete className="deleteBtn" onClick={() => setSimToDelete(simEntry)} />
						}
					</div>
					<div style={{ width: 39 }}>
						{RightIcon && iconClickHandler &&
							<RightIcon className="expandCollapseBtn" onClick={() => iconClickHandler(simEntry)} />
						}
					</div>
				</div>

				{recursive && simEntry.children.length > 0 && _.orderBy(simEntry.children, "simulation.name", "asc").map(child => {
					return (
						<div key={child.simulation.simId} style={{ width: "100%" }}>
							{renderSimulationEntry(child, indentLevel + 1, recursive)}
						</div>
					);
				})}
			</div>
		);
	};

	if (!userInfo || !currentSimulation || !currentSimulation.simId || !simulations
		|| !simulations[currentSimulation.simId]) {
		return null;
	}

	const background = userInfo.isFacilitator ? "#2d9536" :
		(userInfo.userRole.toLowerCase() === "blue" ? "#2653b2" :
			(userInfo.userRole.toLowerCase() === "red" ? "#982721" : "gray"));
	const currentSimulationName = simulations[currentSimulation.simId].name;

	let popoverTop = 0;
	let popoverLeft = 0;
	if (displaySimTree && containerDivEl && containerDivEl.current) {
		const containerRect = containerDivEl.current.getBoundingClientRect();
		popoverLeft = containerRect.left;
		popoverTop = containerRect.top + containerRect.height;
	}

	let maxSimNameWidth = 200;
	if (docksWidth < 1000) {
		maxSimNameWidth = 350;
	}

	return (
		<div ref={containerDivEl} className={dir == "rtl" ? "simulationTreeRTL" : "simulationTree"} style={{ background }}>
			<CubeOutline className="icon" />
			<div className="nameContainer">
				<div className="b2-bright-gray"><Translate value="tableopSession.simulation.simulationTree.current" /></div>
				<Tooltip title={currentSimulationName}>
					<div className="b1-white simName" style={{maxWidth: `${maxSimNameWidth}px`}} data-text={currentSimulationName}>{currentSimulationName}</div>
				</Tooltip>
			</div>
			{!displaySimTree &&
				<ChevronDown className="popoverBtn" onClick={() => setDisplaySimTree(true)} />
			}
			{displaySimTree &&
				<ChevronUp className="popoverBtn" onClick={() => setDisplaySimTree(false)} />
			}
			{currentSimulation.loadStatus === "loading" &&
				<div className="rightPortionContainer">
					<CircularProgress style={dir == "rtl" ? { color: "#fff", width: 20, height: 20, marginLeft: 10 } : { color: "#fff", width: 20, height: 20, marginRight: 10 }} />
					<div>
						<div className="b1-white"><Translate value="tableopSession.simulation.simulationTree.loading" /></div>
						{currentSimulation.lastSimTimeLoaded && 
							<div className="b2-white"><Translate value="tableopSession.simulation.simulationTree.time" /> : {utilities.truncate(currentSimulation.lastSimTimeLoaded, simTimePrecision)}</div>
						}
					</div>
				</div>
			}
			{runningSim && !modificationsActive && currentSimulation.loadStatus !== "loading" &&
				<div className="rightPortionContainer">
					<CircularProgress style={dir == "rtl" ? { color: "#fff", width: 20, height: 20, marginLeft: 10 } : { color: "#fff", width: 20, height: 20, marginRight: 10 }}/>
					<div className="b1-white">
						<Tooltip title={runningSim.name}>
							<div className="simName" style={{maxWidth: `${maxSimNameWidth}px`}}>{runningSim.name}</div>
						</Tooltip>
						<div style={{fontWeight: "bold"}}><Translate value="tableopSession.simulation.simulationTree.run" /> </div>
					</div>
				</div>
			}
			{displaySimTree &&
				<Popover
					open={true}
					onClose={() => setDisplaySimTree(false)}
					anchorReference="anchorPosition"
					anchorPosition={{ left: popoverLeft, top: popoverTop }}
					classes={{ paper: popoverClasses.paper }}
				>
					<div className={dir == "rtl" ? "simTreePopoverContainerRTL" : "simTreePopoverContainer"}>
						<div className="contentContainer">
							<div className="headerContainer">
								<h5 className="headerLabel"><Translate value="tableopSession.simulation.simulationTree.exercise" /></h5>
								<Close className="closeBtn" onClick={() => setDisplaySimTree(false)} />
							</div>
							<div className="entriesContainer">
								{baseSimEntry &&
									renderSimulationEntry(baseSimEntry, 0)
								}
								{firstLevelChildSims && _.orderBy(firstLevelChildSims, "simulation.name", "asc").map(sim => {
									const displayChildren = expandedSims.includes(sim.simulation.simId);
									return (
										<div key={sim.simulation.id}>
											<div className="divider" />
											{renderSimulationEntry(sim, 0, displayChildren,
												sim.children.length > 0 ? (displayChildren ? Minus : Plus) : null,
												expandCollapseSimEntry)}
										</div>
									);
								})}
							</div>
						</div>
					</div>
				</Popover>
			}
			{simToDelete &&
				<ConfirmationDialog
					open={true}
					title=""
					content={<Translate value="tableopSession.controls.simulationTree.dialog.textContent" count={simToDelete.simulation.name}/>}
					onClose={() => setSimToDelete(null)}
					loading={false}
					onConfirm={deleteSim}
					dir={dir}
				/>
			}
			{modificationsActive &&
				<div className="modificationTimer">
					<ModificationTimerContainer></ModificationTimerContainer>
				</div>
			}
		</div>
	);
};

SimulationTree.propTypes = propTypes;
export default SimulationTree;