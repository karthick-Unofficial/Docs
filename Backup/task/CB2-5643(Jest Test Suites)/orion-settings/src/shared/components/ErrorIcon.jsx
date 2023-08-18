import React, { useState } from "react";
import { Translate } from "orion-components/i18n";


const ErrorIcon = () => {
	const [hovered, setHovered] = useState(false);

	const handleMouse = () => {
		setHovered(!hovered);
	};

	return (
		<div>
			<div className='hover-error'>
				<Translate value="mainContent.shared.errorIcon.errorText" />
			</div>
			<i
				className='material-icons saved-message error'
				onMouseEnter={handleMouse}
				onMouseLeave={handleMouse}>error</i>
		</div>
	);
};

export default ErrorIcon;