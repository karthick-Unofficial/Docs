import keyBy from "lodash/keyBy";
import merge from "lodash/merge";

const initialState = {
	data: {}
};

const listCategories = (state = initialState, action) => {
	const { type, payload } = action;

	switch (type) {
		case "LIST_CATEGORIES_RECEIVED": {
			const { categories } = payload;

			const newData = { ...state.data };

			const batch = keyBy(categories, "id");
			const update = merge(newData, batch);

			return {
				...state,
				data: { ...state.data, ...update }
			};
		}

		case "LIST_CATEGORY_RECEIVED": {
			const { categoryId, category } = payload;

			const newCategories = { ...state.data };
			newCategories[categoryId] = category;

			return {
				...state,
				data: newCategories
			};
		}

		case "LIST_CATEGORY_REMOVED": {
			const { categoryId } = payload;

			const newCategories = { ...state.data };
			delete newCategories[categoryId];

			return {
				...state,
				data: newCategories
			};
		}

		default:
			return state;
	}
};

export default listCategories;
