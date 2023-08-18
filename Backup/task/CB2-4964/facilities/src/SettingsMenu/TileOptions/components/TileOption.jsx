import React from "react";
import PropTypes from "prop-types";
import { MenuItem } from "@material-ui/core";

const propTypes = {
	option: PropTypes.string.isRequired,
	handleSelect: PropTypes.func,
	thumbnail: PropTypes.string,
	dir: PropTypes.string
};

const defaultProps = {
	handleSelect: null
};

const TileOption = ({ option, handleSelect, thumbnail, dir }) => {
	const styles = {
		option: {
			opacity: 1,
			padding: "0 16px 0 0",
			textTransform: "capitalize"
		},
		image: {
			width: 100,
			height: 100,
			marginRight: 16
		},
		optionRTL: {
			opacity: 1,
			padding: "0 0 0 16px",
			textTransform: "capitalize"
		},
		imageRTL: {
			width: 100,
			height: 100,
			marginLeft: 16
		}
	};
	return (
		<MenuItem
			style={dir == "rtl" ? styles.optionRTL : styles.option}
			onClick={() => handleSelect(option)}
			disabled={!handleSelect}
		>
			<img
				src={thumbnail}
				style={dir == "rtl" ? styles.imageRTL : styles.image}
			/>
			{option}
		</MenuItem>
	);
};

TileOption.propTypes = propTypes;
TileOption.defaultProps = defaultProps;

export default TileOption;
