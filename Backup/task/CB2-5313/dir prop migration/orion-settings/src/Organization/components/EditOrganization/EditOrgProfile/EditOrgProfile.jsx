import React, { useState, useEffect, memo, Fragment } from "react";
import { useNavigate } from "react-router-dom";
//material ui
import {
	Button,
	Container,
	TextField
} from "@mui/material";
//components
import EditPageTemplate from "../../../../shared/components/EditPageTemplate";
import ArticleContainer from "../../../../shared/components/ArticleContainer";
import ProfilePicDropzone from "../../../../shared/components/ProfilePicDropzone";
import { Translate, getTranslation } from "orion-components/i18n";
import { useSelector, useDispatch } from "react-redux";
import * as actionCreators from "./editOrgProfileActions";
import { getDir } from "orion-components/i18n/Config/selector";

const EditOrgProfile = () => {
	const dispatch = useDispatch();

	const { updateOrg } = actionCreators;
	const org = useSelector(state => state.globalData.orgs[state.session.user.profile.orgId]);
	const dir = useSelector(state => getDir(state));

	const navigate = useNavigate();
	const [values, updateValues] = useState({
		organizationName: "",
		organizationDescription: ""
	});
	const [stagedFile, updateStagedFile] = useState(null);
	const [displayErrors, updateDisplayErrors] = useState({});
	useEffect(() => {
		if (org) {
			updateValues({
				organizationName: org.name,
				organizationDescription: org.description
			});
			updateStagedFile(null);
		}
	}, [org]);

	const styles = {
		helperText: {
			textAlign: "unset"
		},
		inputLabelProps: {
			left: "unset",
			...(dir && dir == "rtl" ? { transformOrigin: "top right" } : { transformOrigin: "top left" })
		},
		container: {
			textAlign: "unset",
			paddingLeft: 0,
			paddingRight: 0
		}
	}

	const getSafely = fn => {
		try {
			return fn();
		} catch (e) {
			return undefined;
		}
	};

	const handleSubmit = async (values, stagedFile, org, updateOrg, updateDisplayErrors, ProfileImage) => {
		// clear old errors and recheck if they are still valid errors
		const newDisplayErrors = {};
		let errors = false;
		if (!values.organizationName) {
			newDisplayErrors.organizationName = <Translate value="mainContent.manageOrganization.orgProfile.editOrganization.errorMessage.emptyName" />;
			errors = true;
		}
		if (values.organizationDescription.length > 50) {
			newDisplayErrors.organizationDescription = <Translate value="mainContent.manageOrganization.orgProfile.editOrganization.errorMessage.descTooLong" />;
		}
		if (errors) {
			updateDisplayErrors(newDisplayErrors);
			return;
		}

		const data = {
			organization: {
				name: values.organizationName,
				description: values.organizationDescription,
				orgId: org.orgId,
				orgProfileImage: ProfileImage
			}
		};

		if (org.orgId) {
			// we are editing
			// Staged file can be null here if there was no change
			updateDisplayErrors({});
			dispatch(updateOrg(org.orgId, data, stagedFile));
			navigate(-1);
		}
	};

	const checkForChangedValues = (org, values, stagedFile) => {
		if (stagedFile || org.name !== values.organizationName || org.description !== values.organizationDescription) {
			return false;
		} else {
			return true;
		}
	};

	const stageFile = (files, stagedFile, updateStagedFile) => {
		// If we already have a file staged and we are restaging, we need to
		// destroy the old preview object url
		if (stagedFile) {
			window.URL.revokeObjectURL(stagedFile[0].preview);
		}

		updateStagedFile(files);
	};


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
	} else if (getSafely(() => org.profileImage)) {
		// <-- getSafely will cause this to return undefined for new org (no org prop)
		const imageURL = "/_download?handle=" + org.profileImage;
		orgIcon = (
			<div
				className="org-icon org-profile-image"
				style={{ backgroundImage: "url(" + imageURL + ")" }}
			>
				<img src={`/_download?handle=" + ${org.profileImage}`} alt="profileImage" style={{ visibility: "hidden" }} />
			</div>
		);
	} else {
		orgIcon = (
			<div className="org-icon">
				<span>{orgName ? orgName[0] : "O"}</span>
			</div>
		);
	}
	return (
		<EditPageTemplate title={getTranslation("mainContent.manageOrganization.title")} subTitle={getTranslation("mainContent.manageOrganization.orgProfile.editOrganization.titleDesc")} dir={dir}>
			<ArticleContainer headerTitle={getTranslation("mainContent.manageOrganization.orgProfile.editOrganization.formTitle")} headerDescription={""} editing={true} >
				<Fragment>
					<Container style={{
						marginTop: 30,
						display: "flex",
						padding: 0,
						alignItems: "center"
					}}>
						{orgIcon}
						<ProfilePicDropzone
							label={getTranslation("mainContent.manageOrganization.orgProfile.editOrganization.changeProfile")}
							stageFile={(files) => stageFile(files, stagedFile, updateStagedFile)}
							dir={dir}
						/>
					</Container>
					<div style={{
						display: "flex",
						flexDirection: "column",
						marginTop: 60,
						marginBottom: 80
					}}>
						<TextField
							variant="standard"
							style={{
								width: "60%"
							}}
							label={getTranslation("mainContent.manageOrganization.orgProfile.editOrganization.orgName")}
							error={displayErrors.organizationName}
							helperText={displayErrors.organizationName}
							onChange={(e) => {
								updateValues({ ...values, organizationName: e.target.value });
							}}
							value={values.organizationName}
							InputLabelProps={{
								style: styles.inputLabelProps
							}}
							FormHelperTextProps={{
								style: styles.helperText
							}}
						/>
						<TextField
							variant="standard"
							label={getTranslation("mainContent.manageOrganization.orgProfile.editOrganization.orgDescription", values.organizationDescription.length)}
							multiline={true}
							error={displayErrors.organizationDescription}
							helperText={displayErrors.organizationDescription}
							value={values.organizationDescription}
							style={{
								marginTop: 80
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

					<Container style={styles.container}>
						<Button
							onClick={() => {
								updateValues({
									organizationName: org.name,
									organizationDescription: org.description
								});
								updateStagedFile(null);
								updateDisplayErrors({});
								navigate(-1);
							}}
						>
							<Translate value="mainContent.manageOrganization.orgSettings.activeDir.cancelBtn" />
						</Button>
						<Button
							style={{
								paddingRight: 0
							}}
							disabled={checkForChangedValues(org, values, stagedFile)}
							color="primary"
							onClick={() => {
								updateDisplayErrors({});
								handleSubmit(values, stagedFile, org, updateOrg, updateDisplayErrors, org.profileImage);
							}}
						>
							<Translate value="mainContent.manageOrganization.orgSettings.activeDir.saveBtn" />
						</Button>
					</Container>
				</Fragment>
			</ArticleContainer>
		</EditPageTemplate>
	);
};

export default memo(EditOrgProfile);