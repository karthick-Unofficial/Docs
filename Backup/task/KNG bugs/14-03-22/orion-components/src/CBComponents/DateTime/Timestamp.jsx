import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { timeConversion } from "client-app-core";

moment.relativeTimeThreshold("h", 24);

const propTypes = {
	timestamp: PropTypes.string.isRequired,
	format: PropTypes.string,
	locale: PropTypes.string
};

const defaultProps = {
	format: "L",
	locale: "en"
};

class Timestamp extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	componentDidMount() {
		this.getTimestamp();
		this.handleRefresh();
	}
	componentWillUnmount() {
		clearInterval(this.secondInterval);
		clearInterval(this.minuteInterval);
	}
	getDuration = () => {
		const { timestamp } = this.props;
		const x = moment(timestamp);
		const y = moment();
		const duration = moment.duration(y.diff(x));
		return duration;
	};
	getTimestamp = () => {
		const { timestamp, format, useTimeAgo } = this.props;
		const momentTimestamp = moment(timestamp).locale(this.props.locale);
		const display = useTimeAgo ?
			`${momentTimestamp.fromNow()} (${timeConversion.convertToUserTime(momentTimestamp, "L")})` :
			`${timeConversion.convertToUserTime(momentTimestamp, format)}`;
		this.setState({ display });
	};
	handleRefresh = () => {
		const duration = this.getDuration();
		const seconds = duration.asSeconds();
		const minutes = duration.asMinutes();
		if (minutes < 1) {
			if (!this.secondInterval)
				this.secondInterval = setInterval(() => this.handleRefresh(), 10000);
		}
		if (seconds > 59 && minutes < 59) {
			clearInterval(this.secondInterval);
			if (!this.minuteInterval)
				this.minuteInterval = setInterval(() => this.handleRefresh(), 60000);
		}
		if (minutes === 59) {
			clearInterval(this.minuteInterval);
		}
		this.getTimestamp();
	};
	render() {
		const { display } = this.state;
		return <span>{display}</span>;
	}
}

Timestamp.propTypes = propTypes;
Timestamp.defaultProps = defaultProps;

export default Timestamp;
