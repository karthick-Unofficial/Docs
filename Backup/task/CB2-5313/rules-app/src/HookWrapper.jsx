import React from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";

const HookWrapper = (props) => {
    
	const navigate = useNavigate();
	const location = useLocation();
	const params = useParams();

	return (
		<div>
			{React.cloneElement(props.children, {
				navigate: navigate,
				location: location,
				params: params
			})}
		</div>
	);
};

export default HookWrapper;