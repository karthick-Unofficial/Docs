import React, { useCallback, useEffect, useState } from "react";
import { Avatar, Chip } from "@material-ui/core";
import { TargetingIcon } from "orion-components/SharedComponents";
import { NewWindow } from "orion-components/NewWindow";
import { getCameras } from "./getCameras";
import { spotlightService } from "client-app-core";
import center from "@turf/center";
import { getSpotlight } from "orion-components/Map/helpers";
import { getTranslation } from "orion-components/i18n/I18nContainer";

const SpotlightChip = ({
	spotlight,
	index,
	handleClick,
	cameras,
	setSpotlight,
	user,
	dir
}) => {
	const [windowRef, setWindowRef] = useState(null);
	const { id, geometry, properties } = spotlight;
	const { strokeColor } = properties;

	const handleClose = useCallback(() => {
		handleClick({ id });
		spotlightService.delete(id, err => {
			if (err) {
				console.log("Unable to end Spotlight session", err);
			} else {
				if (windowRef) {
					windowRef.close();
				}
			}
		});
	}, [windowRef, id]);

	useEffect(() => {
		const initialCameras = getCameras(spotlight, cameras);
		const windowReference = new NewWindow({
			url: `${window.location.origin}/mapgl-app/#/spotlight`,
			id: spotlight.id,
			data: {
				windowTitle: `Spotlight ${index + 1}`,
				spotlightColor: strokeColor,
				spotlightTitleColor: "#FFF",
				initialCameras,
				user
			},
			properties: `width=${window.innerWidth -
				200},height=${window.innerHeight - 100},left=0,top=0`
		});
		windowReference.listen(window, window.location.origin, (err, message) => {
			if (err) {
				console.log("ERROR", err);
			} else {
				const { payload } = message;

				if (payload && payload.selectedCamera) {
					const newCamera = cameras[payload.selectedCamera];
					const { spotlightShape, entityData } = newCamera;
					const newSpotlight = { ...spotlight };
					if (newCamera.spotlightShape) {
						newSpotlight.geometry = spotlightShape.geometry;
					} else {
						newSpotlight.geometry = getSpotlight({
							center: center(entityData.geometry)
						}).geometry;
					}
					setSpotlight(newSpotlight);
				}

				if (payload && payload === "exit") {
					handleClose();
				}
			}
		});
		setWindowRef(windowReference);
	}, []);

	useEffect(() => {
		if (windowRef) {
			const newCameras = getCameras(spotlight, cameras);
			spotlightService.update(id, spotlight, err => {
				if (err) {
					console.log("There was an error updating the spotlight", err);
				} else {
					windowRef.sendMessage(
						{ cameras: newCameras },
						`${window.location.origin}/mapgl-app/#/spotlight`
					);
				}
			});
		}
		return () => {};
	}, [geometry, windowRef]);

	return (
		<Chip
			label={getTranslation("global.map.tools.spotlightTool.spotlightChip.spotlight", index + 1)}
			style={dir == "rtl" ? {
				backgroundColor: strokeColor,
				marginRight: 8
			} : {
				backgroundColor: strokeColor,
				marginLeft: 8
			}}
			avatar={
				<Avatar
					style={{
						backgroundColor: strokeColor
					}}
				>
					<TargetingIcon geometry={geometry} />
				</Avatar>
			}
			onDelete={handleClose}
			onClick={() => handleClick({ spotlight })}
		/>
	);
};

export default SpotlightChip;
