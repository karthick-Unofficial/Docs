import React from "react";

const RedConeDouble = ({ className }) => {
	return (
		<svg className={className} xmlns="http://www.w3.org/2000/svg" width="55.197" height="139.779" viewBox="0 0 55.197 139.779">
			<defs>
				<linearGradient id="red-double-linear-gradient" x1="0.5" x2="0.5" y2="1" gradientUnits="objectBoundingBox">
					<stop offset="0" stopColor="#ffbcbc"/>
					<stop offset="1" stopColor="red" stopOpacity="0"/>
				</linearGradient>
			</defs>
			<g id="red_cone_front" transform="translate(-1514.689 -1269.782)">
				<path id="red_cone_double" d="M70.373,0l69.406,55.2H0Z" transform="translate(1514.689 1409.562) rotate(-90)" fill="url(#red-double-linear-gradient)"/>
				<line id="Line_73" data-name="Line 73" y1="48" x2="61" transform="translate(1515.567 1400.285) rotate(-90)" fill="none" stroke="red" strokeWidth="1" strokeDasharray="5" opacity="0.614"/>
				<line id="Line_74" data-name="Line 74" x1="57" y1="46" transform="translate(1517.567 1336.285) rotate(-90)" fill="none" stroke="red" strokeWidth="1" strokeDasharray="5" opacity="0.614"/>
			</g>
		</svg>
	);
};

export default RedConeDouble;