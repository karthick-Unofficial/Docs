import React, { useEffect, useState } from "react";
import Dialog from "material-ui/Dialog";
import { integrationService } from "client-app-core";
import { Grid, InputAdornment, OutlinedInput, CircularProgress, Checkbox, IconButton } from "@material-ui/core";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { SearchOutlined, CloseOutlined, Cancel } from "@material-ui/icons";
import _ from "lodash";
import LookUptable from "./LookUptable";
import { Translate, getTranslation } from "orion-components/i18n";

const ManageModal = ({ open, close, lookupType, contextId, settings, assignedData, dir }) => {

	const [showLoader, setShowLoader] = useState(true);
	const [lookupData, setLookupData] = useState([]);
	const [title, setTitle] = useState("");
	const [showAvailable, setShowAvailable] = useState(false);
	const [showAssigned, setShowAssigned] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [searchColumns, setSearchColumns] = useState([]);
	const [openPopup, setOpenPopup] = useState(false);
	const [checkError, setcheckError] = useState(false);

	const style = {
		dailogCloseIcon: {
			cursor: "pointer",
			float: "right",
			color: "#ECECED"
		},
		dailogCloseIconRtl: {
			cursor: "pointer",
			float: "right",
			color: "#ECECED",
			marginRight: "50px"
		},
		outlinedInput: {
			border: "1px solid #727983",
			width: "55%",
			height: "40px",
			marginTop: "2%",
			marginBottom: "2%",
			color: "white",
			borderRadius: "5px"

		},
		progressContainer: {
			width: "900px",
			height: "50vh",
			display: "table",
			overflow: "hidden"
		},

		progress: {
			display: "table-cell",
			verticalAlign: "middle",
			textAlign: "center"

		},
		errorText: {
			fontSize: "1.3rem",
			color: "#ECECED"
		}

	};



	useEffect(() => {
		setOpenPopup(open);
		if (lookupType === "resources") {
			setTitle(getTranslation("global.profiles.eventProfile.main.resources"));
			setSearchColumns(["Name", "LocationName", "UnitName", "RankName", "ShiftEndTime"]);
		}
		else {

			setTitle(getTranslation("global.profiles.eventProfile.main.equipments"));
			setSearchColumns(["Name", "Category", "UnitName", "ItemCount"]);

		}
		integrationService.getExternalSystemLookup(
			"hrms",
			lookupType,
			(err, response) => {
				if (err) {
					console.log(`The HRMS ${lookupType} lookup returned an error.`, err);
					setShowLoader(false);
					setcheckError(true);
				}
				else if (!response || !response.data || response.data.length === 0) {
					console.log(`The HRMS ${lookupType} lookup didn't return any data.`, response);
					setShowLoader(false);
					setcheckError(true);
				}
				else {
					const { data } = response;
					data.forEach(element => {
						element.Selected = false;
					});
					if (lookupType === "resources") {
						_.merge(_.keyBy(data, "MilitaryNumber"), _.keyBy(assignedData, "MilitaryNumber"));
					}
					else {
						_.merge(_.keyBy(data, "Name"), _.keyBy(assignedData, "Name"));
					}
					data.sort((a, b) => a.Name.localeCompare(b.Name));
					setcheckError(false);
					setShowLoader(false);
					setLookupData(data);
				}
			}
		);
	}, [lookupType, open]);

	useEffect(() => {
		if (searchTerm.length > 0) {
			style.outlinedInput.background = "#727983";
		}
		else {
			style.outlinedInput.background = "none";
		}
	}, [searchTerm]);

	const handleClose = () => {
		close();
	};


	const search = (rows) => {
		if (lookupData)
			if (lookupData.length !== 0) {
				if (lookupType === "resources") {
					return rows.filter((row) =>
						searchColumns.some(
							column =>
								row[column] ?
									row[column].toString().toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
									: null
						)
					);

				}
				else {

					return rows.filter((row) =>
						searchColumns.some(
							column =>
								row[column] ?
									row[column].toString().toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
									: null
						)
					);
				}


			}

	};
	const lookupSearchAndFilter = () => {
		return (
			<div>
				<OutlinedInput
					id="input-with-icon-adornment"
					style={style.outlinedInput}
					placeholder={getTranslation("global.profiles.widgets.hrms.manageModal.search")}
					onChange={e => setSearchTerm(e.target.value)}
					value={searchTerm}
					startAdornment={
						<InputAdornment position={dir == "rtl" ? "end" : "start"}>
							<SearchOutlined style={{ color: "white" }} />
						</InputAdornment>
					}
					endAdornment={
						searchTerm !== "" ?
							<InputAdornment position={dir == "rtl" ? "start" : "end"}>

								<IconButton onClick={() => setSearchTerm("")} >
									<Cancel style={{ color: "white", cursor: "pointer" }} />
								</IconButton>

							</InputAdornment>
							: null
					}
				/>

				< Grid container>
					{lookupType === "resources" ?
						<Grid item xs={2} sm={2} md={2} lg={2}>
							<FormControlLabel
								control={<Checkbox
									name="showAvailable"
									checked={showAvailable}
									style={{
										color: showAvailable ? "#4DB6F5" : "#55575A"
									}}
									onChange={(e) => setShowAvailable(e.target.checked)} />}
								label={getTranslation("global.profiles.widgets.hrms.manageModal.showAvail")}
							/>
						</Grid> : <div />}
					<Grid item xs={2} sm={2} md={2} lg={2}>
						<FormControlLabel
							control={<Checkbox
								label={getTranslation("global.profiles.widgets.hrms.manageModal.showAssigned")}
								name="showAssigned"
								checked={showAssigned}
								style={{
									color: showAssigned ? "#4DB6F5" : "#55575A"
								}}
								onChange={(e) => {
									setShowAssigned(e.target.checked);
								}}
							/>}
							label={getTranslation("global.profiles.widgets.hrms.manageModal.showAssigned")}
						/>
					</Grid>
				</Grid>
			</div>
		);
	};


	return (
		<Dialog
			open={openPopup}
			fullWidth
			contentStyle={{ width: "1010px", maxWidth: "none", marginTop: "2%", height: "848px" }}
		>

			<div style={{ padding: "8px" }}>
				<Grid container>
					<Grid item xs={11} sm={11} md={11} lg={11} >
						<div>
							<Translate value="global.profiles.widgets.hrms.manageModal.select" count={title} />
						</div>
					</Grid>
					<Grid item xs={1} sm={1} md={1} lg={1} >
						<div style={dir === "rtl" ? style.dailogCloseIconRtl : style.dailogCloseIcon}>
							<CloseOutlined onClick={handleClose} />
						</div>
					</Grid>
				</Grid>


				{showLoader ? (
					<div style={style.progressContainer}>
						<div style={style.progress}>
							<CircularProgress size={60} thickness={5} style={{ color: "#4DB5F4" }} />
						</div>
					</div>) :
					checkError ? (
						<div style={style.progressContainer}>
							<div style={style.progress}>
								<span style={style.errorText}>
									{lookupType === "resources" ?
										<Translate value="global.profiles.widgets.hrms.manageModal.noDataErrorResources" /> :
										<Translate value="global.profiles.widgets.hrms.manageModal.noDataErrorEquipment" />}
								</span>
							</div>
						</div>
					) :

						(<div>
							{lookupSearchAndFilter()}
							<LookUptable
								lookupData={search(lookupData)}
								lookupType={lookupType}
								contextId={contextId}
								settings={settings}
								assigned={showAssigned}
								available={showAvailable}
								closePopup={handleClose}
								dir={dir}
							/>
						</div>)}
			</div>
		</Dialog >
	);
};



export default ManageModal;