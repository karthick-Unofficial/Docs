import React, { Component } from "react";

// Material UI
import FlatButton from "material-ui/FlatButton";
import CircularProgress from "material-ui/CircularProgress";

// components
import InputField from "../shared/components/InputField";

// router
import { browserHistory } from "react-router";
import {getTranslation} from "orion-components/i18n/I18nContainer";

class ChangePassword extends Component {
	constructor(props) {
		super(props);

		this.state = {
			newPasswordValue: "",
			currentPasswordValue: "",
			displayErrors: false,
			fieldIsValid: {
				currentPassword: false,
				newPassword: false
			},
			errorMessage: ""
		};
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.passwordChangeError) {
			this.setState({
				errorMessage: nextProps.passwordChangeError
			});
		}
	}

	handleSubmit = e => {
		e.preventDefault();

		// If a field isn't valid on submit, set displayErrors flag and return
		for (const field in this.state.fieldIsValid) {
			if (!this.state.fieldIsValid[field]) {
				this.setState({
					displayErrors: true
				});
				return;
			}
		}

		if (this.state.newPasswordValue !== this.state.newPasswordConfirmValue) {
			this.setState({
				errorMessage: getTranslation("changePassword.errorMessage.notMatch")
			});
			return;
		}

		if (this.state.newPasswordValue === this.state.currentPasswordValue) {
			this.setState({
				errorMessage:  getTranslation("changePassword.errorMessage.chooseNew")
			});
			return;
		}

		this.setState({
			errorMessage: ""
		});
		this.props.onSubmit(
			this.props.userId,
			this.state.currentPasswordValue,
			this.state.newPasswordValue
		);
	};

	onCancel = () => {
		this.props.clearState();
		browserHistory.goBack();
	};

	updateValue = e => {
		this.setState({
			[e.target.name + "Value"]: e.target.value
		});
	};

	requiredValidate = e => {
		const value = e.target.value;
		let valid = true;

		if (value.length === 0) {
			valid = false;
		}

		this.setState({
			fieldIsValid: Object.assign({}, this.state.fieldIsValid, {
				[e.target.name]: valid
			})
		});
	};

	render() {
		const { isLoading } = this.props;

		const saveButtonStyles = {
			color: "white",
			height: "42px",
			width: "120px",
			fontSize: "1.5em",
			fontWeight: "bold"
		};

		const cancelButtonStyles = {
			color: "#29B6F6",
			height: "42px",
			width: "120px",
			fontSize: "1.5em",
			fontWeight: "bold"
		};

		return (
			<div className="password-change-wrapper">
				<form onSubmit={this.handleSubmit} autoComplete="off">
					<InputField
						name="currentPassword"
						type="password"
						className="password-input"
						isEmpty={this.state.currentPasswordValue ? false : true}
						isValid={this.state.fieldIsValid["currentPassword"]}
						placeholder={getTranslation("changePassword.formField.oldPass")}
						value={this.state.currentPasswordValue}
						updateValue={this.updateValue}
						validate={this.requiredValidate}
						emptyMessage={getTranslation("changePassword.errorMessage.required")}
						errorMessage=""
						displayErrors={this.state.displayErrors}
					/>
					<InputField
						name="newPassword"
						type="password"
						className="password-input"
						isEmpty={this.state.newPasswordValue ? false : true}
						isValid={this.state.fieldIsValid["newPassword"]}
						placeholder={getTranslation("changePassword.formField.newPass")}
						value={this.state.newPasswordValue}
						updateValue={this.updateValue}
						validate={this.requiredValidate}
						emptyMessage={getTranslation("changePassword.errorMessage.required")}
						errorMessage=""
						displayErrors={this.state.displayErrors}
					/>
					<InputField
						name="newPasswordConfirm"
						type="password"
						className="password-input"
						isEmpty={this.state.newPasswordConfirmValue ? false : true}
						isValid={this.state.fieldIsValid["newPasswordConfirm"]}
						placeholder={getTranslation("changePassword.formField.confirmPass")}
						value={this.state.newPasswordConfirmValue}
						updateValue={this.updateValue}
						validate={this.requiredValidate}
						emptyMessage={getTranslation("changePassword.errorMessage.required")}
						errorMessage=""
						displayErrors={this.state.displayErrors}
					/>
					{this.state.errorMessage && (
						<span className="error-message">{this.state.errorMessage}</span>
					)}
					<div className="edit-user-buttons">
						{isLoading ? (
							<CircularProgress color="29B6F6" size={42} />
						) : (
							<div>
								<FlatButton
									type="submit"
									style={saveButtonStyles}
									backgroundColor="#29B6F6"
									label={getTranslation("changePassword.formField.saveBtn")}
								/>
								<FlatButton
									onClick={this.onCancel}
									style={cancelButtonStyles}
									label={getTranslation("changePassword.formField.cancelBtn")}
								/>
							</div>
						)}
					</div>
				</form>
			</div>
		);
	}
}

export default ChangePassword;
