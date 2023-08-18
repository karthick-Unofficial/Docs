import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { syncTranslationWithStore } from "react-redux-i18n";
import { getDir } from "./Config/selector";
import * as actions from "./Actions";
import { useSelector, useDispatch, useStore } from "react-redux";

export { supportedLocales } from "./Config/i18n";
export { default as Translate } from "./Translate";
export { default as Localize } from "./Localize";
export { getTranslation, getLocalize } from "./Actions";

const propTypes = {
	appId: PropTypes.string.isRequired,
	children: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
};

const defaultProps = {
	children: []
};

const I18n = ({
	appId,
	children
}) => {
	const dispatch = useDispatch();
	const store = useStore();

	const { initI18n } = actions;
	const dir = useSelector(state => getDir(state));
	const authenticated = useSelector(state => state.session.identity.isAuthenticated);
	const ready = useSelector(state => state.i18n && state.i18n.translations && Object.keys(state.i18n.translations).length > 0);

	useEffect(() => {
		dispatch(initI18n(appId, store));
		syncTranslationWithStore(store);
	}, []);

	useEffect(() => {
		document.dir = dir;
	}, [dir]);

	return (
		authenticated ? (ready ? children : <div />) : children
	);
};

I18n.propTypes = propTypes;
I18n.defaultProps = defaultProps;

export default I18n;