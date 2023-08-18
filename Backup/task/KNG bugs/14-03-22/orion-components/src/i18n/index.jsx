import React, { Component } from "react";
import { syncTranslationWithStore } from "react-redux-i18n";

export default class I18n extends Component {
	constructor(props) {
		super(props);

	}
	componentWillMount(){
    	const store = this.props.store;
    	this.props.initI18n(this.props.appId, store);
    	syncTranslationWithStore(store);
	}

	componentDidUpdate(){
		document.dir = this.props.dir;
	  }

	render() {
    	return <div/>;
	}
}
