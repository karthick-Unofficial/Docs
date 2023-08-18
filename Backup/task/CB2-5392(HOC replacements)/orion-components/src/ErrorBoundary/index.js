import React, { Component } from "react";
import { apm } from "@elastic/apm-rum";
import { Translate } from "orion-components/i18n";

export default class ErrorBoundary extends Component {
	constructor(props) {
		super(props);

		this.state = {
			hasRenderError: false
		};
	}

	componentDidCatch (e) {
		apm.captureError(e, { message: "component-error" });
		console.error("unstable_handleError", e);
		if (e instanceof TypeError && e.message.includes("Cannot read property") && e.message.includes("of undefined")) {
			this.setState({hasRenderError: true});
		}
	}

	render() {
		if (this.state.hasRenderError) {
			if (this.props.fallbackUI) {
				return <this.props.fallbackUI />;
			}
			else return (
				<div><Translate value="global.errorBoundary.errorOccured"/></div>
			);
		} else {
			return this.props.children;
		}
	}
}

