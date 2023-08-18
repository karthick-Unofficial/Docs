import _ from "lodash";
import React, {useState, useEffect} from "react";
import PropTypes from "prop-types";
import { Drawer, Tooltip } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { DockLeft, DockRight, Close } from "mdi-material-ui";
import ErrorBoundary from "../../../shared/components/ErrorBoundary";
import widgetsConfig from "../../Widgets/widgetsConfig";
import { Translate } from "orion-components/i18n/I18nContainer";

const propTypes = {
	dockDirection: PropTypes.string.isRequired,
	dockState: PropTypes.object.isRequired,
	modificationsActive: PropTypes.bool.isRequired,
	componentMessage: PropTypes.object,
	widgetLocalState: PropTypes.object,
	reportWidth: PropTypes.func.isRequired,
	closeDock: PropTypes.func.isRequired,
	openWidget: PropTypes.func.isRequired,
	moveToOtherDock: PropTypes.func.isRequired,
	setLocalState: PropTypes.func.isRequired,
	clearComponentMessage: PropTypes.func.isRequired,
	dir: PropTypes.string
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

const Dock = ({
	dockDirection, 
	dockState, 
	modificationsActive, 
	componentMessage,
	widgetLocalState,
	reportWidth, 
	closeDock, 
	openWidget, 
	moveToOtherDock, 
	setLocalState,
	clearComponentMessage,
	dir
}) => {
	const getCurrentWidget = () => {
		return dockDirection === "left" 
			? dockState.leftDock.currentWidget
			: dockState.rightDock.currentWidget;
	};

	const useLocalState = (key, defaultValue) => {
		const value = widgetLocalState && widgetLocalState[key] ? widgetLocalState[key] : defaultValue;
		const [ val, setVal ] = useState(value);
		const widget = getCurrentWidget();
		return [ val, 
			(newVal) => {
				setLocalState("widget_" + widget, key, newVal);
				setVal(newVal);
			}
		];
	};
	
	const getAvailableWidgets = () => {
		const dockWidgets = dockDirection === "left"
			? dockState.leftDock.availableWidgets 
			: dockState.rightDock.availableWidgets;
		if (modificationsActive) {
			return dockWidgets;
		} else {
			return dockWidgets.filter(widget => !widgetsConfig[widget].modifyMode);
		}
	};

	const [ currentWidget, setCurrentWidget ] = useState(getCurrentWidget());
	const [ availableWidgets, setAvailableWidgets ] = useState(getAvailableWidgets());
	const [ widgetMessage, setWidgetMessage ] = useState(null);

	const [ exclusiveMode, setExclusiveMode ] = useState(false);
	const [ exclusiveModeWidget, setExclusiveModeWidget ] = useState(null);

	useEffect(() => {
		const newCurrentWidget = getCurrentWidget();
		if (currentWidget !== newCurrentWidget) {
			setCurrentWidget(newCurrentWidget);
		}
		const newAvailableWidgets = getAvailableWidgets();
		if (!_.isEqual(availableWidgets, newAvailableWidgets)) {
			setAvailableWidgets(newAvailableWidgets);
		}
	}, [ dockState, modificationsActive ]);

	useEffect(() => {
		// If modifications have been activated, we need to display the modification widget
		if (modificationsActive) {
			const modificationsWidget = _.keys(widgetsConfig).find(key => widgetsConfig[key].modifyMode);
			const dockWidgets = dockDirection === "left"
				? dockState.leftDock.availableWidgets 
				: dockState.rightDock.availableWidgets;
			if (dockWidgets.includes(modificationsWidget) && currentWidget !== modificationsWidget) {
				openWidget(dockState, dockDirection, modificationsWidget);
			}
		} else { // close the modifications widget if open
			if (currentWidget && widgetsConfig[currentWidget].modifyMode) {
				closeDock(dockState, dockDirection);
			}
		}
	}, [modificationsActive]);

	useEffect(() => {
		if (exclusiveMode) {
			if (exclusiveModeWidget === currentWidget) {
				reportWidth(500);
			} else {
				reportWidth(0);
			}
		} else {
			if (currentWidget) {
				reportWidth(560);
			} else if (availableWidgets.length > 0) {
				reportWidth(60);
			} else {
				reportWidth(0);
			}
		}
	}, [ currentWidget, availableWidgets, exclusiveMode, exclusiveModeWidget ]);

	useEffect(() => {
		if (componentMessage) {
			if (!componentMessage.data.widgetData && widgetMessage) {
				setWidgetMessage(null);
			}
			if (componentMessage.data.command === "exclusiveModeOn") {
				setExclusiveMode(true);
				setExclusiveModeWidget(componentMessage.data.widget);
			} else if (componentMessage.data.command === "exclusiveModeOff") {
				setExclusiveMode(false);
				setExclusiveModeWidget(null);
			} else if (componentMessage.data.command === "open") {
				if (exclusiveMode) {
					clearComponentMessage(); // We dont allow widgets to be opened in exclusive mode
					return;
				}
				if (availableWidgets && availableWidgets.includes(componentMessage.data.widget)) {
					if (currentWidget !== componentMessage.data.widget) {
						// Widget not open. We open it first, and once it is open we will pass the message to it
						openWidget(dockState, dockDirection, componentMessage.data.widget);
					}
					if (componentMessage.data.widgetData) {
						setWidgetMessage(componentMessage.data.widgetData);
					} else {
						// We only need to open the widget, so no need to pass message down further to the widget
						clearComponentMessage(); 
					}
				}
			} else if (componentMessage.data.command === "close") {
				if (currentWidget === componentMessage.data.widget) {
					closeDock(dockState, dockDirection);
					clearComponentMessage();
				}
			}
		} else {
			if (widgetMessage) {
				setWidgetMessage(null);
			}
		}
	}, [componentMessage, availableWidgets, currentWidget]);
		
	let MoveToDockIcon;
	let moveToDockTooltip;
	if (dockDirection === "left") {
		MoveToDockIcon = DockRight;
		moveToDockTooltip = <Translate value="tableopSession.controls.dock.dockRight"/>;
	} else {
		MoveToDockIcon = DockLeft;
		moveToDockTooltip = <Translate value="tableopSession.controls.dock.dockLeft"/>;
	}

	const { collapsedPaper, miniPaper, expandedPaper, exclusivePaper } = useStyles();
	let paperStyle = collapsedPaper;
	if (exclusiveMode) {
		if (exclusiveModeWidget === currentWidget) {
			paperStyle = exclusivePaper;
		}
	} else if (currentWidget) {
		paperStyle = expandedPaper;
	} else if (availableWidgets && availableWidgets.length > 0) {
		paperStyle = miniPaper;
	}

	const dockContentStyle = exclusiveMode ?
		{
			overflow: "scroll",
			height: "calc(100vh - 48px)"
		} :
		{
			overflow: "scroll",
			height: "calc(100vh - 116px)"
		};
	

	const renderWidgetArea = () => {
		const Widget = widgetsConfig[currentWidget].widget;
		return (
			<div className="dockArea">
				{!exclusiveMode && 
					<div className="dockHeader">
						<h5 className="title">{widgetsConfig[currentWidget].header}</h5>
						<Tooltip title={moveToDockTooltip} placement="bottom">
							<MoveToDockIcon className="moveToDockIcon" onClick={() => moveToOtherDock(dockState, dockDirection, currentWidget)} />
						</Tooltip>
						<Tooltip title={<Translate value="tableopSession.controls.dock.close"/>} placement="bottom">
							<Close className="close" onClick={() => closeDock(dockState, dockDirection)} />
						</Tooltip>
					</div>
				}
				<div className="dockContent" style={dockContentStyle}>
					<ErrorBoundary componentName={currentWidget}>
						<Widget externalMessage={widgetMessage} useLocalState={useLocalState} />
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
			open={true}
	    >
			<div className={dir == "rtl" ? "sessionDockRTL" : "sessionDock"}>
				{currentWidget && dockDirection==="right" && (!exclusiveModeWidget || exclusiveModeWidget === currentWidget) && 
					renderWidgetArea()
				}
				{!exclusiveMode && 
					<div className="iconBar">
						{availableWidgets.map(widget => {
							const Icon = widgetsConfig[widget].icon;
							return (
								<div key={widget} className={`iconContainer ${currentWidget === widget ? "selected" : ""}`}>
									<Tooltip title={widgetsConfig[widget].header}  placement="bottom">
										<Icon className="icon" onClick={() => openWidget(dockState, dockDirection, widget)} />
									</Tooltip>
								</div>
							);
						})}
					</div>
				}
				{currentWidget && dockDirection==="left" && (!exclusiveModeWidget || exclusiveModeWidget === currentWidget) && 
					renderWidgetArea()
				}
			</div>
		</Drawer>
	);
};

Dock.propTypes = propTypes;
export default Dock;