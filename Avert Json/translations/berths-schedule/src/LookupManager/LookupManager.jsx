import React, { memo } from "react";
import PropTypes from "prop-types";
import {
	Drawer,
	Divider,
	IconButton,
	List,
	ListItem,
	ListItemText
} from "@material-ui/core";
import { Clear } from "@material-ui/icons";
import { default as BerthSettings } from "./BerthSettings/BerthSettingsContainer";
import Lookup from "./Lookup/Lookup";

const propTypes = {
	closeManager: PropTypes.func.isRequired,
	open: PropTypes.bool,
	selectManager: PropTypes.func.isRequired,
	type: PropTypes.string,
	imoRequired: PropTypes.bool,
	mmsiRequired: PropTypes.bool,
	user: PropTypes.object
};

const defaultProps = {
	open: false,
	type: null
};

const LookupManager = ({ closeManager, open, selectManager, type, imoRequired, mmsiRequired, user }) => {
	const styles = {
		button: {
			paddingTop: 0,
			paddingBottom: 0
		},
		typography: {
			variant: "h6",
			style: { color: "#4eb5f3" }
		}
	};
	const canManage = user.applications
				&& user.applications.find(app => app.appId === "berth-schedule-app")
				&& user.applications.find(app => app.appId === "berth-schedule-app").permissions
				&& user.applications.find(app => app.appId === "berth-schedule-app").permissions.includes("manage");
	const getForm = () => {
		const contactFields = {
			company: {
				display: "Company Name",
				required: false,
				searchBy: true,
				dataType: "string"
			},
			firstName: {
				display: "First Name",
				required: true,
				searchBy: true,
				dataType: "string"
			},
			lastName: {
				display: "Last Name",
				required: true,
				searchBy: true,
				dataType: "string"
			},
			email: {
				display: "Email",
				required: true,
				searchBy: false,
				dataType: "string"
			},
			phone: {
				display: "Phone",
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
						display: "Name",
						required: true,
						searchBy: true,
						dataType: "string"
					},
					mmsid: {
						display: "MMSI Number",
						required: mmsiRequired,
						searchBy: true,
						dataType: "string"
					},
					imo: {
						display: "IMO / Official Number",
						required: imoRequired,
						searchBy: true,
						dataType: "number"
					},
					type: {
						display: "Type",
						required: false,
						searchBy: false,
						dataType: "string"
					},
					loa: {
						display: "LOA (ft)",
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
						display: "Draft (ft)",
						required: false,
						searchBy: false,
						dataType: "number"
					}
				};
				return (
					<Lookup key={type} endpoint="vessels" type={type} fields={fields} canManage={canManage} />
				);
			}
			case "barge": {
				const fields = {
					name: {
						display: "Name",
						required: true,
						searchBy: true,
						dataType: "string"
					},
					registry: {
						display: "IMO / Official Number",
						required: true,
						searchBy: true,
						dataType: "string"
					},
					type: {
						display: "Type",
						required: false,
						searchBy: false,
						dataType: "string"
					},
					loa: {
						display: "LOA (ft)",
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
					<Lookup key={type} endpoint="barges" type={type} fields={fields} canManage={canManage} />
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
								display: "Company Name",
								required: true,
								searchBy: true,
								dataType: "string"
							}
						}}
						canManage={canManage}
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
								display: "Name",
								required: true,
								searchBy: true,
								dataType: "string"
							}
						}}
						canManage={canManage}
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
								display: "Activity",
								required: true,
								searchBy: true,
								dataType: "string"
							}
						}}
						canManage={canManage}
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
					/>
				);
		}
	};
	return (
		<Drawer
			anchor="left"
			open={open}
			onClose={closeManager}
			PaperProps={{
				style: {
					width: type ? "100%" : 300,
					flexDirection: "row"
				}
			}}
		>
			{type && (
				<div style={{ position: "absolute", top: 16, right: 16 }}>
					<IconButton onClick={closeManager}>
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
					<ListItem style={{ paddingBottom: 6 }}>
						<ListItemText
							primary="Berth Settings"
							primaryTypographyProps={{ variant: "h5" }}
						/>
					</ListItem>
					<ListItem
						selected={type === "berths"}
						onClick={() => selectManager("berths")}
						button
						style={styles.button}
					>
						<ListItemText
							primary="Manage"
							primaryTypographyProps={styles.typography}
						/>
					</ListItem>
				</List>
				<Divider />
				<List>
					<ListItem style={{ paddingBottom: 6 }}>
						<ListItemText
							primary="Lookup Tables"
							primaryTypographyProps={{ variant: "h5" }}
						/>
					</ListItem>
					<ListItem
						selected={type === "vessel"}
						onClick={() => selectManager("vessel")}
						button
						style={styles.button}
					>
						<ListItemText
							primary="Vessel Information"
							primaryTypographyProps={styles.typography}
						/>
					</ListItem>
					<ListItem
						selected={type === "barge"}
						onClick={() => selectManager("barge")}
						button
						style={styles.button}
					>
						<ListItemText
							primary="Barge Information"
							primaryTypographyProps={styles.typography}
						/>
					</ListItem>
					<ListItem
						selected={type === "vesselType"}
						onClick={() => selectManager("vesselType")}
						button
						style={styles.button}
					>
						<ListItemText
							primary="Vessel Type"
							primaryTypographyProps={styles.typography}
						/>
					</ListItem>
					<ListItem
						selected={type === "vesselActivity"}
						onClick={() => selectManager("vesselActivity")}
						button
						style={styles.button}
					>
						<ListItemText
							primary="Vessel Activity"
							primaryTypographyProps={styles.typography}
						/>
					</ListItem>
					<ListItem
						selected={type === "agent"}
						onClick={() => selectManager("agent")}
						button
						style={styles.button}
					>
						<ListItemText
							primary="Agent / Owner"
							primaryTypographyProps={styles.typography}
						/>
					</ListItem>
					<ListItem
						selected={type === "requestedBy"}
						onClick={() => selectManager("requestedBy")}
						button
						style={styles.button}
					>
						<ListItemText
							primary="Requestor"
							primaryTypographyProps={styles.typography}
						/>
					</ListItem>
					<ListItem
						selected={type === "shipperReceiver"}
						onClick={() => selectManager("shipperReceiver")}
						button
						style={styles.button}
					>
						<ListItemText
							primary="Shipper Receiver"
							primaryTypographyProps={styles.typography}
						/>
					</ListItem>
					<ListItem
						selected={type === "stevedore"}
						onClick={() => selectManager("stevedore")}
						button
						style={styles.button}
					>
						<ListItemText
							primary="Stevedores"
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

LookupManager.propTypes = propTypes;
LookupManager.defaultProps = defaultProps;

export default memo(LookupManager);
