import React, { useState } from "react";
import { Typography, TextField } from "@mui/material";
import { useEffect } from "react";
import UnitMemberRows from "../UnitMemberRows";
import { unitService } from "client-app-core";
import Template from "./Template";
import { subscribeUnitMembers } from "orion-components/GlobalData/Actions";
import { useDispatch } from "react-redux";
import { getTranslation, Translate } from "orion-components/i18n";

const NewUnit = ({ open, closeDialog, members }) => {
	const [unitMembers, setUnitMembers] = useState([]);
	const [selectedUnitMembers, setSelectedUnitMembers] = useState([]);
	const [unitName, setUnitName] = useState("");
	const [unitNameError, setUnitNameError] = useState("");

	const dispatch = useDispatch();

	useEffect(() => {
		setUnitMembers(members);
	}, [members]);

	const getSelectedUnitMembers = (selectedMembers) => {
		const selectedArr = selectedUnitMembers;
		selectedArr.push(selectedMembers.id);
		setSelectedUnitMembers(selectedArr);
	};

	const createNewUnit = () => {
		unitService.createUnit(
			unitName,
			selectedUnitMembers,
			(err, response) => {
				if (err) {
					console.log("ERROR:", err);
				}
				if (response) {
					dispatch(subscribeUnitMembers());
				}
			}
		);
	};

	const close = () => {
		setUnitName("");
		closeDialog();
		setSelectedUnitMembers([]);
		setUnitMembers([]);
	};

	const checkError = (type) => {
		switch (type) {
			case "unitName":
				setUnitNameError(
					getTranslation(
						"global.units.components.dialog.newUnit.unitNameError"
					)
				);
				break;
			default:
				setUnitNameError("");
		}
	};

	const handleChange = (e) => {
		if (e.target.name === "unitName") {
			setUnitName(e.target.value);
			setUnitNameError("");
		}
	};

	return (
		<div>
			<Template
				open={open}
				closeDialog={close}
				onSubmit={createNewUnit}
				title={getTranslation(
					"global.units.components.dialog.newUnit.title"
				)}
				checkError={checkError}
				name={unitName}
			>
				<div
					style={{
						marginBottm: "30px",
						height: "300px",
						minHeight: "300px",
						maxHeight: "500px",
						overflowY: "scroll"
					}}
				>
					<div style={{ marginBottom: "25px" }}>
						<TextField
							variant="standard"
							value={unitName}
							name="unitName"
							onChange={(e) => {
								handleChange(e);
							}}
							error={unitNameError === "" ? false : true}
							helperText={unitNameError}
							label={getTranslation(
								"global.units.components.dialog.newUnit.unitName"
							)}
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
									fontWeight: "300"
								}
							}}
						/>
					</div>
					<div>
						<Typography
							fontSize="12px"
							style={{
								marginTop: "20px",
								color: "#747575",
								marginBottom: "15px"
							}}
						>
							<Translate value="global.units.components.dialog.newUnit.chooseMembers" />
						</Typography>
						<div>
							<UnitMemberRows
								unitMembers={unitMembers}
								newUnit={true}
								getSelectedUnitMembers={getSelectedUnitMembers}
								includeDividers={true}
							/>
						</div>
					</div>
				</div>
			</Template>
		</div>
	);
};
export default NewUnit;
