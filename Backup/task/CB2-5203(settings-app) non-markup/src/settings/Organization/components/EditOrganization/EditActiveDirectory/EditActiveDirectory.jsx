import React, { useState, useEffect, memo, Fragment } from "react";
import { browserHistory } from "react-router";
//material ui
import { Container, Divider, IconButton, Switch, Button, CircularProgress, InputAdornment} from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
//components
import EditPageTemplate from "../../../../shared/components/EditPageTemplate";
import ArticleContainer from "../../../../shared/components/ArticleContainer";
import { TextField, SelectField } from "orion-components/CBComponents";
import Oldlist from "./List/List";
// import { Button, CircularProgress, Switch } from "@material-ui/core";
// import { Visibility, VisibilityOff } from "@material-ui/icons";
import { externalAuthProviderService } from "client-app-core";

import _ from "lodash";
import {Translate, getTranslation} from "orion-components/i18n/I18nContainer";

// Set org's auth settings, if they exist
const setAuthIfExists = (org, setState) => {
	externalAuthProviderService.getAuthByOrgId(org, (err, res) => {
		if (err) {
			console.log("Error grabbing external auth info: ", err);
		}
		else if (res.authId) {
			setState(prevState => {
				return {...prevState, auth: res.authId, shouldSetConnectionInfo: true };
			});
		}
		else {
			setState(prevState => {
				return {...prevState, auth: false, shouldSetConnectionInfo: false };
			});
		}
	});
};

const validateForms = (state, setState) => {
	// We don't want to validate the port field, as it is optional
	const fieldsToValidate = [
		state.fields.authType,
		state.fields.baseDN,
		state.fields.groupName,
		state.fields.host,
		state.fields.password,
		state.fields.username
	];

	const invalidFields = fieldsToValidate.filter(field => {
		return !field.length;
	});

	const isValid = !invalidFields.length;

	// if (!isValid) {
	// 	setState({ ...state, error: "Please ensure all fields are filled before submitting a request.", showFieldError: true });
	// }

	return isValid;
};

const handleUpdateField = (field, state, setState) => event => {
	const value = event.target.value;
	// Only let numbers or empty strings in the port field
	if (field === "port" && !(/^\d*$/).test(value)) {
		return;
	} else {
		const updatedFields = { ...state.fields };
		updatedFields[field] = value;

		setState(prevState => {
			return {
				...prevState,
				fields: updatedFields,
				selectOpen: false,
				users: null,
				data: null
			};
		});
	}
};

const toggleSync = (setState) => {
	setState(prevState => { 
		return {
			...prevState, sync: !prevState.sync, users: null 
		};
	});
};

const toggleShowPassword = (state, setState) => {
	setState({ ...state, showPassword: !state.showPassword });
};

// Method for opening controlled select field
const handleSelectOpen = (state, setState) => {
	setState({ ...state, selectOpen: true });
};

const testConnection = (state, setState) => {
	const {
		fields,
		sync,
		isUpdate
	} = state;
	const {
		host,
		port,
		authType,
		username,
		password,
		groupName,
		baseDN
	} = fields;
	const newState = {};
	console.log("newState: ", newState);
	// Clear data from parent
	newState.users = null;
	setState(prevState => {
		return {
			...prevState,
			...newState
		};
	});

	// If all inputs aren't filled, show error and bail
	if (!validateForms(state, setState)) {
		return;
	}
	newState.data = null;
	newState.error = null;
	// Reset error if exists & clear data from parent
	setState(prevState => {
		return {
			...prevState,
			...newState
		};
	});
	// If no response after half second, show loading wheel
	setTimeout(() => {
		if (!newState.users && !newState.error) {
			newState.loading = true;
			setState(prevState => {
				return {
					...prevState,
					...newState
				};
			});
		}
	}, 500);

	externalAuthProviderService.testAuthConnection(host, port, username, password, groupName, baseDN, authType, isUpdate, (err, res) => {
		if (err) {
			console.log("Error on auth connection: ", err);
			newState.error = getTranslation("mainContent.manageOrganization.errorMessage.requestProblem");
			newState.loading = false;
			setState(prevState => {
				return {
					...prevState,
					...newState
				};
			});
		}
		else {

			// If error
			if (res.hasOwnProperty("success") && !res.success) {

				// If error message is thrown, display it
				if (typeof res.reason.message === "string") {
					newState.error = res.reaon.message;
					newState.loading = false;
					setState(prevState => {
						return {
							...prevState,
							...newState
						};
					});
				}
				// Otherwise, display connection error message
				else {
					newState.error = getTranslation("mainContent.manageOrganization.errorMessage.connError");
					newState.loading = false;
					setState(prevState => {
						return {
							...prevState,
							...newState
						};
					});
				}
			}
			// If success
			else {
				newState.users = res;
				newState.loading = false;
				newState.data = { host, port, authType, username, password, groupName, baseDN, sync };
				setState(prevState => {
					return {
						...prevState,
						...newState
					};
				});
			}
		}
	});
};

