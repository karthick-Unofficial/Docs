import React, { useState, useEffect, useRef } from "react";

import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";

import { Link } from "react-router";
import { Translate, getTranslation } from "orion-components/i18n/I18nContainer";

const Forgot = ({ onForgotClick, errorMessage, resetError }) => {
	const [usernameValue, setUsernameValue] = useState("");
	const [errorMsg, setErrorMsg] = useState(errorMessage || "");
	const username = useRef(null);

	useEffect(() => {
		if (errorMsg !== errorMessage) {
			setErrorMsg(errorMessage);
		}
	}, [errorMessage]);

	useEffect(() => {
		return () => {
			resetError();
		};
	}, []);

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

	const handleUsernameChange = e => {
		setUsernameValue(e.target.value);
	};

	const handleClick = event => {
		if (usernameValue === "") {
			setErrorMsg(getTranslation("login.forgotErrText"));
			return;
		}

		setErrorMsg("");

		onForgotClick(usernameValue);
	};

	const handleKeyDownSubmit = e => {
		if (e.keyCode === 13) {
			handleClick();
		}
	};

	return (
		<div>
			<div className="fields-outer-wrapper">
				<span className="text">
					<Translate value="login.recoveryText" />
				</span>
				<div className="forgot fields-wrapper">
					<TextField
						type="text"
						ref={username}
						value={usernameValue}
						onChange={handleUsernameChange}
						onKeyDown={handleKeyDownSubmit}
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
					<Translate value="login.backToLogin" />
				</Link>
			</div>
			{errorMsg && (
				<p className="error-message">{errorMsg}</p>
			)}
			<RaisedButton
				label={getTranslation("login.sendButton")}
				primary={true}
				fullWidth={true}
				style={buttonStyles}
				labelStyle={labelStyles}
				onClick={event => handleClick(event)}
			/>
		</div>
	);
};

export default Forgot;
