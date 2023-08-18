

// this can still be improved upon --- add up/down arrow incrementing of numbers, better highlighting/focusing, etc.


import React, { useRef } from "react";

const TimeInput = ({ value, timeFormatPreference, disabled, onChange }) => {
	const hoursRef = useRef(null);
	const minutesRef = useRef(null);
	const ampmRef = useRef(null);

	const handleChange = (e) => {

		let newString;
		const hoursEndIndex = value.indexOf(":");
		const minutesEndIndex = value.indexOf(" ");
		const hours = value.slice(0, hoursEndIndex);
		const minutes = timeFormatPreference === "24-hour" ? value.slice(hoursEndIndex + 1) : value.slice(hoursEndIndex + 1, minutesEndIndex);
		const aMPM = value.slice(minutesEndIndex + 1, value.length);

		switch (e.target.name) {

			case "hours": {
				const regexp = /[^\d]/g;
				if (regexp.test(e.target.value)) {
					return;
				}

				const newHours = e.target.value.substr(0, 2).replace(/[^\d]/g, "");
				if (timeFormatPreference === "12-hour" && +newHours > 12) {
					return;
				} else if (timeFormatPreference === "24-hour" && +newHours > 23) {
					return;
				}
				newString = `${newHours}:${minutes}${timeFormatPreference === "24-hour" ? "" : " " + aMPM}`;
				if (newHours.length === 2) {
					minutesRef.current.focus();
				}
				break;

			}
			case "minutes": {
				const regexp = /[^\d]/g;
				if (regexp.test(e.target.value)) {
					return;
				}

				const newMinutes = e.target.value.substr(0, 2).replace(/[^\d]/g, "");
				if (+newMinutes > 59) {
					return;
				}
				newString = `${hours}:${newMinutes}${timeFormatPreference === "24-hour" ? "" : " " + aMPM}`;
				if (newMinutes.length === 2 && timeFormatPreference === "12-hour") {
					ampmRef.current.focus();
				}

				break;
			}
			case "ampm": {
				if (timeFormatPreference === "24-hour") return;

				let newValue;
				if (e.keyCode === 65) {
					newValue = "AM";
				} else if (e.keyCode === 80) {
					newValue = "PM";
				} else if (e.keyCode === 38 || e.keyCode === 40) {
					if (aMPM === "AM") {
						newValue = "PM";
					} else {
						newValue = "AM";
					}
				} else {
					return;
				}
				newString = hours + ":" + minutes + " " + newValue;
				break;

			}

			default:
				break;

		}
		onChange(newString);
	};

	const handleFocus = (e) => {
		e.target.select();
	};

	const hoursEndIndex = value.indexOf(":");
	const minutesEndIndex = value.indexOf(" ");
	const hoursValue = value.slice(0, hoursEndIndex);
	const minutesValue = timeFormatPreference === "24-hour" ? value.slice(hoursEndIndex + 1) : value.slice(hoursEndIndex + 1, minutesEndIndex);
	const ampmValue = value.slice(minutesEndIndex + 1, value.length);
	return (
		<div className='time-input-wrapper'>
			<input
				type='text'
				disabled={disabled}
				name='hours'
				ref={hoursRef}
				value={hoursValue}
				onChange={handleChange}
				onFocus={handleFocus}
				className='time-input' />
			<span>:</span>
			<input
				type='text'
				disabled={disabled}
				name='minutes'
				ref={minutesRef}
				value={minutesValue}
				onChange={handleChange}
				onFocus={handleFocus}
				className='time-input' />
			{timeFormatPreference === "12-hour" &&
				<input
					type='text'
					disabled={disabled}
					name='ampm'
					ref={ampmRef}
					value={ampmValue}
					onKeyDown={handleChange}
					onFocus={handleFocus}
					className='time-input' />
			}
		</div>
	);
};

export default TimeInput;