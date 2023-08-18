import React, { useEffect, useState, Fragment, memo } from "react";
//material ui
import {
	Avatar,
	Button,
	Container,
	Divider,
	TextField
} from "@material-ui/core";
//components
import EditPageTemplate from "../../shared/components/EditPageTemplate";
import ArticleContainer from "../../shared/components/ArticleContainer";
import UserAvatar from "orion-components/UserAvatar";
import ProfilePicDropzone from "../../shared/components/ProfilePicDropzone";
import { browserHistory } from "react-router";
import { routes as r } from "../../routes";
import { Dialog } from "orion-components/CBComponents";
import { userService } from "client-app-core";
import {Translate, getTranslation} from "orion-components/i18n/I18nContainer";

const styles= {
	userFieldStyles: {
		width: "45%",
		marginBottom: 35
	},
	deleteUserButton: {
		color: "#E85858",
		float: "left"
	},
	avatarRTL: {
		height: 60,
		width: 60,
		marginLeft: 15
	},
	helperText: {
		textAlign: "right",
		opacity: "1!important",
		position: "unset!important"
	}
};

const phoneValidate = (value) => {
	let valid = true;

	// 16 is the length of a fully formatted 10-digit phone number
	if (value.length > 0 && value.length < 16) {
		valid = false;
	}
	return valid;
};

const validateEmail = (value) => {
	let valid = true;

	const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	valid = re.test(value);

	if (value.length === 0) {
		valid = false;
	}

	return valid;
};

const handleSubmit = async (values, stagedFile, user, updateUser, updateDisplayErrors, changePassword, isMyUser) => {
	// clear old errors and recheck if they are still valid errors
	const newDisplayErrors = {};
	let errors = false;
	if (values.newPassword !== values.confirmPassword) {
		newDisplayErrors.password = getTranslation("mainContent.accountSettings.editUser.errorMessage.passNotMatch");
		errors = true;
	}
	if (!values.newPassword && values.oldPassword) {
		newDisplayErrors.password = getTranslation("mainContent.accountSettings.editUser.errorMessage.setNewPass");
		errors = true;
	}
	if (values.newPassword && (!values.oldPassword && isMyUser)) {
		newDisplayErrors.oldPassword = getTranslation("mainContent.accountSettings.editUser.errorMessage.currentPass");
		errors = true;
	}

	if (!values.firstName && !values.lastName) {
		newDisplayErrors.name = true;
		errors = true;
	}
	if (values.cell || values.office) {
		if (values.cell && !phoneValidate(values.cell)) {
			newDisplayErrors.cell = true;
			errors = true;
		}
		if (values.office && !phoneValidate(values.office)) {
			newDisplayErrors.office = true;
			errors = true;
		}
	}
	if (!validateEmail(values.email)) {
		newDisplayErrors.email = true;
		errors = true;
	}

	if (errors) {
		updateDisplayErrors(newDisplayErrors);
		return;
	}

	if (values.newPassword) {
		await changePassword(
			user.id,
			values.oldPassword,
			values.newPassword,
			!isMyUser,
			(check) => {
				if (check) {
					newDisplayErrors.setPasswordError = check;
				}
			}
		);

	}
	if (newDisplayErrors.setPasswordError) {
		updateDisplayErrors(newDisplayErrors);
		return;
	}

	const data = {
		name: values.firstName + " " + values.lastName,
		email: values.email,
		orgId: user.orgId,
		contact: {
			officePhone: values.office
				? values.office.replace(/(\)|\(| |-)+/g, "")
				: null,
			cellPhone: values.cell
				? values.cell.replace(/(\)|\(| |-)+/g, "")
				: null
		}
	};

	if (user.id) {
		// we are editing
		// Staged file can be null here if there was no change
		updateDisplayErrors({});
		updateUser(user.id, data, stagedFile || "");
		browserHistory.goBack();
	}
};

const handleDelete = async (userId) => {
	userService.deleteUser(userId, (err, response) => {
		if (err) {
			console.log(err);
		}
		else {
			browserHistory.replace(r.SETTINGS + "manage-organization");
		}
	});
};

