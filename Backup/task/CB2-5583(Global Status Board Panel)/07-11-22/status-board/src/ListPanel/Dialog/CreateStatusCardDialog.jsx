import React, { useState } from "react";
import PropTypes from "prop-types";
import { Dialog, SelectField } from "orion-components/CBComponents";
import { statusBoardService } from "client-app-core";

import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

// TODO: Move these components to a 'shared' directory and update references everywhere
import EditText from "../../shared/components/StatusCard/StatusCardDialog/EditStatusControls/EditText";
import EditSlides from "../../shared/components/StatusCard/StatusCardDialog/EditStatusControls/EditSlides";
import { Translate, getTranslation } from "orion-components/i18n";
// import { FormControlLabel, Checkbox } from "@mui/material";

const propTypes = {
	open: PropTypes.bool.isRequired,
	closeDialog: PropTypes.func.isRequired,
	dir: PropTypes.string
};

const CreateStatusCardDialog = ({ open, closeDialog, dir }) => {
	const [cardName, setCardName] = useState("");
	const [cardType, setCardType] = useState("");
	const [global, setGlobal] = useState(false);
	const [data, setData] = useState(null);

	// Ensure click event on buttons, icons, etc do not activate
	// the draggable grid 'drag' event
	const stopPropagation = e => {
		e.stopPropagation();
	};

	const setChildData = (data) => {
		setData(data);
	};

	const getComponentByType = (dir) => {
		const control = {
			attachments: [],
			type: cardType,
			...(cardType === "text" && { body: null }),
			...(cardType === "slides" && { items: [{ text: "" }], selectedIndex: 0 }),
			...(cardType === "select" && { items: [], selectedIndex: 0 })
		};

		switch (control.type) {
			case "slides":
				return <EditSlides control={control} setData={setChildData} dir={dir} />;
			case "text":
				return <EditText control={control} setData={setChildData} dir={dir} />;
			case "selector":
				return;
			default:
				break;
		}
	};

	const handleNameChange = e => {
		setCardName(e.target.value);
	};

	const handleTypeSelect = e => {
		setCardType(e.target.value);
	};

	const close = () => {
		setCardName("");
		setCardType("");
		setData(null);
		closeDialog();
	};

	const create = () => {
		statusBoardService.create(
			{
				name: cardName,
				global: global,
				data: [
					{
						"attachments": [],
						"type": cardType,
						...(cardType === "text" && { body: data }),
						...(cardType === "slides" && { items: data || [], selectedIndex: 0 }),
						...(cardType === "select" && { items: data, selectedIndex: 0 })
					}
				]
			},
			(err) => {
				if (err) {
					console.log("Create error", err);
				}
				else {
					close();
				}
			}
		);
	};

	const saveDisabled = !cardName || !cardType || (cardType === "slides" && (!data || data.length === 0));
	const component = cardType ? getComponentByType(dir) : null;

	const styles = {
		inputLabelProps: {
			color: "#B5B9BE",
			...(dir === "rtl" && { transformOrigin: "top right", textAlign: "right", right: "0" }),
			...(dir === "ltr" && { transformOrigin: "top left", textAlign: "left" })
		}
	};

	return (
		<Dialog
			open={open}
			confirm={{ label: getTranslation("listPanel.dialog.save"), action: () => create(), disabled: saveDisabled }}
			abort={{ label: getTranslation("listPanel.dialog.cancel"), action: close }}
			options={{
				maxWidth: "xs",
				fullWidth: true
			}}
		>
			<div style={{ minHeight: "500px" }}>
				<TextField
					label={getTranslation("listPanel.dialog.fieldLabel.cardName")}
					fullWidth={true}
					variant="standard"
					margin="normal"
					value={cardName}
					onChange={handleNameChange}
					onMouseDown={stopPropagation}
					onTouchStart={stopPropagation}
					autoFocus={true}
					InputLabelProps={{
						style: styles.inputLabelProps
					}}
				/>
				<FormControlLabel
					control={<Checkbox
						checked={global}
						onChange={() => setGlobal(!global)}
					/>}
					label={"Global"}
				/>
				<SelectField
					id="card-type-select"
					label={getTranslation("listPanel.dialog.fieldLabel.cardType")}
					value={cardType}
					handleChange={handleTypeSelect}
					disabled={!!cardType}
					fullWidth={true}
					dir={dir}
				>
					<MenuItem key="slides" value="slides">
						<Translate value="listPanel.dialog.fieldLabel.slides" />
					</MenuItem>
					<MenuItem key="text" value="text">
						<Translate value="listPanel.dialog.fieldLabel.text" />
					</MenuItem>
				</SelectField>
				{component}
			</div>
		</Dialog>
	);
};

CreateStatusCardDialog.propTypes = propTypes;
export default CreateStatusCardDialog;