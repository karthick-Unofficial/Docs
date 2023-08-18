import { connect } from "react-redux";
import AppMenu from "./AppMenu";
import { getDir } from "orion-components/i18n/Config/selector";
import { bindActionCreators } from "redux";

const mapStateToProps = state => {
	return {
		user: state.session.user.profile,
		org: state.session.organization.profile,
		emailConfig: state.clientConfig.supportEmail,
		dir: getDir(state)
	};
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators({}, dispatch);
};

const AppMenuContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(AppMenu);

export default AppMenuContainer;
