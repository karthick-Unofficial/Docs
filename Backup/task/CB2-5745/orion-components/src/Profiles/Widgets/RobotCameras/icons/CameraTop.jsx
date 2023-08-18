import React from "react";

const CameraTop = ({ className }) => {
	return (
		<svg
			className={className}
			xmlns="http://www.w3.org/2000/svg"
			width="23"
			height="15"
			viewBox="0 0 23 15"
		>
			<g
				id="Group_929"
				data-name="Group 929"
				transform="translate(-697 -804)"
			>
				<g id="video" transform="translate(697 804)">
					<path
						id="video-2"
						data-name="video"
						d="M20.889,11.625V7.25A1.264,1.264,0,0,0,19.611,6H4.278A1.264,1.264,0,0,0,3,7.25v12.5A1.264,1.264,0,0,0,4.278,21H19.611a1.264,1.264,0,0,0,1.278-1.25V15.375l5.111,5V6.625Z"
						transform="translate(-3 -6)"
						fill="#fff"
					/>
				</g>
				<text
					id="PTZ"
					transform="translate(706 815)"
					fill="#434343"
					fontSize="11"
					fontFamily="Roboto-Medium, Roboto"
					fontWeight="500"
				>
					<tspan x="-3.47" y="0">
						T
					</tspan>
				</text>
			</g>
		</svg>
	);
};

export default CameraTop;
