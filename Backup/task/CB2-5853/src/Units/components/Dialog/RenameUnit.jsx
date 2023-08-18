import React, { useEffect } from "react";
import { unitService } from "client-app-core";
import Template from "./Template";
import { useState } from "react";
import { TextField } from "@mui/material";
import { getTranslation } from "orion-components/i18n";

const RenameUnit = ({ open, closeDialog, unit }) => {
	const [unitName, setUnitName] = useState("");
	const [unitNameError, setUnitNameError] = useState("");

	useEffect(() => {
		if (unit) {
			setUnitName(unit.name);
		}
	}, [unit]);

	useEffect(() => {
		return () => {
			setUnitName("");
		};
	}, []);

	const renameUnit = async () => {
		await unitService.renameUnit(unit.id, unitName, (err, response) => {
			if (err) {
				console.log("ERROR:", err, response);
			}
		});
	};

	const checkError = (type) => {
		switch (type) {
			case "unitName":
				setUnitNameError(getTranslation("global.units.components.dialog.renameUnit.unitNameError"));
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

	const handleClose = () => {
		setUnitName(unit.name);
	};

	return (
		<div>
			<Template
				open={open}
				closeDialog={closeDialog}
				onSubmit={renameUnit}
				onCancel={handleClose}
				title={getTranslation("global.units.components.dialog.renameUnit.title")}
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
							label={getTranslation("global.units.components.dialog.renameUnit.unitName")}
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
							autoFocus={true}
						/>
					</div>
				</div>
			</Template>
		</div>
	);
};
export default RenameUnit;
