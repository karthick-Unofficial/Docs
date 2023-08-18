import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";

import { Link } from "react-router-dom";
import { Translate, getTranslation } from "orion-components/i18n/I18nContainer";

const Forgot = () => {

	const { errorMessage, onForgotClick, resetError } = useOutletContext();
	const navigate = useNavigate();

	const [usernameValue, setUsernameValue] = useState("");
	const [errMessage, setErrMessage] = useState(errorMessage || "");

	useEffect(() => {
		return () => { resetError(); };
	}, []);

	useEffect(() => {
		setErrMessage(errorMessage);
	}, [errorMessage]);

	const handleUsernameChange = e => {
		setUsernameValue(e.target.value);
	};

	const handleClick = event => {
		if (usernameValue === "") {
			setErrMessage(getTranslation("login.forgotErrText"));
			return;
		}

		setErrMessage("");

		onForgotClick(usernameValue, navigate);
	};

	const handleKeyDownSubmit = e => {
		if (e.keyCode === 13) {
			handleClick();
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
				<span className="text">
					<Translate value="login.recoveryText" />
				</span>
				<div className="forgot fields-wrapper">
					<TextField
						type="text"
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
			{errMessage && (
				<p className="error-message">{errMessage}</p>
			)}
			<RaisedButton
				label={<Translate value="login.sendButton" />}
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