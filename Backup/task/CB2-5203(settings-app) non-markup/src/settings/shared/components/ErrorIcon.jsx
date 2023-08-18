import React, { Component } from "react";
import {Translate} from "orion-components/i18n/I18nContainer";


class ErrorIcon extends Component {

	constructor(props) {
		super(props);

		this.state = {
			hovered: false
		};
	}

	handleMouse = () => {
		this.setState({
			hovered: !this.state.hovered
		});
	}

	render () {
		return (
			<div>
				<div className='hover-error'>
                	<Translate value="mainContent.shared.errorIcon.errorText"/>
				</div>
				<i 
					className='material-icons saved-message error'
					onMouseEnter={this.handleMouse}
					onMouseLeave={this.handleMouse}>error</i> 
			</div>
		);
	}
}

export default ErrorIcon;