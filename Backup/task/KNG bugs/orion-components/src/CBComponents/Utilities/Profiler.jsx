import React, { Component, unstable_Profiler as Profiler } from "react";
import { PropTypes } from "prop-types";

const propTypes = {
	id: PropTypes.string.isRequired,
	reportInterval: PropTypes.number,
	pollInterval: PropTypes.number
};

const defaultProps = {
	reportInterval: 15000,
	pollInterval: 5000
};

class CBProfiler extends Component {
	constructor(props) {
		super(props);
		this.state = { total: [], previous: [], current: [], perPoll: [] };
	}

	componentDidMount() {
		const { reportInterval, pollInterval } = this.props;
		setInterval(() => {
			this.logMetrics();
		}, reportInterval);
		setInterval(() => {
			this.setState(state => ({
				perPoll: [...state.perPoll, state.current],
				previous: state.current,
				current: []
			}));
		}, pollInterval);
	}

	getRenderCounts = () => {
		const { pollInterval } = this.props;
		const { previous, current, perPoll } = this.state;
		const difference = Math.round(current.length - previous.length);
		const renderCount = perPoll.map(poll => poll.length);
		const pollAverage = Math.round(
			renderCount.reduce((a, b) => a + b, 0) / perPoll.length
		);
		console.groupCollapsed(
			`%c# of Render Calculations / ${pollInterval / 1000} seconds`,
			"font-weight: bold"
		);
		console.log(`Average Per Poll: %c${pollAverage}`, "font-weight: bold");
		console.log(`Previous Poll: ${previous.length}`);
		console.log(`Current Poll: ${current.length}`);
		console.log(
			`Difference: %c${Math.abs(difference)}`,
			`color: ${difference > 0 ? "red" : "green"}`
		);
		console.groupEnd();
	};

	getRenderTimes = () => {
		const { pollInterval } = this.props;
		const { perPoll, total } = this.state;

		const getAverage = (key, inputArray) => {
			const result =
				inputArray.map(item => item[key]).reduce((a, b) => a + b, 0) /
				inputArray.length;
			return result;
		};

		const getNestedAverage = (key, inputArray) => {
			const result =
				inputArray
					.map(poll => getAverage(key, poll))
					.reduce((a, b) => a + b, 0) / inputArray.length;
			return result;
		};
		const totalActualTime = getAverage("actualTime", total);
		const totalBaseTime = getAverage("baseTime", total);
		const totalStartToCommit =
			getAverage("commitTime", total) - getAverage("startTime", total);
		const actualTime = getNestedAverage("actualTime", perPoll);
		const baseTime = getNestedAverage("baseTime", perPoll);
		const startToCommit =
			getNestedAverage("commitTime", perPoll) -
			getNestedAverage("startTime", perPoll);
		console.groupCollapsed(
			`%cRender Times / ${pollInterval / 1000} seconds`,
			"font-weight: bold"
		);
		console.group("Overall");
		console.log(
			`Average Actual Time: %c${totalActualTime}`,
			"font-weight: bold"
		);
		console.log(`Average Base Time: %c${totalBaseTime}`, "font-weight: bold");
		console.log(
			`Average Time from Start to Commit: %c${totalStartToCommit}`,
			"font-weight: bold"
		);
		console.groupEnd();
		console.group("Per Poll");
		console.log(`Average Actual Time: %c${actualTime}`, "font-weight: bold");
		console.log(`Average Base Time: %c${baseTime}`, "font-weight: bold");
		console.log(
			`Average Time from Start to Commit: %c${startToCommit}`,
			"font-weight: bold"
		);
		console.groupEnd();
		console.groupEnd();
	};

	logMetrics = () => {
		const { id } = this.props;
		console.group(
			`%c${id} Component Render Metrics`,
			"background-color: black; color: white;"
		);
		this.getRenderCounts();
		this.getRenderTimes();
		console.groupEnd();
	};

	handleRender = (id, phase, actualTime, baseTime, startTime, commitTime) => {
		const { total, current } = this.state;
		const metrics = { id, phase, actualTime, baseTime, startTime, commitTime };
		if (phase !== "mount") {
			total.push(metrics);
			current.push(metrics);
		}
	};
	render() {
		const { id, children } = this.props;
		return (
			<Profiler id={id} onRender={this.handleRender}>
				{children}
			</Profiler>
		);
	}
}

CBProfiler.propTypes = propTypes;
CBProfiler.defaultProps = defaultProps;

export default CBProfiler;
