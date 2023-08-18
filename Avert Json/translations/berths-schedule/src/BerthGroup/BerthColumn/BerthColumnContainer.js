import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./berthColumnActions";
import BerthColumn from "./BerthColumn.jsx";
import { getBerthsByGroup } from "../../selectors";

const mapStateToProps = (state, props) => {
	const berths = getBerthsByGroup(state, props);
	return { berths };
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const BerthColumnContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(BerthColumn);

export default BerthColumnContainer;
