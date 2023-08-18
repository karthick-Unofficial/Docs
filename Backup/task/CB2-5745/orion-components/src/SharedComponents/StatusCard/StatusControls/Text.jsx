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
		lineHeight: 1
	}
};

const Text = ({ control, dir, id }) => {
	const { body } = control;
	const [text, setText] = useState(EditorState.createEmpty());
	const iteration = useRef(1); // iteration ref is used to dynamically update sliceValue based on scrollHeight.
	const bodyRef = useRef(body);

	const setEditorState = () => {
		const editorState = EditorState.createWithContent(convertFromRaw(bodyRef.current));
		const container = document.querySelector(`#text-boundary${id} .public-DraftEditor-content`);
		const contentState = editorState.getCurrentContent();
		const blocks = contentState.getBlockMap();
		let isTruncated = false;
		const truncatedBlocks = [];
		blocks.forEach(block => {
			if (!isTruncated && container.scrollHeight > 215) {
				isTruncated = true;
				const truncatedHtml = `${block.getText().slice(0, - (100 * iteration.current))}...`;
				const truncatedBlock = block.merge({
					text: truncatedHtml,
					type: block.getType(),
					data: block.getData()
				});
				truncatedBlocks.push(truncatedBlock);
				iteration.current = iteration.current + 1;
			} else {
				iteration.current = 1;
				truncatedBlocks.push(block);
			}
		});

		if (isTruncated) {
			const state = ContentState.createFromBlockArray(truncatedBlocks);
			const update = EditorState.createWithContent(state);
			setText(update);
		} else {
			setText(editorState);
		}
	};

	// On mount, if a body exists, convert it and set it
	useEffect(() => {
		bodyRef.current = body;
		if (body) {
			setEditorState();
		}
	}, [body]);


	// Ensure click event on buttons, icons, etc do not activate
	// the draggable grid 'drag' event
	const stopPropagation = (e) => {
		e.stopPropagation();
	};

	useEffect(() => {
		const container = document.querySelector(`#text-boundary${id} .public-DraftEditor-content`);

		//ResizeObserver is being used to monitor editor container scrollHeight and trigger truncation method if overflown.
		const observer = new ResizeObserver(entries => {
			for (let entry of entries) {
				if (entry.target === container) {
					if (body) {
						if (container.scrollHeight > 215) {
							setEditorState();
						}
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
			id={`text-boundary${id}`}
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
		</div>
	);
};

Text.propTypes = propTypes;
export default Text;
