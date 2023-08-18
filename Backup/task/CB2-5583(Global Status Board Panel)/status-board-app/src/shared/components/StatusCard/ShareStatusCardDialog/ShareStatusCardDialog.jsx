import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { 
	organizationService, 
	statusBoardService 
} from "client-app-core";
import { Dialog } from "orion-components/CBComponents";
import {
	List,
	ListItem,
	ListItemText,
	ListItemSecondaryAction,
	Checkbox
} from "@mui/material";
import { getTranslation } from "orion-components/i18n";

const propTypes = {
	open: PropTypes.bool.isRequired,
	closeDialog: PropTypes.func.isRequired,
	cardId: PropTypes.string.isRequired,
	sharedWith: PropTypes.array.isRequired
};

const styles = {
	listItem: {
		backgroundColor: "#41454A",
		height: "60px",
		margin: "8px 0"
	}
};

const ShareStatusCardDialog = ({open, closeDialog, cardId, sharedWith}) => {
	const [ orgs, setOrgs ] = useState([]);
	const [ selectedOrgs, setSelectedOrgs ] = useState(sharedWith);

	useEffect(() => {
		if (open) {
			organizationService.getAllOrgsForSharing((err, res) => {
				if (err) {
					console.log("Error retrieving organizations:", err);
				}
				else {
					const orgs = res.result.map(org => {
						return { name: org.name, orgId: org.orgId };
					});
					setOrgs(orgs);
				}
			});
		}
	}, [open]);
	
	// Ensure click event on buttons, icons, etc do not activate
	// the draggable grid 'drag' event
	const stopPropagation = e => {
		e.stopPropagation();
	};

	const handleToggle = value => () =>  {
		const selected = selectedOrgs.includes(value);

		const newSelected = 
						selected
							? selectedOrgs.filter(orgId => orgId !== value)
							: [...selectedOrgs, value];

		setSelectedOrgs(newSelected);
	};

	const cancel = () => {
		setSelectedOrgs(sharedWith);
		closeDialog();
	}; 

	const save = () => {
		statusBoardService.shareWithOrgs(cardId, selectedOrgs, (err) => {
			if (err) {
				console.log("Error sharing card with organizations:", err);
			}
			else {
				closeDialog();
			}
		});
	};

	return (
		<Dialog
			open={open}
			confirm={{ label: getTranslation("shared.statusCard.shareStatusCardDialog.save"), action: () => save() }}
			abort={{ label: getTranslation("shared.statusCard.shareStatusCardDialog.cancel"), action: () => cancel() }}
			title={getTranslation("shared.statusCard.shareStatusCardDialog.title")}
			options={{
				maxWidth: "xs",
				fullWidth: true
			}}
		>
			<List> 
				{orgs.map(org => {
					return (
						<ListItem 
							key={org.orgId + "-button"}
							style={styles.listItem}
						>
							<ListItemText primary={org.name} />
							<ListItemSecondaryAction>
								<Checkbox
									color="primary"
									edge="end"
									checked={selectedOrgs.includes(org.orgId)}
									onChange={handleToggle(org.orgId)}
								/>
							</ListItemSecondaryAction>
						</ListItem>
					);
				})}
			</List>
		</Dialog>
	);
};

ShareStatusCardDialog.propTypes = propTypes;
export default ShareStatusCardDialog;