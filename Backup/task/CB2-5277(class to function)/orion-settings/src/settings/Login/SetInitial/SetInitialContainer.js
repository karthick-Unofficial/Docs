import { connect } from "react-redux";
import { setInitialPassword } from "./setInitialActions";
import SetInitialPassword from "./SetInitialPassword";


const mapDispatchToProps = (dispatch) => {
	return {
		handleSubmit: (password, token) => {
			dispatch(setInitialPassword(password, token));
		}
	};
};
export default connect(null, mapDispatchToProps)(SetInitialPassword); 
