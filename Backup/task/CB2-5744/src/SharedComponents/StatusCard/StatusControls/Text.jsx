import React, { useState, useEffect, useRef } from "react";
import { EditorState, convertFromRaw, ContentState } from "draft-js";
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
		height: "calc(100% - 91px)",
		lineHeight: 1,
		position: "relative"
	},
	gradient: {
		background: "-webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(137,255,241,0)), color-stop(100%,rgb(73, 77, 83, 1)))",
		height: 30,
		position: "absolute",
		width: "100%",
		bottom: 0,
		zIndex: 1,
		display: "none"
	}
};

const Text = ({ control, dir, id }) => {
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
	const stopPropagation = (e) => {
		e.stopPropagation();
	};

	useEffect(() => {
		const container = document.querySelector(`#text-boundary_${id} .public-DraftEditor-content`);
		const gradientContainer = document.querySelector(`#gradient_${id}`);
		const maxHeight = window.getComputedStyle(container).getPropertyValue('max-height').replace("px", "");

		//Using sortable textCard element to validate scrollHeight, avoiding conflicts from global status panel.
		const sortableContainer = document.querySelector(`.grid-list-item #text-boundary_${id} .public-DraftEditor-content`);
		const gridContainer = document.querySelector(`#grid-list-item${id}`);

		//ResizeObserver is being used to monitor editor container scrollHeight and trigger truncation method if overflown.
		const observer = new ResizeObserver(entries => {
			for (let entry of entries) {
				if (entry.target === container) {
					if (container.scrollHeight > maxHeight) {
						gradientContainer.style.display = "block";
					} else {
						if (sortableContainer.clientHeight < 50) {
							gridContainer.classList.add("grid-list-short");
						} else {
							gridContainer.classList.remove("grid-list-short");
						}
						gradientContainer.style.display = "none";
					}
				}
			}
		});

		observer.observe(container);

		return () => {
			observer.unobserve(container);
		};

	}, []);

	return (
		<div
			id={`text-boundary_${id}`}
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
				editorClassName={`viewOnlyEditor ${dir == "rtl" ? "textEditorRTL" : "textEditor"}`}
				editorStyle={{ color: "#B5B9BE" }}
			/>
			<div id={`gradient_${id}`} style={styles.gradient}></div>
		</div>
	);
};

Text.propTypes = propTypes;
export default Text;
