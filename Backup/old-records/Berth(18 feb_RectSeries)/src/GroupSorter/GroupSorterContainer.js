import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./groupSorterActions";
import GroupSorter from "./GroupSorter.jsx";
import { orderedGroupSelector } from "../selectors";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = state => {
	const { appState } = state;
	const open = appState.dialog.openDialog === "group-order";
	return { groups: orderedGroupSelector(state), open,	dir: getDir(state) };
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const GroupSorterContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(GroupSorter);

export default GroupSorterContainer;
