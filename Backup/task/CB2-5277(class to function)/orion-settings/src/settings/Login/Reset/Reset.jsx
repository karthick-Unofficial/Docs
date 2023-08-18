import React, { useEffect, useState, useRef } from "react";

import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";

import { browserHistory } from "react-router";

import { authService } from "client-app-core";
import { Translate, getTranslation } from "orion-components/i18n/I18nContainer";

const Reset = ({ errorMessage, params }) => {
	const [passwordValue, setPasswordValue] = useState("");
	const [passwordConfirmValue, setPasswordConfirmValue] = useState("");
	const [errorMsg, setErrorMsg] = useState(errorMessage || null);
	const [verified, setVerified] = useState(false);
	const [done, setDone] = useState(false);
	const password = useRef(null);

	useEffect(() => {
		authService.verifyReset(params.token, (err, response) => {
			if (err) {
				console.log(err);
				browserHistory.push("/login/invalid-reset");
			}
			else {
				setVerified(true);
			}
		});
	}, []);

	useEffect(() => {
		setErrorMsg(errorMessage);
	}, [errorMessage]);

	const handlePasswordChange = (e) => {
		setPasswordValue(e.target.value);
	};

	const handlePasswordConfirmChange = (e) => {
		setPasswordConfirmValue(e.target.value);
	};

	const handleKeyDownSubmit = (e) => {
		if (e.keyCode === 13) {
			handleClick();
		}
	};

	const handleClick = () => {

		if (passwordValue !== passwordConfirmValue) {
			setErrorMsg(getTranslation("login.errorMessage.bothPassText"));
			return;
		}


		authService.resetPassword(passwordValue, params.token, (err, response) => {
			if (err) {
				console.log(err);
			}
			else {
				if (response.success) {
					setErrorMsg("");
					setDone(true);
					window.setTimeout(() => browserHistory.push("/login"), 2000);
				}
				// Validation reset error
				else if (response.err) {
					setErrorMsg(response.err.message);
				}
				// Password restriction error
				else if (response.reason) {
					setErrorMsg(response.reason.message);
				}
			}
		});
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
		<div className='reset-container'>
			{verified && !done &&
				<div>
					<div className='fields-outer-wrapper'>
						<span className='text'><Translate value="login.Reset.title" /></span>
						<div className='forgot fields-wrapper'>
							<TextField
								type='password'
								ref={password}
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
							/>
							<hr />
							<TextField
								type='password'
								ref={password}
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
					<RaisedButton
						label={getTranslation("login.Reset.changePassBtn")}
						primary={true}
						fullWidth={true}
						style={buttonStyles}
						labelStyle={labelStyles}
						onClick={(event) => handleClick(event)} />

				</div>
			}
			{done &&
				<div>
					<div className='fields-outer-wrapper'>
						<span className='text'><Translate value="login.Reset.successMsg" /></span>
						<div className='forgot fields-wrapper'>
						</div>
					</div>
				</div>
			}
		</div>
	);
};

export default Reset;