import React, { Fragment, useEffect, memo, useState } from "react";
import PropTypes from "prop-types";
import ErrorBoundary from "orion-components/ErrorBoundary";
import AppBarContainer from "./AppBar/AppBarContainer";
import { Services } from "orion-components/Services";
import BaseMapservice from "orion-components/Services/BaseMapService/BaseMapsServiceContainer";
import { default as BerthToolbar } from "./BerthToolbar/BerthToolbarContainer";
import { default as FormPanel } from "./FormPanel/FormPanelContainer";
import { default as GroupSorter } from "./GroupSorter/GroupSorterContainer";
import { default as LookupManager } from "./LookupManager/LookupManagerContainer";
import { default as BerthMap } from "./BerthMap/BerthMapContainer";
import { default as BerthSchedule } from "./BerthSchedule/BerthScheduleContainer";
import { default as DailyAgenda } from "./DailyAgenda/DailyAgendaContainer";
import { Collapse } from "@material-ui/core";
import { WavCam } from "orion-components/Dock";
const propTypes = {
	getAllBerths: PropTypes.func.isRequired,
	getAllBerthGroups: PropTypes.func.isRequired,
	getAppState: PropTypes.func.isRequired,
	getGlobalAppState: PropTypes.func.isRequired,
	hydrateUser: PropTypes.func.isRequired,
	identity: PropTypes.shape({
		email: PropTypes.string.isRequired,
		isAuthenticated: PropTypes.bool.isRequired,
		userId: PropTypes.string.isRequired
	}),
	isHydrated: PropTypes.bool.isRequired,
	location: PropTypes.object,
	map: PropTypes.object.isRequired,
	view: PropTypes.object.isRequired,
	subscribeBerthAssignments: PropTypes.func.isRequired,
	subscribeFeedPermissions: PropTypes.func.isRequired,
	WavCamOpen: PropTypes.bool
};

const defaultProps = {
	location: null
};

const App = ({
	getAllBerths,
	getAllBerthGroups,
	getAppState,
	getGlobalAppState,
	hydrateUser,
	identity,
	isHydrated,
	map,
	view,
	subscribeBerthAssignments,
	subscribeFeedPermissions,
	location,
	WavCamOpen
}) => {
	const [service, setService] = useState(false);

	useEffect(() => {
		const { userId } = identity;
		hydrateUser(userId);
		getAppState("berth-schedule-app");
		subscribeFeedPermissions(userId);
		getGlobalAppState();
		getAllBerthGroups();
		getAllBerths();
		subscribeBerthAssignments();
	}, [
		getAllBerthGroups,
		getAllBerths,
		getAppState,
		getGlobalAppState,
		hydrateUser,
		identity,
		subscribeBerthAssignments,
		subscribeFeedPermissions,
		service
	]);

	const styles = {
		wrapper: {
			position: "relative",
			width: "100%",
			display: "flex",
			flexDirection: "column",
			height: `calc(100vh - 112px - ${WavCamOpen ? "304px" : "0px"} - ${map.open ? "500px" : "0px"})`,
			overflow: "auto"
		}
	};
	return isHydrated ? (
		<div>
			<Services>
				<BaseMapservice setReady={() => setService(true)} />
			</Services>
			<ErrorBoundary>
				<AppBarContainer location={location} />
			</ErrorBoundary>
			<WavCam />
			<Collapse in={map.open} unmountOnExit>
				<BerthMap />
			</Collapse>
			<BerthToolbar />
			<LookupManager />
			<div style={styles.wrapper}>
				{view.page === "schedule" ? <BerthSchedule /> : <DailyAgenda />}
				<FormPanel />
			</div>
			<GroupSorter />
		</div>
	) : (
		<Fragment />
	);
};

App.propTypes = propTypes;
App.defaultProps = defaultProps;

export default memo(App);
