import React from "react";

const InputField = ({ updateValue, validate, name, placeholder, isValid, emptyMessage, displayErrors, errorMessage, disabled, type, value, isEmpty }) => {


	const onChange = e => {
		const newValue = updateValue(e);
		if (validate) {
			validate(e, newValue);
		}
	};

	const options = {};
	if (disabled) {
		options["disabled"] = "disabled";
		options["style"] = { "color": "#828283" };
	}

	return (
		<div className={`wrapper-${name} input-wrapper`}>
			<input
				name={name}
				type={type}
				className={`field input-${name} cb-font-b2`}
				placeholder={placeholder}
				onChange={onChange}
				value={value}
				{...options} />
			{displayErrors && !isValid &&
				<span className='cb-font-b2 error-message'>{isEmpty ? emptyMessage : errorMessage}</span>
			}
		</div>
	);
};

export default InputField;
