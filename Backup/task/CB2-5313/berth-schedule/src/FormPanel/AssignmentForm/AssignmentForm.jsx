import React, { memo, Fragment, useCallback, useState } from "react";
import PropTypes from "prop-types";
import { Button, SvgIcon, CircularProgress, Tooltip } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import { mdiFilePdfBox } from "@mdi/js";
import VesselFields from "./components/VesselFields";
import BargeFields from "./components/BargeFields";
import ScheduleFields from "./components/ScheduleFields";
import CargoBerthFields from "./components/CargoBerthFields";
import AgentOwnerFields from "./components/AgentOwnerFields";
import RequestingFields from "./components/RequestingFields";
import ServicesFields from "./components/ServicesFields";
import NotesField from "./components/NotesField";
import { validate } from "../../shared/utility/validate";
import {
	addBerthAssignment,
	deleteBerthAssignment,
	updateBerthAssignment
} from "./helpers";
import { Translate, getTranslation } from "orion-components/i18n";
import { useSelector, useDispatch } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";
import { generatePDFExport } from "./assignmentFormActions";
import { makeStyles } from "@mui/styles";

const propTypes = {
	handleClose: PropTypes.func.isRequired
};

const useStyles = makeStyles({
	disabled: {
		color: "rgba(255, 255, 255, 0.3)!important"
	},
	approveDisabled: {
		backgroundColor: "rgba(255, 255, 255, 0.12)!important"
	}
});

