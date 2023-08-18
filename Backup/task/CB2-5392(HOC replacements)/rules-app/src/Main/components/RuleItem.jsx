import React, { useState } from "react";
import _ from "lodash";
import { Link } from "react-router-dom";

// Material Ui
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import { Translate, getTranslation } from "orion-components/i18n";
import { useDispatch } from "react-redux";

const RuleItem = ({ deleteCallback, closeDialog, unsubscribeFromRule, openDialog, dialogId, ruleName, linkId, isPriority, desc, notifySystem, notifyEmail, notifyPush, sharedRule, canManage, dir, isOpen }) => {
	const dispatch = useDispatch();

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
		<FlatButton
			label={getTranslation("main.components.ruleItem.actions.label.cancel")}
			primary={true}
			onClick={handleCloseDialog}
		/>,
		<FlatButton
			label={getTranslation("main.components.ruleItem.actions.label.unsubscribe")}
			primary={true}
			keyboardFocused={true}
			onClick={() => {
				unsubscribeClick(linkId);
				handleCloseDialog();
			}}
			style={{
				color: "#E85858"
			}}
		/>
	];

	return (
		<div className="ruleItem">
			<article style={dir == "rtl" ? { padding: "5px 10px 5px 0px" } : {}}>
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
				<span className="unsubscribeTarget" onClick={handleOpenDialog} >
					<p><Translate value="main.components.ruleItem.unsubscribeTarget.unsbuscribe" /></p>
					<Dialog
						title={getTranslation("main.components.ruleItem.unsubscribeTarget.dialog.title")}
						children={<p><Translate value="main.components.ruleItem.unsubscribeTarget.dialog.children" count={ruleName} /></p>}
						open={isOpen === `unsubscribe-dialog-${dialogId}`}
						onRequestClose={handleCloseDialog}
						actions={actions}
					/>
				</span>
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
