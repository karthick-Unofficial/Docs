import { connect } from "react-redux";
import ChipTray from "./ChipTray";
import { mapState as mapStateSelector } from "orion-components/AppState/Selectors";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = state => {
	const { offset } = mapStateSelector(state);
	const { dockData } = state.appState.dock;
	return {
		offset,
		dockState: dockData,
		dir: getDir(state)
	};
};

const ChipTrayContainer = connect(mapStateToProps)(ChipTray);

export default ChipTrayContainer;
