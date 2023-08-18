import React, { Component } from "react";

import { Link } from "react-router";

import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";
import Divider from "material-ui/Divider";

import {Translate, getTranslation} from "orion-components/i18n/I18nContainer";

export default class LoginForm extends Component {
	constructor(props) {
		super(props);

		this.state = {
			usernameValue: "",
			passwordValue: "",
			errorMessage: this.props.errorMessage || ""
		};
		this.handleUsernameChange = this.handleUsernameChange.bind(this);
		this.handlePasswordChange = this.handlePasswordChange.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.handleUsernameKeyDown = this.handleUsernameKeyDown.bind(this);
		this.handlePasswordKeyDown = this.handlePasswordKeyDown.bind(this);
	}

	componentDidUpdate(prevProps) {
		const { errorMessage } = this.props;
		if (prevProps.errorMessage !== errorMessage) {
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
		const { errorMessage } = this.state;
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
					<div className="fields-wrapper">
						<TextField
							type="text"
							ref="username"
							value={this.state.usernameValue}
							onChange={this.handleUsernameChange}
							onKeyDown={this.handleUsernameKeyDown}
							style={inputStyles}
							inputStyle={textStyles}
							underlineDisabledStyle={underlineStyles}
							underlineStyle={underlineStyles}
							underlineShow={false}
							hintStyle={floatingLabelStyle}
							hintText={getTranslation("login.emailHintText")}
							className="text-field"
							autoFocus={true}
						/>
						<hr />
						<TextField
							type="password"
							ref="password"
							value={this.state.passwordValue}
							onChange={this.handlePasswordChange}
							onKeyDown={this.handlePasswordKeyDown}
							style={inputStyles}
							inputStyle={textStyles}
							underlineStyle={underlineStyles}
							underlineShow={false}
							hintStyle={floatingLabelStyle}
							hintText={getTranslation("login.passwordHintText")}
							className="text-field"
						/>
					</div>
					<Link to="/login/forgot-password" className="forgot-password-link">
						<Translate value="login.forgotPassword"/>
					</Link>
				</div>
				{errorMessage && <p className="error-message">{errorMessage}</p>}
				<RaisedButton
					label={getTranslation("login.loginButton")}
					primary={true}
					fullWidth={true}
					style={buttonStyles}
					labelStyle={labelStyles}
					onClick={event => this.handleClick(event)}
				/>
			</div>
		);
	}

	handleUsernameChange(e) {
		this.setState({
			usernameValue: e.target.value
		});
	}

	handlePasswordChange(e) {
		this.setState({
			passwordValue: e.target.value
		});
	}

	handleClick(event) {
		if (this.state.usernameValue === "") {
			this.setState({
				errorMessage: getTranslation("login.errorMessage.emptyUser")
			});
			return;
		}

		if (this.state.passwordValue === "") {
			this.setState({
				errorMessage: getTranslation("login.errorMessage.emptyPassword")
			});
			return;
		}

		this.setState({
			errorMessage: ""
		});
		const creds = {
			username: this.state.usernameValue,
			password: this.state.passwordValue
		};
		this.props.onLoginClick(creds);
	}

	handleUsernameKeyDown(e) {
		if (e.keyCode === 13) {
			if (this.state.usernameValue !== "") {
				if (this.state.passwordValue === "") {
					// -- move cursor to password field
					this.refs.password.focus();
				}
				else if (this.state.passwordValue !== "") {
					// -- submit login
					this.handleClick();
				}
			}
		}
	}

	handlePasswordKeyDown(e) {
		if (e.keyCode === 13) {
			if (this.state.usernameValue !== "") {
				// -- submit login
				this.handleClick();
			}
		}
	}
}
