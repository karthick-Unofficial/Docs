import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import I18n from "./index";
import * as actions from "./Actions";
import { getDir } from "./Config/selector";
export { supportedLocales } from "./Config/i18n";
export { default as Translate } from "./Translate";
export { default as Localize } from "./Localize";
export { getTranslation, getLocalize } from "./Actions";

const mapStateToProps = state => {

	return {
		locale: state.i18n.locale,
		dir: getDir(state)
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actions, dispatch);
};

const I18nContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(I18n);

export default I18nContainer;
