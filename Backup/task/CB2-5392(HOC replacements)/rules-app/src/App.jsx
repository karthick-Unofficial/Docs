import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import RulesAppBar from "./RulesAppBar/RulesAppBar";
import { Services } from "orion-components/Services";

// Error Handling
import ErrorBoundary from "orion-components/ErrorBoundary";
import { WavCam } from "orion-components/Dock";
import { useSelector, useDispatch, useStore } from "react-redux";
import * as actionCreators from "./appActions";

const App = ({
	children
}) => {
	const dispatch = useDispatch();
	const store = useStore();

	const {
		hydrateUser,
		getAppState,
		getGlobalAppState,
		reHydrateUser,
		fetchHealthSystems,
		subscribeRules,
		subscribeCollections,
		subscribeFeedPermissions
	} = actionCreators;
	const { notifications, ...remainder } = useSelector(state => state.globalData);
	const WavCamOpen = useSelector(state => state.appState.dock.dockData.WavCam);
	const globalData = remainder;
	const session = useSelector(state => state.session);

	const location = useLocation();

	const [timedOut, setTimedOut] = useState(false);

	useEffect(() => {
		dispatch(hydrateUser(session.identity.userId));
		dispatch(getAppState("rules-app"));
		dispatch(getGlobalAppState());
		dispatch(reHydrateUser(session.identity.userId));
		dispatch(fetchHealthSystems());

		//New
		dispatch(subscribeRules());
		dispatch(subscribeCollections());
		dispatch(subscribeFeedPermissions());

		setTimeout(() => {
			setTimedOut(true);
		}, 4000);
	}, []);

	const isHydrated =
		(
			session.identity.userId
			&& globalData.org.orgUsers
		)
		|| timedOut;

	return (
		<div>
			{isHydrated ? (
				<div className="rulesAppWrapper">
					<Services />
					<ErrorBoundary store={store}>
						<RulesAppBar location={location} />
					</ErrorBoundary>
					<WavCam />
					{children}
				</div>
			) : null
			}
		</div>
	);
};

export default App;
