import React, { Component } from "react";
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

class EscalationAttributes extends Component {
	constructor(props) {
		super(props);
		this.state = {
			editing: false,
			editingIndex: null,
			loadingEvents: false,
			eventId: props.escalationEvent,
			eventName: ""
		};
	}

	componentDidMount() {
		this.fetchEventDetails(this.props.escalationEvent);
	}

	componentDidUpdate(prevProps) {
		if (this.props.escalationEvent !== prevProps.escalationEvent) {
			this.fetchEventDetails(this.props.escalationEvent);
		}
	}

	fetchEventDetails(eventId) {
		eventService.getEventById(eventId, (err, result) => {
			if (result){
				this.setState({
					eventId,
					eventName: result.name
				});
			}else{
				console.log(err);
			}
		});
	}

	handleClick = () => {
		this.props.openDialog("escalation-dialog");
	};

	handleCancelClick = () => {
		this.props.closeDialog("escalation-dialog");
		this.setState({
			editing: false,
			editingIndex: null
		});
	};

	handleDeleteClick = () => {
		this.props.deleteEscalation();
		this.setState({
			eventName: ""
		});
	};

	addEscalation = newEscalation => {
		this.props.addEscalation(newEscalation);
		this.props.closeDialog("escalation-dialog");
		this.setState({
			eventName: newEscalation.name
		});
	};

	render() {
		const {
			styles,
			escalationEvent,
			isOpen
		} = this.props;

		const isEmpty = obj => {
			for(const key in obj) {
				if(obj.hasOwnProperty(key))
					return false;
			}
			return true;
		};

		return (
			<div className="generic-attribute">
				<h4><Translate value="createEditRule.escalations.title"/></h4>
				<List 
					className="rule-attributes-list"
				>
					{!isEmpty(this.state.eventName) ?
						<ListItem
							key={escalationEvent.id}
							primaryText={this.state.eventName}
							leftIcon={
								<i
									className='material-icons'
									style={{color: "tomato"}}
									onClick={() => this.handleDeleteClick()}
								>
									clear	
								</i>
							}
						/>
						:
						<ListItem
							className="add-rule-attribute"
							primaryText={getTranslation("createEditRule.escalations.chooseTemp")}
							onClick={this.handleClick}
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
							isOpen={this.props.isOpen === "escalation-dialog"}
							closeDialog={this.handleCancelClick}
							escalationEvent={escalationEvent}
							addEscalation={this.addEscalation}
							updateEscalation={this._updateEscalation}
							editingIndex={this.state.editingIndex}
							autoScrollBodyContent={true}
						/>
					)}
				</ErrorBoundary>
			</div>
		);
	}
}

export default EscalationAttributes;