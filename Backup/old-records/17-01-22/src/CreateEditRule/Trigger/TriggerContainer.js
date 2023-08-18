import { connect } from "react-redux";

import TriggerAttributes from "./TriggerAttributes";

const mapStateToProps = (state, ownProps) => {
	return {
		isOpen: state.appState.dialog.openDialog
	};
};

const TriggerContainer = connect(
	mapStateToProps
)(TriggerAttributes);

export default TriggerContainer;