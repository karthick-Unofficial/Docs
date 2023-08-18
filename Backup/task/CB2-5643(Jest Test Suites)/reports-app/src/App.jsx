import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// Error Handling
import ErrorBoundary from "orion-components/ErrorBoundary";
import { Services } from "orion-components/Services";
import { useLocation } from "react-router-dom";

// Components
import ReportsAppBar from "./ReportsAppBar/ReportsAppBar";
import { WavCam } from "orion-components/Dock";
import { discoverReportTypes, hydrateUser, getGlobalAppState, subscribeFeedPermissions } from "./appActions.js";


const App = (props) => {

	const location = useLocation();
	const dispatch = useDispatch();
	const identity = useSelector(state => state.session.identity);
	const isHydrated = useSelector(state => state.session.user.isHydrated);

	useEffect(() => {
		const { userId } = identity;
		dispatch(hydrateUser(userId));
		dispatch(getGlobalAppState());
		dispatch(discoverReportTypes());
		dispatch(subscribeFeedPermissions(userId));
	}, []);

	const { children } = props;

	return (
		<div className="app-wrapper">
			{isHydrated &&
				<div className='content-wrapper'>
					<Services />
					<ErrorBoundary>
						<ReportsAppBar location={location} />
					</ErrorBoundary>
					<WavCam />
					{children}
				</div>
			}
		</div>
	);
};

export default App;
