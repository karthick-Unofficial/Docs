import React from "react";

import { useNavigate } from "react-router-dom";

// Material UI
import { Button, Divider } from "@mui/material";

import { Translate, getTranslation } from "orion-components/i18n";

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
				<h2><Translate value="components.notFound.errorMessage" /></h2>
				<h4><Translate value="components.notFound.pageError" /></h4>
				<Divider />
				<Button
					onTouchTap={navigate(-1)}
					color="primary"
					style={flatButtonStyles}
					variant="text"
				>
					{getTranslation("components.notFound.goBack")}
				</Button>
			</div>
		</div>
	);
};

export default NotFound;