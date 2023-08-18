const initialDrawingState = {
	type: null,
	active: false,
	editing: false
};

const drawingTools = (state = initialDrawingState, action) => {
	const { type, payload } = action;

	switch (type) {
		case "SET_DRAWING_MODE": {
			const { active, editing, type } = payload;

			return {
				...state,
				active,
				editing,
				type
			};
		}

		default:
			return state;
	}
};

export default drawingTools;
