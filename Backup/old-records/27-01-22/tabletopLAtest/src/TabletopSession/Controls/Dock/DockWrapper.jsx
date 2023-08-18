import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { GlobalDock } from "orion-components/GlobalDock";
import panelsConfig from "../../Panels/panelsConfig";

const propTypes = {
	dockDirection: PropTypes.string.isRequired,
	modificationsActive: PropTypes.bool.isRequired,
	componentMessage: PropTypes.object,
	reportWidth: PropTypes.func.isRequired,
	openPanel: PropTypes.func.isRequired,
	closePanel: PropTypes.func.isRequired,	
	sendComponentMessage: PropTypes.func.isRequired,
	clearComponentMessage: PropTypes.func.isRequired
};

const DockWrapper = ({
	dockDirection,
	modificationsActive,
	componentMessage,
	reportWidth,
	openPanel,
	closePanel,
	sendComponentMessage,
	clearComponentMessage
}) => {
	const appId = "tabletop-app";
	const [ currentPanel, setCurrentPanel ] = useState(null);
	const [ availablePanels, setAvailablePanels ] = useState([]);
	const [ panelsToHide, setPanelsToHide ] = useState([]);
	const [ exclusiveModePanel, setExclusiveModePanel ] = useState(null);

	const updateCurrentPanel = ( panel ) => {
		setCurrentPanel(panel);
	};

	const updateAvailablePanels = ( panels ) => {
		setAvailablePanels(panels);
	};

	useEffect(() => {
		// If modifications have been activated, we need to display the modification panel
		const modificationsPanel = "modifyExercise";
		if (modificationsActive) {
			// Should ideally check here if modificationsPanel is in availablePanels to trigger the below only for the correct 
			// dock, but at this point of time availablePanels would not include modificationsPanel. However an attempt to open 
			// the same panel twice would not hurt.
			openPanel(appId, modificationsPanel);
			setPanelsToHide([]);
		} else { // close the modifications panel if open
			setPanelsToHide([modificationsPanel]);
			if (currentPanel === modificationsPanel) {
				closePanel(appId, modificationsPanel);
			}
		}
	}, [modificationsActive]);

	useEffect(() => {
		if (componentMessage) {
			if (componentMessage.data.command === "exclusiveModeOn") {
				setExclusiveModePanel(componentMessage.data.panel);
				clearComponentMessage();
			} else if (componentMessage.data.command === "exclusiveModeOff") {
				setExclusiveModePanel(null);
				clearComponentMessage();
			} else if (componentMessage.data.command === "open") {
				if (exclusiveModePanel) {
					clearComponentMessage(); // We dont allow panels to be opened in exclusive mode
					return;
				}
				if (availablePanels.includes(componentMessage.data.panel)) {
					openPanel(appId, componentMessage.data.panel);
					clearComponentMessage();
					if (componentMessage.data.panelData) {
						sendComponentMessage({
							recipient: "panel_" + componentMessage.data.panel,
							data: componentMessage.data.panelData
						});
					}
				}
			} else if (componentMessage.data.command === "close") {
				if (currentPanel === componentMessage.data.panel) {
					closePanel(appId, componentMessage.data.panel);
					clearComponentMessage();
				}
			}
		}
	}, [ componentMessage ]);

	return (
		<GlobalDock
			appId={appId}
			dockDirection={dockDirection}
			panelsConfig={panelsConfig}
			panelsToHide={panelsToHide}
			exclusiveModePanel={exclusiveModePanel}
			reportWidth={reportWidth}
			reportAvailablePanels={updateAvailablePanels}
			reportCurrentPanel={updateCurrentPanel}
	    />
	);
};

DockWrapper.propTypes = propTypes;
export default DockWrapper;