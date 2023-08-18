import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./typeAheadFilterActions";
import TypeAheadFilter from "./TypeAheadFilter";

const mapStateToProps = (state, ownProps) => {
	return ownProps;
};

function mapDispatchToProps(dispatch) {
	return bindActionCreators(actionCreators, dispatch);
}

const TypeAheadFilterContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(TypeAheadFilter);

export default TypeAheadFilterContainer;