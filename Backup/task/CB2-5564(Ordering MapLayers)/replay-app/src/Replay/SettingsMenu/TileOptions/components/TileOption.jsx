import React from "react";
import PropTypes from "prop-types";
import { MenuItem } from "@mui/material";

const propTypes = {
	option: PropTypes.string.isRequired,
	handleSelect: PropTypes.func,
	thumbnail: PropTypes.string,
	dir: PropTypes.string
};

const defaultProps = {
	handleSelect: null
};

const TileOption = ({ option, label, handleSelect, thumbnail, dir }) => {
	const styles = {
		option: {
			opacity: 1,
			...(dir === "rtl" && { padding: "0 0 0 16px" }),
			...(dir === "ltr" && { padding: "0 16px 0 0" }),
			fontSize: 14
		},
		image: {
			width: 100,
			height: 100,
			...(dir === "rtl" && { marginLeft: 16 }),
			...(dir === "ltr" && { marginRight: 16 })
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
			{label}
		</MenuItem>
	);
};

TileOption.propTypes = propTypes;
TileOption.defaultProps = defaultProps;

export default TileOption;