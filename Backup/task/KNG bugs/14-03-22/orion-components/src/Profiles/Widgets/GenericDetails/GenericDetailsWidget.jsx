import React, { Component } from "react";
import PropTypes from "prop-types";
import { KvpDisplay } from "../../../CBComponents";
import _ from "lodash";
import isEqual from "react-fast-compare";

export class GenericDetailsWidget extends Component {
	constructor(props) {
		super(props);
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (!_(this.props.kvPairs).xorWith(nextProps.kvPairs, isEqual).isEmpty() || !this.props.displayProps.isEqual(nextProps.displayProps)) {
			return true;
		}
		return false;
	}

	applyDisplayProps(kvPairs, displayProps) {
		const kvPairsReplaced = kvPairs.map(pair => {
			if (displayProps[pair.key]) {
				pair.key = displayProps[pair.key];
			}
			return pair;
		});

		return kvPairsReplaced;
	}

	render() {
		const { kvPairs, displayProps } = this.props;
		let kvpDisplayProps  = kvPairs;
		if (displayProps) {
			kvpDisplayProps = this.applyDisplayProps(kvPairs, displayProps);
		}

		return (
			<div className="details-widget">
				<KvpDisplay keyValuePairs={kvpDisplayProps} />
			</div>
		);
	}

}

GenericDetailsWidget.propTypes = {
	kvPairs: PropTypes.arrayOf(PropTypes.shape({
		key: PropTypes.string,
		value: PropTypes.string
	})).isRequired,
	displayProps: PropTypes.object
};

GenericDetailsWidget.defaultProps = {
	kvPairs: [{
		key: "",
		value: ""
	}]
};

export default GenericDetailsWidget;