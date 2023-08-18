import React, { useCallback, useEffect, useState } from "react";
import { Avatar, Chip } from "@mui/material";
import { TargetingIcon } from "orion-components/SharedComponents";
import { NewWindow } from "orion-components/NewWindow";
import { getCameras } from "./getCameras";
import { spotlightService } from "client-app-core";
import center from "@turf/center";
import { getSpotlight } from "orion-components/Map/helpers";
import { getTranslation } from "orion-components/i18n";
import { useDispatch } from "react-redux";

const SpotlightChip = ({
	spotlight,
	index,
	handleClick,
	cameras,
	setSpotlight,
	user,
	dir
}) => {
	const dispatch = useDispatch();

	const [windowRef, setWindowRef] = useState(null);
	const [mounted, setMounted] = useState(false);
	const { id, geometry, properties } = spotlight;
	const { strokeColor } = properties;

	const handleClose = useCallback(() => {
		handleClick({ id });
		spotlightService.delete(id, (err) => {
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
		setMounted(true);
	}, []);

	if (mounted) {
		const initialCameras = getCameras(spotlight, cameras);
		const windowReference = new NewWindow({
			url: `${window.location.origin}/map-app/#/spotlight`,
			id: spotlight.id,
			data: {
				windowTitle: `Spotlight ${index + 1}`,
				spotlightColor: strokeColor,
				spotlightTitleColor: "#FFF",
				initialCameras,
				user
			},
			properties: `width=${window.innerWidth - 200},height=${
				window.innerHeight - 100
			},left=0,top=0`
		});
		windowReference.listen(
			window,
			window.location.origin,
			(err, message) => {
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
						dispatch(setSpotlight(newSpotlight));
					}

					if (payload && payload === "exit") {
						handleClose();
					}
				}
			}
		);
		setWindowRef(windowReference);
		setMounted(false);
	}

	useEffect(() => {
		if (windowRef) {
			const newCameras = getCameras(spotlight, cameras);
			spotlightService.update(id, spotlight, (err) => {
				if (err) {
					console.log(
						"There was an error updating the spotlight",
						err
					);
				} else {
					windowRef.sendMessage(
						{ cameras: newCameras },
						`${window.location.origin}/map-app/#/spotlight`
					);
				}
			});
		}
		return () => {};
	}, [geometry, windowRef]);

	const styles = {
		chip: {
			backgroundColor: strokeColor,
			...(dir === "ltr" && { marginRight: 8 }),
			...(dir === "rtl" && { marginLeft: 8 })
		}
	};

	return (
		<Chip
			label={getTranslation(
				"global.map.tools.spotlightTool.spotlightChip.spotlight",
				index + 1
			)}
			style={styles.chip}
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
