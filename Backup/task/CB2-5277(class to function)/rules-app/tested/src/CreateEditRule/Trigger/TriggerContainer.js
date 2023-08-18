import { getDir } from "orion-components/i18n/Config/selector";
import { connect } from "react-redux";

import TriggerAttributes from "./TriggerAttributes";

const mapStateToProps = (state, ownProps) => {
	return {
		isOpen: state.appState.dialog.openDialog,
		dir: getDir(state)
	};
};

const TriggerContainer = connect(
	mapStateToProps
)(TriggerAttributes);

export default TriggerContainer;