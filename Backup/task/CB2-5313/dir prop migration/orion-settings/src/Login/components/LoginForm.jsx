import React, { useEffect, useState, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button, Input } from "@mui/material";
import { Translate, getTranslation } from "orion-components/i18n";

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
				<div className="fields-wrapper">
					<Input
						id="name"
						type="text"
						placeholder={getTranslation("login.emailHintText")}
						autoFocus={true}
						disableUnderline={true}
						onChange={handleUsernameChange}
						onKeyDown={handleUsernameKeyDown}
						value={usernameValue}
						ref={usernamRef}
						style={inputStyles}
						className="text-field"

					/>
					<hr />
					<Input
						id="password"
						type="password"
						ref={passwordRef}
						value={passwordValue}
						disableUnderline={true}
						onChange={handlePasswordChange}
						onKeyDown={handlePasswordKeyDown}
						style={inputStyles}
						className="text-field"
						placeholder={getTranslation("login.passwordHintText")}

					/>
					{/*<TextField																							
												
						hintStyle={floatingLabelStyle}						
						
												
					/>*/}


				</div>
				<Link to="/login/forgot-password" className="forgot-password-link">
					<Translate value="login.forgotPassword" />
				</Link>
			</div>
			{errMessage && <p className="error-message">{errMessage}</p>}
			<Button
				fullWidth={true}
				style={buttonStyles}
				onClick={event => handleClick(event)}
			>

				{getTranslation("login.loginButton")}

			</Button>
		</div>
	);

};

export default LoginForm;