import React, { Component } from "react";
import _ from "lodash";
import {Link} from "react-router";

// Material Ui
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";

class RuleItem extends Component {
	constructor(props) {
		super(props);

		this.state = {
			unsubscribeOpen: false
		};
	}
	
	_deleteClick = (id) => {
		this.props.deleteCallback(id);
	}

	unsubscribeClick = (id) => {
		const { unsubscribeFromRule } = this.props;
		unsubscribeFromRule(id);
	}

	handleCloseDialog = () => {
		this.props.closeDialog(`unsubscribe-dialog-${this.props.dialogId}`);
	}

	handleOpenDialog = () => {
		this.props.openDialog(`unsubscribe-dialog-${this.props.dialogId}`);
	}

	render() {
		const { ruleName, linkId, isPriority, desc, notifySystem, notifyEmail, notifyPush, sharedRule, canManage} = this.props;

		const actions = [
			<FlatButton
				label="Cancel"
				primary={true}
				onClick={this.handleCloseDialog}
			/>,
			<FlatButton
				label="Unsubscribe"
				primary={true}
				keyboardFocused={true}
				onClick={() => {
					this.unsubscribeClick(linkId);
					this.handleCloseDialog();
				}}
				style={{
					color: "#E85858"
				}}
			/>
	    ];

		return (
			<div className="ruleItem">
				<article>
					<Link to={`/rule/${linkId}`}>
						<h3 className="ruleName">{ruleName}</h3>
						<div className="desc">{desc}</div>
						<section>
							{
								isPriority &&
								<div className="priority">priority</div>
							}
							{ notifyPush !== false || notifySystem !== false || notifyEmail !== false ?
								
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
					<span className="unsubscribeTarget" onClick={this.handleOpenDialog} >
						<p>UNSUBSCRIBE</p>
						<Dialog 
							title='UNSUBSCRIBE?'
							children={<p>Are you sure you want to unsubscribe from {ruleName}?</p>}
							open={this.props.isOpen === `unsubscribe-dialog-${this.props.dialogId}`}
							onRequestClose={this.handleCloseDialog}
							actions={actions}
						/>
					</span>
				}
				{canManage &&
					// Can only delete rules you own
					<span className="removeTarget" onClick={() => this._deleteClick(linkId)} >
						<i className="material-icons">close</i>
					</span>
				}
			</div>
		);}
}
export default RuleItem;
