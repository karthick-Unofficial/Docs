import React, { Component } from "react";

import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";

import { Link } from "react-router";
import {Translate, getTranslation} from "orion-components/i18n/I18nContainer";

export default class Forgot extends Component {
	constructor(props) {
		super(props);

		this.state = {
			usernameValue: "",
			errorMessage: ""
		};
	}

	componentDidUpdate(prevProps) {
		const { errorMessage } = this.props;
		if (this.state.errorMessage !== errorMessage) {
			this.setState({
				errorMessage: errorMessage
			});
		}
	}

	componentWillUnmount() {
		const { resetError } = this.props;
		resetError();
	}

	render() {
		const inputStyles = {
			width: "calc(100% - 4rem)"
		};

		const textStyles = {
			paddingBottom: "8px",
			fontSize: 16,
			color: "white"
		};

		const floatingLabelStyle = {
			color: "rgba(255, 255, 255, 0.3)"
		};

		const buttonStyles = {
			height: "50px"
		};

		const labelStyles = {
			fontSize: "16px",
			fontWeight: "bold",
			lineHeight: "50px"
		};

		const underlineStyles = {
			borderColor: "rgba(255,255,255, 0.1)",
			backgroundColor: "#5ebef3"
		};

		return (
			<div>
				<div className="fields-outer-wrapper">
					<span className="text">
						<Translate value="login.recoveryText"/>
					</span>
					<div className="forgot fields-wrapper">
						<TextField
							type="text"
							ref="username"
							value={this.state.usernameValue}
							onChange={this.handleUsernameChange}
							onKeyDown={this.handleKeyDownSubmit}
							style={inputStyles}
							inputStyle={textStyles}
							underlineDisabledStyle={underlineStyles}
							underlineStyle={underlineStyles}
							underlineShow={false}
							hintStyle={floatingLabelStyle}
							hintText={getTranslation("login.emailAddress")}
							className="text-field"
							autoFocus={true}
						/>
					</div>
					<Link to="/login" className="forgot-password-link">
						<Translate value="login.backToLogin"/>
					</Link>
				</div>
				{this.state.errorMessage && (
					<p className="error-message">{this.state.errorMessage}</p>
				)}
				<RaisedButton
					label={getTranslation("login.sendButton")}
					primary={true}
					fullWidth={true}
					style={buttonStyles}
					labelStyle={labelStyles}
					onClick={event => this.handleClick(event)}
				/>
			</div>
		);
	}

	handleUsernameChange = e => {
		this.setState({
			usernameValue: e.target.value
		});
	};

	handleClick = event => {
		if (this.state.usernameValue === "") {
			this.setState({
				errorMessage: getTranslation("login.forgotErrText")
			});
			return;
		}

		this.setState({
			errorMessage: ""
		});

		this.props.onForgotClick(this.state.usernameValue);
	};

	handleKeyDownSubmit = e => {
		if (e.keyCode === 13) {
			this.handleClick();
		}
	};
}
