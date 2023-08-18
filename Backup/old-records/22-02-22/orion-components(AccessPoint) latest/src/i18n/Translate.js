import React, { Component } from "react";
import { Translate } from "react-redux-i18n";

class Translator extends Component {

	render() {
		return <Translate value={this.props.value} count={this.props.count != undefined ? this.props.count : ""} primaryValue={this.props.primaryValue != undefined ? this.props.primaryValue : ""} secondaryValue={this.props.secondaryValue != undefined ? this.props.secondaryValue : ""} />;
	}
}

export default Translator;
