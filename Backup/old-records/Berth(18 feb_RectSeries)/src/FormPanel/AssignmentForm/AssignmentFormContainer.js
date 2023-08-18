import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./assignmentFormActions";
import AssignmentForm from "./AssignmentForm.jsx";

const mapStateToProps = state => {
	const { berths, formPanel, session, clientConfig } = state;
	const { data, editing, isGeneratingPdf, exportingError } = formPanel;
	const { agentOwner, requestingCompany, imoRequired, mmsiRequired, servicesConfig, notesEnabled, cargoDirectionLevel, voyageNumber } = clientConfig;

	let agentOwnerEnabled = true;
	let agentOwnerRequired = true;
	if (agentOwner) {
		agentOwnerEnabled = Boolean(agentOwner.enabled);
		agentOwnerRequired = Boolean(agentOwner.required);
	}

	let requestingCompanyEnabled = true;
	let requestingCompanyRequired = true;
	if (requestingCompany) {
		requestingCompanyEnabled = Boolean(requestingCompany.enabled);
		requestingCompanyRequired = Boolean(requestingCompany.required);
	}

	let voyageNumberEnabled = false;
	let voyageNumberRequired = false;
	if (voyageNumber) {
		voyageNumberEnabled = Boolean(voyageNumber.enabled);
		voyageNumberRequired = Boolean(voyageNumber.required);
	}
	return {
		berths,
		data,
		editing,
		user: session.user.profile,
		agentOwnerEnabled,
		agentOwnerRequired,
		requestingCompanyEnabled,
		requestingCompanyRequired,
		voyageNumberEnabled,
		voyageNumberRequired,
		imoRequired: Boolean(imoRequired),
		mmsiRequired: Boolean(mmsiRequired),
		servicesConfig,
		notesEnabled: Boolean(notesEnabled !== false),
		cargoDirectionLevel,
		timeFormatPreference: state.appState.global.timeFormat,
		isGeneratingPdf,
		exportingError
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const AssignmentFormContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(AssignmentForm);

export default AssignmentFormContainer;
