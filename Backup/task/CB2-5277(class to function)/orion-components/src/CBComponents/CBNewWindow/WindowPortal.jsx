import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { getTranslation } from "orion-components/i18n/I18nContainer";

const propTypes = {
	children: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.node),
		PropTypes.node
	]).isRequired,
	id: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	windowStyle: PropTypes.string.isRequired,
	onWindowClose: PropTypes.func.isRequired
};

const defaultProps = {
	children: <div></div>,
	id: "1",
	title: getTranslation("global.CBComponents.CBNewWindow.newWindow"),
	windowStyle: "width=600,height=600,left=0,top=0",
	onWindowClose: () => { }
};

const WindowPortal = ({ id, windowStyle, title, onWindowClose, children }) => {
	const containerElement = document.createElement("div");
	const windowReference = null;

	useEffect(() => {
		const windowReference = window.open("", id, windowStyle);

		// Copy CSS styling from the source document to the document generated in the new window
		enableStyling(document, windowReference.document);

		// Set title
		windowReference.document.title = title;

		// Append container
		windowReference.document.body.appendChild(containerElement);

		// Call provided function when window is manually closed
		windowReference.onbeforeunload = () => {
			onWindowClose();
		};

		return () => {
			onWindowClose();
			// Close window
			windowReference.close();
		};
	}, []);

	return ReactDOM.createPortal(children, containerElement);
};

/**
 * Copy CSS styling from a source document to a target document
 * @param {object} document - Document from source 
 * @param {object} windowDocument - Document from newly generated window
 */
const enableStyling = (document, windowDocument) => {

	// Convert array-like object into array
	const documentStyleArray = [...document.styleSheets];

	documentStyleArray.forEach(stylesheet => {

		// style tags
		if (stylesheet.cssRules) {
			const element = document.createElement("style");
  
			// Convert array-like object into array
			const cssRules = [...stylesheet.cssRules];

			// Add css rules to the body of a style element 
			cssRules.forEach(rule => {
				element.appendChild(document.createTextNode(rule.cssText));
			});

			// Append the element to the head of the new window
			windowDocument.head.appendChild(element);
		}
		// link tags
		else if (stylesheet.href) {
			// Create link tag
			const element = document.createElement("link");

			// Set relevant properties
			element.rel = "stylesheet";
			element.href = stylesheet.href;

			// Append the element to the head of the new window
			windowDocument.head.appendChild(element);
		}
	});
};

WindowPortal.propTypes = propTypes;
WindowPortal.defaultProps = defaultProps;

export default WindowPortal;