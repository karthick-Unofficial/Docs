import React, { useState, useEffect } from "react";
import { Dialog as CBDialog } from "orion-components/CBComponents";
import { Chip } from "@mui/material";
import { getTranslation } from "orion-components/i18n";
import { getDir } from "orion-components/i18n/Config/selector";
import { deleteSpotlightSessions, closeDialog, restartSpotlight } from "./resumeSpotlightActions";
import { useDispatch, useSelector } from "react-redux";

const ResumeSpotlightDialog = () => {

	const dispatch = useDispatch();

	const dialogOpen = useSelector(state => state.appState.dialog.openDialog === "resumeSpotlightDialog");
	const dialogData = useSelector(state => state.appState.dialog.dialogData);
	const dir = useSelector(state => getDir(state));


	const [spotlights, setSpotlights] = useState([]);
	const [disabledSpotlights, setDisabledSpotlights] = useState([]);

	useEffect(() => {
		if (dialogData && dialogData.activeSpotlights) {
			setSpotlights(dialogData.activeSpotlights);
		}
	}, [dialogData]);

	const handleSpotlightClick = (spotlight) => {
		setDisabledSpotlights([...disabledSpotlights, spotlight.id]);
		dispatch(restartSpotlight(spotlight));
	};

	const handleClose = () => {
		const spotlightIds = spotlights.map(spot => spot.id);
		const spotlightIdsToDelete = spotlightIds.filter(id => {
			return !disabledSpotlights.includes(id);
		});

		if (spotlightIdsToDelete.length) {
			dispatch(deleteSpotlightSessions(spotlightIdsToDelete));
		}

		dispatch(closeDialog("resumeSpotlightDialog"));
	};

	return (
		<CBDialog
			open={dialogOpen}
			title={getTranslation("spotLight.resumeSpotlightDialog.title")}
			textContent={getTranslation("spotLight.resumeSpotlightDialog.textContent")}
			abort={{ label: getTranslation("spotLight.resumeSpotlightDialog.close"), action: handleClose }}
			dir={dir}
		>
			<div style={{ width: "100%", display: "flex", flexWrap: "nowrap", justifyContent: "space-evenly", marginTop: "15px" }}>
				{spotlights.map((spotlight, index) => {
					const isClickable = !disabledSpotlights.includes(spotlight.id);
					return <Chip
						label={getTranslation("spotLight.resumeSpotlightDialog.spotlight", index + 1)}
						style={dir == "rtl" ? {
							backgroundColor: !isClickable ? "grey" : spotlight && spotlight.properties && spotlight.properties.strokeColor ? spotlight.properties.strokeColor : "grey",
							marginRight: 8
						} : {
							backgroundColor: !isClickable ? "grey" : spotlight && spotlight.properties && spotlight.properties.strokeColor ? spotlight.properties.strokeColor : "grey",
							marginLeft: 8
						}}
						onClick={() => handleSpotlightClick(spotlight)}
						clickable={isClickable}
					/>;
				})}
			</div>
		</CBDialog>
	);
};

export default ResumeSpotlightDialog;
