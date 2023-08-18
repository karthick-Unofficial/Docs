import React, { Component } from "react";
import { IconButton, FlatButton } from "material-ui";
import Expand from "material-ui/svg-icons/maps/zoom-out-map";
import LaunchIcon from "@material-ui/icons/Launch";
import { Dialog } from "../../../CBComponents";
import { FileDocumentEditOutline } from "mdi-material-ui";

import ReactQuill from "react-quill";
import "quill-image-drop-module/image-drop.min.js";
import { Translate, getTranslation } from "orion-components/i18n/I18nContainer";


class NotesWidget extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentHtml: "",
			beforeChange: "",
			originalHTML: "",
			updatedHTML: "",
			actor: [],
			theme: "snow",
			hasChanged: false,
			hasUpdated: false,
			revert: false,
			notesChanged: false
		};
		this.reactQuillRef = null;
		this.replaceWhitespace = this.replaceWhitespace.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.cancelEdit = this.cancelEdit.bind(this);
		this.saveEdit = this.saveEdit.bind(this);
	}

	handleExpand = () => {
		this.props.selectWidget("Notes");
	};

	handleLaunch = () => {
		const { contextId, entityType } = this.props;

		// -- different actions based on entity type: ["track", "shapes", "event", "camera", "facility"]
		if (entityType === "event") {
			window.open(`/events-app/#/entity/${contextId}/widget/notes`);
		}
	};

	handleChange(content, delta, source, editor) {
		const imgCount = (editor.getHTML().match(/<img/g) || []).length;
		if (editor.getText().length <= 10000 && imgCount <= 10) {
			const html = editor.getHTML();
			const change = this.replaceWhitespace(html);
			const original = this.replaceWhitespace(this.state.originalHTML);
			const hasChanged = original !== change;
			if (this.props.updateNotesStatus)
				this.props.updateNotesStatus(hasChanged);
			this.setState({
				currentHtml: html,
				beforeChange: html,
				hasChanged: hasChanged,
				revert: false,
				notesChanged: hasChanged
			});
		} else {
			this.setState({
				revert: true
			});
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextState.revert !== this.state.revert && nextState.revert) {
			return true;
		}
		if (nextState.currentHtml !== this.state.currentHtml) {
			return true;
		}

		if (nextProps.dialog !== this.props.dialog) {
			return true;
		}

		if (this.state.updatedHTML !== nextState.updatedHTML) {
			return true;
		}

		if (
			this.props.selected !== nextProps.selected ||
			this.props.enabled !== nextProps.expanded ||
			this.props.expanded !== nextProps.expanded
		) {
			return true;
		}

		return false;
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		//If an event does not have a notes object, we need to create an empty one
		if (nextProps.event && !nextProps.notes) {
			return {
				originalHTML: "<p><br></p>",
				currentHtml: "<p><br></p>",
				beforeChange: "<p><br></p>"
			};
		}

		//initial loading of the notes and keep loading updates to the notes until user makes changes
		if (
			(nextProps.notes && !prevState.originalHTML) ||
			(nextProps.notes &&
				nextProps.notes.html !== prevState.originalHTML &&
				!prevState.hasChanged)
		) {
			return {
				originalHTML: nextProps.notes.html,
				currentHtml: nextProps.notes.html,
				beforeChange: nextProps.notes.html
			};
		}

		//We need a flag for when a user is making changes, but the notes has updated since the user started making changes
		if (
			prevState.hasChanged &&
			nextProps.notes && nextProps.notes.html !== prevState.originalHTML
		) {
			const newState = {
				hasUpdated: true
			};
			//Flags that will help grab the names of users who made changes while user was editing
			if (!prevState.updatedHTML) {
				newState["updatedHTML"] = nextProps.notes.html;
				newState["actor"] = [nextProps.activities[0].actor];
			} else {
				newState["updatedHTML"] = nextProps.notes.html;
				if (nextProps.activities[0].actor.id !== prevState.actor[0].id) {
					newState["actor"] = prevState.actor;
					newState.actor.push(nextProps.activities[0].actor);
				}
			}

			return newState;
		}

		return null;
	}

	replaceWhitespace = str => {
		let newStr = str
			.slice()
			.split(" ")
			.join("&nbsp;");
		newStr = str
			.slice()
			.split("img&nbsp;")
			.join("img ");
		return newStr;
	};

	saveEdit = async forceUpdate => {
		if (forceUpdate === undefined) {
			forceUpdate = !this.state.hasUpdated;
		}

		if (forceUpdate) {
			const notes = {
				path: this.props.notes
					? this.props.notes.path
						? this.props.notes.path
						: ""
					: "",
				html: this.replaceWhitespace(this.state.currentHtml),
				name: "notes"
			};
			if (this.state.currentHtml === "<p><br></p>") {
				this.props.deleteNotes(this.props.event.id);
				if (this.props.updateNotesStatus)
					this.props.updateNotesStatus(false);
			} else {
				this.props.updateNotes(this.props.event, [notes]);
				if (this.props.updateNotesStatus)
					this.props.updateNotesStatus(false);
			}
			this.setState({
				hasChanged: false,
				hasUpdated: false,
				actors: [],
				updatedHTML: "",
				notesChanged: false
			});
		} else {
			this.props.openDialog("notesWidgetDialog");
		}
	};



	cancelEdit = () => {
		if (this.props.updateNotesStatus)
			this.props.updateNotesStatus(false);
		this.setState({
			originalHTML: this.replaceWhitespace(this.props.notes.html),
			currentHtml: this.replaceWhitespace(this.props.notes.html),
			beforeChange: this.replaceWhitespace(this.props.notes.html),
			updatedHTML: "",
			actors: [],
			hasChanged: false,
			notesChanged: false
		});
	};


	componentDidUpdate() {
		if (this.props.dir === "rtl") {			
			const quillEditor = document.getElementsByClassName("ql-editor");
			if (quillEditor.length > 0) {
				for (let i = 0; i < quillEditor.length; i++) {
					quillEditor[i].style.direction = "rtl";
					quillEditor[i].style["text-align"] = "right";
					quillEditor[i].style[" unicode-bidi"] = "bidi-override;";

				}
			}
		}
	}

	render() {
		const {
			selected,
			order,
			expanded,
			enabled,
			disabled,
			canContribute,
			widgetsExpandable,
			secondaryExpanded,
			widgetsLaunchable,
			event,
			dir
		} = this.props;
		return selected || !enabled ? (
			<div />
		) : (
			<section
				id="notes-wrapper"
				className={`${expanded ? "expanded" : "collapsed"} ${"index-" +
					order} widget-wrapper`}
			>
				{!expanded && (
					<div id="notes-widget" className="widget-content">
						<div className="widget-header">
							<div className="cb-font-b2"><Translate value="global.profiles.widgets.notes.title" /></div>
							<FileDocumentEditOutline
								style={dir == "rtl" ? { marginRight: "5px", color: `${event.notes ? "#4eb5f3" : "#b5b9be"}` } : { marginLeft: "5px", color: `${event.notes ? "#4eb5f3" : "#b5b9be"}` }}
							/>
							<div className="widget-header-buttons">
								{secondaryExpanded && this.state.notesChanged && (
									<div className={"widget-option-button"}>
										<FlatButton
											label={getTranslation("global.profiles.widgets.notes.cancel")}
											secondary={true}
											onClick={() => this.cancelEdit()}
										/>
										<FlatButton
											label={getTranslation("global.profiles.widgets.notes.save")}
											primary={true}
											onClick={() => this.saveEdit()}
										/>
									</div>
								)}
								{!disabled && widgetsExpandable && (
									<div className="widget-expand-button">
										<IconButton
											style={dir == "rtl" ? { paddingLeft: 0, width: "auto" } : { paddingRight: 0, width: "auto" }}
											onClick={this.handleExpand}
										>
											<Expand />
										</IconButton>
									</div>
								)}
								{!disabled && widgetsLaunchable && (
									<div className="widget-expand-button">
										<IconButton
											style={dir == "rtl" ? { paddingLeft: 0, width: "auto" } : { paddingRight: 0, width: "auto" }}
											onClick={this.handleLaunch}
										>
											<LaunchIcon />
										</IconButton>
									</div>
								)}
							</div>
						</div>
						{secondaryExpanded && (
							<div className="notes-quill">
								<ReactQuill
									value={this.state.currentHtml}
									ref={el => {
										this.reactQuillRef = el;
									}}
									onChange={this.handleChange.bind(this)}
									theme={this.state.theme}
									modules={
										canContribute
											? NotesWidget.modules
											: {
												toolbar: false
											}
									}
									formats={NotesWidget.formats}
									readOnly={!canContribute}
									bounds={"#notes-widget"}
									style={{}}
									placeholder={this.props.placeholder}
								/>
							</div>
						)}
					</div>
				)}
				{expanded && (
					<div id="notes-widget" className="widget-content">
						<ReactQuill
							value={this.state.currentHtml}
							ref={el => {
								this.reactQuillRef = el;
							}}
							onChange={this.handleChange}
							theme={this.state.theme}
							modules={
								canContribute
									? NotesWidget.modules
									: {
										toolbar: false
									}
							}
							formats={NotesWidget.formats}
							readOnly={!canContribute}
							bounds={"#notes-widget"}
							style={{}}
							placeholder={this.props.placeholder}
						/>
						<Dialog
							open={this.props.dialog === "notesWidgetDialog"}
							title={getTranslation("global.profiles.widgets.notes.conflictingChanges")}
							textContent={
								this.state.actor[0]
									? this.state.actor.length < 2
										? getTranslation("global.profiles.widgets.notes.textContent1", this.state.actor[0].name)
										: getTranslation("global.profiles.widgets.notes.textContent2")
									: ""
							}
							confirm={{
								action: () => {
									this.saveEdit(true);
									this.props.closeDialog("notesWidgetDialog");
								},
								label: getTranslation("global.profiles.widgets.notes.confirm")
							}}
							abort={{
								action: () => this.props.closeDialog("notesWidgetDialog"),
								label: getTranslation("global.profiles.widgets.notes.cancel")
							}}
							dir={dir}
						/>
						<Dialog
							open={this.props.dialog === "notesWidgetLoadingDialog"}
							title={getTranslation("global.profiles.widgets.notes.uploading")}
							textContent={getTranslation("global.profiles.widgets.notes.uploadingNewImgs")}
							dir={dir}
						/>
					</div>
				)}
			</section>
		);
	}
}

NotesWidget.modules = {
	toolbar: [
		[{ header: "1" }, { header: "2" }],
		["bold", "italic", "underline", "strike"],

		[
			{ list: "ordered" },
			{ list: "bullet" },
			{ indent: "-1" },
			{ indent: "+1" }
		],
		["link", "image"],
		["clean"]
	],
	imageDrop: true
};

NotesWidget.formats = [
	"header",
	"font",
	"size",
	"bold",
	"italic",
	"underline",
	"strike",
	"blockquote",
	"list",
	"bullet",
	"indent",
	"link",
	"image"
];



export default NotesWidget;
