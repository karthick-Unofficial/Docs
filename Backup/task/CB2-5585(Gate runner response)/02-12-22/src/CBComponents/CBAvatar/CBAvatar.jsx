import React from "react";
import PropTypes from "prop-types";
import { Avatar } from "@mui/material";

const propTypes = {
	size: PropTypes.number,
	image: PropTypes.string,
	name: PropTypes.string.isRequired
};

const defaultProps = {
	size: 40,
	image: null
};

const CBAvatar = ({ size, image, name }) => {
	return (
		<Avatar
			style={{
				width: size,
				height: size,
				color: "#FFF",
				backgroundColor: `#${((Math.random() * 0xffffff) << 0).toString(16)}`
			}}
			alt={name}
			src={image}
		>
			{!image && name.match(/\b(\w)/g)}
		</Avatar>
	);
};

CBAvatar.propTypes = propTypes;
CBAvatar.defaultProps = defaultProps;

export default CBAvatar;
