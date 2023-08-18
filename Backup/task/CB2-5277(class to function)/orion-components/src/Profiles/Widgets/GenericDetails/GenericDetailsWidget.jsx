import React, { Component, memo } from "react";
import PropTypes from "prop-types";
import { KvpDisplay } from "../../../CBComponents";
import _ from "lodash";
import isEqual from "react-fast-compare";

const GenericDetailsWidget = ({
	kvPairs,
	displayProps
}) => {

	const applyDisplayProps = (kvPairs, displayProps) => {
		const kvPairsReplaced = kvPairs.map(pair => {
			if (displayProps[pair.key]) {
				pair.key = displayProps[pair.key];
			}
			return pair;
		});

		return kvPairsReplaced;
	};

	let kvpDisplayProps = kvPairs;
	if (displayProps) {
		kvpDisplayProps = applyDisplayProps(kvPairs, displayProps);
	}

	return (
		<div className="details-widget">
			<KvpDisplay keyValuePairs={kvpDisplayProps} />
		</div>
	);
};

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

const onPropsChange = (prevProps, nextProps) => {
	if (!_(prevProps.kvPairs).xorWith(nextProps.kvPairs, isEqual).isEmpty() || !prevProps.displayProps.isEqual(nextProps.displayProps)) {
		return false;
	}
	return true;
};

export default memo(GenericDetailsWidget, onPropsChange);