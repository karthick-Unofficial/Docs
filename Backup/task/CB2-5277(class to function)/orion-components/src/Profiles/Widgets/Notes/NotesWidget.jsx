import React, { memo, useEffect, useRef, useState, forwardRef } from "react";
import { IconButton, FlatButton } from "material-ui";
import Expand from "material-ui/svg-icons/maps/zoom-out-map";
import LaunchIcon from "@material-ui/icons/Launch";
import { Dialog } from "../../../CBComponents";
import { Facebook, FileDocumentEditOutline } from "mdi-material-ui";

import ReactQuill from "react-quill";
import "quill-image-drop-module/image-drop.min.js";
import { Translate, getTranslation } from "orion-components/i18n/I18nContainer";


const NotesWidget = forwardRef((props, ref) => {
	const {
		selectWidget,
		contextId, entityType,
		updateNotesStatus,
		event,
		notes,
		deleteNotes,
		openDialog,
		closeDialog,
		updateNotes,
		dir,
		selected,
		order,
		expanded,
		enabled,
		disabled,
		canContribute,
		widgetsExpandable,
		secondaryExpanded,
		widgetsLaunchable,
		placeholder,
		dialog,
		activities
	} = props;
	const [currentHtml, setCurrentHtml] = useState("");
	const [beforeChange, setBeforeChange] = useState("");
	const [originalHTML, setOriginalHTML] = useState("");
	const [updatedHTML, setUpdatedHTML] = useState("");
	const [actor, setActor] = useState([]);
	const [theme, setTheme] = useState("snow");
	const [hasChanged, setHasChanged] = useState(false);
	const [hasUpdated, setHasUpdated] = useState(false);
	const [revert, setRevert] = useState(false);
	const [notesChanged, setNotesChanged] = useState(false);
	const reactQuillRef = useRef(null);
	const currentHtmlRef = useRef(null);

	const handleExpand = () => {
		selectWidget("Notes");
	};

	useEffect(() => {
		currentHtmlRef.current = currentHtml;
	}, [currentHtml]);

	const handleLaunch = () => {
		// -- different actions based on entity type: ["track", "shapes", "event", "camera", "facility"]
		if (entityType === "event") {
			window.open(`/events-app/#/entity/${contextId}/widget/notes`);
		}
	};

	const handleChange = (content, delta, source, editor) => {
		const imgCount = (editor.getHTML().match(/<img/g) || []).length;
		if (editor.getText().length <= 10000 && imgCount <= 10) {
			const html = editor.getHTML();
			const change = replaceWhitespace(html);
			const original = replaceWhitespace(originalHTML);
			const hasChanged = original !== change;
			if (updateNotesStatus) {
				updateNotesStatus(hasChanged);
				setCurrentHtml(html);
				setBeforeChange(html);
				setHasChanged(hasChanged);
				setRevert(false);
				setNotesChanged(hasChanged);

			}
		} else {
			setRevert(true);
		}
	};

	useEffect(() => {
		//If an event does not have a notes object, we need to create an empty one
		if (event && !notes) {
			setOriginalHTML("<p><br></p>");
			setCurrentHtml("<p><br></p>");
			setBeforeChange("<p><br></p>");
		}

		//initial loading of the notes and keep loading updates to the notes until user makes changes
		if (
			(notes && !originalHTML) ||
			(notes &&
				notes.html !== originalHTML &&
				!hasChanged)
		) {
			setOriginalHTML(notes.html);
			setCurrentHtml(notes.html);
			setBeforeChange(notes.html);
		}

		//We need a flag for when a user is making changes, but the notes has updated since the user started making changes
		if (
			hasChanged &&
			notes && notes.html !== originalHTML
		) {
			//Flags that will help grab the names of users who made changes while user was editing
			if (!updatedHTML) {
				setUpdatedHTML(notes.html);
				setActor([activities[0].actor]);
			} else {
				setUpdatedHTML(notes.html);
				if (activities[0].actor.id !== actor[0].id) {
					const actorData = [...actor, activities[0].actor];
					setActor(actorData);
				}
			}
			setHasUpdated(true);
		}
		if (ref) ref.current = { cancelEdit, saveEdit };

	}, [props]);

	const replaceWhitespace = str => {
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

	const saveEdit = async forceUpdate => {
		if (forceUpdate === undefined) {
			forceUpdate = !hasUpdated;
		}

		if (forceUpdate) {
			const notes = {
				path: notes
					? notes.path
						? notes.path
						: ""
					: "",
				html: replaceWhitespace(currentHtml),
				name: "notes"
			};
			if (currentHtmlRef.current === "<p><br></p>") {
				deleteNotes(event.id);
				if (updateNotesStatus)
					updateNotesStatus(false);
			} else {
				updateNotes(event, [notes]);
				if (updateNotesStatus)
					updateNotesStatus(false);
			}
			setHasChanged(false);
			setHasUpdated(false);
			setActor([]);
			setUpdatedHTML("");
			setNotesChanged(false);
		} else {
			openDialog("notesWidgetDialog");
		}
	};

	const cancelEdit = () => {
		if (updateNotesStatus)
			updateNotesStatus(false);
		setOriginalHTML(replaceWhitespace(notes.html));
		setCurrentHtml(replaceWhitespace(notes.html));
		setBeforeChange(replaceWhitespace(notes.html), );
		setUpdatedHTML("");
		setActor([]);
		setHasChanged(false);
		setNotesChanged(false);
		let element = document.getElementsByClassName("ql-editor");
		element[0].innerHTML = "";
	};

	useEffect(() => {
		if (dir === "rtl") {
			const quillEditor = document.getElementsByClassName("ql-editor");
			if (quillEditor.length > 0) {
				for (let i = 0; i < quillEditor.length; i++) {
					quillEditor[i].style.direction = "rtl";
					quillEditor[i].style["text-align"] = "right";
					quillEditor[i].style[" unicode-bidi"] = "bidi-override;";

				}
			}
		}
	}, [dir]);

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
							{secondaryExpanded && notesChanged && (
								<div className={"widget-option-button"}>
									<FlatButton
										label={getTranslation("global.profiles.widgets.notes.cancel")}
										secondary={true}
										onClick={() => cancelEdit()}
									/>
									<FlatButton
										label={getTranslation("global.profiles.widgets.notes.save")}
										primary={true}
										onClick={() => saveEdit()}
									/>
								</div>
							)}
							{!disabled && widgetsExpandable && (
								<div className="widget-expand-button">
									<IconButton
										style={dir == "rtl" ? { paddingLeft: 0, width: "auto" } : { paddingRight: 0, width: "auto" }}
										onClick={handleExpand}
									>
										<Expand />
									</IconButton>
								</div>
							)}
							{!disabled && widgetsLaunchable && (
								<div className="widget-expand-button">
									<IconButton
										style={dir == "rtl" ? { paddingLeft: 0, width: "auto" } : { paddingRight: 0, width: "auto" }}
										onClick={handleLaunch}
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
								defaultValue={currentHtml}
								ref={reactQuillRef}
								onChange={handleChange}
								theme={theme}
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
								placeholder={placeholder}
								className={dir == "rtl" ? "editorStylesRTL" : ""}
							/>
						</div>
					)}
				</div>
			)}
			{expanded && (
				<div id="notes-widget" className="widget-content">
					<ReactQuill
						defaultValue={currentHtml}
						ref={reactQuillRef}
						onChange={handleChange}
						theme={theme}
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
						placeholder={placeholder}
						className={dir == "rtl" ? "editorStylesRTL" : ""}
					/>
					<Dialog
						open={dialog === "notesWidgetDialog"}
						title={getTranslation("global.profiles.widgets.notes.conflictingChanges")}
						textContent={
							actor[0]
								? actor.length < 2
									? getTranslation("global.profiles.widgets.notes.textContent1", actor[0].name)
									: getTranslation("global.profiles.widgets.notes.textContent2")
								: ""
						}
						confirm={{
							action: () => {
								saveEdit(true);
								closeDialog("notesWidgetDialog");
							},
							label: getTranslation("global.profiles.widgets.notes.confirm")
						}}
						abort={{
							action: () => closeDialog("notesWidgetDialog"),
							label: getTranslation("global.profiles.widgets.notes.cancel")
						}}
						dir={dir}
					/>
					<Dialog
						open={dialog === "notesWidgetLoadingDialog"}
						title={getTranslation("global.profiles.widgets.notes.uploading")}
						textContent={getTranslation("global.profiles.widgets.notes.uploadingNewImgs")}
						dir={dir}
					/>
				</div>
			)}
		</section>
	);
});

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


export default memo(NotesWidget);

//doubt on getDerivedStateFromProps.
