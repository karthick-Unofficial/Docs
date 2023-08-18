import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./listMenuActions";

import ListMenu from "./ListMenu";

const mapStateToProps = state => {
	return {};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const ListMenuContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ListMenu);

export default ListMenuContainer;
