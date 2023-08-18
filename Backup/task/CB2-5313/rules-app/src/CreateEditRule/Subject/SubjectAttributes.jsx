import React, { useState } from "react";

// Error Handling
import ErrorBoundary from "orion-components/ErrorBoundary";

// material-ui
import { Tabs, Tab } from "@mui/material";
import { List, ListItemText, ListItemIcon, ListItemButton } from "@mui/material";
import { TabPanel } from "orion-components/CBComponents";

// components
import SubjectDialog from "./SubjectDialog/SubjectDialog";
import SubjectFeedDialog from "./SubjectFeedDialog/SubjectFeedDialog";

// misc
import _ from "lodash";
import { Translate, getTranslation } from "orion-components/i18n";
import { useSelector, useDispatch } from "react-redux";
import * as actionCreators from "./subjectAttributesActions.js";
import { getDir } from "orion-components/i18n/Config/selector";

const SubjectAttributes = ({ toggleSubjectTab, styles, handleSubjectHover, removeSubject, tabValue, subject, addSubjects }) => {
	const dispatch = useDispatch();
	const { clearSearchResults, closeDialog, openDialog } = actionCreators;

	const dir = useSelector(state => getDir(state) || "ltr");
	const isOpen = useSelector(state => state.appState.dialog.openDialog);
	const [tabValueState, setTabValueState] = useState("a1");

	const handleEntityClick = () => {
		if (isOpen === "subject-entity-dialog") {
			dispatch(closeDialog("subject-entity-dialog"));
		}
		else {
			dispatch(openDialog("subject-entity-dialog"));
		}
		dispatch(clearSearchResults());
	};

	const handleFeedFilterClick = () => {
		if (isOpen === "subject-feed-dialog") {
			dispatch(closeDialog("subject-feed-dialog"));
		}
		else {
			dispatch(openDialog("subject-feed-dialog"));
		}
	};

	const handleTabClick = (event, tab) => {
		toggleSubjectTab(tab);
	};

	const _capitalize = (string) => {
		return string.slice(0, 1).toUpperCase() + string.slice(1, string.length);
	};

	const customStyle = {
		ruleAttributesList: {
			...(dir === "rtl" ? { paddingRight: "16px" } : { paddingLeft: "16px" })
		}
	};

	return (
		<div className="generic-attribute">
			<h4><Translate value="createEditRule.subject.subjectAttributes.title" /></h4>
			<p><Translate value="createEditRule.subject.subjectAttributes.tracks" /></p>
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
					label={getTranslation("createEditRule.subject.subjectAttributes.anyTrack")}
					sx={styles.tabButton}
					value='a1'
					className={`left-tab ${tabValue === "a1" ? "selected-tab" : "unselected-tab"}`}
				/>
				<Tab
					label={getTranslation("createEditRule.subject.subjectAttributes.selectTracks")}
					style={styles.tabButton}
					value='a2'
					className={`right-tab ${tabValue === "a2" ? "selected-tab" : "unselected-tab"}`}
				/>
			</Tabs>
			<TabPanel value={"a1"} selectedTab={tabValue}>
				<div>
					<List
						className='rule-attributes-list'
						sx={customStyle.ruleAttributesList}
					>
						{subject.map((feed, index) =>
							<ListItemButton
								className="listItemButton-overrides"
								key={feed.id}
								onMouseEnter={() => handleSubjectHover(index)}
								onMouseLeave={() => handleSubjectHover(null)}
							>
								<ListItemIcon>
									<i
										className='material-icons'
										style={{ color: "tomato" }}
										onClick={() => removeSubject(feed)}
									>clear</i>
								</ListItemIcon>
								<ListItemText
									primary={feed.name}
									primaryTypographyProps={{ style: { fontSize: 16 } }}
								/>
							</ListItemButton>
						)}
						{subject.length > 0 ?
							<ListItemButton
								onClick={handleFeedFilterClick}
								className='add-rule-attribute listItemButton-overrides'
							>
								<ListItemIcon>
									<i
										className='material-icons'
										style={{ color: "#35b7f3" }}
									>add</i>
								</ListItemIcon>
								<ListItemText
									primary={getTranslation("createEditRule.subject.subjectAttributes.editFeed")}
									primaryTypographyProps={{ style: { fontSize: 16, color: "#35b7f3" } }}
								/>
							</ListItemButton>
							:
							<ListItemButton
								onClick={handleFeedFilterClick}
								className='add-rule-attribute listItemButton-overrides'
							>
								<ListItemIcon>
									<i
										className='material-icons'
										style={{ color: "#35b7f3" }}
									>add</i>
								</ListItemIcon>
								<ListItemText
									primary={getTranslation("createEditRule.subject.subjectAttributes.addFeed")}
									primaryTypographyProps={{ style: { fontSize: 16, color: "#35b7f3" } }}
								/>
							</ListItemButton>
						}
					</List>
					{isOpen === "subject-feed-dialog" && (
						<ErrorBoundary>
							<SubjectFeedDialog
								isOpen={isOpen === "subject-feed-dialog"}
								styles={styles}
								toggleDialog={handleFeedFilterClick}
								addSubjects={addSubjects}
								subject={subject}
							/>
						</ErrorBoundary>
					)}
				</div>
			</TabPanel >
			<TabPanel value={"a2"} selectedTab={tabValue}>
				<div>
					<List
						className='rule-attributes-list'
						sx={customStyle.ruleAttributesList}
					>
						{subject.map((track, index) =>
							<ListItemButton
								className="listItemButton-overrides"
								key={track.id}
								onMouseEnter={() => handleSubjectHover(index)}
								onMouseLeave={() => handleSubjectHover(null)}
							>
								<ListItemIcon>
									<i
										className='material-icons'
										style={{ color: "tomato" }}
										onClick={() => removeSubject(track)}
									>clear</i>
								</ListItemIcon>
								<ListItemText
									primary={track.name}
									primaryTypographyProps={{ style: { fontSize: 16 } }}
								/>
							</ListItemButton>
						)}
						{subject.length > 0 ?
							<ListItemButton
								className='add-rule-attribute listItemButton-overrides'
								onClick={handleEntityClick}
							>
								<ListItemIcon>
									<i
										className='material-icons'
										style={{ color: "#35b7f3" }}
									>add</i>
								</ListItemIcon>
								<ListItemText
									primary={getTranslation("createEditRule.subject.subjectAttributes.addAnother")}
									primaryTypographyProps={{ style: { fontSize: 16, color: "#35b7f3" } }}
								/>
							</ListItemButton>
							:
							<ListItemButton
								className='add-rule-attribute listItemButton-overrides'
								sx={styles.listItemButton}
								style={{ background: "none" }}
								onClick={handleEntityClick}
							>
								<ListItemIcon>
									<i
										className='material-icons'
										style={{ color: "#35b7f3" }}
									>add</i>
								</ListItemIcon>
								<ListItemText
									primary={getTranslation("createEditRule.subject.subjectAttributes.addEntity")}
									primaryTypographyProps={{ style: { fontSize: 16, color: "#35b7f3" } }}
								/>
							</ListItemButton>
						}
					</List>
					{isOpen === "subject-entity-dialog" && (
						<ErrorBoundary>
							<SubjectDialog
								isOpen={isOpen === "subject-entity-dialog"}
								styles={styles}
								toggleDialog={handleEntityClick}
								addSubjects={addSubjects}
								subject={subject}
							/>
						</ErrorBoundary>
					)}
				</div>
			</TabPanel>
		</div >
	);
};


export default SubjectAttributes;