import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { syncTranslationWithStore } from "react-redux-i18n";

const propTypes = {
	store: PropTypes.object.isRequired,
	appId: PropTypes.string.isRequired,
	children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
	dir: PropTypes.string,
	initI18n: PropTypes.func.isRequired,
	ready: PropTypes.bool.isRequired
};

const defaultProps = {
	store: {},
	children: [],
	dir: "ltr",
	ready: false
};

const I18n = ({
	store,
	appId,
	children,
	dir,
	initI18n,
	ready
}) => {
	useEffect(() => {
    	initI18n(appId, store);
    	syncTranslationWithStore(store);
	}, []);

	useEffect(() => {
		document.dir = dir;
	}, [dir]);

	return (
		ready ? children : <div />
	);
};

I18n.propTypes = propTypes;
I18n.defaultProps = defaultProps;

export default I18n;