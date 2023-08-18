import PropTypes from "prop-types";
import React, { useEffect, Fragment} from "react";

const propTypes = {
	keyboardkeys : PropTypes.object
};

const KeyboardShortCutKey = (props) => {
	
	useEffect(() => {
		const keyboardkeys = props.keyboardkeys;
		const handleKeyPress = (event) => {
			if(event.altKey) {
				const evtObj = event.code;
				const actionItem = keyboardkeys[evtObj];
				if(props.hasOwnProperty(actionItem)){
					props[actionItem]();
				}
				
			}
		};
		if(keyboardkeys){
			document.addEventListener("keydown", handleKeyPress, false);
	
			return () => {
				document.removeEventListener("keydown", handleKeyPress, false);
			};
		}
		
	}, [props.keyboardkeys]);

	return (
		<Fragment/>
	);
};


KeyboardShortCutKey.propTypes = propTypes;
export default KeyboardShortCutKey;