import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./keyboardActions";
import KeyboardShortCutKey from "./KeyboardShortCutKey";



const mapStateToProps = state => {
	return {
		keyboardkeys: state.clientConfig ? state.clientConfig.keyboardkeys : null
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators( actionCreators, dispatch);
};

const KeyboardShortCutKeysContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(KeyboardShortCutKey);

export default KeyboardShortCutKeysContainer;