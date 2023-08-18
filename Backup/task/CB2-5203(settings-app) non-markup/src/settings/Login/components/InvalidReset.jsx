import React, { Component } from "react";

import { browserHistory } from "react-router";
import {Translate} from "orion-components/i18n/I18nContainer";

class InvalidReset extends Component {

	componentDidMount () {
		window.setTimeout(() => browserHistory.push("/login"), 3000);
	}

	render() {

		return (
			<div className='login-app app'>
				<div className='invalid-reset-wrapper'>
					<h2 className='invalid-reset-message'><Translate value="login.expiredText"/></h2>
				</div>
			</div>
		);
	}
}

export default InvalidReset;
