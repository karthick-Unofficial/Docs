[TOC]

## GlobalDock

## Overview

GlobalDock is a dock panel control that can be docked to the left or right of the application, and hosts a set of panels provided by the application.
At any point of time, a single panel can be opened in each dock panel, and the currently open panel in the left dock can 
be moved to the right dock and vice versa.
Currently it assumes that both dock panels (2 instances of this control) are present in the application.


## Usage

Following are the 4 steps for adding both dock panels to the application.

1. Add 2 instances of this control to the application as below:
    <GlobalDock dockDirection="left" appId="tabletop-app" panelsConfig={panelsConfig} />
	<GlobalDock dockDirection="right" appId="tabletop-app" panelsConfig={panelsConfig} />


    Following are the props accepted by the control: 
        == dockDirection ==
            Required.
            Direction where the control will be docked. Possible values are "left" or "right".

        == appId ==
            Required.
            ID of the application hosting this control.

        == panelsConfig ==
            Required.
            Config object describing all the panels that can be hosted in this dock panel. The same object will be passed to both instances.
            A sample config would be:
            {
                home: {
                    icon: Home,
                    header: "Home",
                    callback: navigateToHome
                },
                roster: {
                    icon: AccountBoxMultiple,
                    header: "Team Roster",
                    panel: RosterContainer
                },
                events: {
                    icon: AlertRhombus,
                    header: "Events",
                    panel: EventsContainer
                },
                facilities: {
                    icon: OfficeBuildingMarker,
                    header: "Facilities and Floorplans",
                    panel: FacilitiesContainer
                }
            }

            In the sample above, the values for icons refer to icon components.
            Eg. import { AccountBoxMultiple } from "mdi-material-ui";

            and the values for panels are react components implementing those panels
            Eg. import RosterContainer from "./Roster/RosterContainer";

            Instead of a panel, a callback function can be provided - In this case the callback function (eg. navigateToHome in the above snippet) will be invoked when the icon is clicked. Callbacks take precedence over panels.

        == panelsToHide ==
        Optional.
        An array of panel names that should be hidden.

        == exclusiveModePanel ==
        Optional
        If specified, the panel will be displayed in an exclusive mode. i.e. Only the dock panel containing the panel will be displayed, keeping the other dock panel hidden and there would be no option for selecting any other panel. It is assumed that the exclusiveModePanel has already been opened.

        == reportWidth ==
        Optional.
        A function that can be passed to obtain the width of the control initially and whenever the width changes.

        == reportAvailablePanels ==
        Optional.
        A function that can be passed to obtain the current list of available panels in this specific dock panel initially and whenever the list is updated.

        == reportCurrentPanel ==
        Optional.
        A function that can be passed to obtain the name of the currently open panel in this specific dock panel initially and whenever this information is updated.

    Following actions are supported:
        == openPanel ==
        Open a specific panel. If the panel is already open in any dock panel, this will be a no-op.

        == closePanel ==
        Close a specific panel. If the panel is not open in any dock panel, this will be a no-op.


2. Link to the stylesheet from your index.scss:

    == index.scss == 

            @import '../../node_modules/orion-components/scss/global-dock.scss';

3. Ensure that the persisted reducer (defined in orion-components/AppState/Reducers) is defined under state.appState.
    For example:
        const rootReducer = optimist(
            combineReducers({
                appState: combineReducers({ ..., persisted }),
            })
        );                  

4. Ensure that the action getAppState (defined in orion-components/AppState/Actions) is called in App.jsx to fetch persisted state for the application.
    For example:
        getAppState("tabletop-app");


Done!