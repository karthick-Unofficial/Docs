import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// Error Handling
import ErrorBoundary from "orion-components/ErrorBoundary";
import { Services } from "orion-components/Services";
import { useLocation } from "react-router-dom";

// Components
import AppBar from "orion-components/AppBar/AppBar";
import { WavCam } from "orion-components/Dock";
import { discoverReportTypes, hydrateUser, getGlobalAppState, subscribeFeedPermissions } from "./appActions.js";
import { getTranslation } from "orion-components/i18n";

const App = (props) => {
	const location = useLocation();
	const dispatch = useDispatch();
	const identity = useSelector((state) => state.session.identity);
	const isHydrated = useSelector((state) => state.session.user.isHydrated);
	const locale = useSelector((state) => state.i18n.locale);

	const [title, setTitle] = useState("Reports");
	const navigate = useNavigate();

	useEffect(() => {
		const { userId } = identity;
		dispatch(hydrateUser(userId));
		dispatch(getGlobalAppState());
		dispatch(discoverReportTypes());
		dispatch(subscribeFeedPermissions(userId));
	}, []);

	const handleGoHome = () => {
		navigate("/");
	};

	useEffect(() => {
		if (location.pathname === "/") {
			setTitle("Reports");
		} else if (location.state && location.state.name) {
			const titleText = getTranslation(location.state.name);
			setTitle(titleText);
		} else if (location.pathname === "/report-builder/sitrep") {
			setTitle("Event SITREP");
		}
	}, [location, locale]);

	const { children } = props;

	return (
		<div className="app-wrapper">
			{isHydrated && (
				<div className="content-wrapper">
					<Services />
					<ErrorBoundary>
						<AppBar titleText={title} handleGoHome={handleGoHome} appId="reports-app" />
					</ErrorBoundary>
					<WavCam />
					{children}
				</div>
			)}
		</div>
	);
};

export default App;
