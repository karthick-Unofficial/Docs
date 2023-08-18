import React, { Component } from "react";

class InputField extends Component {
	constructor(props) {
		super(props);


		this.onChange = this.onChange.bind(this);
	}


	onChange (e) {
		const newValue = this.props.updateValue(e);
		if (this.props.validate) {
			this.props.validate(e, newValue);
		}
	}


	render () {

		const { 
			name, 
			placeholder, 
			isValid, 
			emptyMessage, 
			displayErrors, 
			errorMessage} = this.props;

		const options = {};
		if (this.props.disabled) {
			options["disabled"] = "disabled";
			options["style"] = { "color": "#828283" };
		}

		return (
			<div className={`wrapper-${name} input-wrapper`}>
				<input 
					name={name}
					type={this.props.type}
					className={`field input-${name} cb-font-b2`} 
					placeholder={placeholder}
					onChange={this.onChange}
					value={this.props.value}
					{...options} />
				{displayErrors && !isValid &&
						<span className='cb-font-b2 error-message'>{this.props.isEmpty ? emptyMessage : errorMessage }</span>
				}
			</div>
		);
	}
}

export default InputField;
