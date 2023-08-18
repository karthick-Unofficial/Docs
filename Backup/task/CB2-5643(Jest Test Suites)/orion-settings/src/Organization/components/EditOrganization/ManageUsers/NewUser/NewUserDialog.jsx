import React, { useState, useEffect, memo } from "react";
// material-ui
import { Container, Divider, TextField } from "@mui/material";
// components
import { SelectField, Dialog } from "orion-components/CBComponents";
import { Translate, getTranslation } from "orion-components/i18n";
import { useStyles } from "../../../../../shared/styles/overrides";

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

const handleSubmit = async (values, orgId, updateDisplayErrors, onSubmit, close, dispatch) => {
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

	if (!values.title || !values.roleId) {
		newDisplayErrors.role = true;
		errors = true;
	}

	if (errors) {
		updateDisplayErrors(newDisplayErrors);
		return;
	}

	const data = {
		name: values.firstName + " " + values.lastName,
		email: values.email,
		role: values.title,
		orgId: orgId,
		contact: {
			officePhone: values.office
				? values.office.replace(/(\)|\(| |-)+/g, "")
				: null,
			cellPhone: values.cell
				? values.cell.replace(/(\)|\(| |-)+/g, "")
				: null
		},
		roleId: values.roleId,
		admin: false,
		ecoAdmin: false,
		orgRole: {
			roleId: values.roleId,
			title: values.title
		}
	};

	// we are creating
	dispatch(onSubmit(data));
	close();
};

const NewUserDialog = ({
	abortAction,
	confirmAction,
	open,
	orgId,
	onSubmit,
	orgRoles,
	dir,
	dispatch
}) => {
	const classes = useStyles();
	
	const [values, updateValues] = useState({
		firstName: "",
		lastName: "",
		cell: "",
		office: "",
		email: "",
		roleId: "",
		title: ""
	});
	const [displayErrors, updateDisplayErrors] = useState({});
	useEffect(() => {
		updateDisplayErrors({});
		updateValues({
			firstName: "",
			lastName: "",
			cell: "",
			office: "",
			email: "",
			roleId: "",
			title: ""
		});
	}, [open]);

	const styles = {
		userFieldStyles: {
			width: "45%",
			marginBottom: 35
		},
		helperText: {
			...(dir === "rtl" && {
				textAlign: "right",
				opacity: "1!important",
				position: "unset!important"
			})
		},
		inputLabelProps: {
			left: "unset",
			...(dir && dir == "rtl" ? { transformOrigin: "top right" } : { transformOrigin: "top left" })
		}

	};


	return (
		<Dialog
			open={open}
			title={<h3><Translate value="mainContent.manageOrganization.orgSettings.manageUsers.dialog.title" /></h3>}
			paperPropStyles={{
				backgroundColor: "#41454a",
				padding: "15px"
			}}
			abort={{
				label: getTranslation("mainContent.manageOrganization.orgSettings.manageUserRoles.cancelBtn"),
				action: () => {
					abortAction();
				}
			}}
			confirm={{
				label: getTranslation("mainContent.manageOrganization.orgSettings.manageUsers.dialog.doneBtn"),
				action: () => {
					updateDisplayErrors({});
					handleSubmit(values, orgId, updateDisplayErrors, onSubmit, confirmAction, dispatch);
				}
			}}
		>
			{orgRoles.length && (
				<div style={{
					width: 260
				}}>
					<SelectField
						id={"new-user-role-selection"}
						label={getTranslation("mainContent.manageOrganization.orgSettings.manageUsers.dialog.userRole")}
						error={displayErrors.role}
						helperText={displayErrors.role ? getTranslation("mainContent.manageOrganization.orgSettings.manageUsers.dialog.errorMessage.selectRoleErr") : ""}
						formControlProps={{
							style: {
								marginTop: 0
							}
						}}
						handleChange={(e) => updateValues(prevState => {
							return {
								...prevState,
								roleId: e.target.value,
								title: orgRoles.find(role => role.id === e.target.value).title
							};
						})}
						value={values.roleId}
						items={orgRoles}
						dir={dir}
					/>
				</div>
			)}
			<Container style={{
				marginTop: 30,
				minHeight: "100%",
				padding: 0
			}}>
				<Divider style={{
					position: "absolute",
					left: 0,
					right: 0
				}} />
				<div style={{
					paddingTop: 24,
					display: "flex",
					flexWrap: "wrap",
					justifyContent: "space-between",
					flexDirection: "row"
				}}>
					<TextField
						variant="standard"
						style={styles.userFieldStyles}
						label={getTranslation("mainContent.manageOrganization.orgSettings.manageUsers.dialog.firstName")}
						error={displayErrors.name}
						helperText={displayErrors.name ? getTranslation("mainContent.manageOrganization.orgSettings.manageUsers.dialog.errorMessage.emptyFieldErr") : ""}
						onChange={(e) => {
							setValue(e.target.value, "firstName", values, updateValues);
						}}
						value={values.firstName}
						autoFocus={true}
						InputLabelProps={{
							style: styles.inputLabelProps
						}}
						FormHelperTextProps={{
							style: styles.helperText
						}}
						InputProps={{ classes: { underline: classes.underline } }}
					/>
					<TextField
						variant="standard"
						style={styles.userFieldStyles}
						label={getTranslation("mainContent.manageOrganization.orgSettings.manageUsers.dialog.lastName")}
						error={displayErrors.name}
						helperText={displayErrors.name ? getTranslation("mainContent.manageOrganization.orgSettings.manageUsers.dialog.errorMessage.emptyFieldErr") : ""}
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
						InputProps={{ classes: { underline: classes.underline } }}
					/>
					<TextField
						variant="standard"
						style={styles.userFieldStyles}
						label={getTranslation("mainContent.manageOrganization.orgSettings.manageUsers.dialog.cellPhone")}
						error={displayErrors.cell}
						helperText={displayErrors.cell ? getTranslation("mainContent.manageOrganization.orgSettings.manageUsers.dialog.errorMessage.formatText") : ""}
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
						InputProps={{ classes: { underline: classes.underline } }}
					/>
					<TextField
						variant="standard"
						style={styles.userFieldStyles}
						label={getTranslation("mainContent.manageOrganization.orgSettings.manageUsers.dialog.officePhone")}
						error={displayErrors.office}
						helperText={displayErrors.office ? getTranslation("mainContent.manageOrganization.orgSettings.manageUsers.dialog.errorMessage.formatText") : ""}
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
						InputProps={{ classes: { underline: classes.underline } }}
					/>
					<TextField
						variant="standard"
						style={styles.userFieldStyles}
						label={getTranslation("mainContent.manageOrganization.orgSettings.manageUsers.dialog.email")}
						type="email"
						error={displayErrors.email}
						helperText={displayErrors.email ? getTranslation("mainContent.manageOrganization.orgSettings.manageUsers.dialog.errorMessage.validEmail") : ""}
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
						InputProps={{ classes: { underline: classes.underline } }}
					/>
				</div>
			</Container>
		</Dialog>
	);
};

export default memo(NewUserDialog);