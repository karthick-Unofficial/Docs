import React from "react";
import Button from "@material-ui/core/Button";
import { Translate } from "orion-components/i18n";

const SubmitControls = ({ isValidActivity, resetForm, handleGenerateAlert, dir }) => {

	return (
		<div className="buttons">
			<Button
				variant="text"
				style={dir == "rtl" ? {
					marginLeft: 12
				} : {
					marginRight: 12
				}}
				onClick={resetForm}
			>
				<Translate value="alertGenerator.submitControls.reset" />
			</Button>
			{isValidActivity ?
				<Button
					variant="contained"
					onClick={handleGenerateAlert}
					style={{
						backgroundColor: "#35b7f3",
						color: "#fff"
					}}
				>
					<Translate value="alertGenerator.submitControls.generate" />
				</Button>
				:
				<Button
					variant="contained"
					onClick={handleGenerateAlert}
					disabled={!isValidActivity}
					style={{
						color: "#fff"
					}}
				>
					<Translate value="alertGenerator.submitControls.generate" />
				</Button>
			}
		</div>
	);
};

export default SubmitControls;