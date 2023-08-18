import React, { useState } from "react";
import { Link } from "react-router-dom";

// Material Ui
import { Dialog, DialogActions, DialogTitle, Button } from "@mui/material";
import { Translate, getTranslation } from "orion-components/i18n";
import { useDispatch } from "react-redux";
import { useStyles } from "../../shared/styles/overrides";

const RuleItem = ({ deleteCallback, closeDialog, unsubscribeFromRule, openDialog, dialogId, ruleName, linkId, isPriority, desc, notifySystem, notifyEmail, notifyPush, sharedRule, canManage, dir, isOpen }) => {
	const dispatch = useDispatch();
	const classes = useStyles();

	const [unsubscribeOpen, setUnsubscribeOpen] = useState(false);

	const _deleteClick = (id) => {
		deleteCallback(id);
	};

	const unsubscribeClick = (id) => {
		dispatch(unsubscribeFromRule(id));
	};

	const handleCloseDialog = () => {
		dispatch(closeDialog(`unsubscribe-dialog-${dialogId}`));
	};

	const handleOpenDialog = () => {
		dispatch(openDialog(`unsubscribe-dialog-${dialogId}`));
	};

	const actions = [
		<Button
			variant="text"
			primary={true}
			onClick={handleCloseDialog}
		>
			{getTranslation("main.components.ruleItem.actions.label.cancel")}
		</Button>,
		<Button
			variant="text"
			onClick={() => {
				unsubscribeClick(linkId);
				handleCloseDialog();
			}}
			style={{
				color: "#E85858"
			}}
		>{getTranslation("main.components.ruleItem.actions.label.unsubscribe")}
		</Button>
	];

	const styles = {
		paperProps: {
			width: "100%",
			borderRadius: "2px"
		},
		dialogContent: {
			fontSize: "16px",
			color: "rgba(255, 255, 255, 0.6)",
			padding: "0px 24px 24px",
			border: "none",
			maxHeight: "329px"
		},
		article: {
			...(dir == "rtl" && { padding: "5px 10px 5px 0px" })
		}
	};

	return (
		<div className="ruleItem">
			<article style={styles.article}>
				<Link to={`/rule/${linkId}`}>
					<h3 className="ruleName">{ruleName}</h3>
					<div className="desc">{desc}</div>
					<section>
						{
							isPriority &&
							<div className="priority"><Translate value="main.components.ruleItem.ruleItem.priority" /></div>
						}
						{notifyPush !== false || notifySystem !== false || notifyEmail !== false ?

							<div className="notifyTypes">
								{
									notifySystem &&
									<i className="material-icons">laptop</i>
								}
								{
									notifyPush &&
									<i className="material-icons">phone_iphone</i>
								}
								{
									notifyEmail &&
									<i className="material-icons">email</i>
								}
							</div>
							:
							<div className='notifyTypes'></div>
						}
					</section>
				</Link>
			</article>
			{sharedRule &&
				// Shared rules can be unsubscribed from
				<><span className="unsubscribeTarget" onClick={() => handleOpenDialog()} >
					<p><Translate value="main.components.ruleItem.unsubscribeTarget.unsbuscribe" /></p>
				</span>
					<Dialog
						PaperProps={{ sx: styles.paperProps }}
						classes={{ scrollPaper: classes.scrollPaper }}
						open={isOpen === `unsubscribe-dialog-${dialogId}`}
						onClose={() => handleCloseDialog()}
					>
						<DialogTitle
							sx={styles.dialogTitle}
						>
							{getTranslation("main.components.ruleItem.unsubscribeTarget.dialog.title")}
						</DialogTitle>
						<span style={styles.dialogContent}>
							<Translate value="main.components.ruleItem.unsubscribeTarget.dialog.children" count={ruleName} />
						</span>
						<DialogActions>{actions}</DialogActions>
					</Dialog>
				</>
			}
			{canManage &&
				// Can only delete rules you own
				<span className="removeTarget" onClick={() => _deleteClick(linkId)} >
					<i className="material-icons">close</i>
				</span>
			}
		</div>
	);
};

export default RuleItem;
