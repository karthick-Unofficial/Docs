import React from "react";
import { TextField } from "orion-components/CBComponents";
import { Translate } from "orion-components/i18n/I18nContainer";

const TextColumn = ({ defaultValue, handleChange, dir }) => {
	return (
		<TextField
			id="default"
			label={<Translate value="shared.textColumn.fieldLabel.defaultValue"/>}
			value={defaultValue}
			handleChange={handleChange("defaultValue")}
			dir={dir}
		/>
	);
};

export default TextColumn;
