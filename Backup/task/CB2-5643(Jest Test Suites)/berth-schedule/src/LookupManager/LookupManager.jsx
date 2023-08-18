import React, { memo } from "react";
import {
	Drawer,
	Divider,
	IconButton,
	List,
	ListItem,
	ListItemText
} from "@mui/material";
import { Clear } from "@mui/icons-material";
import BerthSettings from "./BerthSettings/BerthSettings";
import Lookup from "./Lookup/Lookup";
import { getTranslation } from "orion-components/i18n";
import { useSelector, useDispatch } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";
import { closeManager, selectManager } from "./lookupManagerActions";



const LookupManager = () => {
	const dispatch = useDispatch();

	const management = useSelector(state => state.management);
	const clientConfig = useSelector(state => state.clientConfig);
	const { open, type } = management;
	const { imoRequired, mmsiRequired } = clientConfig;
	const user = useSelector(state => state.session.user.profile);
	const dir = useSelector(state => getDir(state));
	const imoReq = Boolean(imoRequired);
	const mmsiReq = Boolean(mmsiRequired);

	const styles = {
		button: {
			paddingTop: 0,
			paddingBottom: 0
		},
		typography: {
			variant: "h6",
			style: { color: "#4eb5f3" }
		},
		listItem: {
			paddingBottom: 6,
			...(dir === "rtl" && { textAlign: "right" })
		},
		clearWrapper: {
			...(dir == "rtl" ? { position: "absolute", top: 16, left: 16 } : { position: "absolute", top: 16, right: 16 })
		}
	};
	const canManage = user.applications
		&& user.applications.find(app => app.appId === "berth-schedule-app")
		&& user.applications.find(app => app.appId === "berth-schedule-app").permissions
		&& user.applications.find(app => app.appId === "berth-schedule-app").permissions.includes("manage");

	const getForm = () => {
		const contactFields = {
			company: {
				display: getTranslation("lookupManager.fieldLabel.contactFields.companyName"),
				required: false,
				searchBy: true,
				dataType: "string"
			},
			firstName: {
				display: getTranslation("lookupManager.fieldLabel.contactFields.firstName"),
				required: true,
				searchBy: true,
				dataType: "string"
			},
			lastName: {
				display: getTranslation("lookupManager.fieldLabel.contactFields.lastName"),
				required: true,
				searchBy: true,
				dataType: "string"
			},
			email: {
				display: getTranslation("lookupManager.fieldLabel.contactFields.email"),
				required: true,
				searchBy: false,
				dataType: "string"
			},
			phone: {
				display: getTranslation("lookupManager.fieldLabel.contactFields.phone"),
				required: false,
				searchBy: false,
				dataType: "string"
			}
		};
		switch (type) {
			case "berths":
				return <BerthSettings />;
			case "vessel": {
				const fields = {
					name: {
						display: getTranslation("lookupManager.fieldLabel.vessel.name"),
						required: true,
						searchBy: true,
						dataType: "string"
					},
					mmsid: {
						display: getTranslation("lookupManager.fieldLabel.vessel.mmsiNumber"),
						required: mmsiReq,
						searchBy: true,
						dataType: "string"
					},
					imo: {
						display: getTranslation("lookupManager.fieldLabel.vessel.imoNumber"),
						required: imoReq,
						searchBy: true,
						dataType: "number"
					},
					type: {
						display: getTranslation("lookupManager.fieldLabel.vessel.type"),
						required: false,
						searchBy: false,
						dataType: "string"
					},
					loa: {
						display: getTranslation("lookupManager.fieldLabel.vessel.loa"),
						required: true,
						searchBy: false,
						dataType: "number"
					},
					grt: {
						display: "GRT",
						required: false,
						searchBy: false,
						dataType: "number"
					},
					draft: {
						display: getTranslation("lookupManager.fieldLabel.vessel.draft"),
						required: false,
						searchBy: false,
						dataType: "number"
					}
				};
				return (
					<Lookup key={type} endpoint="vessels" type={type} fields={fields} canManage={canManage} dir={dir} />
				);
			}
			case "barge": {
				const fields = {
					name: {
						display: getTranslation("lookupManager.fieldLabel.barge.name"),
						required: true,
						searchBy: true,
						dataType: "string"
					},
					registry: {
						display: getTranslation("lookupManager.fieldLabel.barge.imoNumber"),
						required: true,
						searchBy: true,
						dataType: "string"
					},
					type: {
						display: getTranslation("lookupManager.fieldLabel.barge.type"),
						required: false,
						searchBy: false,
						dataType: "string"
					},
					loa: {
						display: getTranslation("lookupManager.fieldLabel.barge.loa"),
						required: true,
						searchBy: false,
						dataType: "number"
					},
					grt: {
						display: "GRT",
						required: false,
						searchBy: false,
						dataType: "number"
					}
				};
				return (
					<Lookup key={type} endpoint="barges" type={type} fields={fields} canManage={canManage} dir={dir} />
				);
			}
			case "shipperReceiver":
				return (
					<Lookup
						key={type}
						type={type}
						endpoint="shippersReceivers"
						fields={{
							company: {
								display: getTranslation("lookupManager.fieldLabel.shipperReceiver.companyName"),
								required: true,
								searchBy: true,
								dataType: "string"
							}
						}}
						canManage={canManage}
						dir={dir}
					/>
				);
			case "vesselType":
				return (
					<Lookup
						key={type}
						endpoint="vesselTypes"
						type={type}
						fields={{
							name: {
								display: getTranslation("lookupManager.fieldLabel.vesselType.name"),
								required: true,
								searchBy: true,
								dataType: "string"
							}
						}}
						canManage={canManage}
						dir={dir}
					/>
				);
			case "vesselActivity":
				return (
					<Lookup
						key={type}
						endpoint="vesselActivities"
						type={type}
						fields={{
							activity: {
								display: getTranslation("lookupManager.fieldLabel.vesselActivity.activity"),
								required: true,
								searchBy: true,
								dataType: "string"
							}
						}}
						canManage={canManage}
						dir={dir}
					/>
				);
			default:
				return (
					<Lookup
						key={type}
						endpoint={`${type}s`}
						type={type}
						fields={contactFields}
						canManage={canManage}
						dir={dir}
					/>
				);
		}
	};
	return (
		<Drawer
			anchor={dir == "rtl" ? "right" : "left"}
			open={open}
			onClose={() => dispatch(closeManager())}
			PaperProps={{
				style: {
					width: type ? "100%" : 300,
					flexDirection: "row"
				}
			}
			}
		>
			{type && (
				<div style={styles.clearWrapper}>
					<IconButton onClick={() => dispatch(closeManager())}>
						<Clear />
					</IconButton>
				</div>
			)}

			<div
				style={{
					width: 300,
					height: "100%",
					borderRight: "1px solid #ffffff1f"
				}}
			>
				<List>
					<ListItem style={styles.listItem}>
						<ListItemText
							primary={getTranslation("lookupManager.listItemText.berthSettings")}
							primaryTypographyProps={{ variant: "h5" }}
						/>
					</ListItem>
					<ListItem
						selected={type === "berths"}
						onClick={() => dispatch(selectManager("berths"))}
						button
						style={{ ...styles.listItem, ...styles.button }}
					>
						<ListItemText
							primary={getTranslation("lookupManager.listItemText.manage")}
							primaryTypographyProps={styles.typography}
						/>
					</ListItem>
				</List>
				<Divider />
				<List>
					<ListItem style={styles.listItem}>
						<ListItemText
							primary={getTranslation("lookupManager.listItemText.lookupTables")}
							primaryTypographyProps={{ variant: "h5" }}
						/>
					</ListItem>
					<ListItem
						selected={type === "vessel"}
						onClick={() => dispatch(selectManager("vessel"))}
						button
						style={{ ...styles.listItem, ...styles.button }}
					>
						<ListItemText
							primary={getTranslation("lookupManager.listItemText.vesselInfo")}
							primaryTypographyProps={styles.typography}
						/>
					</ListItem>
					<ListItem
						selected={type === "barge"}
						onClick={() => dispatch(selectManager("barge"))}
						button
						style={{ ...styles.listItem, ...styles.button }}
					>
						<ListItemText
							primary={getTranslation("lookupManager.listItemText.bargeInfo")}
							primaryTypographyProps={styles.typography}
						/>
					</ListItem>
					<ListItem
						selected={type === "vesselType"}
						onClick={() => dispatch(selectManager("vesselType"))}
						button
						style={{ ...styles.listItem, ...styles.button }}
					>
						<ListItemText
							primary={getTranslation("lookupManager.listItemText.vesselType")}
							primaryTypographyProps={styles.typography}
						/>
					</ListItem>
					<ListItem
						selected={type === "vesselActivity"}
						onClick={() => dispatch(selectManager("vesselActivity"))}
						button
						style={{ ...styles.listItem, ...styles.button }}
					>
						<ListItemText
							primary={getTranslation("lookupManager.listItemText.vesselActivity")}
							primaryTypographyProps={styles.typography}
						/>
					</ListItem>
					<ListItem
						selected={type === "agent"}
						onClick={() => dispatch(selectManager("agent"))}
						button
						style={{ ...styles.listItem, ...styles.button }}
					>
						<ListItemText
							primary={getTranslation("lookupManager.listItemText.agent")}
							primaryTypographyProps={styles.typography}
						/>
					</ListItem>
					<ListItem
						selected={type === "requestedBy"}
						onClick={() => dispatch(selectManager("requestedBy"))}
						button
						style={{ ...styles.listItem, ...styles.button }}
					>
						<ListItemText
							primary={getTranslation("lookupManager.listItemText.requestor")}
							primaryTypographyProps={styles.typography}
						/>
					</ListItem>
					<ListItem
						selected={type === "shipperReceiver"}
						onClick={() => dispatch(selectManager("shipperReceiver"))}
						button
						style={{ ...styles.listItem, ...styles.button }}
					>
						<ListItemText
							primary={getTranslation("lookupManager.listItemText.shipperReceiver")}
							primaryTypographyProps={styles.typography}
						/>
					</ListItem>
					<ListItem
						selected={type === "stevedore"}
						onClick={() => dispatch(selectManager("stevedore"))}
						button
						style={{ ...styles.listItem, ...styles.button }}
					>
						<ListItemText
							primary={getTranslation("lookupManager.listItemText.stevedores")}
							primaryTypographyProps={styles.typography}
						/>
					</ListItem>
				</List>
			</div>
			{type && (
				<div style={{ width: "-webkit-fill-available", margin: "34px 16px" }}>
					{getForm()}
				</div>
			)}
		</Drawer>
	);
};



export default memo(LookupManager);
