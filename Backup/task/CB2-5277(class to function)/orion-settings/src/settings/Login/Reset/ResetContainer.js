import { connect } from "react-redux";
import { resetPassword } from "./resetActions";
import Reset from "./Reset";

const mapDispatchToProps = (dispatch) => {
	return {
		handleSubmit: (password, token) => {
			dispatch(resetPassword(password, token));
		}
	};
};
export default connect(null, mapDispatchToProps)(Reset); 
