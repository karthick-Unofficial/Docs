import React, { useEffect, useState } from "react";
import RulesAppBarContainer from "./RulesAppBar/RulesAppBarContainer";
import { Services } from "orion-components/Services";

// Error Handling
import ErrorBoundary from "orion-components/ErrorBoundary";
import { WavCam } from "orion-components/Dock";
const App = ({ hydrateUser, getAppState, getGlobalAppState, reHydrateUser, fetchHealthSystems, subscribeRules, subscribeCollections, subscribeFeedPermissions, session, globalData, location, children }) => {
	const [timedOut, setTimedOut] = useState(false);

	useEffect(() => {
		hydrateUser(session.identity.userId);
		getAppState("rules-app");
		getGlobalAppState();
		reHydrateUser(session.identity.userId);
		// this.props.fetchRules(this.props.session.user.profile.orgId);
		// this.props.fetchCollections();
		fetchHealthSystems();

		//New
		subscribeRules();
		subscribeCollections();
		subscribeFeedPermissions();

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
					<ErrorBoundary>
						<RulesAppBarContainer location={location} />
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
