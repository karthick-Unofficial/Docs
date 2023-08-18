import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TextField, Button } from "@mui/material";


import { useNavigate } from "react-router-dom";

import { authService } from "client-app-core";
import { Translate, getTranslation } from "orion-components/i18n";

const SetInitialPassword = ({ errorMessage }) => {

	const navigate = useNavigate();
	const { token } = useParams();

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
		<div className="reset-container">
			{verified &&
				!done && (
					<div>
						<div className="fields-outer-wrapper">
							<span className="text">
								<Translate value="login.setInitial.title" />
							</span>
							<div className="forgot fields-wrapper">
								<TextField
									variant="standard"
									type="password"
									value={passwordValue}
									onChange={handlePasswordChange}
									onKeyDown={handleKeyDownSubmit}
									style={inputStyles}
									inputStyle={textStyles}
									underlineStyle={underlineStyles}
									underlineShow={false}
									hintStyle={floatingLabelStyle}
									hintText={getTranslation("login.hintText.newPass")}
									className="text-field"
									autoFocus={true}
								/>
								<hr />
								<TextField
									variant="standard"
									type="password"
									value={passwordConfirmValue}
									onChange={handlePasswordConfirmChange}
									onKeyDown={handleKeyDownSubmit}
									style={inputStyles}
									inputStyle={textStyles}
									underlineStyle={underlineStyles}
									underlineShow={false}
									hintStyle={floatingLabelStyle}
									hintText={getTranslation("login.hintText.confirmPass")}
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