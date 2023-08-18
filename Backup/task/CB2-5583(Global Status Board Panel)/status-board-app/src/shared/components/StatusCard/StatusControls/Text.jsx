import React, { useState, useEffect } from "react";
import { EditorState, convertFromRaw } from "draft-js";
import PropTypes from "prop-types";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";


const propTypes = {
	control: PropTypes.object.isRequired,
	dir: PropTypes.string
};

const styles = {
	container: {
		width: "100%",
		height: "100%"
	}
};

const Text = ({ control, dir }) => {
	const { body } = control;
	const [text, setText] = useState(EditorState.createEmpty());

	// On mount, if a body exists, convert it and set it
	useEffect(() => {
		if (body) {
			setText(EditorState.createWithContent(convertFromRaw(body)));
		}
	}, [body]);

	// Ensure click event on buttons, icons, etc do not activate
	// the draggable grid 'drag' event
	const stopPropagation = e => {
		e.stopPropagation();
	};

	return (
		<div
			id="text-boundary"
			style={styles.container}
			onMouseDown={stopPropagation}
			onTouchStart={stopPropagation}
		>
			<Editor
				editorState={text}
				toolbarHidden={true}
				readOnly={true}
				toolbarClassName="toolbarClassName"
				wrapperClassName="textAreaWrapper"
				editorClassName={dir == "rtl" ? "textEditorRTL" : "textEditor"}
				editorStyle={{ color: "#B5B9BE" }}
			/>
		</div>
	);
};

Text.propTypes = propTypes;
export default Text;