const formatPhone = (value) => {
	if (!value) return "";

	let input = value;
	// Strip all characters from the input except digits
	input = input.replace(/\D/g, "");

	// Trim the remaining input to ten characters, to preserve phone number format
	input = input.substring(0, 10);

	// Based upon the length of the string, we add formatting as necessary
	const size = input.length;
	if (size === 0) {
		input = "";
	} else if (size < 4) {
		input = "(" + input;
	} else if (size < 7) {
		input = "(" + input.substring(0, 3) + ") " + input.substring(3, 6);
	} else {
		input =
			"(" +
			input.substring(0, 3) +
			") " +
			input.substring(3, 6) +
			" - " +
			input.substring(6, 10);
	}
	return input;
};

const checkForChangedValues = (user, values, stagedFile) => {
	if (stagedFile || user.name !== (values.firstName + " " + values.lastName) || user.contact.cellPhone !== values.cell || user.contact.officePhone !== values.office || user.email !== values.email
		|| values.oldPassword || values.newPassword || values.confirmPassword) {
		return false;
	} else {
		return true;
	}
};

const setValue =(value, field, values, updateValues) => {
	updateValues({ ...values, [field]: value });
};

const stageFile = (files, stagedFile, updateStagedFile) => {
	// If we already have a file staged and we are restaging, we need to
	// destroy the old preview object url
	if (stagedFile) {
		window.URL.revokeObjectURL(stagedFile[0].preview);
	}

	updateStagedFile(files);
};

