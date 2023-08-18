import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Input, Button } from "@mui/material";


import { useNavigate } from "react-router-dom";

import { authService } from "client-app-core";
import { Translate, getTranslation } from "orion-components/i18n";
import { useSelector } from "react-redux";

const SetInitialPassword = ({ errorMessage }) => {

	const navigate = useNavigate();
	const { token } = useParams();

	// helps to render latest translations
	const translations = useSelector(state => state.i18n.translations);

	const [passwordValue, setPasswordValue] = useState("");
	const [passwordConfirmValue, setPasswordConfirmValue] = useState("");
	const [errorMsg, setErrorMsg] = useState(errorMessage || null);
	const [verified, setVerified] = useState(false);
	const [done, setDone] = useState(false);

	useEffect(() => {
		authService.verifySetInitialPassword(
			token,
			(err, response) => {
				if (err) {
					console.log(err);
					navigate("/login/invalid-reset");
				} else {
					setVerified(true);
				}
			}
		);
	}, []);

	useEffect(() => {
		if (errorMessage) {
			setErrorMsg(errorMessage);
		}
	}, [errorMessage]);

	const handlePasswordChange = e => {
		setPasswordValue(e.target.value);
	};

	const handlePasswordConfirmChange = e => {
		setPasswordConfirmValue(e.target.value);
	};

	const handleKeyDownSubmit = e => {
		if (e.keyCode === 13) {
			handleClick();
		}
	};

	const handleClick = () => {
		if (passwordValue !== passwordConfirmValue) {
			setErrorMsg(getTranslation("login.errorMessage.bothPassText"));
			return;
		}

		authService.setInitialPassword(
			passwordValue,
			token,
			(err, response) => {
				if (err) {
					console.log(err);
				} else {
					if (response.success) {
						setDone(true);
						setErrorMsg("");
						window.setTimeout(() => navigate("/login"), 2000);
					} else {
						setErrorMsg(response.reason.message);
					}

				}
			}
		);
	};

	const validPassword =
		passwordValue.length >= 5 && passwordConfirmValue === passwordValue;

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

	const labelStyles = {
		fontSize: "16px",
		fontWeight: "bold",
		lineHeight: "50px"
	};

	return (
		<div className="reset-container">
			{verified &&
				!done && (
				<div>
					<div className="fields-outer-wrapper">
						<span className="text">
							<Translate value="login.setInitial.title" />
						</span>
						<div className="forgot fields-wrapper">
							<Input
								id="newPass"
								type="password"
								placeholder={getTranslation("login.hintText.newPass")}
								autoFocus={true}
								disableUnderline={true}
								onChange={handlePasswordChange}
								onKeyDown={handleKeyDownSubmit}
								value={passwordValue}
								style={inputStyles}
								className="text-field"

							/>
							<hr />
							<Input
								id="confirmPass"
								type="password"
								placeholder={getTranslation("login.hintText.confirmPass")}
								autoFocus={true}
								disableUnderline={true}
								onChange={handlePasswordConfirmChange}
								onKeyDown={handleKeyDownSubmit}
								value={passwordConfirmValue}
								style={inputStyles}
								className="text-field"
							/>
						</div>
					</div>
					{errorMsg && (
						<p className="error-message">{errorMsg}</p>
					)}
					<Button
						disabled={!validPassword}
						fullWidth={true}
						style={buttonStyles}
						onClick={event => handleClick(event)}
					>
						<div style={labelStyles}>
							{getTranslation("login.setInitial.setPassBtn")}
						</div>
					</Button>
				</div>
			)}
			{done && (
				<div>
					<div className="fields-outer-wrapper">
						<span className="text">
							<Translate value="login.setInitial.successMsg" />
						</span>
						<div className="forgot fields-wrapper" />
					</div>
				</div>
			)}
		</div>
	);
};

export default SetInitialPassword;