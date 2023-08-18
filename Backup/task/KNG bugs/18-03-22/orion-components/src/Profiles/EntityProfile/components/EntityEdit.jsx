import React from "react";
import { Translate } from "orion-components/i18n/I18nContainer";

export default class EntityEdit extends React.Component {
  
	render() {
		const {onClick} = this.props;
		return (
    	<a onClick={onClick}><i className="material-icons">edit</i><span><Translate value="global.profiles.entityProfile.entityEdit.edit" /></span></a> 
		);
	}
}