const EditUser = ({
	changePassword,
	updateUser,
	updateUserProfilePic,
	user,
	userId,
	isMyUser,
	canEditThisUser,
	dir
}) => {
	const [values, updateValues] = useState({
		firstName: "",
		lastName: "",
		newPassword: "",
		confirmPassword: "",
		cell: "",
		office: "",
		email: ""
	});
	const [stagedFile, updateStagedFile] = useState(null);
	const [displayErrors, updateDisplayErrors] = useState({});
	const [deleteConfirmation, updateDeleteConfirmation] = useState(false);
	useEffect(() => {
		if (user) {
			updateValues({
				firstName: user.name ? user.name.split(" ").slice(0, -1).join(" ") : "",
				lastName: user.name ? user.name.split(" ").slice(-1).join(" ") : "",
				oldPassword: "",
				newPassword: "",
				confirmPassword: "",
				cell: formatPhone(user.contact.cellPhone),
				office: formatPhone(user.contact.officePhone),
				email: user.email
			});
			updateStagedFile(null);
		}
	}, [user]);

	useEffect(() => {
		if (userId) {
			if (!canEditThisUser || !user) {
				browserHistory.replace(r.MY_ACCOUNT);
			}
		}
	}, [canEditThisUser]);

	if (!user) return null;
	const avatar = stagedFile ? (
		<Avatar
			style={dir == "rtl" ? styles.avatarRTL : {
				height: 60,
				width: 60,
				marginRight: 15
			}}
			src={stagedFile[0].preview}
		/>) : ( 
		<Avatar style={dir == "rtl" ? styles.avatarRTL : {
			height: 60,
			width: 60,
			marginRight: 15
		}}>
			<UserAvatar size={60} user={user} />
		</Avatar>
	);
	return (
		<EditPageTemplate title={getTranslation(isMyUser ? "mainContent.accountSettings.editUser.title1" : "mainContent.accountSettings.editUser.title2")} subTitle={getTranslation(isMyUser ? "mainContent.accountSettings.editUser.titleText1" : "mainContent.accountSettings.editUser.titleText2")} dir={dir}>
			<ArticleContainer
				headerTitle={getTranslation("mainContent.accountSettings.editUser.editProfile")}
				headerDescription={""}
				editing={true}
			>
				<Fragment>
					<Container style={{
						marginTop: 30,
						display: "flex",
						padding: 0,
						alignItems: "center"
					}}>
						{avatar}
						<ProfilePicDropzone
							attachAction={updateUserProfilePic}
							userId={user.id}
							stageFile={(files) => stageFile(files, stagedFile, updateStagedFile)}
						/>
					</Container>
					<Container style={{
						margin: "30px 0",
						display: "flex",
						padding: 0,
						justifyContent: "space-evenly"
					}}>
						{isMyUser && 
							<TextField
								style={{
									maxWidth: 180
								}}
								label={getTranslation("mainContent.accountSettings.editUser.oldPass")}
								type="password"
								error={displayErrors.setPasswordError && displayErrors.setPasswordError.includes("old password") ? displayErrors.setPasswordError : displayErrors.oldPassword}
								helperText={displayErrors.setPasswordError && displayErrors.setPasswordError.includes("old password") ? displayErrors.setPasswordError : displayErrors.oldPassword}
								onChange={(e) => {
									updateValues({ ...values, oldPassword: e.target.value });
								}}
								value={values.oldPassword}
								InputLabelProps={{
									style: {
										transformOrigin: (dir && dir == "rtl" ? "top right": "top left"), left: "unset"
									}
								}}
								FormHelperTextProps={{
									style: (dir && dir == "rtl" ? styles.helperText : {})
								  }}
							/>
						}
						<TextField
							style={{
								maxWidth: 180
							}}
							label={getTranslation("mainContent.accountSettings.editUser.newPass")}
							type="password"
							error={displayErrors.setPasswordError && !displayErrors.setPasswordError.includes("old password") ? displayErrors.setPasswordError : displayErrors.password}
							helperText={displayErrors.setPasswordError && !displayErrors.setPasswordError.includes("old password") ? displayErrors.setPasswordError : displayErrors.password}
							onChange={(e) => {
								updateValues({ ...values, newPassword: e.target.value });
							}}
							value={values.newPassword}
							InputLabelProps={{
								style: {
									transformOrigin: (dir && dir == "rtl" ? "top right": "top left"), left: "unset"
								}
							}}
							FormHelperTextProps={{
								style: (dir && dir == "rtl" ? styles.helperText : {})
							  }}
						/>
						<TextField
							style={{
								maxWidth: 180
							}}
							label={getTranslation("mainContent.accountSettings.editUser.confirmPass")}
							type="password"
							error={displayErrors.password}
							helperText={displayErrors.password}
							onChange={(e) => {
								updateValues({ ...values, confirmPassword: e.target.value });
							}}
							value={values.confirmPassword}
							InputLabelProps={{
								style: {
									transformOrigin: (dir && dir == "rtl" ? "top right": "top left"), left: "unset"
								}
							}}
							FormHelperTextProps={{
								style: (dir && dir == "rtl" ? styles.helperText : {})
							  }}
						/>
					</Container>
					<Divider style={{
						position: "absolute",
						left: 15,
						right: 15
					}} />
					<Container style={{
						marginTop: 65,
						minHeight: "100%",
						display: "flex",
						flexWrap: "wrap",
						padding: 0,
						justifyContent: "space-between",
						flexDirection: "row"
					}}>
						<TextField
							style={styles.userFieldStyles}
							label={getTranslation("mainContent.accountSettings.editUser.firstName")}
							error={displayErrors.name}
							helperText={displayErrors.name ? getTranslation("mainContent.accountSettings.editUser.errorMessage.emptyFieldErr") : ""}
							onChange={(e) => {
								setValue(e.target.value, "firstName", values, updateValues);
							}}
							value={values.firstName}
							InputLabelProps={{
								style: {
									transformOrigin: (dir && dir == "rtl" ? "top right": "top left"), left: "unset"
								}
							}}
							FormHelperTextProps={{
								style: (dir && dir == "rtl" ? styles.helperText : {})
							  }}
						/>
						<TextField
							style={styles.userFieldStyles}
							label={getTranslation("mainContent.accountSettings.editUser.lastName")}
							error={displayErrors.name}
							helperText={displayErrors.name ?  getTranslation("mainContent.accountSettings.editUser.errorMessage.emptyFieldErr") : ""}
							onChange={(e) => {
								setValue(e.target.value, "lastName", values, updateValues);
							}}
							value={values.lastName}
							InputLabelProps={{
								style: {
									transformOrigin: (dir && dir == "rtl" ? "top right": "top left"), left: "unset"
								}
							}}
							FormHelperTextProps={{
								style: (dir && dir == "rtl" ? styles.helperText : {})
							  }}
						/>
						<TextField
							style={styles.userFieldStyles}
							label={getTranslation("mainContent.accountSettings.editUser.cellPhone")}
							error={displayErrors.cell}
							helperText={displayErrors.cell ?  getTranslation("mainContent.accountSettings.editUser.errorMessage.formatText") : ""}
							onChange={(e) => {
								setValue(formatPhone(e.target.value), "cell", values, updateValues);
							}}
							value={values.cell || ""}
							InputLabelProps={{
								style: {
									transformOrigin: (dir && dir == "rtl" ? "top right": "top left"), left: "unset"
								}
							}}
							FormHelperTextProps={{
								style: (dir && dir == "rtl" ? styles.helperText : {})
							  }}
						/>
						<TextField
							style={styles.userFieldStyles}
							label={getTranslation("mainContent.accountSettings.editUser.officePhone")}
							error={displayErrors.office}
							helperText={displayErrors.office ?  getTranslation("mainContent.accountSettings.editUser.errorMessage.formatText") : ""}
							onChange={(e) => {
								setValue(formatPhone(e.target.value), "office", values, updateValues);
							}}
							value={values.office || ""}
							InputLabelProps={{
								style: {
									transformOrigin: (dir && dir == "rtl" ? "top right": "top left"), left: "unset"
								}
							}}
							FormHelperTextProps={{
								style: (dir && dir == "rtl" ? styles.helperText : {})
							  }}
						/>
						<TextField
							style={styles.userFieldStyles}
							label={getTranslation("mainContent.accountSettings.editUser.email")}
							type="email"
							error={displayErrors.email}
							helperText={displayErrors.email ? getTranslation("mainContent.accountSettings.editUser.errorMessage.validEmail") : ""}
							onChange={(e) => {
								setValue(e.target.value, "email", values, updateValues);
							}}
							value={values.email}
							InputLabelProps={{
								style: {
									transformOrigin: (dir && dir == "rtl" ? "top right": "top left"), left: "unset"
								}
							}}
							FormHelperTextProps={{
								style: (dir && dir == "rtl" ? styles.helperText : {})
							  }}
						/>
					</Container>
					<Container style={dir == "rtl" ? {textAlign: "left", paddingRight: 0} : {
						textAlign: "right",
						paddingLeft: 0
					}}>
						{!isMyUser && canEditThisUser && <Button
							style={styles.deleteUserButton}
							onClick={() => {
								updateDeleteConfirmation(true);
							}}
						>
							<Translate value="mainContent.accountSettings.editUser.deleteUser"/>
						</Button>}
						<Button
							onClick={() => {
								updateValues({
									firstName: user.name ? user.name.split(" ").slice(0, -1).join(" ") : "",
									lastName: user.name ? user.name.split(" ").slice(-1).join(" ") : "",
									oldPassword: "",
									newPassword: "",
									confirmPassword: "",
									cell: user.contact.cellPhone,
									office: user.contact.officePhone,
									email: user.email
								});
								updateStagedFile(null);
								updateDisplayErrors({});
								browserHistory.goBack();
							}}
						>
							<Translate value="mainContent.accountSettings.editUser.cancelBtn"/>
						</Button>
						<Button
							disabled={checkForChangedValues(user, values, stagedFile)}
							color="primary"
							onClick={() => {
								updateDisplayErrors({});
								handleSubmit(values, stagedFile, user, updateUser, updateDisplayErrors, changePassword, isMyUser);
							}}
						>
							<Translate value="mainContent.accountSettings.editUser.doneBtn"/>
						</Button>
					</Container>
					<Dialog
						open={deleteConfirmation}
						title={<h3><Translate value="mainContent.accountSettings.editUser.dialog.title"/></h3>}
						paperPropStyles={{
							backgroundColor: "#41454a",
							padding: 15 
						}}
						abort={{
							label: getTranslation("mainContent.accountSettings.editUser.cancelBtn"),
							action: () => {
								updateDeleteConfirmation(false);
							}
						}}
						confirm={{
							label: getTranslation("mainContent.accountSettings.editUser.confirmBtn"),
							action: () => {
								updateDisplayErrors({});
								handleDelete(userId);
							}
						}}
					>
						<p><Translate value="mainContent.accountSettings.editUser.dialog.confirmText"/></p>
					</Dialog>
				</Fragment>
			</ArticleContainer>
		</EditPageTemplate>
	);
};

export default memo(EditUser);