import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Drawer, Tooltip } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { DockLeft, DockRight, Close } from "mdi-material-ui";
import ErrorBoundary from "../ErrorBoundary";
import { useSelector, useDispatch } from "react-redux";
import * as actionCreators from "./dockActions";
import keys from "lodash/keys";
import isEqual from "lodash/isEqual";

const propTypes = {
	appId: PropTypes.string.isRequired,
	dockDirection: PropTypes.string.isRequired,
	globalDockState: PropTypes.object,
	panelsConfig: PropTypes.object.isRequired,
	panelsToHide: PropTypes.array,
	exclusiveModePanel: PropTypes.string,
	reportWidth: PropTypes.func,
	reportAvailablePanels: PropTypes.func,
	reportCurrentPanel: PropTypes.func,
	openPanel: PropTypes.func.isRequired,
	closePanel: PropTypes.func.isRequired,
	moveToOtherDock: PropTypes.func.isRequired,
	saveDockState: PropTypes.func.isRequired
};

const useStyles = makeStyles(theme => ({
	collapsedPaper: {
		marginTop: 48,
		width: 0,
		transition: theme.transitions.create("width", {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen
		})
	},
	miniPaper: {
		marginTop: 48,
		width: 60,
		boxShadow: "6px 0px 8px #0000007B, -6px 0px 8px #0000007B",
		zIndex: 550,
		transition: theme.transitions.create("width", {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen
		})
	},
	expandedPaper: {
		marginTop: 48,
		width: 560,
		boxShadow: "6px 0px 8px #0000007B, -6px 0px 8px #0000007B",
		zIndex: 550,
		transition: theme.transitions.create("width", {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen
		})
	},
	exclusivePaper: {
		marginTop: 48,
		width: 500,
		boxShadow: "6px 0px 8px #0000007B, -6px 0px 8px #0000007B",
		zIndex: 550,
		transition: theme.transitions.create("width", {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen
		})
	}
}));

