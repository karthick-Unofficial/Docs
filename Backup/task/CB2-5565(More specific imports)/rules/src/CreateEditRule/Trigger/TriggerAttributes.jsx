import React, { useState } from "react";

// Error Handling
import ErrorBoundary from "orion-components/ErrorBoundary";

// material-ui
import { Tabs, Tab } from "@mui/material";
import { Select, MenuItem, List, ListItemText, ListItemIcon, ListItemButton } from "@mui/material";
import { TabPanel } from "orion-components/CBComponents";
import { useStyles } from "../../shared/styles/overrides";

// components
import TriggerDialog from "./TriggerDialog/TriggerDialog";

// misc
import { Translate, getTranslation } from "orion-components/i18n";
import { useSelector, useDispatch } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";

const TriggerAttributes = ({ openDialog, closeDialog, toggleTriggerTab, targetType, availableTargets, styles, addTargets, targets, trigger, replace, handleChangeTrigger, triggers, tabValue, handleTargetHover, removeTarget, displayName }) => {
	const dispatch = useDispatch();
	const classes = useStyles();

	const isOpen = useSelector(state => state.appState.dialog.openDialog);
	const dir = useSelector(state => getDir(state));

	const [dialogIsOpen, setDialogIsOpen] = useState(false);
	const [tabValueState, setTabValueState] = useState("b1");

	const _openDialog = () => {
		dispatch(openDialog("trigger-dialog"));
	};

	const _closeDialog = () => {
		dispatch(closeDialog("trigger-dialog"));
	};

	const handleClick = () => {
		dispatch(openDialog("trigger-dialog"));
	};

	const handleTabClick = (event, tab) => {
		toggleTriggerTab(tab);
	};

	const _capitalize = (string) => {
		return string.slice(0, 1).toUpperCase() + string.slice(1, string.length);
	};

	const customStyle = {
		typography: {
			fontSize: 16, lineHeight: "unset", letterSpacing: "unset"
		}
	};

	return (
		<div className="generic-attribute">
			<h4>{replace || <Translate value="createEditRule.trigger.title" />}</h4>
			<p><Translate value="createEditRule.trigger.actionThatFires" /></p>
			{trigger &&
				<div>
					<Select
						className={`disableOutlined ${dir == "rtl" && "rtlIcon"}`}
						value={trigger}
						onChange={handleChangeTrigger}
						style={{ color: "white", borderRadius: 5, border: 0, width: "100%", backgroundColor: "#1F1F21", height: "48px", marginBottom: "12px" }}
						MenuProps={{
							anchorOrigin: {
								vertical: "top",
								horizontal: "left"
							},
							transformOrigin: {
								vertical: "top",
								horizontal: "left"
							},
							classes: {
								paper: classes.paper
							}
						}}
					>
						{triggers.map((trigger) => {
							return (
								<MenuItem
									key={trigger}
									value={trigger}
									classes={{ selected: classes.selected }}
									sx={{ padding: "6px 24px", fontSize: "15px", height: "32px", letterSpacing: "unset" }}
								>
									{trigger}
								</MenuItem>
							);
						})}
					</Select>
				</div>
			}
			<Tabs
				value={tabValue}
				TabIndicatorProps={{
					sx: {
						display: "none"
					}
				}}
				onChange={handleTabClick}
			>
				<Tab
					label={trigger === "cross" ? getTranslation("createEditRule.trigger.anyLine") : displayName === "polygon" || "system" ? getTranslation(`createEditRule.trigger.anyDots.${displayName}`) : getTranslation("createEditRule.trigger.anyDynamic", displayName)}
					sx={styles.tabButton}
					value='b1'
					className={`left-tab ${tabValue === "b1" ? "selected-tab" : "unselected-tab"}`}
				/>
				<Tab
					label={trigger === "cross" ? getTranslation("createEditRule.trigger.selectLine") : displayName === "polygon" || "system" ? getTranslation(`createEditRule.trigger.select.${displayName}`) : getTranslation("createEditRule.trigger.selectDynamic", displayName)}
					sx={styles.tabButton}
					value='b2'
					className={`right-tab ${tabValue === "b2" ? "selected-tab" : "unselected-tab"}`}
				/>
			</Tabs>
			<TabPanel value={"b2"} selectedTab={tabValue}>
				<div>
					<List
						className='rule-attributes-list'
					>
						{targets.map((item, index) =>
							<div>
								<ListItemButton
									className="listItemButton-overrides"
									key={item.id}
									onMouseEnter={() => handleTargetHover(index)}
									onMouseLeave={() => handleTargetHover(null)}
								>
									<ListItemIcon>
										<i

											className='material-icons'
											style={{ color: "tomato" }}
											onClick={() => removeTarget(item)}
										>clear</i>
									</ListItemIcon>
									<ListItemText
										primary={targetType === "shape" ? item.entityData.properties.name : item.name}
										primaryTypographyProps={customStyle.typography}
									/>
								</ListItemButton>
							</div>
						)}
						{targets.length > 0 ?
							<div>
								<ListItemButton
									className='add-rule-attribute listItemButton-overrides'
									onClick={handleClick}
								>
									<ListItemIcon>
										<i
											className='material-icons'
											style={{ color: "#35b7f3" }}
										>
											add
										</i>
									</ListItemIcon>
									<ListItemText
										primary={getTranslation("createEditRule.trigger.addAnother")}
										primaryTypographyProps={{ ...customStyle.typography, color: "#35b7f3" }}
									/>
								</ListItemButton>
							</div>
							:
							<div>
								<ListItemButton
									className='add-rule-attribute listItemButton-overrides'
									onClick={handleClick}
								>
									<ListItemIcon>
										<i
											className='material-icons'
											style={{ color: "#35b7f3" }}
										>
											add
										</i>
									</ListItemIcon>
									<ListItemText
										primary={trigger === "cross" ? getTranslation("createEditRule.trigger.anyLine") : displayName === "polygon" || "system" ? getTranslation(`createEditRule.trigger.anyDots.${displayName}`) : getTranslation("createEditRule.trigger.anyDynamicdots", displayName)}
										primaryTypographyProps={{ ...customStyle.typography, color: "#35b7f3" }}
									/>
								</ListItemButton>
							</div>
						}
					</List>

					<ErrorBoundary>
						{isOpen === "trigger-dialog" && (
							<TriggerDialog
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
			</TabPanel>
		</div >
	);
};


export default TriggerAttributes;