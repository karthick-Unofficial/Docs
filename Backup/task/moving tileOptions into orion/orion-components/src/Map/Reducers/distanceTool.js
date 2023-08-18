const initialState = {
	paths: {},
	activePath: null
};

const distanceTool = (state = initialState, action) => {
	const { payload, type } = action;
	switch (type) {
		case "PATH_UPDATE": {
			const { path } = payload;
			return {
				...state,
				paths: { ...state.paths, [path.id]: path }
			};
		}
		case "PATHS_UPDATE": {
			const { paths } = payload;
			return {
				...state,
				paths
			};
		}
		case "PATH_DELETE": {
			const { id } = payload;
			const newPaths = { ...state.paths };
			delete newPaths[id];
			return {
				...state,
				paths: newPaths
			};
		}
		case "ACTIVE_PATH_SET": {
			const { path } = payload;
			return {
				...state,
				activePath: path
			};
		}
		default:
			return state;
	}
};

export default distanceTool;
