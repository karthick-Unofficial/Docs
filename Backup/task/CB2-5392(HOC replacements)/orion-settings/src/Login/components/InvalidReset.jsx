import React, { useEffect } from "react";

import { useNavigate } from "react-router-dom";
import {Translate} from "orion-components/i18n/I18nContainer";

const InvalidReset = () => {

	const navigate = useNavigate();

	useEffect(() => {
		window.setTimeout(() => navigate("/login"), 3000);
	}, []);

	return (
		<div className='login-app app'>
			<div className='invalid-reset-wrapper'>
				<h2 className='invalid-reset-message'><Translate value="login.expiredText"/></h2>
			</div>
		</div>
	);
};

export default InvalidReset;
