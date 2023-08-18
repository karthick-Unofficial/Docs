import React from "react";
import PropTypes from "prop-types";
import { MenuItem } from "@material-ui/core";

const propTypes = {
	option: PropTypes.string.isRequired,
	handleSelect: PropTypes.func,
	thumbnail: PropTypes.string
};

const defaultProps = {
	handleSelect: null
};

const TileOption = ({ option, handleSelect, thumbnail }) => {
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
		}
	};
	return (
		<MenuItem
			style={styles.option}
			onClick={() => handleSelect(option)}
			disabled={!handleSelect}
		>			
			<img
				src={thumbnail}				
				style={styles.image}
			/>
			{option}
		</MenuItem>
	);
};

TileOption.propTypes = propTypes;
TileOption.defaultProps = defaultProps;

export default TileOption;
