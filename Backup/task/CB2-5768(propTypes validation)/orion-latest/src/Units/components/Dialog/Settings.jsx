import React from "react";
import Template from "./Template";
import { TextField, Radio, RadioGroup, FormControlLabel, Grid, Typography, MenuItem } from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";
import { unitService } from "client-app-core";
import { subscribeUnitMembers } from "orion-components/GlobalData/Actions";
import { useDispatch, useSelector } from "react-redux";
import { getAllUnits } from "orion-components/GlobalData/Selectors";
import { getTranslation, Translate } from "orion-components/i18n";
import { UnitsPanelContext } from "orion-components/Dock/UnitsPanel/UnitsPanel";
import { useContext } from "react";
import size from "lodash/size";
import includes from "lodash/includes";

const Settings = ({ open, closeDialog, unitMember }) => {
	const unitsData = useSelector((state) => getAllUnits(state));

	const [unitMemberName, setUnitMemberName] = useState("");
	const [unit, setUnit] = useState("");
	const [memberType, setMemberType] = useState("person");
	const [phoneNumber, setPhoneNumber] = useState(null);
	const [countryCode, setCountryCode] = useState("+1");
	const [selectedRoles, setSelectedRoles] = useState([]);

	const dispatch = useDispatch();

	const unitsPanel = useContext(UnitsPanelContext);
	const { memberRoleTypes, countryCodesArray } = unitsPanel;

	useEffect(() => {
		if (unitMember) {
			setUnitMemberName(unitMember.name);
			setUnit(unitMember.unitId);
			setSelectedRoles(unitMember.roles);
			setMemberType(unitMember.memberType);
			setPhoneNumber(unitMember.phone);
		}
	}, [unitMember]);

	useEffect(() => {
		const { phone } = unitMember;
		const CountryCode =
			size(countryCodesArray) && countryCodesArray.find((countryCodes) => includes(phone, countryCodes.code));
		if (size(CountryCode)) {
			setCountryCode(CountryCode.code);
			setPhoneNumber(formatPhone(phone.replace(CountryCode.code, "")));
		}
	}, [countryCodesArray]);

	const handleSave = () => {
		if (unit === "unassign") {
			unassignUnitFromUnitMember();
		} else if (unitMember.isFeed === false || unitMember.unitId !== null) {
			updateUnitMember();
		} else {
			createUnitMember();
		}
	};

	const unassignUnitFromUnitMember = () => {
		unitService.unassignUnitFromUnitMember(unitMember.id, (err, response) => {
			if (err) {
				console.log("ERROR:", err, response);
			} else {
				dispatch(subscribeUnitMembers());
			}
		});
	};

	const createUnitMember = () => {
		const { feedId, entityId, entityType } = unitMember;

		const formattedPhone = countryCode + phoneNumber.replace(/\D/g, "");

		unitService.createUnitMember(
			memberType,
			feedId,
			entityId,
			entityType,
			unit,
			formattedPhone,
			selectedRoles,
			(err, response) => {
				if (err) {
					console.log("ERROR:", err, response);
				} else {
					dispatch(subscribeUnitMembers());
				}
			}
		);
	};

	const updateUnitMember = () => {
		const { feedId, entityId, entityType, id } = unitMember;

		const formattedPhone = countryCode + phoneNumber.replace(/\D/g, "");

		unitService.updateUnitMember(
			id,
			memberType,
			feedId,
			entityId,
			entityType,
			unit,
			formattedPhone,
			selectedRoles,
			(err, response) => {
				if (err) {
					console.log("ERROR:", err, response);
				} else {
					dispatch(subscribeUnitMembers());
				}
			}
		);
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
			input = "(" + input.substring(0, 3) + ") " + input.substring(3, 6) + " - " + input.substring(6, 10);
		}
		return input;
	};

	return (
		<div>
			<Template
				open={open}
				closeDialog={closeDialog}
				onSubmit={handleSave}
				title={getTranslation("global.units.components.dialog.settings.title")}
			>
				<div
					style={{
						marginBottom: "30px"
					}}
				>
					<div style={{ marginBottom: "25px" }}>
						<TextField
							variant="standard"
							value={unitMemberName}
							name="unitMemberName"
							label={getTranslation("global.units.components.dialog.settings.name")}
							fullWidth
							inputProps={{
								readOnly: true,
								style: {
									fontSize: "12px",
									fontWeight: "300"
								}
							}}
							InputLabelProps={{
								style: {
									fontSize: "14px",
									fontWeight: "300",
									color: "#5E5E60"
								}
							}}
						/>
					</div>
					<div style={{ marginBottom: "25px", display: "flex" }}>
						<Grid container columnSpacing={3}>
							<Grid item xs={4} sm={4} md={4} lg={4}>
								<TextField
									select
									value={countryCode}
									variant="standard"
									fullWidth
									InputProps={{
										style: {
											fontSize: "12px",
											fontWeight: "300",
											marginRight: "10px"
										}
									}}
									label={getTranslation("global.units.components.dialog.settings.Phone")}
									InputLabelProps={{
										style: {
											fontSize: "14px",
											fontWeight: "300",
											color: "#5E5E60"
										}
									}}
									defaultValue="+1"
									onChange={(e) => setCountryCode(e.target.value)}
								>
									{size(countryCodesArray) &&
										countryCodesArray.map((countryCode) => (
											<MenuItem key={`${countryCode.code}-menu-item`} value={countryCode.code}>
												{countryCode.name}
											</MenuItem>
										))}
								</TextField>
							</Grid>
							<Grid item xs={8} sm={8} md={8} lg={8}>
								<TextField
									variant="standard"
									value={phoneNumber}
									name="phoneNumber"
									fullWidth
									InputLabelProps={{
										style: {
											fontSize: "14px",
											fontWeight: "300",
											color: "#5E5E60"
										}
									}}
									InputProps={{
										style: {
											fontSize: "12px",
											fontWeight: "300",
											marginTop: "16px"
										}
									}}
									onChange={(e) => {
										setPhoneNumber(formatPhone(e.target.value));
									}}
									placeholder="(___) __ ____"
								/>
							</Grid>
						</Grid>
					</div>
					<div style={{ marginBottom: "25px" }}>
						<TextField
							select
							value={unit}
							variant="standard"
							fullWidth
							InputProps={{
								style: {
									fontSize: "12px",
									fontWeight: "300"
								}
							}}
							InputLabelProps={{
								style: {
									fontSize: "14px",
									fontWeight: "300",
									color: "#5E5E60"
								}
							}}
							label={getTranslation("global.units.components.dialog.settings.chooseUnit")}
							onChange={(e) => setUnit(e.target.value)}
						>
							{unitMember.unitId !== null ? (
								<MenuItem value="unassign">
									<Translate value="global.units.components.dialog.settings.unAssign" />
								</MenuItem>
							) : null}

							{unitsData.map((type) => {
								return (
									<MenuItem value={type.id} key={`${type.id}-menu-item`}>
										{type.name}
									</MenuItem>
								);
							})}
						</TextField>
					</div>

					<div style={{ marginBottom: "25px" }}>
						<RadioGroup
							row
							name="memberType"
							defaultValue="person"
							value={memberType}
							style={{ display: "flex", flexWrap: "wrap" }}
							onChange={(e) => setMemberType(e.target.value)}
						>
							<FormControlLabel
								value="person"
								control={<Radio />}
								label={getTranslation("global.units.components.dialog.settings.person")}
								sx={{ minWidth: "150px" }}
							/>
							<FormControlLabel
								value="vehicle"
								control={<Radio />}
								label={getTranslation("global.units.components.dialog.settings.vehicle")}
								sx={{ minWidth: "150px" }}
							/>
						</RadioGroup>
					</div>

					<div style={{ marginTop: "10px", marginBottom: "25px" }}>
						<Typography
							fontSize="12px"
							style={{
								paddingTop: "20px",
								fontWeight: "300px",
								marginBottom: "25px"
							}}
						>
							<Translate value="global.units.components.dialog.settings.equipmentSkills" />
						</Typography>
						<div>
							<TextField
								select
								value={selectedRoles}
								variant="standard"
								fullWidth
								InputProps={{
									style: {
										fontSize: "12px",
										fontWeight: "300"
									}
								}}
								InputLabelProps={{
									style: {
										fontSize: "14px",
										fontWeight: "300",
										color: "#5E5E60"
									}
								}}
								label={getTranslation("global.units.components.dialog.settings.chooseRole")}
								onChange={(e) => setSelectedRoles(e.target.value)}
							>
								{memberRoleTypes.length > 0 &&
									memberRoleTypes.map((type) => {
										return (
											<MenuItem value={type.id} key={`${type.id}-menu-item`}>
												{type.name}
											</MenuItem>
										);
									})}
							</TextField>
						</div>
					</div>
				</div>
			</Template>
		</div>
	);
};
export default Settings;
