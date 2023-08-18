import React from "react";

const BlueCone = ({ className }) => {
	return (
		<svg className={className} xmlns="http://www.w3.org/2000/svg" width="93.425" height="55.197" viewBox="0 0 93.425 55.197">
			<defs>
				<linearGradient id="blue-linear-gradient" x1="0.5" x2="0.5" y2="1" gradientUnits="objectBoundingBox">
					<stop offset="0" stopColor="#5a92b4"/>
					<stop offset="1" stopColor="#4982a4" stopOpacity="0"/>
				</linearGradient>
			</defs>
			<g id="blue_cone" transform="translate(-1349.689 -1137.114)">
				<path id="blue_cone" d="M59.09,2.517l46.389,55.2H12.054Z" transform="translate(1455.168 1194.828) rotate(-180)" fill="url(#blue-linear-gradient)"/>
				<line id="Line_69" data-name="Line 69" y1="41" x2="35" transform="translate(1434.189 1187.613) rotate(180)" fill="none" stroke="#dbf1ff" strokeWidth="1" strokeDasharray="5" opacity="0.614"/>
				<line id="Line_70" data-name="Line 70" x1="35" y1="41" transform="translate(1393.189 1187.613) rotate(180)" fill="none" stroke="#dbf1ff" strokeWidth="1" strokeDasharray="5" opacity="0.614"/>
			</g>
		</svg>
	);
};

export default BlueCone;