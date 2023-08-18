import React, { useState, useEffect } from "react";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import PropTypes from "prop-types";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const propTypes = {
	control: PropTypes.object.isRequired,
	setData: PropTypes.func.isRequired,
	global: PropTypes.bool,
	dir: PropTypes.string
};

const styles = {
	container: {
		width: "100%",
		height: "100%"
	}
};

const handleChange = (value, setText, setData, changed, setChanged, setEditorData) => {
	if (!changed) {
		setChanged(1);
	}
	setText(value);
	// Convert to raw format and send to parent component to use when saving
	const contentState = value.getCurrentContent();
	const raw = convertToRaw(contentState);
	setEditorData(raw);
	setData(raw);
};

const stopPropagation = (e) => {
	e.stopPropagation();
};

const EditText = ({ control, setData, global, dir }) => {
	const { body } = control;
	const [text, setText] = useState(EditorState.createEmpty());
	const [changed, setChanged] = useState(0);
	const [editorData, setEditorData] = useState(body);
	// Ensure click event on buttons, icons, etc do not activate
	// the draggable grid 'drag' event

	// On mount, if a body exists, convert it and set it
	useEffect(() => {
		if (body && !changed) {
			setText(EditorState.createWithContent(convertFromRaw(body)));
		}
	}, [body, changed]);

	useEffect(() => {
		setData(editorData);
	}, [global]);

	return (
		<div id="text-boundary" style={styles.container} onMouseDown={stopPropagation} onTouchStart={stopPropagation}>
			<Editor
				editorState={text}
				toolbarClassName="toolbarClassName"
				wrapperClassName="textAreaWrapper"
				editorClassName={dir == "rtl" ? "textEditorRTL" : "textEditor"}
				onEditorStateChange={(value) =>
					handleChange(value, setText, setData, changed, setChanged, setEditorData)
				}
				toolbar={{
					options: ["inline", "fontSize", "list", "history"],
					inline: {
						options: ["bold", "italic", "underline"]
					},
					fontSize: {
						options: ["14", "16", "18", "24"],
						dropdownClassName: "fontDropdown"
					},
					list: {
						options: ["unordered", "ordered"]
					}
				}}
			/>
		</div>
	);
};

EditText.propTypes = propTypes;
export default EditText;
