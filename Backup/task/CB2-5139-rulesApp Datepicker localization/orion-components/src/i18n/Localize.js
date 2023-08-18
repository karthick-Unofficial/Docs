import React, { Component } from "react";
import { Localize } from "react-redux-i18n";

class LocalizeComponent extends Component{
    
	render(){
		return <Localize value={this.props.value} dateFormat={this.props.dateFormat} options={this.props.options ? this.props.options : null} />;
	}
}

export default LocalizeComponent;
