// redux
import { connect } from "react-redux";
import { changePassword, clearPasswordState }  from "./changePasswordActions";

import ChangePassword from "./ChangePassword.jsx";

const mapStateToProps = (state) => {
	return {
		isLoading: state.appState.loading["changePassword"],
		userId: state.session.user.profile.id,
		passwordChangeError: state.appState.errors.passwordChangeError
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onSubmit: (userId, currentPassword, newPassword) => {
			dispatch(changePassword(userId, currentPassword, newPassword));
		},
		clearState: () => {
			dispatch(clearPasswordState());
		}
	};
}; 

const ChangePasswordContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ChangePassword);

export default ChangePasswordContainer;