import React, { useEffect, useState } from "react";
import { eventService } from "client-app-core";

// Error Handling
import ErrorBoundary from "orion-components/ErrorBoundary";

// material-ui
import List, { ListItem } from "material-ui/List";

// components
import EscalationDialog from "./EscalationDialog/EscalationDialog";

// misc
import _ from "lodash";
import { Translate, getTranslation } from "orion-components/i18n/I18nContainer";

const EscalationAttributes = ({ escalationEvent, openDialog, closeDialog, deleteEscalation, addEscalation, styles, isOpen }) => {
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
		openDialog("escalation-dialog");
	};

	const handleCancelClick = () => {
		closeDialog("escalation-dialog");
		setEditing(false);
		setEditingIndex(null);
	};

	const handleDeleteClick = () => {
		deleteEscalation();
		setEventName("");
	};

	const addNewEscalation = newEscalation => {
		addEscalation(newEscalation);
		closeDialog("escalation-dialog");
		setEventName(newEscalation.name);
	};

	const isEmpty = obj => {
		for (const key in obj) {
			if (obj.hasOwnProperty(key))
				return false;
		}
		return true;
	};

	return (
		<div className="generic-attribute">
			<h4><Translate value="createEditRule.escalations.title" /></h4>
			<List
				className="rule-attributes-list"
			>
				{!isEmpty(eventName) ?
					<ListItem
						key={escalationEvent.id}
						primaryText={eventName}
						leftIcon={
							<i
								className='material-icons'
								style={{ color: "tomato" }}
								onClick={() => handleDeleteClick()}
							>
								clear
							</i>
						}
					/>
					:
					<ListItem
						className="add-rule-attribute"
						primaryText={getTranslation("createEditRule.escalations.chooseTemp")}
						onClick={handleClick}
						leftIcon={
							<i className="material-icons" style={{ color: "#35b7f3" }}>
								add
							</i>
						}
					/>
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
						editingIndex={editingIndex}
						autoScrollBodyContent={true}
					/>
				)}
			</ErrorBoundary>
		</div>
	);
};

export default EscalationAttributes;