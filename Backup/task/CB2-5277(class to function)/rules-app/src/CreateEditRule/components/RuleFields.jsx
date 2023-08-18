import React from "react";

import TextField from "material-ui/TextField";
import { getTranslation } from "orion-components/i18n/I18nContainer";


const RuleFields = ({ titleErrorText, handleChangeTitle, title, desc, handleChangeDesc, dir }) => {

	return (
		<div>
			<div className="row">
				<div className="row-item fullwidth">
					<div className="edit-rule-input">
						<TextField
							hintText={getTranslation("createEditRule.components.ruleFields.ruleName")}
							errorText={titleErrorText}
							onChange={handleChangeTitle}
							value={title}
							fullWidth={true}
							style={{
								borderRadius: 5
							}}
							hintStyle={dir == "rtl" ? {
								color: "#828283",
								paddingRight: 12,
								fontFamily: "roboto",
								fontWeight: "normal"
							} : {
								color: "#828283",
								paddingLeft: 12,
								fontFamily: "roboto",
								fontWeight: "normal"
							}}
							inputStyle={dir == "rtl" ? {
								paddingRight: 12
							} : {
								paddingLeft: 12
							}}
							errorStyle={{
								margin: 0,
								padding: "10px 0 0 0"
							}}
							underlineShow={false}
							autoFocus={true}
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