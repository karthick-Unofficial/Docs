import React from "react";
import { TextField } from "orion-components/CBComponents";
import { getTranslation } from "orion-components/i18n";

const TextColumn = ({ defaultValue, handleChange, dir }) => {
	return (
		<TextField
			id="default"
			label={getTranslation("shared.textColumn.fieldLabel.defaultValue")}
			value={defaultValue}
			handleChange={handleChange("defaultValue")}
			dir={dir}
		/>
	);
};

export default TextColumn;
