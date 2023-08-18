import React, { useEffect, useState } from "react";

import { TextField, Button, Input } from "@mui/material";


import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

import { authService } from "client-app-core";
import { Translate, getTranslation } from "orion-components/i18n";

const Reset = ({ errorMessage }) => {

	const navigate = useNavigate();
	const { token } = useParams();

	const [passwordValue, setPasswordValue] = useState("");
	const [passwordConfirmValue, setPasswordConfirmValue] = useState("");
	const [errorMsg, setErrorMsg] = useState(errorMessage || null);
	const [verified, setVerified] = useState(false);
	const [done, setDone] = useState(false);

	useEffect(() => {
		authService.verifyReset(token, (err, response) => {
			if (err) {
				console.log(err);
				navigate("/login/invalid-reset");
			}
			else {
				setVerified(true);
			}
		});
	}, []);

	useEffect(() => {
		if (errorMsg) {
			setErrorMsg(errorMsg);
		}
	}, [errorMsg]);

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
			setErrorMsg(<Translate value="login.errorMessage.bothPassText" />);
			return;
		}


		authService.resetPassword(passwordValue, token, (err, response) => {
			if (err) {
				console.log(err);
			}
			else {
				if (response.success) {
					setDone(true);
					setErrorMsg("");
					window.setTimeout(() => navigate("/login"), 2000);
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
		width: "calc(100% - 4rem)",
		paddingTop: "10px",
		paddingBottom: "15px",
		fontSize: 16,
		color: "white"
	};



	const buttonStyles = {
		paddingTop: "10px",
		paddingBottom: "15px",
		fontSize: 16,
		color: "white"

	};


	return (
		<div className='reset-container'>
			{verified && !done &&
				<div>
					<div className='fields-outer-wrapper'>
						<span className='text'><Translate value="login.Reset.title" /></span>
						<div className='forgot fields-wrapper'>
							<Input
								type='password'
								value={passwordValue}
								placeholder={getTranslation("login.hintText.newPass")}
								autoFocus={true}
								disableUnderline={true}
								onChange={handlePasswordChange}
								onKeyDown={handleKeyDownSubmit}								
								style={inputStyles}
								className="text-field"

							/>
							<hr />
							<Input
								type='password'
								value={passwordConfirmValue}
								placeholder={getTranslation("login.hintText.confirmPass")}
								autoFocus={true}
								disableUnderline={true}
								onChange={handlePasswordConfirmChange}
								onKeyDown={handleKeyDownSubmit}
								style={inputStyles}
								className="text-field"

							/>
						</div>
					</div>
					{errorMsg && (
						<p className="error-message">{errorMsg}</p>
					)}
					<Button
						fullWidth={true}
						style={buttonStyles}
						onClick={event => handleClick(event)}
					>
						{getTranslation("login.Reset.changePassBtn")}

					</Button>
				</div>
			}
			{
				done &&
				<div>
					<div className='fields-outer-wrapper'>
						<span className='text'><Translate value="login.Reset.successMsg" /></span>
						<div className='forgot fields-wrapper'>
						</div>
					</div>
				</div>
			}
		</div >
	);


};

export default Reset;
