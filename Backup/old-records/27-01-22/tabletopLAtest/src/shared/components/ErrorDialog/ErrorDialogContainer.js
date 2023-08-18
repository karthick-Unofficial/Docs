import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./errorActions";
import ErrorDialog from "./ErrorDialog";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = state => {
	return {
		error: state.error,
		dir: getDir(state)
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const ErrorDialogContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ErrorDialog);

export default ErrorDialogContainer;
