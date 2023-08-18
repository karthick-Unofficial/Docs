import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

import { Button, Input } from "@mui/material";

import { Link } from "react-router-dom";
import { Translate, getTranslation } from "orion-components/i18n";
import { useSelector } from "react-redux";

const Forgot = () => {

	const { errorMessage, onForgotClick, resetError } = useOutletContext();
	const navigate = useNavigate();

	//translations here initiates component rerender on successful translations updates.
	const translations = useSelector(state => state.i18n.translations);

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
		width: "calc(100% - 4rem)",
		paddingTop: "10px",
		paddingBottom: "15px",
		fontSize: 16,
		color: "white"
	};

	const buttonStyles = {
		height: "50px",
		color: "#fff",
		fontSize: "16px",
		fontWeight: "bold",
		lineHeight: "50px"
	};


	return (
		<div>
			<div className="fields-outer-wrapper">
				<span className="text">
					<Translate value="login.recoveryText" />
				</span>
				<div className="forgot fields-wrapper">
					<Input
						id="forgotField"
						type="text"
						placeholder={getTranslation("login.emailAddress")}
						autoFocus={true}
						disableUnderline={true}
						onChange={handleUsernameChange}
						onKeyDown={handleKeyDownSubmit}
						value={usernameValue}
						style={inputStyles}
						className="text-field"

					/>
				</div>
				<Link to="/login" className="forgot-password-link">
					<Translate value="login.backToLogin" />
				</Link>
			</div>
			{errMessage && (
				<p className="error-message">{errMessage}</p>
			)}
			<Button
				fullWidth={true}
				style={buttonStyles}
				onClick={event => handleClick(event)}
			>

				<Translate value="login.sendButton" />

			</Button>

		</div >
	);

};

export default Forgot;