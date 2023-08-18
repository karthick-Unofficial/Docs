import React, { Component } from "react";

import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";
import Divider from "material-ui/Divider";

import { browserHistory } from "react-router";

import { authService } from "client-app-core";
import { Translate, getTranslation } from "orion-components/i18n/I18nContainer";

export default class SetInitialPassword extends Component {
    constructor(props) {
        super(props);

        this.state = {
            passwordValue: "",
            passwordConfirmValue: "",
            errorMessage: this.props.errorMessage || null,
            verified: false,
            done: false
        };
    }

    componentDidMount() {
        authService.verifySetInitialPassword(
            this.props.params.token,
            (err, response) => {
                if (err) {
                    console.log(err);
                    browserHistory.push("/login/invalid-reset");
                } else {
                    this.setState({
                        verified: true
                    });
                }
            }
        );
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.errorMessage) {
            this.setState({
                errorMessage: nextProps.errorMessage
            });
        }
    }

    handlePasswordChange = e => {
        this.setState({
            passwordValue: e.target.value
        });
    };

    handlePasswordConfirmChange = e => {
        this.setState({
            passwordConfirmValue: e.target.value
        });
    };

    handleKeyDownSubmit = e => {
        if (e.keyCode === 13) {
            this.handleClick();
        }
    };

    handleClick = () => {
        if (this.state.passwordValue !== this.state.passwordConfirmValue) {
            this.setState({
                errorMessage: getTranslation("login.errorMessage.bothPassText")
            });
            return;
        }

        authService.setInitialPassword(
            this.state.passwordValue,
            this.props.params.token,
            (err, response) => {
                if (err) {
                    console.log(err);
                } else {
                    if (response.success) {
                        this.setState({ done: true, errorMessage: "" });
                        window.setTimeout(() => browserHistory.push("/login"), 2000);
                    } else {
                        this.setState({
                            errorMessage: response.reason.message
                        });
                    }

                }
            }
        );
    };

    render() {
        const { passwordValue, passwordConfirmValue } = this.state;

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
                {this.state.verified &&
                    !this.state.done && (
                        <div>
                            <div className="fields-outer-wrapper">
                                <span className="text">
                                    <Translate value="login.setInitial.title" />
                                </span>
                                <div className="forgot fields-wrapper">
                                    <TextField
                                        type="password"
                                        ref="password"
                                        value={this.state.passwordValue}
                                        onChange={this.handlePasswordChange}
                                        onKeyDown={this.handleKeyDownSubmit}
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
                                        type="password"
                                        ref="password"
                                        value={this.state.passwordConfirmValue}
                                        onChange={this.handlePasswordConfirmChange}
                                        onKeyDown={this.handleKeyDownSubmit}
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
                            {this.state.errorMessage && (
                                <p className="error-message">{this.state.errorMessage}</p>
                            )}
                            <RaisedButton
                                label={getTranslation("login.setInitial.setPassBtn")}
                                disabled={!validPassword}
                                primary={true}
                                fullWidth={true}
                                style={buttonStyles}
                                labelStyle={labelStyles}
                                onClick={event => this.handleClick(event)}
                            />
                        </div>
                    )}
                {this.state.done && (
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
    }
}
