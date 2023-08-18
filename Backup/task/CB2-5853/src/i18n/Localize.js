import React from "react";
import { Localize } from "react-redux-i18n";

const LocalizeComponent = ({ value, dateFormat, options }) => {
	return <Localize value={value} dateFormat={dateFormat} options={options ? options : null} />;
};

export default LocalizeComponent;
