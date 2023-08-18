import React, { useEffect, useState, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { Link } from "react-router-dom";

import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";
import Divider from "material-ui/Divider";

import {Translate, getTranslation} from "orion-components/i18n/I18nContainer";

const LoginForm = () => {

	const { errorMessage, onLoginClick, resetError } = useOutletContext();

	const usernamRef = useRef();
	const passwordRef = useRef();

	const [usernameValue, setUsernameValue] = useState("");
	const [passwordValue, setPasswordValue] = useState("");
	const [errMessage, setErrMessage] = useState(errorMessage || "");

	useEffect(() => {
		return () => {
			resetError();
		};
	}, []);

	useEffect(() => {
		setErrMessage(errorMessage);
	}, [errorMessage]);

	const handleUsernameChange = (e) => {
		setUsernameValue(e.target.value);
	};

	const handlePasswordChange = (e) => {
		setPasswordValue(e.target.value);
	};

	const handleClick = (event) => {
		if (usernameValue === "") {
			setErrMessage(getTranslation("login.errorMessage.emptyUser"));
			return;
		}

		if (passwordValue === "") {
			setErrMessage(getTranslation("login.errorMessage.emptyPassword"));
			return;
		}

		setErrMessage("");
		const creds = {
			username: usernameValue,
			password: passwordValue
		};
		onLoginClick(creds);
	};

	const handleUsernameKeyDown = (e) => {
		if (e.keyCode === 13) {
			if (usernameValue !== "") {
				if (passwordValue === "") {
					// -- move cursor to password field
					passwordRef.current.focus();
				}
				else if (passwordValue !== "") {
					// -- submit login
					handleClick();
				}
			}
		}
	};

	const handlePasswordKeyDown = (e) => {
		if (e.keyCode === 13) {
			if (usernameValue !== "") {
				// -- submit login
				handleClick();
			}
		}
	};


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
						ref={usernamRef}
						value={usernameValue}
						onChange={handleUsernameChange}
						onKeyDown={handleUsernameKeyDown}
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
						ref={passwordRef}
						value={passwordValue}
						onChange={handlePasswordChange}
						onKeyDown={handlePasswordKeyDown}
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
			{errMessage && <p className="error-message">{errMessage}</p>}
			<RaisedButton
				label={getTranslation("login.loginButton")}
				primary={true}
				fullWidth={true}
				style={buttonStyles}
				labelStyle={labelStyles}
				onClick={event => handleClick(event)}
			/>
		</div>
	);

};

export default LoginForm;