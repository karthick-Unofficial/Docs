import React from "react";

import { TextField } from "@mui/material";
import { getTranslation } from "orion-components/i18n";
import {useStyles} from "../../shared/styles/overrides";

const RuleFields = ({ titleErrorText, handleChangeTitle, title, desc, handleChangeDesc, dir }) => {
	const classes = useStyles();
	return (
		<div>
			<div className="row">
				<div className="row-item fullwidth">
					<div className="edit-rule-input">
						<TextField
							placeholder={getTranslation("createEditRule.components.ruleFields.ruleName")}
							helperText={titleErrorText}
							error={titleErrorText}
							onChange={handleChangeTitle}
							value={title}
							fullWidth={true}
							style={{
								borderRadius: 5
							}}
							inputProps={{
								style: { padding: "0 12px", height: 48 }
							}}
							autoFocus={true}
							InputProps={{ classes: { input: classes.input }, disableUnderline: true }}
							variant="standard"
							FormHelperTextProps={{
								style: {
									fontSize: 12,
									color: "rgb(244, 67, 54)",
									letterSpacing: "unset"
								}
							}}
						/>
					</div>
				</div>
			</div>

			<div className="row">
				<div className="row-item fullwidth">
					<div className="edit-rule-input">
						<textarea placeholder={getTranslation("createEditRule.components.ruleFields.descNotes")} rows="3" value={desc} onChange={handleChangeDesc} />
					</div>
				</div>
			</div>
		</div>

	);
};

export default RuleFields;