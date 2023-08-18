import React from "react";
import PropTypes from "prop-types";
import { SvgIcon } from "@material-ui/core";

const propTypes = {
	fontSize: PropTypes.oneOf(["inherit", "default", "small", "large"])
};

const Target = ({ handleMouseEnter, handleMouseLeave }) => {
	return (
		<SvgIcon onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
			>
				<title>targeting-icon</title>
				<circle
					cx="12"
					cy="12"
					r="10.5"
					fill="none"
					stroke="#fff"
					strokeMiterlimit="10"
					strokeWidth="2.5"
				/>
				<line
					x1="2"
					y1="12"
					x2="7"
					y2="12"
					fill="none"
					stroke="#fff"
					strokeMiterlimit="10"
					strokeWidth="2.5"
				/>
				<line
					x1="17"
					y1="12"
					x2="22"
					y2="12"
					fill="none"
					stroke="#fff"
					strokeMiterlimit="10"
					strokeWidth="2.5"
				/>
				<line
					x1="12"
					y1="2"
					x2="12"
					y2="7"
					fill="none"
					stroke="#fff"
					strokeMiterlimit="10"
					strokeWidth="2.5"
				/>
				<line
					x1="12"
					y1="17"
					x2="12"
					y2="22"
					fill="none"
					stroke="#fff"
					strokeMiterlimit="10"
					strokeWidth="2.5"
				/>
			</svg>
		</SvgIcon>
	);
};

Target.propTypes = propTypes;

export default Target;
