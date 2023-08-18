import React, { Component } from "react";

import TextField from "material-ui/TextField";
import { Translate } from "orion-components/i18n/I18nContainer";
import { renderToStaticMarkup } from "react-dom/server";


class RuleFields extends Component {
	constructor(props) {
		super(props);
		this.state = {  };
	}

	placeholderConverter = (value) => {
		const placeholderTxt = renderToStaticMarkup(<Translate value={value}/>);
		let placeholderString = placeholderTxt.toString().replace(/<\/?[^>]+(>|$)/g, "");
		return placeholderString;
	};

	render() { 
		return (  
			<div>
				<div className="row">
					<div className="row-item fullwidth">
						<div className="edit-rule-input">
							<TextField
								hintText={<Translate value="createEditRule.components.ruleFields.ruleName"/>}
								errorText={this.props.titleErrorText}
								onChange={this.props.handleChangeTitle}
								value={this.props.title}
								fullWidth={true}
								style={{
									borderRadius: 5
								}}
								hintStyle={{
									color: "#828283",
									paddingLeft: 12,
									fontFamily: "roboto",
									fontWeight: "normal"
								}}
								inputStyle={{
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
							<textarea placeholder={this.placeholderConverter("createEditRule.components.ruleFields.descNotes")} rows="3" value={this.props.desc} onChange={this.props.handleChangeDesc} />
						</div>
					</div>
				</div>
			</div>

		);
	}
}
 
export default RuleFields;