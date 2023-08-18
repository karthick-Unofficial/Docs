import React from "react";
import { Translate } from "orion-components/i18n/I18nContainer";

const EntityEdit = ({onClick}) => {
	return (
		<a onClick={onClick}><i className="material-icons">edit</i><span><Translate value="global.profiles.entityProfile.entityEdit.edit" /></span></a>
	);
};

export default EntityEdit;