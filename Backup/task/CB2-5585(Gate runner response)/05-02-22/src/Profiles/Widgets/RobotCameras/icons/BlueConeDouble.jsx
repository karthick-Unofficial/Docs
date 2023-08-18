import React from "react";

const BlueConeDouble = ({ className }) => {
	return (
		<svg className={className} xmlns="http://www.w3.org/2000/svg" width="55.197" height="139.779" viewBox="0 0 55.197 139.779">
			<defs>
				<linearGradient id="blue-double-linear-gradient" x1="0.5" x2="0.5" y2="1" gradientUnits="objectBoundingBox">
					<stop offset="0" stopColor="#5a92b4"/>
					<stop offset="1" stopColor="#4982a4" stopOpacity="0"/>
				</linearGradient>
			</defs>
			<g id="blue_cone_front" transform="translate(-1402.689 -1265.782)">
				<path id="blue_cone_double" d="M70.373,0l69.406,55.2H0Z" transform="translate(1402.689 1405.562) rotate(-90)" fill="url(#blue-double-linear-gradient)"/>
				<line id="Line_71" data-name="Line 71" y1="48" x2="61" transform="translate(1403.567 1396.285) rotate(-90)" fill="none" stroke="#dbf1ff" strokeWidth="1" strokeDasharray="5" opacity="0.614"/>
				<line id="Line_72" data-name="Line 72" x1="60" y1="48" transform="translate(1403.567 1335.285) rotate(-90)" fill="none" stroke="#dbf1ff" strokeWidth="1" strokeDasharray="5" opacity="0.614"/>
			</g>
		</svg>
	);
};

export default BlueConeDouble;