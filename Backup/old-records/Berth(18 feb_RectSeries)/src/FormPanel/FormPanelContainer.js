import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./formPanelActions";
import FormPanel from "./FormPanel.jsx";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = state => {
	const { berths, formPanel } = state;
	const { data, editing, open, type } = formPanel;
	const { locale } = state.i18n;
	return { berths, data, editing, open, type, dir: getDir(state), locale };
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const FormPanelContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(FormPanel);

export default FormPanelContainer;
