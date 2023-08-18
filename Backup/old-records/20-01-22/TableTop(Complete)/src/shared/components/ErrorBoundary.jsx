import React, { Component } from "react";
import PropTypes from "prop-types";
import clientLogsService  from "../../../src/services/clientLogsService";
import { Translate } from "orion-components/i18n/I18nContainer";

export default class ErrorBoundary extends Component {
	constructor(props) {
		super(props);

		this.state = {hasError: false};
	}
	
	static getDerivedStateFromError(error) {
		if(error){
			return { hasError: true };
		}
	  }

	componentDidCatch(error, errorInfo) {
		const newClientLog = {
			isError: this.state.hasError,
			message: error.message,
			errorStack: errorInfo.componentStack,
			componentName: this.props.componentName ? this.props.componentName : null
		};
		clientLogsService.saveClientLogs(newClientLog);
	}

	render() {
		if (this.state.hasError) {
			return (
				<div><Translate value="shared.components.errorBoundary.error" /></div>
			);
		} else {
			return this.props.children;
		}
	}
}	

ErrorBoundary.propTypes = {
	children: PropTypes.node.isRequired,
	componentName: PropTypes.string
};
