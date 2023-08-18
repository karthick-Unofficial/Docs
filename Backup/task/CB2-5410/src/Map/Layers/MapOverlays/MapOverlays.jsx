import React, { useState, useEffect } from "react";

import Overlay from "./components/Overlay";
import { mapOverlayService } from "client-app-core";
import { useSelector, useDispatch } from "react-redux";
import { setMapOverlays } from "./mapOverlaysActions";

const MapOverlays = () => {
	const dispatch = useDispatch();

	const appId = useSelector((state) => state.application.appId);
	const [overlays, setOverlays] = useState([]);

	useEffect(() => {
		mapOverlayService.getAppSpecificMapOverlays(appId, (err, response) => {
			if (err) console.log("ERROR", err);
			if (!response) return;
			dispatch(setMapOverlays({ overlays: response }));
			setOverlays(response);
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
