

// this can still be improved upon --- add up/down arrow incrementing of numbers, better highlighting/focusing, etc.


import React, { Component } from "react";

class TimeInput extends Component {

	constructor(props) {
		super(props);
		this.state = {
			minutesValue: "00",
			hoursValue: "00",
			amValue: "AM"
		};
	}

	handleChange = (e) => {
		const { value, timeFormatPreference } = this.props;

		let newString;
		const hoursEndIndex = value.indexOf(":");
		const minutesEndIndex = value.indexOf(" ");
		const hours = value.slice(0, hoursEndIndex);
		const minutes = timeFormatPreference === "24-hour" ? value.slice(hoursEndIndex + 1) : value.slice(hoursEndIndex + 1, minutesEndIndex);
		const aMPM = this.props.value.slice(minutesEndIndex + 1, this.props.value.length);

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
					this.refs.minutes.focus();
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
					this.refs.ampm.focus();
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
		this.props.onChange(newString);
	}

	handleFocus = (e) => {
		e.target.select();
	}



	render () {
		const { value, timeFormatPreference } = this.props;
		const hoursEndIndex = value.indexOf(":");
		const minutesEndIndex = value.indexOf(" ");
		const hoursValue = value.slice(0, hoursEndIndex);
		const minutesValue = timeFormatPreference === "24-hour" ? value.slice(hoursEndIndex + 1) : value.slice(hoursEndIndex + 1, minutesEndIndex);
		const ampmValue = this.props.value.slice(minutesEndIndex + 1, this.props.value.length);
		return (
			<div className='time-input-wrapper'>
				<input 
					type='text'
					disabled={this.props.disabled} 
					name='hours' 
					ref='hours'
					value={hoursValue}
					onChange={this.handleChange} 
					onFocus={this.handleFocus}
					className='time-input'/>
				<span>:</span>
				<input 
					type='text'
					disabled={this.props.disabled} 
					name='minutes' 
					ref='minutes'
					value={minutesValue}
					onChange={this.handleChange} 
					onFocus={this.handleFocus}
					className='time-input'/>
				{timeFormatPreference === "12-hour" &&
					<input
						type='text'
						disabled={this.props.disabled}
						name='ampm'
						ref='ampm'
						value={ampmValue}
						onKeyDown={this.handleChange}
						onFocus={this.handleFocus}
						className='time-input'/>
				}
			</div>
		);
	}
}

export default TimeInput;