const styles = {
	body: {
		color: "white",
		maxWidth: "600px"
	},
	inputContainer: {
		marginBottom: 40,
		display: "flex",
		flexWrap: "wrap",
		justifyContent: "space-between",
		alignItems: "flex-end"
	},
	button: {
		color: "rgb(53, 183, 243)"
	},
	progress: {
		textAlign: "center",
		padding: "30px 0"
	}
};

const handleConfirm = (data, users, auth, loggedInUserOrg, refreshEcosystem, setState) => {

	// If org already has an authProvider set, update it
	if (auth) {
		externalAuthProviderService.updateAuthenticationInfo(loggedInUserOrg, data, users, auth.id, (err, res) => {
			if (err) {
				console.log("Error updating auth provider: ", err);
				setState(prevState => {
					return { ...prevState, error: err, data: null, users: null };
				});
			}
			else {
				// Refresh user list
				setTimeout(() => {
					refreshEcosystem();
				}, 1000);
			}
		});
	}
	// If org has no authProvider, create one
	else {
		externalAuthProviderService.createAuthenticationInfo(loggedInUserOrg, data, users, (err, res) => {
			if (err) {
				console.log("Error creating auth provider: ", err);
				setState(prevState => {
					return { ...prevState, error: err, data: null, users: null };
				});
			}
			else {
				// Refresh user list
				setTimeout(() => {
					refreshEcosystem();
				}, 1000);
			}
		});
	}
};

