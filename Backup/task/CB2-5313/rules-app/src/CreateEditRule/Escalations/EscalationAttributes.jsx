import React, { useEffect, useState } from "react";
import { eventService } from "client-app-core";

// Error Handling
import ErrorBoundary from "orion-components/ErrorBoundary";

// material-ui
import { List, ListItemText, ListItemIcon, ListItemButton } from "@mui/material";

// components
import EscalationDialog from "./EscalationDialog/EscalationDialog";

// misc
import _ from "lodash";
import { Translate, getTranslation } from "orion-components/i18n";
import { useDispatch, useSelector } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";

const EscalationAttributes = ({ escalationEvent, openDialog, closeDialog, deleteEscalation, addEscalation, styles, isOpen }) => {
	const dispatch = useDispatch();

	const dir = useSelector(state => getDir(state) || "ltr");
	const [editing, setEditing] = useState(false);
	const [editingIndex, setEditingIndex] = useState(null);
	const [loadingEvents, setLoadingEvents] = useState(false);
	const [eventId, setEventId] = useState(escalationEvent);
	const [eventName, setEventName] = useState("");

	useEffect(() => {
		fetchEventDetails(escalationEvent);
	}, []);

	useEffect(() => {
		fetchEventDetails(escalationEvent);
	}, [escalationEvent]);

	const fetchEventDetails = (eventId) => {
		eventService.getEventById(eventId, (err, result) => {
			if (result) {
				setEventId(eventId);
				setEventName(result.name);
			} else {
				console.log(err);
			}
		});
	};

	const handleClick = () => {
		dispatch(openDialog("escalation-dialog"));
	};

	const handleCancelClick = () => {
		dispatch(closeDialog("escalation-dialog"));
		setEditing(false);
		setEditingIndex(null);
	};

	const handleDeleteClick = () => {
		deleteEscalation();
		setEventName("");
	};

	const addNewEscalation = newEscalation => {
		addEscalation(newEscalation);
		dispatch(closeDialog("escalation-dialog"));
		setEventName(newEscalation.name);
	};

	const isEmpty = obj => {
		for (const key in obj) {
			if (obj.hasOwnProperty(key))
				return false;
		}
		return true;
	};

	const customStyle = {
		ruleAttributesList: {
			...(dir === "rtl" ? { paddingRight: "16px" } : { paddingLeft: "16px" })
		}
	};

	return (
		<div className="generic-attribute">
			<h4><Translate value="createEditRule.escalations.title" /></h4>
			<List
				className="rule-attributes-list"
				sx={customStyle.ruleAttributesList}
			>
				{!isEmpty(eventName) ?
					<ListItemButton
						className="listItemButton-overrides"
						key={escalationEvent.id}
					>
						<ListItemIcon>
							<i
								className='material-icons'
								style={{ color: "tomato" }}
								onClick={() => handleDeleteClick()}
							>
								clear
							</i>
						</ListItemIcon>
						<ListItemText
							primary={eventName}
							primaryTypographyProps={{ style: { fontSize: 16 } }}
						/>
					</ListItemButton>
					:
					<ListItemButton
						className="add-rule-attribute listItemButton-overrides"
						onClick={handleClick}
					>
						<ListItemIcon>
							<i className="material-icons" style={{ color: "#35b7f3" }}>
								add
							</i>
						</ListItemIcon>
						<ListItemText
							primary={getTranslation("createEditRule.escalations.chooseTemp")}
							primaryTypographyProps={{ style: { fontSize: 16, color: "#35b7f3" } }}
						/>
					</ListItemButton>
				}
			</List>
			<ErrorBoundary>
				{isOpen === "escalation-dialog" && (
					<EscalationDialog
						modal={true}
						contentStyle={styles.dialogStyles}
						isOpen={isOpen === "escalation-dialog"}
						closeDialog={handleCancelClick}
						escalationEvent={escalationEvent}
						addEscalation={addNewEscalation}
						// updateEscalation={_updateEscalation} 
						// Seems like _updateEscalation method is'nt used anymore in EscalationDialog.
						editingIndex={editingIndex}
						autoScrollBodyContent={true}
					/>
				)}
			</ErrorBoundary>
		</div>
	);
};

export default EscalationAttributes;