const AssignmentForm = ({ handleClose }) => {
	const dispatch = useDispatch();
	const classes = useStyles();

	const berths = useSelector(state => state.berths);
	const formPanel = useSelector(state => state.formPanel);
	const session = useSelector(state => state.session);
	const clientConfig = useSelector(state => state.clientConfig);
	const { data, editing, isGeneratingPdf, exportingError } = formPanel;
	const { agentOwner, requestingCompany, imoRequired, mmsiRequired, servicesConfig, notesEnabled, cargoDirectionLevel, voyageNumber } = clientConfig;
	const user = session.user.profile;
	const imoReq = Boolean(imoRequired);
	const mmsiReq = Boolean(mmsiRequired);
	const enabledNotes = Boolean(notesEnabled !== false);
	const timeFormatPreference = useSelector(state => state.appState.global.timeFormat);
	const dir = useSelector(state => getDir(state));
	const locale = useSelector(state => state.i18n.locale);

	let agentOwnerEnabled = true;
	let agentOwnerRequired = true;
	if (agentOwner) {
		agentOwnerEnabled = Boolean(agentOwner.enabled);
		agentOwnerRequired = Boolean(agentOwner.required);
	}

	let requestingCompanyEnabled = true;
	let requestingCompanyRequired = true;
	if (requestingCompany) {
		requestingCompanyEnabled = Boolean(requestingCompany.enabled);
		requestingCompanyRequired = Boolean(requestingCompany.required);
	}

	let voyageNumberEnabled = false;
	let voyageNumberRequired = false;
	if (voyageNumber) {
		voyageNumberEnabled = Boolean(voyageNumber.enabled);
		voyageNumberRequired = Boolean(voyageNumber.required);
	}

	const [values, setValues] = useState(data);
	const [assignmentChanged, setAssignmentChanged] = useState(false);
	const [deletionConfirm, setDeletionConfirm] = useState(false);

	const handleConfirmDelete = () => {
		setDeletionConfirm(true);
		setTimeout(() => {
			setDeletionConfirm(false);
		}, 5000);
	};

	const {
		id,
		agent,
		barges,
		cargo,
		approved,
		berth,
		requestedBy,
		schedule,
		vessel,
		cargoDirection,
		footmarkAssignment,
		footmark,
		services,
		notes,
		primaryActivity
	} = values;
	const canEdit = user.applications && user.applications.find(app => app.appId === "berth-schedule-app") &&
		user.applications.find(app => app.appId === "berth-schedule-app").permissions.includes("manage");
	const selectedBerth = berths.find(b => b.id === berth.id);
	const isValid = () => {

		const isFootmarkValid = parseFloat(footmark) > -1 ? true : false;

		let valid =
			vessel.name &&
			(!mmsiReq || vessel.mmsid) &&
			vessel.loa &&
			(!imoReq || vessel.imo) &&
			validate("number", vessel.imo) &&
			validate("grt", vessel.grt) &&
			validate("loa", vessel.loa) &&
			validate("draft", vessel.draft) &&
			(!agentOwnerRequired || agent.name.firstName) &&
			(!agentOwnerRequired || agent.email) &&
			(!requestingCompanyRequired || requestedBy.name.firstName) &&
			(!requestingCompanyRequired || requestedBy.email) &&
			(!voyageNumberRequired || vessel.voyageNumber) &&
			berth.id &&
			isFootmarkValid &&
			validate("number", footmark) &&
			(selectedBerth &&
				(footmark <= selectedBerth.endFootmark &&
					footmark >= selectedBerth.beginningFootmark));

		Object.values(values).forEach(value => {
			if (value && value.email && !validate("email", value.email)) {
				valid = false;
			} else if (value && value.phone && !validate("phone", value.phone)) {
				valid = false;
			}
		});

		if (barges.length) {
			Object.values(barges).forEach(barge => {
				const { name, registry, loa, grt } = barge;
				if (
					!name ||
					!registry ||
					!loa ||
					!validate("loa", loa) ||
					!validate("grt", grt)
				) {
					valid = false;
				}
			});
		}

		if (cargo.length) {
			Object.values(cargo).forEach(c => {
				const { commodity, shipperReceiver, weight } = c;
				if (
					(!commodity && !shipperReceiver.company && !weight) ||
					!validate("number", weight)
				) {
					valid = false;
				}
			});
		}

		if (schedule.atd && !schedule.ata) {
			valid = false;
		}

		// If both ATA and ATD are set, prevent ATD from being earlier than ATA
		if ((schedule.ata && schedule.atd) && new Date(schedule.atd) < new Date(schedule.ata)) {
			valid = false;
		}

		return valid;
	};
	const handleChange = useCallback(
		(key, type) => e => {
			if (type) {
				setValues({
					...values,
					[type]: {
						...values[type],
						[key]: type === "schedule" ? e : e.target.value
					}
				});
			} else {
				setValues({
					...values,
					[key]: e.target.value
				});
			}
			setAssignmentChanged(true);
		},
		[values]
	);
	const handleChangeName = useCallback(
		(type, firstName = "", lastName = "") => {
			setValues({
				...values,
				[type]: {
					...values[type],
					name: { firstName, lastName }
				}
			});
			setAssignmentChanged(true);
		},
		[values]
	);
	const handleUpdate = useCallback(
		(key, update) => {
			if (update) {
				setValues({ ...values, [key]: update });
			} else {
				setValues({ ...values, [key]: data[key] });
			}
			setAssignmentChanged(true);
		},
		[data, values]
	);

	const handleExport = () => {
		const berthName = data.berth ? data.berth.name : null;
		dispatch(generatePDFExport(data.id, data.vessel.name, berthName, new Date()));
	};

	const handleSave = (e, approved = false) => {
		const newAssignment = { ...values };
		const keys = ["agent", "berth", "requestedBy", "vessel", "primaryActivity"];
		keys.forEach(key => {
			newAssignment[`${key}Id`] = newAssignment[key].id;
		});
		if (!id) {
			addBerthAssignment(newAssignment);
		} else {
			updateBerthAssignment(id, newAssignment, approved);
		}
		handleClose();
	};
	const handleDelete = () => {
		deleteBerthAssignment(id);
		handleClose();
	};

	const handleApprove = () => {
		if (!id) {
			handleUpdate("approved", true);
		} else {
			handleSave(null, true);
		}
	};

	const styles = {
		themedButton: {
			fontSize: "0.875rem",
			fontWeight: "500",
			letterSpacing: 0,
			minWidth: "64px",
			height: "36px",
			"&:hover": {
				backgroundColor: "rgba(255, 255, 255, 0.08)"
			}
		}
	};

	// -- enable PDF Export if assignment has already been created and currently has no changes
	const cleanAssignment = data.id && !assignmentChanged;
	return (
		<Fragment>
			<div style={{ display: "flex", flexDirection: "column", margin: "16px 8px" }}>
				<div style={{ display: "flex" }}>
					{!isGeneratingPdf ? (
						<Fragment>
							<Tooltip title={!cleanAssignment ? getTranslation("formPanel.assignmentForm.assignmentTooltip") : ""} placement="top">
								<span>
									<Button
										variant="contained"
										style={{ width: "150px", backgroundColor: "#5E6571", color: "#fff", fontSize: "12px", opacity: `${cleanAssignment ? "1" : "0.4"}` }}
										startIcon={
											<SvgIcon style={dir == "rtl" ? { marginLeft: 8 } : {}}>
												<path d={mdiFilePdfBox} />
											</SvgIcon>
										}
										onClick={handleExport}
										disabled={!cleanAssignment}
									>
										<Translate value="formPanel.assignmentForm.buttonLabels.printExport" />
									</Button>
								</span>
							</Tooltip>
						</Fragment>
					) : (
						<div style={dir == "rtl" ? { marginRight: "60px" } : { marginLeft: "60px" }}>
							<CircularProgress size={30} />
						</div>
					)}
					<div style={dir == "rtl" ? { marginRight: "auto" } : { marginLeft: "auto" }}>
						{canEdit && editing && (
							<Button
								onClick={deletionConfirm ? handleDelete : handleConfirmDelete}
								variant={deletionConfirm ? "contained" : "text"}
								color={deletionConfirm ? "secondary" : "error"}
								style={dir == "rtl" ? { color: deletionConfirm ? "#FFF" : "#E85858", marginLeft: "64px" } : { color: deletionConfirm ? "#FFF" : "#E85858", marginRight: "64px" }}
							>
								{deletionConfirm ? <Translate value="global.CBComponents.CBDialog.confirmDelete" />
									: <Translate value="formPanel.assignmentForm.buttonLabels.delete" />}
							</Button>
						)}
						<Button onClick={handleClose} sx={{ ...styles.themedButton, color: "#B5B9BE", letterSpacing: "0.02857em" }}>
							<Translate value="formPanel.assignmentForm.buttonLabels.cancel" />
						</Button>
						<Button disabled={!isValid() || !canEdit} onClick={handleSave} classes={{ disabled: classes.disabled }}>
							<Translate value="formPanel.assignmentForm.buttonLabels.save" />
						</Button>
					</div>
				</div>
				{exportingError &&
					<span className="cb-font-b2 error-text">{exportingError.message}</span>
				}
			</div>
			{!data.approved && (
				<Button
					disabled={
						!isValid() ||
						!canEdit ||
						!schedule.eta ||
						!schedule.etd ||
						!vessel.loa ||
						approved
					}
					style={{
						borderRadius: 0,
						boxShadow: "unset",
						color: "#FFF",
						backgroundColor: approved ? "green" : ""
					}}
					onClick={handleApprove}
					variant="contained"
					classes={{ disabled: classes.approveDisabled }}
				>
					<CheckCircle style={dir == "rtl" ? { marginLeft: 12 } : { marginRight: 12 }} />
					{!approved ? <Translate value="formPanel.assignmentForm.buttonLabels.approveBerth" /> : <Translate value="formPanel.assignmentForm.buttonLabels.approvedBerth" />}
				</Button>
			)}
			<VesselFields
				handleChange={handleChange}
				handleUpdate={handleUpdate}
				vessel={vessel}
				primaryActivity={primaryActivity}
				cargoDirectionEnabled={cargoDirectionLevel !== "cargo"}
				cargoDirection={cargoDirection}
				voyageNumberEnabled={voyageNumberEnabled}
				voyageNumberRequired={voyageNumberRequired}
				imoRequired={imoReq}
				mmsiRequired={mmsiReq}
				dir={dir}
			/>
			<BargeFields
				handleChange={handleChange}
				handleUpdate={handleUpdate}
				barges={barges}
				dir={dir}
			/>
			<ScheduleFields
				handleChange={handleChange}
				schedule={schedule}
				timeFormatPreference={timeFormatPreference}
				dir={dir}
				locale={locale}
			/>
			<CargoBerthFields
				handleChange={handleChange}
				handleUpdate={handleUpdate}
				berth={berth}
				berths={berths}
				cargo={cargo}
				cargoDirectionEnabled={cargoDirectionLevel === "cargo"}
				footmarkAssignment={footmarkAssignment}
				footmark={footmark}
				dir={dir}
			/>
			{agentOwnerEnabled && <AgentOwnerFields
				saved={!!id}
				handleChange={handleChange}
				handleChangeName={handleChangeName}
				handleUpdate={handleUpdate}
				agent={agent}
				isRequired={agentOwnerRequired}
				dir={dir}
			/>}
			{requestingCompanyEnabled && <RequestingFields
				handleChange={handleChange}
				handleChangeName={handleChangeName}
				handleUpdate={handleUpdate}
				requestedBy={requestedBy}
				isRequired={requestingCompanyRequired}
				dir={dir}
			/>}
			{(servicesConfig && servicesConfig.length > 0) && <ServicesFields
				handleUpdate={handleUpdate}
				serviceConfig={servicesConfig}
				services={services}
				dir={dir}
			/>}
			{enabledNotes && <NotesField
				handleChange={handleChange}
				notes={notes}
				dir={dir}
			/>}
		</Fragment>
	);
};

AssignmentForm.propTypes = propTypes;


export default memo(AssignmentForm);
