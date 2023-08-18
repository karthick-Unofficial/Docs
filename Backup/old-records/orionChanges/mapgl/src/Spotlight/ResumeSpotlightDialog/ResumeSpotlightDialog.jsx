import React, { useState, useEffect } from "react";
import { Dialog as CBDialog } from "orion-components/CBComponents";
import { Chip } from "@material-ui/core";
import { Translate } from "orion-components/i18n/I18nContainer";

const ResumeSpotlightDialog = ({
	dialogOpen,
	dialogData,
	deleteSpotlightSessions,
	closeDialog,
	restartSpotlight,
	dir
}) => {
	const [spotlights, setSpotlights] = useState([]);
	const [disabledSpotlights, setDisabledSpotlights] = useState([]);

	useEffect(() => {
		if (dialogData && dialogData.activeSpotlights) {
			setSpotlights(dialogData.activeSpotlights);
		}
	}, [dialogData]);

	const handleSpotlightClick = (spotlight) => {
		setDisabledSpotlights([...disabledSpotlights, spotlight.id]);
		restartSpotlight(spotlight);
	};

	const handleClose = () => {
		const spotlightIds = spotlights.map(spot => spot.id);
		const spotlightIdsToDelete = spotlightIds.filter(id => {
			return !disabledSpotlights.includes(id);
		});

		if (spotlightIdsToDelete.length) {
			deleteSpotlightSessions(spotlightIdsToDelete);
		}
		
		closeDialog("resumeSpotlightDialog");
	};

	return (
		<CBDialog
			open={dialogOpen}
			title={<Translate value="spotLight.resumeSpotlightDialog.title"/>}
			textContent={<Translate value="spotLight.resumeSpotlightDialog.textContent"/>}
			abort={{ label: <Translate value="spotLight.resumeSpotlightDialog.close"/>, action: handleClose }}
			dir={dir}
		>
			<div style={{width: "100%", display: "flex", flexWrap: "nowrap", justifyContent: "space-evenly", marginTop: "15px"}}>
				{spotlights.map((spotlight, index) => {
					const isClickable = !disabledSpotlights.includes(spotlight.id);
					return <Chip
						label={<Translate value="spotLight.resumeSpotlightDialog.spotlight" count={index + 1}/>}
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
