import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./formPanelActions";
import FormPanel from "./FormPanel.jsx";

const mapStateToProps = state => {
	const { berths, formPanel } = state;
	const { data, editing, open, type } = formPanel;
	return { berths, data, editing, open, type };
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const FormPanelContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(FormPanel);

export default FormPanelContainer;
