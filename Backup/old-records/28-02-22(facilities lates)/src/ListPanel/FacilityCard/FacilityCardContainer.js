import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreators from "./facilityCardActions";
import { FacilityCard } from "orion-components/Facilities";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = (state) => {
	return { dir: getDir(state) };
};

const mapDispatchToProps = dispatch => {
	return bindActionCreators(actionCreators, dispatch);
};

const FacilityCardContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(FacilityCard);

export default FacilityCardContainer;
