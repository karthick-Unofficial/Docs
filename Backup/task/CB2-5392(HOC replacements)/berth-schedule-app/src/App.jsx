import React, { Fragment, useEffect, memo, useState } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import ErrorBoundary from "orion-components/ErrorBoundary";
import AppBar from "./AppBar/AppBar";
import { Services } from "orion-components/Services";
import BaseMapservice from "orion-components/Services/BaseMapService/BaseMapsServiceContainer";
import BerthToolbar from "./BerthToolbar/BerthToolbar";
import FormPanel from "./FormPanel/FormPanel";
import GroupSorter from "./GroupSorter/GroupSorter";
import LookupManager from "./LookupManager/LookupManager";
import BerthMap from "./BerthMap/BerthMap";
import BerthSchedule from "./BerthSchedule/BerthSchedule";
import DailyAgenda from "./DailyAgenda/DailyAgenda";
import { Collapse } from "@material-ui/core";
import { WavCam } from "orion-components/Dock";
import { useSelector, useDispatch } from "react-redux";
import { getAllBerths, getAllBerthGroups, subscribeBerthAssignments } from "./appActions";
import { getAppState, getGlobalAppState } from "orion-components/AppState/Actions";
import { hydrateUser } from "orion-components/Session/Actions";
import { subscribeFeedPermissions } from "orion-components/GlobalData/Actions";

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
	map: PropTypes.object.isRequired,
	view: PropTypes.object.isRequired,
	subscribeBerthAssignments: PropTypes.func.isRequired,
	subscribeFeedPermissions: PropTypes.func.isRequired,
	WavCamOpen: PropTypes.bool
};

const App = () => {

	const location = useLocation();

	const [service, setService] = useState(false);
	const dispatch = useDispatch();

	const map = useSelector(state => state.map);
	const session = useSelector(state => state.session);
	const view = useSelector(state => state.view);
	const { user, identity } = session;
	const isHydrated = user.isHydrated;
	const WavCamOpen = useSelector(state => state.appState.dock.dockData.WavCam);

	useEffect(() => {
		const { userId } = identity;
		dispatch(hydrateUser(userId));
		dispatch(getAppState("berth-schedule-app"));
		dispatch(subscribeFeedPermissions(userId));
		dispatch(getGlobalAppState());
		dispatch(getAllBerthGroups());
		dispatch(getAllBerths());
		dispatch(subscribeBerthAssignments());
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
				<AppBar location={location} />
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

export default memo(App);
