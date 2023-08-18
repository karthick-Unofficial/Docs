import React from "react";
import PropTypes from "prop-types";
import { CBSlider as Slider } from "orion-components/CBComponents";
import { Translate } from "orion-components/i18n/I18nContainer";

const styles = {
	text: {
		color: "white"
	}
};

const propTypes = {
	transparency: PropTypes.number.isRequired,
	setData: PropTypes.func.isRequired
};

const defaultProps = {
	transparency: 20,
	setData: () => {}
};

const TransparencySlider = ({ transparency, setData }) => {
	const handleTransparencyChange = (e, value) => {
		setData(value);
	};

	return (
		<div style={{ width: "100%", padding: "0 20px" }}>
			<p className="b1-white" style={styles.text}><Translate value="global.sharedComponents.shapeEdit.transparencySlider.fill" count={transparency}/> </p>
			<div style={{ padding: "16px 0" }}>
				<Slider
					value={transparency}
					min={0}
					max={100}
					step={1}
					onChange={handleTransparencyChange}
				/>
			</div>
		</div>
	);
};

TransparencySlider.propTypes = propTypes;
TransparencySlider.defaultProps = defaultProps;

export default TransparencySlider;
