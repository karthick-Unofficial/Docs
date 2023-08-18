import React, { useState } from "react";
import PropTypes from "prop-types";
import { Dialog } from "orion-components/CBComponents";
import { statusBoardService } from "client-app-core";

import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import EditText from "./EditStatusControls/EditText";
import EditSlides from "./EditStatusControls/EditSlides";
import _ from "lodash";
import { getTranslation } from "orion-components/i18n";

const propTypes = {
	open: PropTypes.bool.isRequired,
	closeDialog: PropTypes.func.isRequired,
	card: PropTypes.object.isRequired,
	dir: PropTypes.string
};

const StatusCardDialog = ({ open, closeDialog, card, dir }) => {
	const [cardName, setCardName] = useState(card.name);
	const [global, setGlobal] = useState(card.global);
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
		const control = _.cloneDeep(card.data[0]);

		// Set a temporary property on the selected control item so that we may update
		// the selectedIndex if deletions would cause it to be out of bounds
		if (control.type !== "text") {
			control.items[control.selectedIndex].selected = true;
		}

		// TODO: If we choose to allow multiple data objects per card in the future, 
		// this will need to be updated to account for that
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

	const cancel = () => {
		setCardName(card.name);
		setData(card.data[0]);
		closeDialog();
	};

	const save = () => {
		const dataType = card.data[0].type;
		let selectedIndex = null;

		// Set selected index, accounting for item deletions, and remove the temporary property
		// that marks the selected item
		if (dataType !== "text") {
			const foundIndex = data.findIndex(item => item.selected);
			selectedIndex = foundIndex > -1 ? foundIndex : 0;
			delete data[selectedIndex].selected;
		}

		const update = {
			name: cardName,
			global: global,
			data: [{
				attachments: [],
				// Add properties based on the card type
				...(dataType === "text" && { body: data, type: "text" }),
				...(dataType === "slides" && { items: data, type: "slides", selectedIndex: selectedIndex || 0 }),
				...(dataType === "select" && { items: data, type: "select", selectedIndex: card.data[0].selectedIndex })
			}]
		};

		statusBoardService.update(card.id, update, (err, res) => {
			if (err) {
				console.log("Card update error", err);
			}
			else {
				console.log("Update resolve", res);
				closeDialog();
			}
		});
	};

	const deleteCard = () => {
		statusBoardService.delete(card.id);
	};

	const component = getComponentByType(dir);

	const styles = {
		inputLabelProps: {
			color: "#B5B9BE",
			...(dir === "rtl" && { transformOrigin: "top right", textAlign: "right", right: "0" }),
			...(dir === "rtl" && { transformOrigin: "top left", textAlign: "left" })
		}
	};

	return (
		<Dialog
			open={open}
			confirm={{ label: getTranslation("shared.statusCard.StatusCardDialog.save"), action: () => save() }}
			abort={{ label: getTranslation("shared.statusCard.StatusCardDialog.cancel"), action: () => cancel() }}
			deletion={{ label: getTranslation("shared.statusCard.StatusCardDialog.delete"), action: () => deleteCard() }}
			options={{
				maxWidth: "xs",
				fullWidth: true
			}}
		>
			<div style={{ minHeight: "500px" }}>
				<TextField
					label={getTranslation("shared.statusCard.StatusCardDialog.fieldLabel.cardName")}
					fullWidth={true}
					margin="normal"
					value={cardName}
					variant="standard"
					onChange={handleNameChange}
					onMouseDown={stopPropagation}
					onTouchStart={stopPropagation}
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
				{component}
			</div>
		</Dialog>
	);
};

StatusCardDialog.propTypes = propTypes;
export default StatusCardDialog;