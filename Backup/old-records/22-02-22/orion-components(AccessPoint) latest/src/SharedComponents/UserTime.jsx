import React, { Component } from "react";
import moment from "moment-timezone";
import { timeConversion } from "client-app-core";
class UserTime extends Component {
	constructor(props) {
		super(props);

	}

	render() {
		const {time, format} = this.props;
		const userTime = timeConversion.convertToUserTime(time, format);

		return <div>
			{userTime}
		</div>;
	}
}

export default UserTime;