const GlobalDock = ({
	appId,
	dockDirection,
	panelsConfig,
	panelsToHide,
	exclusiveModePanel,
	reportWidth,
	reportAvailablePanels,
	reportCurrentPanel
}) => {
	const dispatch = useDispatch();

	const {
		openPanel,
		closePanel,
		moveToOtherDock,
		saveDockState
	} = actionCreators;
	const globalDockState = useSelector(state => state.appState && state.appState.persisted && state.appState.persisted.globalDockState);
	const getCurrentPanel = () => {
		if (!globalDockState) {
			return null;
		}
		return dockDirection === "left"
			? globalDockState.leftDock.currentPanel
			: globalDockState.rightDock.currentPanel;
	};

	const getAvailablePanels = () => {
		const dockPanels = dockDirection === "left"
			? globalDockState.leftDock.availablePanels
			: globalDockState.rightDock.availablePanels;
		if (!panelsToHide || panelsToHide.length === 0) {
			return dockPanels;
		} else {
			return dockPanels.filter(panel => !panelsToHide.includes(panel));
		}
	};

	const hasDiscrepancy = () => {
		// Discrepancies might exist if the persisted state conflicts with the parameters passed 
		// to the control. In such cases, we should avoid rendering.
		if (!panelsToHide || panelsToHide.length === 0) {
			return false;
		}
		const currentPanel = getCurrentPanel();
		if (panelsToHide.includes(currentPanel)) {
			return true;
		}
		return false;
	};

	const [currentPanel, setCurrentPanel] = useState(null);
	const [availablePanels, setAvailablePanels] = useState([]);

	useEffect(() => {
		if (!globalDockState) {
			// We setup the default state
			const availablePanels = keys(panelsConfig);
			const newState = {
				leftDock: {
					availablePanels: availablePanels,
					currentPanel: null
				},
				rightDock: {
					availablePanels: [],
					currentPanel: null
				}
			};
			dispatch(saveDockState(appId, newState));
		} else {
			// We check for any new panels not added to the dock state, we add them to left dock
			const newPanels = [];
			keys(panelsConfig).forEach((panel) => {
				if (!globalDockState.leftDock.availablePanels.includes(panel)
					&& !globalDockState.rightDock.availablePanels.includes(panel)) {
					newPanels.push(panel);
				}
			});

			if (newPanels.length > 0) {
				const newState = {
					...globalDockState,
					leftDock: {
						...globalDockState.leftDock,
						availablePanels: [...globalDockState.leftDock.availablePanels, ...newPanels]
					}
				};
				dispatch(saveDockState(appId, newState));
			}
		}
	}, []);

	useEffect(() => {
		if (!globalDockState) {
			return;
		}

		const newAvailablePanels = getAvailablePanels();
		if (!isEqual(availablePanels, newAvailablePanels)) {
			setAvailablePanels(newAvailablePanels);
			if (reportAvailablePanels) {
				reportAvailablePanels(newAvailablePanels);
			}
		}

		const newCurrentPanel = getCurrentPanel();
		if (newCurrentPanel !== null && !newAvailablePanels.includes(newCurrentPanel)) {
			dispatch(closePanel(appId, newCurrentPanel));
		} else if (currentPanel !== newCurrentPanel) {
			setCurrentPanel(newCurrentPanel);
			if (reportCurrentPanel) {
				reportCurrentPanel(newCurrentPanel);
			}
		}
	}, [globalDockState, panelsToHide]);

	useEffect(() => {
		if (!reportWidth) {
			return;
		}
		if (exclusiveModePanel) {
			if (exclusiveModePanel === currentPanel) {
				reportWidth(500);
			} else {
				reportWidth(0);
			}
		} else {
			if (currentPanel) {
				reportWidth(560);
			} else if (availablePanels.length > 0) {
				reportWidth(60);
			} else {
				reportWidth(0);
			}
		}
	}, [currentPanel, availablePanels, exclusiveModePanel]);

	const discrepanciesExist = hasDiscrepancy();

	let MoveToDockIcon;
	let moveToDockTooltip;
	if (dockDirection === "left") {
		MoveToDockIcon = DockRight;
		moveToDockTooltip = "Dock Right";
	} else {
		MoveToDockIcon = DockLeft;
		moveToDockTooltip = "Dock Left";
	}

	const { collapsedPaper, miniPaper, expandedPaper, exclusivePaper } = useStyles();
	let paperStyle = collapsedPaper;
	if (exclusiveModePanel) {
		if (exclusiveModePanel === currentPanel) {
			paperStyle = exclusivePaper;
		}
	} else if (currentPanel) {
		paperStyle = expandedPaper;
	} else if (availablePanels && availablePanels.length > 0) {
		paperStyle = miniPaper;
	}

	const dockContentStyle = exclusiveModePanel ?
		{
			overflow: "scroll",
			height: "calc(100vh - 48px)"
		} :
		{
			overflow: "scroll",
			height: "calc(100vh - 116px)"
		};


	const renderPanelArea = () => {
		const Panel = panelsConfig[currentPanel].panel;
		return (
			<div className="dockArea">
				{!exclusiveModePanel &&
					<div className="dockHeader">
						<h5 className="title">{panelsConfig[currentPanel].header}</h5>
						<Tooltip title={moveToDockTooltip} placement="bottom">
							<MoveToDockIcon className="moveToDockIcon" onClick={() => dispatch(moveToOtherDock(appId, globalDockState, dockDirection, currentPanel))} />
						</Tooltip>
						<Tooltip title="Close" placement="bottom">
							<Close className="close" onClick={() => dispatch(closePanel(appId, currentPanel))} />
						</Tooltip>
					</div>
				}
				<div className="dockContent" style={dockContentStyle}>
					<ErrorBoundary>
						<Panel />
					</ErrorBoundary>
				</div>
			</div>
		);
	};

	return (
		<Drawer
			variant="persistent"
			anchor={dockDirection}
			classes={{
				paper: paperStyle
			}}
			open={!discrepanciesExist}
		>
			<div className="globalDock">
				{currentPanel && dockDirection === "right" && (!exclusiveModePanel || exclusiveModePanel === currentPanel) &&
					renderPanelArea()
				}
				{!exclusiveModePanel &&
					<div className="iconBar">
						{availablePanels.map(panel => {
							const Icon = panelsConfig[panel].icon;
							return (
								<div key={panel} className={`iconContainer ${currentPanel === panel ? "selected" : ""}`}>
									<Tooltip title={panelsConfig[panel].header} placement="bottom">
										<Icon className="icon" onClick={() => {
											const callback = panelsConfig[panel].callback;
											if (callback) {
												callback();
											} else {
												dispatch(openPanel(appId, panel));
											}
										}} />
									</Tooltip>
								</div>
							);
						})}
					</div>
				}
				{currentPanel && dockDirection === "left" && (!exclusiveModePanel || exclusiveModePanel === currentPanel) &&
					renderPanelArea()
				}
			</div>
		</Drawer>
	);
};

GlobalDock.propTypes = propTypes;
export default GlobalDock;