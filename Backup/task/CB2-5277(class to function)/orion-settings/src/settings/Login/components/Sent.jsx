import React, { Component } from "react";

import { Link } from "react-router";
import { Translate } from "orion-components/i18n/I18nContainer";

const Sent = () => {

	return (
		<div className='reset-container'>
			<div>
				<div className='fields-outer-wrapper'>
					<span className='text' >
						<Translate value="login.sentText" /><br />
						<Translate value="login.click" /><Link className='login-link' to='/login'><Translate value="login.here" /></Link> <Translate value="login.toReturn" />
					</span>
				</div>
			</div>
		</div>
	);
};

export default Sent;