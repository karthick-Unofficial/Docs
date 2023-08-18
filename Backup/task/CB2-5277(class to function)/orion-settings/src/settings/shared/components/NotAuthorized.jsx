import React from "react";

import { browserHistory } from "react-router";
import {Translate, getTranslation} from "orion-components/i18n/I18nContainer";

// Material UI
import FlatButton from "material-ui/FlatButton";
import Divider from "material-ui/Divider";

const NotAuthorized = () => {
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
				<h2><Translate value="mainContent.shared.notAuthorized.title"/></h2>
				<h4>
					<Translate value="mainContent.shared.notAuthorized.titleText"/>
				</h4>
				<Divider />
				<FlatButton
					onClick={browserHistory.goBack}
					label={getTranslation("mainContent.shared.notAuthorized.backBtn")}
					style={flatButtonStyles}
				/>
			</div>
		</div>
	);
};

export default NotAuthorized;
