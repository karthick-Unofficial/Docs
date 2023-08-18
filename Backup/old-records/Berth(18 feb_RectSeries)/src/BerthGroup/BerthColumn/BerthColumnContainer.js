import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./berthColumnActions";
import BerthColumn from "./BerthColumn.jsx";
import { getBerthsByGroup } from "../../selectors";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = (state, props) => {
	const berths = getBerthsByGroup(state, props);
	return { berths, dir: getDir(state)};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const BerthColumnContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(BerthColumn);

export default BerthColumnContainer;
