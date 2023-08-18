import React from "react";

import { useNavigate } from "react-router-dom";
import { Translate } from "orion-components/i18n";

// Material UI

import { Divider, Button } from "@mui/material";

const NotFound = () => {

	const navigate = useNavigate();

	const flatButtonStyles = {
		color: "#29B6F6",
		height: "42px",
		fontSize: "1.5em",
		fontFamily: "Roboto",
		marginTop: "2rem"
	};

	return (
		<div className="not-found-wrapper">
			<div className="not-found-message">
				<h2><Translate value="mainContent.shared.notFound.title" /></h2>
				<h4>
					<Translate value="mainContent.shared.notFound.titleText" />
				</h4>
				<Divider />
				<Button
					onClick={navigate(-1)}
					style={flatButtonStyles}
				><Translate value="mainContent.shared.notFound.backBtn" />
				</Button>
			</div>
		</div>
	);
};

export default NotFound;
