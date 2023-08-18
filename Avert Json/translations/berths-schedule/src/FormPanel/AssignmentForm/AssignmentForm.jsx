import React, { memo, Fragment, useCallback, useState } from "react";
import PropTypes from "prop-types";
import { Button, SvgIcon, CircularProgress, Tooltip } from "@material-ui/core";
import { CheckCircle } from "@material-ui/icons";
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

const propTypes = {
	berths: PropTypes.array,
	data: PropTypes.object.isRequired,
	editing: PropTypes.bool,
	handleClose: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired,
	agentOwnerEnabled: PropTypes.bool.isRequired,
	agentOwnerRequired: PropTypes.bool,
	requestingCompanyEnabled: PropTypes.bool.isRequired,
	requestingCompanyRequired: PropTypes.bool,
	voyageNumberEnabled: PropTypes.bool.isRequired,
	voyageNumberRequired: PropTypes.bool,
	imoRequired: PropTypes.bool.isRequired,
	mmsiRequired: PropTypes.bool.isRequired,
	servicesConfig: PropTypes.array,
	notesEnabled: PropTypes.bool.isRequired,
	cargoDirectionLevel: PropTypes.string,
	timeFormatPreference: PropTypes.string,
	isGeneratingPdf: PropTypes.bool.isRequired,
	generatePDFExport: PropTypes.func.isRequired,
	exportingError: PropTypes.object
};

const defaultProps = {
	berths: [],
	editing: false,
	timeFormatPreference: "12-hour"
};

const AssignmentForm = ({
	berths,
	data,
	editing,
	handleClose,
	user,
	agentOwnerEnabled,
	agentOwnerRequired,
	requestingCompanyEnabled,
	requestingCompanyRequired,
	voyageNumberEnabled,
	voyageNumberRequired,
	imoRequired,
	mmsiRequired,
	servicesConfig,
	notesEnabled,
	cargoDirectionLevel,
	timeFormatPreference,
	isGeneratingPdf,
	generatePDFExport,
	exportingError
}) => {
	const [values, setValues] = useState(data);
	const [assignmentChanged, setAssignmentChanged] = useState(false);
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
	console.log("user: ", user);
	const canEdit = user.applications && user.applications.find(app => app.appId === "berth-schedule-app") && 
	user.applications.find(app => app.appId === "berth-schedule-app").permissions.includes("manage");
	console.log("userApplications: ", user.applications);
	console.log("berthApp: ", user.applications.find(app => app.appId === "berth-schedule-app") );
	console.log("permissions: ", user.applications.find(app => app.appId === "berth-schedule-app").permissions.includes("manage"));
	console.log("canEdit: ", canEdit);
	const selectedBerth = berths.find(b => b.id === berth.id);
	const isValid = () => {
		
		let isFootmarkValid = parseFloat(footmark)> -1 ? true: false;
		
		let valid =
			vessel.name &&
			(!mmsiRequired || vessel.mmsid) &&
			vessel.loa &&
			(!imoRequired || vessel.imo) &&
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
		generatePDFExport(data.id, data.vessel.name, berthName, new Date());
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

	// -- enable PDF Export if assignment has already been created and currently has no changes
	const cleanAssignment = data.id && !assignmentChanged;
	return (
		<Fragment>
			<div style={{ display: "flex", flexDirection: "column", margin: "16px 8px" }}>
				<div style={{ display: "flex" }}>
					{!isGeneratingPdf ? (
						<Fragment>
							<Tooltip title={!cleanAssignment ? "Assignment Data Not Saved" : ""} placement="top">
								<span>
									<Button
										variant="contained"
										style={{ width: "150px", backgroundColor: "#5E6571", color: "currentColor", fontSize: "12px", opacity: `${cleanAssignment ? "1" : "0.4"}` }}
										startIcon={
											<SvgIcon>
												<path d={mdiFilePdfBox} />
											</SvgIcon>
										}
										onClick={handleExport}
										disabled={!cleanAssignment}
									>
										Print/Export
									</Button>
								</span>
							</Tooltip>
						</Fragment>
					) : (
						<div style={{ marginLeft: "60px"}}>
							<CircularProgress size={30} />
						</div>
					)}
					<div style={{ marginLeft: "auto" }}>
						{canEdit && editing && (
							<Button onClick={handleDelete} style={{ color: "#E85858", marginRight: "64px" }}>
								Delete
							</Button>
						)}
						<Button onClick={handleClose}>
							Cancel
						</Button>
						<Button disabled={!isValid() || !canEdit} onClick={handleSave} color="primary">
							Save
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
					color="primary"
				>
					<CheckCircle style={{ marginRight: 12 }} />
					{!approved ? "Approve Berth Request" : "Berth Request Approved"}
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
				imoRequired={imoRequired}
				mmsiRequired={mmsiRequired}
			/>
			<BargeFields
				handleChange={handleChange}
				handleUpdate={handleUpdate}
				barges={barges}
			/>
			<ScheduleFields
				handleChange={handleChange}
				schedule={schedule}
				timeFormatPreference={timeFormatPreference}
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
			/>
			{agentOwnerEnabled && <AgentOwnerFields
				saved={!!id}
				handleChange={handleChange}
				handleChangeName={handleChangeName}
				handleUpdate={handleUpdate}
				agent={agent}
				isRequired={agentOwnerRequired}
			/>}
			{requestingCompanyEnabled && <RequestingFields
				handleChange={handleChange}
				handleChangeName={handleChangeName}
				handleUpdate={handleUpdate}
				requestedBy={requestedBy}
				isRequired={requestingCompanyRequired}
			/>}
			{(servicesConfig && servicesConfig.length > 0) && <ServicesFields
				handleUpdate={handleUpdate}
				serviceConfig={servicesConfig}
				services={services}
			/>}
			{notesEnabled && <NotesField
				handleChange={handleChange}
				notes={notes}
			/>}
		</Fragment>
	);
};

AssignmentForm.propTypes = propTypes;
AssignmentForm.defaultProps = defaultProps;

export default memo(AssignmentForm);
