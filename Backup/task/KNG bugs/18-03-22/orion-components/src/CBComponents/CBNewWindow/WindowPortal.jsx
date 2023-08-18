import React, { Component } from "react";
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
	onWindowClose: () => {}
};

class WindowPortal extends Component {
	constructor(props) {
		super(props);

		this.containerElement = document.createElement("div");
		this.windowReference = null;
	}
    
	componentDidMount() {
		const { id, windowStyle, title, onWindowClose } = this.props;

		// Open window
		this.windowReference = window.open("", id, windowStyle);

		// Copy CSS styling from the source document to the document generated in the new window
		enableStyling(document, this.windowReference.document);

		// Set title
		this.windowReference.document.title = title;

		// Append container
		this.windowReference.document.body.appendChild(this.containerElement);

		// Call provided function when window is manually closed
		this.windowReference.onbeforeunload = () => {
			onWindowClose();
		};
	}
    
	componentWillUnmount() {
		const { onWindowClose } = this.props;

		// Call provided function when unmounting
		onWindowClose();

		// Close window
		this.windowReference.close();
	}

	render() {
		return ReactDOM.createPortal(this.props.children, this.containerElement);
	}
}

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