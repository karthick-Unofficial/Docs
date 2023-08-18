import React, { useState } from "react";

// Error Handling
import ErrorBoundary from "orion-components/ErrorBoundary";

// material-ui
import { Tabs, Tab } from "material-ui/Tabs";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";
import List, { ListItem } from "material-ui/List";

// components
import TriggerDialogContainer from "./TriggerDialog/TriggerDialogContainer";

// misc
import _ from "lodash";
import { Translate, getTranslation } from "orion-components/i18n/I18nContainer";

const TriggerAttributes = ({ openDialog, closeDialog, toggleTriggerTab, targetType, availableTargets, isOpen, styles, addTargets, targets, trigger, dir, replace, handleChangeTrigger, triggers, tabValue, handleTargetHover, removeTarget, displayName }) => {
	const [dialogIsOpen, setDialogIsOpen] = useState(false);
	const [tabValueState, setTabValueState] = useState("b1");

	const _openDialog = () => {
		openDialog("trigger-dialog");
	};

	const _closeDialog = () => {
		closeDialog("trigger-dialog");
	};

	const handleClick = () => {
		openDialog("trigger-dialog");
	};

	const handleTabClick = (event) => {
		toggleTriggerTab(event.props.value);
	};

	const _capitalize = (string) => {
		return string.slice(0, 1).toUpperCase() + string.slice(1, string.length);
	};

	return (
		<div className="generic-attribute">
			<h4>{replace || <Translate value="createEditRule.trigger.title" />}</h4>
			<p><Translate value="createEditRule.trigger.actionThatFires" /></p>
			{trigger &&
				<div>
					<SelectField
						className={dir == "rtl" && "rtlIcon"}
						value={trigger}
						onChange={handleChangeTrigger}
						style={{ color: "white", borderRadius: 5, border: 0, width: "100%", backgroundColor: "#1F1F21" }}
						labelStyle={{ margin: 0, padding: "0 16px" }}
						menuItemStyle={{ color: "white", backgroundColor: "#1F1F21" }}
						listStyle={{ backgroundColor: "#1F1F21" }}
						underlineStyle={{ border: "none", margin: 0 }}
						selectedMenuItemStyle={{}}
					>
						{triggers.map((trigger) => {
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
				value={tabValue}
			>
				<Tab
					label={trigger === "cross" ? getTranslation("createEditRule.trigger.anyLine") : displayName === "polygon" || "system" ? getTranslation(`createEditRule.trigger.anyDots.${displayName}`) : getTranslation("createEditRule.trigger.anyDynamic", displayName)}
					style={styles.tabButton}
					value='b1'
					onActive={handleTabClick}
					className={`left-tab ${tabValue === "b1" ? "selected-tab" : "unselected-tab"}`}
				>
				</Tab>
				<Tab
					label={trigger === "cross" ? getTranslation("createEditRule.trigger.selectLine") : displayName === "polygon" || "system" ? getTranslation(`createEditRule.trigger.select.${displayName}`) : getTranslation("createEditRule.trigger.selectDynamic", displayName)}
					style={styles.tabButton}
					value='b2'
					onActive={handleTabClick}
					className={`right-tab ${tabValue === "b2" ? "selected-tab" : "unselected-tab"}`}
				>
					<div>
						<List
							className='rule-attributes-list'
						>
							{targets.map((item, index) =>
								<ListItem
									key={item.id}
									onMouseEnter={() => handleTargetHover(index)}
									onMouseLeave={() => handleTargetHover(null)}
									primaryText={targetType === "shape" ? item.entityData.properties.name : item.name}
									leftIcon={
										<i

											className='material-icons'
											style={{ color: "tomato" }}
											onClick={() => removeTarget(item)}
										>clear</i>
									}
								/>
							)}
							{targets.length > 0 ?
								<ListItem
									className='add-rule-attribute'
									primaryText={getTranslation("createEditRule.trigger.addAnother")}
									onClick={handleClick}
									leftIcon={
										<i
											className='material-icons'
											style={{ color: "#35b7f3" }}
										>
											add
										</i>
									}
								/>
								:
								<ListItem
									className='add-rule-attribute'
									primaryText={trigger === "cross" ? getTranslation("createEditRule.trigger.anyLine") : displayName === "polygon" || "system" ? getTranslation(`createEditRule.trigger.anyDots.${displayName}`) : getTranslation("createEditRule.trigger.anyDynamicdots", displayName)}
									onClick={handleClick}
									leftIcon={
										<i
											className='material-icons'
											style={{ color: "#35b7f3" }}
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
									closeDialog={_closeDialog}
									openDialog={_openDialog}
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
};


export default TriggerAttributes;