import React, { useState, useEffect } from "react";

import Overlay from "./components/Overlay";
import { applicationService } from "client-app-core";
import { useSelector } from "react-redux";
import EventBus from "orion-components/SharedComponents/EventBus";

const MapOverlays = () => {
	const appId = useSelector((state) => state.application.appId);
	const [overlays, setOverlays] = useState([]);

	useEffect(() => {
		applicationService.getAppSpecificMapOverlays(appId, (err, response) => {
			if (err) console.log("ERROR", err);
			if (!response) return;
			setOverlays(response);
			EventBus.publish("overlays", response);
		});
	}, [appId]);

	return (
		<>
			{overlays.map((overlay, index) => (
				<Overlay key={index} overlay={overlay} />
			))}
		</>
	);
};

export default MapOverlays;
