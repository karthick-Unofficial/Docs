import { connect } from "react-redux";
import WmsBaseMapLayer from "./WmsBaseMapLayer";

const mapStateToProps = state => {
	return {
		wmsBaseMapPath: state.clientConfig ? state.clientConfig.wmsBaseMapPath : null
	};
};

const WmsBaseMapLayerContainer = connect(
	mapStateToProps
)(WmsBaseMapLayer);

export default WmsBaseMapLayerContainer;
