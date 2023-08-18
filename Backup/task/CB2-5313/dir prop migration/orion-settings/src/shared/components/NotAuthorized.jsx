import React from "react";

import { useNavigate } from "react-router-dom";
import { Translate } from "orion-components/i18n";

// Material UI
import { Divider, Button } from "@mui/material";

const NotAuthorized = () => {
	const flatButtonStyles = {
		color: "#29B6F6",
		height: "42px",
		fontSize: "1.5em",
		fontFamily: "Roboto",
		marginTop: "2rem"
	};

	const navigate = useNavigate();

	return (
		<div className="not-found-wrapper">
			<div className="not-found-message">
				<h2><Translate value="mainContent.shared.notAuthorized.title" /></h2>
				<h4>
					<Translate value="mainContent.shared.notAuthorized.titleText" />
				</h4>
				<Divider />
				<Button
					onClick={navigate(-1)}
					style={flatButtonStyles}
				>
					<Translate value="mainContent.shared.notAuthorized.backBtn" />
				</Button>
			</div>
		</div>
	);
};

export default NotAuthorized;
