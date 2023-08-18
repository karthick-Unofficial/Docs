import React, { Fragment, memo, useState } from "react";
// material-ui
import {
	Button,
	Divider,
	List
} from "@mui/material";

// components
import EditPageTemplate from "../../../../shared/components/EditPageTemplate";
import ArticleContainer from "../../../../shared/components/ArticleContainer";
import Row from "./components/Row";
import { Translate, getTranslation } from "orion-components/i18n";
import { useSelector, useDispatch } from "react-redux";
import * as actionCreators from "./sharingConnectionsActions";
import { getDir } from "orion-components/i18n/Config/selector";

const addRemoveImportRow = (importRow, setState) => {
	setState(prevState => {
		return {
			...prevState,
			importRow: !importRow,
			...(importRow && { importId: "", error: null })
		};
	});
};

const handleUpdateImport = (value, setState) => {
	setState(prevState => {
		return {
			...prevState,
			importId: value, error: null
		};
	});
};

const importConnection = (state, setState, establishConnection, dispatch) => {
	const { importId, importRow } = state;

	dispatch(establishConnection(importId, (err, result) => {
		if (err) {
			console.log(err);
		}
		else {
			if (result.success) {
				addRemoveImportRow(importRow, setState);
			}
			else {
				setState(prevState => {
					return {
						...prevState,
						error: result.message
					};
				});
			}
		}
	}));
};



const SharingConnections = () => {
	const dispatch = useDispatch();

	const {
		createConnection,
		disconnect,
		establishConnection
	} = actionCreators;

	const userOrgId = useSelector(state => state.session.user.profile.orgId);
	const org = useSelector(state => state.globalData.orgs[userOrgId]);
	const organization = org;
	const dir = useSelector(state => getDir(state));

	const [state, setState] = useState({
		importRow: false,
		importId: "",
		error: null
	});
	const { importRow, importId, error } = state;
	const sharingConnections = organization ? organization.sharingConnections : [];
	// Connections shared from your org
	const filteredSharingConnectionsFromOrg = sharingConnections
		.filter((connection) => {
			return connection.sourceOrg === organization.orgId;
		});
	const sharedFromOrgItems = filteredSharingConnectionsFromOrg.map((connection, index) => {
		const { targetOrgName } = connection;

		return (
			<Fragment>
				<Row
					id={connection.id}
					index={index}
					value={targetOrgName || connection.id}
					handleClear={() => dispatch(disconnect(connection.id))}
					disabled={true}
					toolTipCheck={true}
					targetOrgName={targetOrgName}
					dir={dir}
				/>
				{index !== filteredSharingConnectionsFromOrg.length - 1 && (
					<Divider style={{ position: "absolute", left: 0, right: -40 }} />
				)
				}
			</Fragment>

		);
	});

	// Connections shared from other orgs
	const filteredSharingConnections = sharingConnections
		.filter((connection) => {
			return connection.sourceOrg !== organization.orgId;
		});
	const sharedWithOrgItems = filteredSharingConnections.map((connection, index) => {
		const { sourceOrgName } = connection;
		return (
			<Fragment>
				<Row
					id={connection.id}
					index={index}
					value={sourceOrgName}
					handleClear={() => dispatch(disconnect(connection.id))}
					disabled={true}
					targetOrgName={sourceOrgName}
					dir={dir}
				/>
				{index !== filteredSharingConnections.length - 1 && (
					<Divider style={{ position: "absolute", left: 0, right: -40 }} />
				)}
			</Fragment>
		);
	});

	const currentConnections = sharedFromOrgItems.length;
	const maxConnections = organization ? organization.maxSharingConnections : 0;

	const styles = {
		button: {
			backgroundColor: "transparent",
			...(dir === "rtl" ? { marginLeft: 26, paddingRight: 0 } : { marginRight: 26, paddingLeft: 0 })
		}
	};

	return (
		<Fragment>
			<EditPageTemplate
				title={getTranslation("mainContent.manageOrganization.orgSettings.title")}
				subTitle={getTranslation("mainContent.manageOrganization.orgSettings.sharingConn.titleText")}
				dir={dir}
			>
				<ArticleContainer
					headerTitle={getTranslation("mainContent.manageOrganization.orgSettings.sharingConn.formTitle1")}
					headerDescription={getTranslation("mainContent.manageOrganization.orgSettings.sharingConn.formTitle1Text")}
					headerFullWidth={true}
					editing={true}
				>
					<div style={{ color: "white", marginTop: 40 }}>
						<div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
							<Button
								disableTouchRipple={true}
								style={styles.button}
								disabled={currentConnections >= maxConnections}
								size="medium"
								color="primary"
								onClick={() => dispatch(createConnection())}
							>
								<Translate value="mainContent.manageOrganization.orgSettings.sharingConn.addConnButton" />
							</Button>
							<p style={{ fontSize: 16 }}><Translate value="mainContent.manageOrganization.orgSettings.sharingConn.activeConn" />: {currentConnections}/{maxConnections}</p>
						</div>
					</div>
					<Divider style={{ position: "absolute", left: 0, right: 0 }} />
					{sharedFromOrgItems.length > 0 && (
						<List>
							{sharedFromOrgItems}
						</List>
					)}
				</ArticleContainer>
				<ArticleContainer
					headerTitle={getTranslation("mainContent.manageOrganization.orgSettings.sharingConn.formTitle2")}
					headerFullWidth={true}
					headerDescription={getTranslation("mainContent.manageOrganization.orgSettings.sharingConn.formTitle2Text")}
					editing={true}
				>
					<div style={{ display: "flex", alignItems: "center", marginTop: "25px", marginBottom: "15px" }}>
						{!importRow && (
							<Button
								size="medium"
								color="primary"
								onClick={() => addRemoveImportRow(importRow, setState)}
							>
								<Translate value="mainContent.manageOrganization.orgSettings.sharingConn.importBtn" />
							</Button>
						)}
					</div>
					{importRow && (
						<Fragment>
							{error && (
								<div style={{ width: "100%" }}>
									<p style={{ color: "red" }}>{error}</p>
								</div>
							)}
							<div style={{ display: "flex" }}>
								<div style={{ width: "70%" }}>
									<Row
										handleChange={(e) => handleUpdateImport(e.target.value, setState)}
										value={importId}
										handleClear={() => setState(prevState => {
											return {
												...prevState,
												importId: "", error: null
											};
										})}
										placeholder={getTranslation("mainContent.manageOrganization.orgSettings.sharingConn.tokenPlaceholder")}
										dir={dir}
									/>
								</div>
								<Button
									size="medium"
									color="primary"
									onClick={() => importConnection(state, setState, establishConnection, dispatch)}
								>
									<Translate value="mainContent.manageOrganization.orgSettings.sharingConn.import" />
								</Button>
								<Button
									size="medium"
									color="error"
									onClick={() => addRemoveImportRow(importRow, setState)}
								>
									<Translate value="mainContent.manageOrganization.orgSettings.sharingConn.cancelBtn" />
								</Button>
							</div>
						</Fragment>
					)}
					<Divider style={{ position: "absolute", left: 0, right: 0 }} />
					{sharedWithOrgItems.length > 0 && (
						<List>
							{sharedWithOrgItems}
						</List>
					)}
				</ArticleContainer>
			</EditPageTemplate>
		</Fragment>

	);
};

export default memo(SharingConnections);