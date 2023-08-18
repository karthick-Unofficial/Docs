import React from "react";
import PropTypes from "prop-types";
import { SvgIcon } from "@mui/material";

const propTypes = {
	fontSize: PropTypes.oneOf(["inherit", "default", "small", "large"])
};

const TargetObserved = ({ handleMouseEnter, handleMouseLeave }) => {
	return (
		<SvgIcon
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			viewBox="0 0 29.946 21.574"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="29.946"
				height="21.574"
				viewBox="0 0 29.946 21.574"
			>
				<path
					id="icon-eye"
					d="M16.19,7.992a.6.6,0,0,0-.374.12L.246,19.49a.6.6,0,0,0,.054,1l15.569,8.982a.6.6,0,1,0,.6-1.036l-2.441-1.408a14.564,14.564,0,0,0,.439-16.361.6.6,0,0,0-.041-.057l2.1-1.532a.6.6,0,0,0-.332-1.087Zm8.5,6.062a1.2,1.2,0,0,0-.834,2.057l1.467,1.467h-5.56a1.2,1.2,0,1,0,0,2.4H25.4l-1.549,1.549a1.2,1.2,0,1,0,1.694,1.694l4.4-4.4-4.4-4.4A1.2,1.2,0,0,0,24.689,14.054Zm-9.829.191a13.273,13.273,0,0,1,.527,2.11,2.757,2.757,0,0,0-.237,5.264l.05.015a13.26,13.26,0,0,1-.695,2.124,5.081,5.081,0,0,1,.354-9.513Z"
					transform="translate(-0.001 -7.992)"
					fill="#fff"
				/>
			</svg>
		</SvgIcon>
	);
};

TargetObserved.propTypes = propTypes;

export default TargetObserved;
