import React, { useState } from "react";

// Error Handling
import ErrorBoundary from "orion-components/ErrorBoundary";

// material-ui
import { Tabs, Tab } from "material-ui/Tabs";
import List, { ListItem } from "material-ui/List";

// components
import SubjectDialog from "./SubjectDialog/SubjectDialog";
import SubjectFeedDialog from "./SubjectFeedDialog/SubjectFeedDialog";

// misc
import _ from "lodash";
import { Translate, getTranslation } from "orion-components/i18n";
import { useSelector, useDispatch } from "react-redux";
import * as actionCreators from "./subjectAttributesActions.js";

const SubjectAttributes = ({ toggleSubjectTab, styles, handleSubjectHover, removeSubject, tabValue, subject, addSubjects }) => {
	const dispatch = useDispatch();
	const { clearSearchResults, closeDialog, openDialog } = actionCreators;

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

	const handleTabClick = (event) => {
		toggleSubjectTab(event.props.value);
	};

	const _capitalize = (string) => {
		return string.slice(0, 1).toUpperCase() + string.slice(1, string.length);
	};

	return (
		<div className="generic-attribute">
			<h4><Translate value="createEditRule.subject.subjectAttributes.title" /></h4>
			<p><Translate value="createEditRule.subject.subjectAttributes.tracks" /></p>
			<Tabs
				tabItemContainerStyle={styles.contentContainerStyle}
				inkBarStyle={styles.inkBar}
				value={tabValue}
				children={[
					<Tab
						label={getTranslation("createEditRule.subject.subjectAttributes.anyTrack")}
						style={styles.tabButton}
						value='a1'
						onActive={handleTabClick}
						className={`left-tab ${tabValue === "a1" ? "selected-tab" : "unselected-tab"}`}
					>
						<div>
							<List
								className='rule-attributes-list'
							>
								{subject.map((feed, index) =>
									<ListItem
										key={feed.id}
										onMouseEnter={() => handleSubjectHover(index)}
										onMouseLeave={() => handleSubjectHover(null)}
										primaryText={feed.name}
										leftIcon={
											<i
												className='material-icons'
												style={{ color: "tomato" }}
												onClick={() => removeSubject(feed)}
											>clear</i>
										}
									/>
								)}
								{subject.length > 0 ?
									<ListItem
										className='add-rule-attribute'
										primaryText={getTranslation("createEditRule.subject.subjectAttributes.editFeed")}
										onClick={handleFeedFilterClick}
										leftIcon={
											<i
												className='material-icons'
												style={{ color: "#35b7f3" }}
											>add</i>
										}
									/>
									:
									<ListItem
										className='add-rule-attribute'
										primaryText={getTranslation("createEditRule.subject.subjectAttributes.addFeed")}
										onClick={handleFeedFilterClick}
										leftIcon={
											<i
												className='material-icons'
												style={{ color: "#35b7f3" }}
											>add</i>
										}
									/>
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
					</Tab>,
					<Tab
						label={getTranslation("createEditRule.subject.subjectAttributes.selectTracks")}
						style={styles.tabButton}
						value='a2'
						onActive={handleTabClick}
						className={`right-tab ${tabValue === "a2" ? "selected-tab" : "unselected-tab"}`}
					>
						<div>
							<List
								className='rule-attributes-list'
							>
								{subject.map((track, index) =>
									<ListItem
										key={track.id}
										onMouseEnter={() => handleSubjectHover(index)}
										onMouseLeave={() => handleSubjectHover(null)}
										primaryText={track.name}
										leftIcon={
											<i
												className='material-icons'
												style={{ color: "tomato" }}
												onClick={() => removeSubject(track)}
											>clear</i>
										}
									/>
								)}
								{subject.length > 0 ?
									<ListItem
										className='add-rule-attribute'
										primaryText={getTranslation("createEditRule.subject.subjectAttributes.addAnother")}
										onClick={handleEntityClick}
										leftIcon={
											<i
												className='material-icons'
												style={{ color: "#35b7f3" }}
											>add</i>
										}
									/>
									:
									<ListItem
										className='add-rule-attribute'
										primaryText={getTranslation("createEditRule.subject.subjectAttributes.addEntity")}
										onClick={handleEntityClick}
										leftIcon={
											<i
												className='material-icons'
												style={{ color: "#35b7f3" }}
											>add</i>
										}
									/>
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
					</Tab>
				]}
			/>
		</div>
	);
};


export default SubjectAttributes;