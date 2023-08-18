import React from "react";

const Speedometer = ({ className }) => {
	return (
		<svg
			className={className}
			id="speedometer"
			xmlns="http://www.w3.org/2000/svg"
			width="16.6"
			height="14.33"
			viewBox="0 0 16.6 14.33"
		>
			<path
				id="speedometer-2"
				data-name="speedometer"
				d="M10.3,13.735A2.481,2.481,0,0,1,9.055,9.1l8.059-4.641-4.59,7.911A2.5,2.5,0,0,1,10.3,13.735M10.3,3a8.484,8.484,0,0,1,4.125,1.09l-1.743,1A6.65,6.65,0,0,0,3.66,11.257,6.533,6.533,0,0,0,5.6,15.923H5.61a.819.819,0,0,1,0,1.164.847.847,0,0,1-1.179.008h0A8.248,8.248,0,0,1,10.3,3m8.3,8.257A8.211,8.211,0,0,1,16.168,17.1h0A.837.837,0,0,1,15,17.087a.819.819,0,0,1,0-1.164h0a6.547,6.547,0,0,0,1.942-4.665,6.635,6.635,0,0,0-.448-2.395l1-1.734A8.433,8.433,0,0,1,18.6,11.257Z"
				transform="translate(-2 -3)"
				fill="#fff"
			/>
		</svg>
	);
};

export default Speedometer;
