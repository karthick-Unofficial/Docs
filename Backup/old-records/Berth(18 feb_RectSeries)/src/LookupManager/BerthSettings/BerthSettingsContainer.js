import { connect } from "react-redux";
import BerthSettings from "./BerthSettings.jsx";
const mapStateToProps = state => {
	const { berthGroups } = state;
	const user = state.session.user.profile;
	return { berthGroups, user };
};

const BerthSettingsContainer = connect(mapStateToProps)(BerthSettings);

export default BerthSettingsContainer;