const EditActiveDirectory = ({
	org,
	refreshEcosystem,
	dir
}) => {
	const [state, setState] = useState({
		// connection data from forms to be sent
		data: null,
		users: null,
		error: null,
		// connection data received from DB
		auth: false,
		shouldSetConnectionInfo: false,
		fields: {
			host: "",
			port: "",
			authType: "",
			username: "",
			password: "",
			groupName: "",
			baseDN: ""
		},
		sync: false,
		showPassword: false,
		selectOpen: false,
		loading: false,
		showFieldError: false,
		isUpdate: false	
	});

	useEffect(() => {
		// If user's org has an authProvider already, set it to state
		if (org) {
			setAuthIfExists(org, setState);
		}
	}, [org, setState, setAuthIfExists]);

	const {
		auth,
		shouldSetConnectionInfo
	} = state;

	useEffect(() => {
		if (shouldSetConnectionInfo && auth && auth.connection) {
			setState(prevState => {
				return {
					...prevState,
					fields: {
						host: auth.connection.host,
						port: auth.connection.port,
						authType: auth.connection.authType,
						username: auth.connection.username,
						password: auth.connection.password,
						groupName: auth.connection.groupName,
						baseDN: auth.connection.baseDN
					},
					shouldSetConnectionInfo: false,
					sync: auth.connection.sync,
					isUpdate: true
				};
			});
		}
	}, [shouldSetConnectionInfo, auth, setState]);

	const {
		data,
		fields,
		sync,
		showPassword,
		loading,
		error,
		users,
		showFieldError,
		selectOpen
	} = state;

	const {
		host,
		port,
		authType,
		username,
		password,
		groupName,
		baseDN
	} = fields;
	return (
		<EditPageTemplate 
			title={getTranslation("mainContent.manageOrganization.orgSettings.title")} 
			subTitle={getTranslation("mainContent.manageOrganization.orgSettings.activeDir.subText")}
			dir={dir} 
		>
			<ArticleContainer headerTitle={getTranslation("mainContent.manageOrganization.orgSettings.activeDir.formTitle")} headerDescription={""} editing={true} >
				<Fragment>
					<Container style={{
						marginTop: 30,
						display: "flex",
						padding: 0,
						alignItems: "center"
					}}>
						<div style={styles.body}>
							<div style={styles.inputContainer}>
								<div style={{ width: "30%" }}>
									<SelectField
										id="authtype"
										label={getTranslation("mainContent.manageOrganization.orgSettings.activeDir.authLabel")}
										handleChange={handleUpdateField("authType", state, setState)}
										handleOpen={() => handleSelectOpen(state, setState)}
										value={authType}
										items={[{ value: "LDAP", id: "ldap" }, { value: "Active Directory", id: "active-directory" }]}
										open={selectOpen}
										controlled={true}
										error={showFieldError && !authType}
										dir={dir}
									/>
								</div>
								<div style={{ width: "50%" }}>
									<TextField
										id="host"
										label={getTranslation("mainContent.manageOrganization.orgSettings.activeDir.hostLabel")}
										value={host}
										handleChange={handleUpdateField("host", state, setState)}
										error={showFieldError && !host}
										dir={dir}
									/>
								</div>
								<div style={{ width: "15%" }}>
									<TextField
										id="port"
										label={getTranslation("mainContent.manageOrganization.orgSettings.activeDir.portLabel")}
										value={port}
										handleChange={handleUpdateField("port", state, setState)}
									// error={showFieldError && !port}
										dir={dir}
									/>
								</div>
								<div style={{ width: "48%" }}>
									<TextField
										id="username"
										label={getTranslation("mainContent.manageOrganization.orgSettings.activeDir.userLabel")}
										value={username}
										handleChange={handleUpdateField("username", state, setState)}
										error={showFieldError && !username}
										dir={dir}
									/>
								</div>
								<div style={{ width: "48%" }}>
									<TextField
										id="password"
										label={getTranslation("mainContent.manageOrganization.orgSettings.activeDir.passLabel")}
										value={password}
										handleChange={handleUpdateField("password", state, setState)}
										error={showFieldError && !password}
										type={showPassword ? "text" : "password"}
										endAdornment = {showPassword ? <IconButton style={{ color: "white" }}><VisibilityOffIcon /></IconButton> : <IconButton style={{ color: "white" }}><VisibilityIcon /></IconButton>}
										adornmentClick={() => toggleShowPassword(state, setState)}
										InputLabelProps={{
											style: {
												transformOrigin: (dir && dir == "rtl" ? "top right": "top left")
											}
										}}
										dir={dir}
									/>
								</div>
								<div style={{ width: "48%" }}>
									<TextField
										id="groupname"
										label={getTranslation("mainContent.manageOrganization.orgSettings.activeDir.groupLabel")}
										value={groupName}
										handleChange={handleUpdateField("groupName", state, setState)}
										error={showFieldError && !groupName}
										dir={dir}
									/>
								</div>
								<div style={{ width: "48%" }}>
									<TextField
										id="baseDN"
										label="baseDN"
										value={baseDN}
										handleChange={handleUpdateField("baseDN", state, setState)}
										error={showFieldError && !baseDN}
										dir={dir}
									/>
								</div>
								<div style={{
									marginTop: 25,
									width: "100%",
									display: "flex",
									flexWrap: "wrap",
									justifyContent: "space-between",
									alignItems: "flex-end"
								}}>
									<div style={{ width: "50%" }}>
										<Button
											color="primary"
											style={{ paddingLeft: 0 }}
											disabled={!validateForms(state, setState)}
											onClick={() => testConnection(state, setState)}
										>
											<Translate value="mainContent.manageOrganization.orgSettings.activeDir.testconLabel"/>
										</Button>
									</div>
									<div style={{
										width: "50%",
										display: "flex",
										flexWrap: "wrap",
										alignItems: "center"
									}}>
										<p style={{ width: "70%" }}><Translate value="mainContent.manageOrganization.orgSettings.activeDir.autosyncLabel"/>:</p>
										<Switch
											onChange={() => toggleSync(setState)}
											checked={sync}
											color="primary"
										/>
									</div>
								</div>
							</div>
							{loading && (
								<div style={styles.progress}>
									<CircularProgress size={80} />
								</div>
							)}
							{error && (
								<div style={styles.progress}>
									<p>{error}</p>
								</div>
							)}
							{users && (
								<React.Fragment>
									<h3 style={{ marginTop: "20px" }}><Translate value="mainContent.manageOrganization.orgSettings.activeDir.usersLabel"/>:</h3>
									{
										users.length > 0
											? <Oldlist listItems={users} />
											: <div style={styles.progress}><Translate value="mainContent.manageOrganization.orgSettings.activeDir.emptyUsersText"/></div>
									}
								</React.Fragment>
							)}
							{!users && (<Divider />)}
							<Container style={dir == "rtl" ? {textAlign: "left", marginTop: 30} : {
								textAlign: "right",
								marginTop: 30
							}}>
								<Button
									onClick={() => {
										setState(prevState => {
											return {
												...prevState,
												// connection data from forms to be sent
												data: null,
												users: null,
												error: null
											};
										});
										browserHistory.goBack();
									}}
								>
									<Translate value="mainContent.manageOrganization.orgSettings.activeDir.cancelBtn"/>
								</Button>
								<Button
									disabled={!data || !users}
									color="primary"
									onClick={() => {
										handleConfirm(data, users, auth, org, refreshEcosystem, setState);
									}}
								>
									<Translate value="mainContent.manageOrganization.orgSettings.activeDir.saveBtn"/>
								</Button>
							</Container>
						</div>
					</Container>
				</Fragment>
			</ArticleContainer>

		</EditPageTemplate>
	);
};

export default memo(EditActiveDirectory);