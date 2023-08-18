import React from "react";
import { Translate } from "react-redux-i18n";

const Translator = ({ value, count, primaryValue, secondaryValue, style }) => {

	return <Translate value={value} count={count != undefined ? count : ""} primaryValue={primaryValue != undefined ? primaryValue : ""} secondaryValue={secondaryValue != undefined ? secondaryValue : ""} style={style} />;

};

export default Translator;
