import React, { useEffect, useState, useRef } from "react";
import * as actionCreators from "./typeAheadFilterActions";

const TypeAheadFilter = ({ placeholder, dispatch }) => {
	const { typeAheadFilter } = actionCreators;

	const [typeAheadText, setTypeAheadText] = useState("");
	const [mounted, setMounted] = useState(false);

	const typeaheadRef = useRef(null);

	// escape key acts as cancel shortcut
	const _handleKeyDown = (event) => {
		if (event.key === "Escape" && typeAheadText.length > 0) eraseInputValue();
	};

	useEffect(() => {
		setMounted(true);

		return () => {
			document.removeEventListener("keydown", _handleKeyDown);
		};
	}, []);

	if (!mounted) {
		document.addEventListener("keydown", _handleKeyDown);
		setMounted(true);
	}

	const handleTextChange = (event) => {
		setTypeAheadText(event.target.value);
		dispatch(typeAheadFilter(event.target.value));
	};

	const eraseInputValue = () => {
		dispatch(typeAheadFilter(""));
		typeaheadRef.current.value = "";
		setTypeAheadText("");
	};

	return (
		<div className="typeAhead">
			<div>
				<input
					type="text"
					ref={typeaheadRef}
					onChange={handleTextChange}
					placeholder={placeholder}
				/>
			</div>

			{typeAheadText ?
				<button onClick={eraseInputValue}>
					<i className="material-icons">cancel</i>
				</button>
				:
				<i className="material-icons">search</i>
			}

		</div>
	);
};

export default TypeAheadFilter;
