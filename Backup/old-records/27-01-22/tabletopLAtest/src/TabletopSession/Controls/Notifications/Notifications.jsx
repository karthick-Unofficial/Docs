import React, { Fragment, useEffect}  from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
//import { ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as eventUtilities from "../../../shared/utility/eventUtility";
import { Translate } from "orion-components/i18n/I18nContainer";

const propTypes = {
	userId: PropTypes.string.isRequired,
	sessionId: PropTypes.string,
	users: PropTypes.object,
	newCommunication: PropTypes.object,
	commsToSend: PropTypes.array,
	agents: PropTypes.object,
	loadAgentProfile: PropTypes.func.isRequired,
	openEventsWidget: PropTypes.func.isRequired,
	createCommunication: PropTypes.func.isRequired
};

const Notifications = ({
	userId,
	sessionId,
	users,
	newCommunication,
	commsToSend,
	agents,
	loadAgentProfile,
	openEventsWidget,
	createCommunication
}) => {

	useEffect(() => {
		if (newCommunication) {
			const senderId = newCommunication.commsFrom;
			const senderName = userId === senderId ? null : // We dont want to display sender name if sender is self
				(users.hasOwnProperty(senderId) ? users[senderId].name : null); 

			if (newCommunication.classification === "agentEquipment") {
				const agentId = newCommunication.event.actorId;
				
				if (agents[agentId]) {
					const agentName = agents[agentId].entityData.properties.name;
					toast.info(displayEquipmentNotifications(agentId, agentName, senderName), {
						className: "toast-notifications",
						position: toast.POSITION.TOP_RIGHT
					});
				}
				else {
					return;
				}
			}
			else {
				let eventDescription = "";
				const classification = newCommunication.classification;
				const eventClassification = eventUtilities.getEventClassifications().find(eventClassification => eventClassification.classification === classification); 
				if(eventClassification){
					eventDescription = eventClassification.description;
				}
				//const eventId = parseInt(newCommunication.event.id);
				toast.info(displayEventNotifications( senderName, eventDescription), {
					className: "toast-notifications",
					position: toast.POSITION.TOP_RIGHT
				});
			}
		}
	}, [newCommunication]);

	const displayEquipmentNotifications = (agentId, agentName, senderName) => {
		if (senderName) {
			return (<p ><Translate value="tableopSession.controls.notifications.equipSharedFor"/><a style={{cursor: "pointer", color: "#4db5f4"}} onClick={() => loadAgentProfile(agentId)}>{agentName}</a> <Translate value="tableopSession.controls.notifications.by"/> {senderName}.</p>);
		} else {
			return (<p ><Translate value="tableopSession.controls.notifications.equipUncovered"/><a style={{cursor: "pointer", color: "#4db5f4"}} onClick={() => loadAgentProfile(agentId)}>{agentName}</a>.</p>);
		}
	};

	const displayEventNotifications = (senderName, eventClassification) => (
		<p ><Translate value="tableopSession.controls.notifications.a"/> <a style={{cursor: "pointer", color: "#4db5f4"}} onClick={() => openEventsWidget()}>{eventClassification}</a> <Translate value="tableopSession.controls.notifications.eventShared"/> {senderName}.</p>
	);

	useEffect(() => {
		if (commsToSend && commsToSend.length > 0) {
			commsToSend.forEach(commToSend => createCommunication(sessionId, commToSend));
		}
	}, [ sessionId, commsToSend ]);

	return (
		<Fragment>
		</Fragment>
	);
};

Notifications.propTypes = propTypes;
export default Notifications;