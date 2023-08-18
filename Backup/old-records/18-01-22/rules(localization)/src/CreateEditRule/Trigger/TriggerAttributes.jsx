import React, { Component } from "react";

// Error Handling
import ErrorBoundary from "orion-components/ErrorBoundary";

// material-ui
import {Tabs, Tab} from "material-ui/Tabs";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";
import List, {ListItem} from "material-ui/List";

// components
import TriggerDialogContainer from "./TriggerDialog/TriggerDialogContainer";

// misc
import _ from "lodash";
import { Translate } from "orion-components/i18n/I18nContainer";

class TriggerAttributes extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dialogIsOpen: false,
			tabValue: "b1"
		};
	}

_openDialog = () => {
	this.props.openDialog("trigger-dialog");
}

_closeDialog = () => {
	this.props.closeDialog("trigger-dialog");
}

handleClick = () => {
	this.props.openDialog("trigger-dialog");
}

handleTabClick = (event) => {
	this.props.toggleTriggerTab(event.props.value);
}

_capitalize = (string) => {
	return string.slice(0, 1).toUpperCase() + string.slice(1, string.length);
}

render () {
	const {
		targetType,
		availableTargets,
		isOpen,
		styles,
		addTargets,
		targets,
		trigger
	} = this.props;
	return (
		<div className="generic-attribute">
			<h4>{this.props.replace || "Trigger"}</h4>
			<p><Translate value="createEditRule.trigger.actionThatFires"/></p>
			{trigger && 
<div>
	<SelectField
		value={trigger}
		onChange={this.props.handleChangeTrigger}
		style={{color: "white", borderRadius: 5, border: 0, width: "100%", backgroundColor: "#1F1F21"}}
		labelStyle={{margin: 0, padding: "0 16px"}}
		menuItemStyle={{color: "white", backgroundColor: "#1F1F21"}}
		listStyle={{backgroundColor: "#1F1F21"}}
		underlineStyle={{border: "none", margin: 0}}
		selectedMenuItemStyle={{}}
	>
		{this.props.triggers.map((trigger) => {
			return (
				<MenuItem
					key={trigger}
					value={trigger}
					primaryText={trigger}
				/>
			);
		})}
	</SelectField>
</div>
			}
			<Tabs
				tabItemContainerStyle={styles.contentContainerStyle}
				inkBarStyle={styles.inkBar}
				value={this.props.tabValue}
			>
				<Tab
					label={trigger === "cross" ? <Translate value="createEditRule.trigger.anyLine"/> : <Translate value="createEditRule.trigger.anyDynamic" count={this.props.displayName}/>}
					style={styles.tabButton}
					value='b1'
					onActive={this.handleTabClick}
					className={`left-tab ${this.props.tabValue === "b1" ? "selected-tab" : "unselected-tab"}`}
				>
				</Tab>
				<Tab
					label={trigger === "cross" ? <Translate value="createEditRule.trigger.selectLine"/> : <Translate value="createEditRule.trigger.selectDynamic" count={this.props.displayName}/>}
					style={styles.tabButton}
					value='b2'
					onActive={this.handleTabClick}
					className={`right-tab ${this.props.tabValue === "b2" ? "selected-tab" : "unselected-tab"}`}
				>
					<div>
						<List
							className='rule-attributes-list'
						>
							{targets.map((item, index) => 
								<ListItem
									key={item.id}
									onMouseEnter={() => this.props.handleTargetHover(index)}
									onMouseLeave={() => this.props.handleTargetHover(null)}
									primaryText={targetType === "shape" ? item.entityData.properties.name : item.name}
									leftIcon={
										<i

											className='material-icons'
											style={{color: "tomato"}}
											onClick={() => this.props.removeTarget(item)}
										>clear</i>
									}
								/>
							)}
							{targets.length > 0 ?
								<ListItem
									className='add-rule-attribute'
									primaryText={<Translate value="createEditRule.trigger.addAnother"/>}
									onClick={this.handleClick}
									leftIcon={
										<i
											className='material-icons'
											style={{color: "#35b7f3"}}
										>
add
										</i>
									}
								/>
								:
								<ListItem
									className='add-rule-attribute'
									primaryText={trigger === "cross" ? <Translate value="createEditRule.trigger.anyLine"/> : <Translate value="createEditRule.trigger.anyDynamicdots" count={this.props.displayName}/>}
									onClick={this.handleClick}
									leftIcon={
										<i
											className='material-icons'
											style={{color: "#35b7f3"}}
										>
add
										</i>
									}
								/>
							}
						</List>

						<ErrorBoundary>
							{isOpen === "trigger-dialog" && (
								<TriggerDialogContainer
									targetType={targetType}
									availableTargets={availableTargets}
									isOpen={isOpen === "trigger-dialog"}
									styles={styles}
									closeDialog={this._closeDialog}
									openDialog={this._openDialog}
									addTargets={addTargets}
									targets={targets}
									trigger={trigger}
								/>
							)}
						</ErrorBoundary>
					</div>
				</Tab>
			</Tabs>
		</div>
	);
}
}


export default TriggerAttributes;