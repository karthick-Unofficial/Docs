import React, { Fragment, useState, useEffect, memo } from "react";
// material-ui
import { Container, TextField } from "@mui/material";
// components
import { Dialog } from "orion-components/CBComponents";
import ProfilePicDropzone from "../../shared/components/ProfilePicDropzone";
import { Translate, getTranslation } from "orion-components/i18n";
import { useDispatch } from "react-redux";

const setValue = (value, field, values, updateValues) => {
	updateValues({ ...values, [field]: value });
};

const phoneValidate = (value) => {
	let valid = true;

	// 16 is the length of a fully formatted 10-digit phone number
	if (value.length > 0 && value.length < 16) {
		valid = false;
	}
	return valid;
};

const formatPhone = (value) => {
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

const validateEmail = (value) => {
	let valid = true;

	const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	valid = re.test(value);

	if (value.length === 0) {
		valid = false;
	}

	return valid;
};

const handleSubmit = async (values, stagedFile, createNewOrg, updateDisplayErrors, dispatch) => {
	// clear old errors and recheck if they are still valid errors
	const newDisplayErrors = {};
	let errors = false;
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

	if (!values.organizationName) {
		newDisplayErrors.organizationName = getTranslation("mainContent.manageEcosystem.errorMessage.emptyOrg");
		errors = true;
	}
	if (values.organizationDescription.length > 50) {
		newDisplayErrors.organizationDescription = getTranslation("mainContent.manageEcosystem.errorMessage.descTooLong");
	}

	if (errors) {
		updateDisplayErrors(newDisplayErrors);
		return;
	}

	const user = {
		name: values.firstName + " " + values.lastName,
		email: values.email,
		admin: true,
		ecoAdmin: false,
		orgId: values.organizationName,
		roleId: null,
		role: "Org User", // this is required by the userModel and is the default role for any new organization
		contact: {
			officePhone: values.cell,
			cellPhone: values.office
		},
		// Don't believe orgRole object serves a purpose anymore, but leaving here for now just in case.
		orgRole: {
			roleId: null,
			title: "Org Admin"
		}
	};

	const organization = {
		name: values.organizationName,
		description: values.organizationDescription,
		orgId: values.organizationName
	};
	dispatch(createNewOrg(organization, stagedFile, user));
};

const stageFile = (files, stagedFile, updateStagedFile) => {
	// If we already have a file staged and we are restaging, we need to
	// destroy the old preview object url
	if (stagedFile) {
		window.URL.revokeObjectURL(stagedFile[0].preview);
	}

	updateStagedFile(files);
};

const CreateNewOrgDialog = ({
	createNewOrg,
	createOrgError,
	abortAction,
	open,
	dir
}) => {
	const dispatch = useDispatch();

	const [values, updateValues] = useState({
		organizationName: "",
		organizationDescription: "",
		firstName: "",
		lastName: "",
		cell: "",
		office: "",
		email: "",
		roleId: "",
		title: ""
	});

	const [stagedFile, updateStagedFile] = useState(null);
	const [displayErrors, updateDisplayErrors] = useState({});
	useEffect(() => {
		updateValues({
			organizationName: "",
			organizationDescription: "",
			firstName: "",
			lastName: "",
			cell: "",
			office: "",
			email: "",
			roleId: "",
			title: ""
		});
		updateStagedFile(null);
		updateDisplayErrors({});
	}, [open]);
	// Icon logic if no org image
	let orgName = values.organizationName;
	orgName = orgName.startsWith("The ")
		? orgName.slice(4, orgName.length)
		: orgName;

	let orgIcon;
	if (stagedFile) {
		orgIcon = (
			<div
				className="org-icon org-profile-image"
				style={{
					backgroundImage: "url(" + stagedFile[0].preview + ")"
				}}
			>
				<img src={`url(" + ${stagedFile[0].preview} + ")`} alt="profileImage" style={{ visibility: "hidden" }} />
			</div>
		);
	} else {
		orgIcon = (
			<div className="org-icon">
				<span>{orgName ? orgName[0] : "O"}</span>
			</div>
		);
	}


	const styles = {
		userFieldStyles: {
			width: "45%",
			marginBottom: 35
		},
		helperText: {
			textAlign: "unset"
		},
		inputLabelProps: {
			left: "unset",
			...(dir && dir === "rtl" ? { transformOrigin: "top right" } : { transformOrigin: "top left" })
		}
	};

	return (
		<Dialog
			open={open}
			title={<h3><Translate value="mainContent.manageEcosystem.AddOrgForm.title" /></h3>}
			paperPropStyles={{
				backgroundColor: "#41454a",
				padding: 15,
				width: 600
			}}
			abort={{
				label: getTranslation("mainContent.manageEcosystem.AddOrgForm.cancelBtn"),
				action: () => {
					updateStagedFile(null);
					updateDisplayErrors({});
					abortAction();
				}
			}}
			confirm={{
				label: getTranslation("mainContent.manageEcosystem.AddOrgForm.doneBtn"),
				action: () => {
					updateDisplayErrors({});
					handleSubmit(values, stagedFile, createNewOrg, updateDisplayErrors, dispatch);
				}
			}}
		>
			<Fragment>
				<Container style={{
					marginTop: 30,
					display: "flex",
					padding: 0,
					alignItems: "center"
				}}>
					{orgIcon}
					<ProfilePicDropzone
						label={getTranslation("mainContent.manageEcosystem.AddOrgForm.changeProfile")}
						stageFile={(files) => stageFile(files, stagedFile, updateStagedFile)}
						dir={dir}
					/>
				</Container>
				<div style={{
					display: "flex",
					flexDirection: "column",
					marginTop: 50,
					marginBottom: 65
				}}>
					<TextField
						style={{
							width: "60%"
						}}
						variant="standard"
						label={getTranslation("mainContent.manageEcosystem.AddOrgForm.orgNameLabel")}
						error={displayErrors.organizationName}
						helperText={displayErrors.organizationName}
						onChange={(e) => {
							updateValues({ ...values, organizationName: e.target.value });
						}}
						value={values.organizationName}
						autoFocus={true}
						InputLabelProps={{
							style: styles.inputLabelProps
						}}
						FormHelperTextProps={{
							style: styles.helperText
						}}
					/>
					<TextField
						label={getTranslation("mainContent.manageEcosystem.AddOrgForm.orgDescription", (values.organizationDescription.length || ""))}
						multiline={true}
						variant="standard"
						error={displayErrors.organizationDescription}
						helperText={displayErrors.organizationDescription}
						value={values.organizationDescription}
						style={{
							marginTop: 40
						}}
						InputProps={{
							disableUnderline: true,
							style: {
								border: "1px solid #8b8d8f",
								padding: 10,
								backgroundColor: "#393d41"
							},
							inputProps: {
								style: {
									height: 50
								}
							}
						}}
						onChange={(e) => {
							if (e.target.value && e.target.value.length <= 50) {
								updateValues({ ...values, organizationDescription: e.target.value });
							}
						}}
						InputLabelProps={{
							style: styles.inputLabelProps
						}}
						FormHelperTextProps={{
							style: styles.helperText
						}}
					/>
				</div>
				<Container style={{
					minHeight: "100%",
					padding: 0
				}}>
					<h3><Translate value="mainContent.manageEcosystem.AddOrgForm.initialAdmin" /></h3>
					<div style={{
						paddingTop: 24,
						display: "flex",
						flexWrap: "wrap",
						justifyContent: "space-between",
						flexDirection: "row"
					}}>
						<TextField
							style={styles.userFieldStyles}
							variant="standard"
							label={getTranslation("mainContent.manageEcosystem.AddOrgForm.firstName")}
							error={displayErrors.name}
							helperText={displayErrors.name ? getTranslation("mainContent.manageEcosystem.errorMessage.emptyField") : ""}
							onChange={(e) => {
								setValue(e.target.value, "firstName", values, updateValues);
							}}
							value={values.firstName}
							InputLabelProps={{
								style: styles.inputLabelProps
							}}
							FormHelperTextProps={{
								style: styles.helperText
							}}
						/>
						<TextField
							style={styles.userFieldStyles}
							variant="standard"
							label={getTranslation("mainContent.manageEcosystem.AddOrgForm.lastName")}
							error={displayErrors.name}
							helperText={displayErrors.name ? getTranslation("mainContent.manageEcosystem.errorMessage.emptyField") : ""}
							onChange={(e) => {
								setValue(e.target.value, "lastName", values, updateValues);
							}}
							value={values.lastName}
							InputLabelProps={{
								style: styles.inputLabelProps
							}}
							FormHelperTextProps={{
								style: styles.helperText
							}}
						/>
						<TextField
							style={styles.userFieldStyles}
							variant="standard"
							label={getTranslation("mainContent.manageEcosystem.AddOrgForm.cellPhone")}
							error={displayErrors.cell}
							helperText={displayErrors.cell ? getTranslation("mainContent.manageEcosystem.errorMessage.formatText") : ""}
							onChange={(e) => {
								setValue(formatPhone(e.target.value), "cell", values, updateValues);
							}}
							value={values.cell || ""}
							InputLabelProps={{
								style: styles.inputLabelProps
							}}
							FormHelperTextProps={{
								style: styles.helperText
							}}
						/>
						<TextField
							style={styles.userFieldStyles}
							variant="standard"
							label={getTranslation("mainContent.manageEcosystem.AddOrgForm.officePhone")}
							error={displayErrors.office}
							helperText={displayErrors.office ? getTranslation("mainContent.manageEcosystem.errorMessage.formatText") : ""}
							onChange={(e) => {
								setValue(formatPhone(e.target.value), "office", values, updateValues);
							}}
							value={values.office || ""}
							InputLabelProps={{
								style: styles.inputLabelProps
							}}
							FormHelperTextProps={{
								style: styles.helperText
							}}
						/>
						<TextField
							style={styles.userFieldStyles}
							variant="standard"
							label={getTranslation("mainContent.manageEcosystem.AddOrgForm.email")}
							type="email"
							error={displayErrors.email}
							helperText={displayErrors.email ? getTranslation("mainContent.manageEcosystem.errorMessage.validEmail") : ""}
							onChange={(e) => {
								setValue(e.target.value, "email", values, updateValues);
							}}
							value={values.email}
							InputLabelProps={{
								style: styles.inputLabelProps
							}}
							FormHelperTextProps={{
								style: styles.helperText
							}}
						/>
					</div>
					{createOrgError && (<p style={{ color: "red", textAlign: "center" }}>{createOrgError}</p>)}
				</Container>
			</Fragment>
		</Dialog>
	);
};

export default memo(CreateNewOrgDialog);