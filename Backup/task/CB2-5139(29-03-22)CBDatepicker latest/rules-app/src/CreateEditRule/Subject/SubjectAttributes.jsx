import React, { Component } from "react";

// Error Handling
import ErrorBoundary from "orion-components/ErrorBoundary";

// material-ui
import {Tabs, Tab} from "material-ui/Tabs";
import List, {ListItem} from "material-ui/List";

// components
import SubjectDialogContainer from "./SubjectDialog/SubjectDialogContainer";
import SubjectFeedDialogContainer from "./SubjectFeedDialog/SubjectFeedDialogContainer";

// misc
import _ from "lodash";
import { Translate, getTranslation } from "orion-components/i18n/I18nContainer";


class SubjectAttributes extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tabValue: "a1"
		};
	}

	handleEntityClick = () => {
		const { isOpen, closeDialog, openDialog, clearSearchResults } = this.props;
		if (isOpen === "subject-entity-dialog") {
			closeDialog("subject-entity-dialog");
		}
		else { 
			openDialog("subject-entity-dialog");
		}
		clearSearchResults();
	}

	handleFeedFilterClick = () => {
		const { isOpen, closeDialog, openDialog } = this.props;
		if (isOpen === "subject-feed-dialog") {
			closeDialog("subject-feed-dialog");
		}
		else {
			openDialog("subject-feed-dialog");
		}
	}

	handleTabClick = (event) => {
		this.props.toggleSubjectTab(event.props.value);
	}

	_capitalize = (string) => {
		return string.slice(0, 1).toUpperCase() + string.slice(1, string.length);
	}

	render () {
		const { styles, handleSubjectHover, removeSubject, tabValue, isOpen } = this.props;

		return (
			<div className="generic-attribute">
				<h4><Translate value="createEditRule.subject.subjectAttributes.title"/></h4>
				<p><Translate value="createEditRule.subject.subjectAttributes.tracks"/></p>
				<Tabs
					tabItemContainerStyle={styles.contentContainerStyle}
					inkBarStyle={styles.inkBar}
					value={tabValue}
					children={[
						<Tab
							label={getTranslation("createEditRule.subject.subjectAttributes.anyTrack")}
							style={styles.tabButton}
							value='a1'
							onActive={this.handleTabClick}
							className={`left-tab ${tabValue === "a1" ? "selected-tab" : "unselected-tab"}`}
						>
							<div>
								<List
									className='rule-attributes-list'
								>
									{this.props.subject.map((feed, index) =>
										<ListItem
											key={feed.id}
											onMouseEnter={() => handleSubjectHover(index)}
											onMouseLeave={() => handleSubjectHover(null)}
											primaryText={feed.name}
											leftIcon={
												<i
													className='material-icons'
													style={{color: "tomato"}}
													onClick={() => removeSubject(feed)}
												>clear</i>
											}
										/>
									)}
									{this.props.subject.length > 0 ?
										<ListItem
											className='add-rule-attribute'
											primaryText={getTranslation("createEditRule.subject.subjectAttributes.editFeed")}
											onClick={this.handleFeedFilterClick}
											leftIcon={
												<i
													className='material-icons'
													style={{color: "#35b7f3"}}
												>add</i>
											}
										/>
										:
										<ListItem
											className='add-rule-attribute'
											primaryText={getTranslation("createEditRule.subject.subjectAttributes.addFeed")}
											onClick={this.handleFeedFilterClick}
											leftIcon={
												<i
													className='material-icons'
													style={{color: "#35b7f3"}}
												>add</i>
											}
										/>
									}
								</List>
								{isOpen === "subject-feed-dialog" && (
									<ErrorBoundary>
										<SubjectFeedDialogContainer
											isOpen={isOpen === "subject-feed-dialog"}
											styles={styles}
											toggleDialog={this.handleFeedFilterClick}
											addSubjects={this.props.addSubjects}
											subject={this.props.subject}
										/>
									</ErrorBoundary>
								)}
							</div>
						</Tab>,
						<Tab
							label={getTranslation("createEditRule.subject.subjectAttributes.selectTracks")}
							style={styles.tabButton}
							value='a2'
							onActive={this.handleTabClick}
							className={`right-tab ${tabValue === "a2" ? "selected-tab" : "unselected-tab"}`}
						>
							<div>
								<List
									className='rule-attributes-list'
								>
									{this.props.subject.map((track, index) =>
										<ListItem
											key={track.id}
											onMouseEnter={() => handleSubjectHover(index)}
											onMouseLeave={() => handleSubjectHover(null)}
											primaryText={track.name}
											leftIcon={
												<i
													className='material-icons'
													style={{color: "tomato"}}
													onClick={() => removeSubject(track)}
												>clear</i>
											}
										/>
									)}
									{this.props.subject.length > 0 ?
										<ListItem
											className='add-rule-attribute'
											primaryText={getTranslation("createEditRule.subject.subjectAttributes.addAnother")}
											onClick={this.handleEntityClick}
											leftIcon={
												<i
													className='material-icons'
													style={{color: "#35b7f3"}}
												>add</i>
											}
										/>
										:
										<ListItem
											className='add-rule-attribute'
											primaryText={getTranslation("createEditRule.subject.subjectAttributes.addEntity")}
											onClick={this.handleEntityClick}
											leftIcon={
												<i
													className='material-icons'
													style={{color: "#35b7f3"}}
												>add</i>
											}
										/>
									}	
								</List>
								{isOpen === "subject-entity-dialog" && (
									<ErrorBoundary>
										<SubjectDialogContainer 
											isOpen={isOpen === "subject-entity-dialog"}
											styles={styles}
											toggleDialog={this.handleEntityClick}
											addSubjects={this.props.addSubjects}
											subject={this.props.subject}
										/>
									</ErrorBoundary>
								)}
							</div>
						</Tab>
					]}
				/>
			</div>
		);
	}
}


export default SubjectAttributes;