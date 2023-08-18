import { connect } from "react-redux";
import ZetronCallingPanel from "./ZetronCallingPanel";
import { getDir } from "orion-components/i18n/Config/selector";

const mapStateToProps = (state) => {
	return {
		dir: getDir(state)
	};
};

const ZetronCallingPanelContainer = connect(
	mapStateToProps,
	null
)(ZetronCallingPanel);

export default ZetronCallingPanelContainer;
