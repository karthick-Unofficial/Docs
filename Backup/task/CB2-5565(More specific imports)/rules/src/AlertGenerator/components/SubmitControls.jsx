import React from "react";
import { Button } from "@mui/material";
import { Translate } from "orion-components/i18n";
import { useStyles } from "../../shared/styles/overrides";

const SubmitControls = ({ isValidActivity, resetForm, handleGenerateAlert, dir }) => {
	const classes = useStyles();

	const styles = {
		cancel: {
			color: "#B5B9BE",
			...(dir === "rtl" && { marginLeft: "12px" }),
			...(dir === "ltr" && { marginRight: "12px" }),
			"&:hover": {
				backgroundColor: "rgba(255, 255, 255, 0.08)"
			}
		},
		reset: {
			...(dir === "rtl" && { marginLeft: 12 }),
			...(dir === "ltr" && { marginRight: 12 })
		}
	};

	return (
		<div className="buttons">
			<Button
				variant="text"
				style={styles.reset}
				onClick={resetForm}
				sx={styles.cancel}
			>
				<Translate value="alertGenerator.submitControls.reset" />
			</Button>
			<Button
				variant="contained"
				onClick={handleGenerateAlert}
				disabled={!isValidActivity}
				style={{
					color: "#fff"
				}}
				classes={{
					disabled: classes.disabled
				}}
			>
				<Translate value="alertGenerator.submitControls.generate" />
			</Button>
		</div>
	);
};

export default SubmitControls;