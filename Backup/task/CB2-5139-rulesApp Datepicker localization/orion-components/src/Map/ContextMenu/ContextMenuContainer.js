import { connect } from "react-redux";
import { loadProfile } from "orion-components/ContextPanel/Actions";
import ContextMenu from "./ContextMenu";

const ContextMenuContainer = connect(
	null,
	{ loadProfile }
)(ContextMenu);

export default ContextMenuContainer;
