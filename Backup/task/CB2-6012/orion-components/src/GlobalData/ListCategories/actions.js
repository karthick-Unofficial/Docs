import * as t from "./actionTypes";
import { listCategoryService } from "client-app-core";

/*
 * Add list category data to state
 * @param list categories: an associative array of list categories
 */
const listCategoriesReceived = (categories) => {
	return {
		type: t.LIST_CATEGORIES_RECEIVED,
		payload: {
			categories
		}
	};
};

/*
 * Remove category data from state
 * @param categoryId: id of category to be removed
 */
const listCategoryRemoved = (categoryId) => {
	return {
		type: t.LIST_CATEGORY_REMOVED,
		payload: {
			categoryId
		}
	};
};

// Get all List categories from DB
export const getAllListCategories = () => {
	return (dispatch) => {
		listCategoryService.getAll((err, response) => {
			if (err) console.log(err);
			if (!response) return;
			dispatch(listCategoriesReceived(response));
		});
	};
};

export const getListCategory = (categoryId, callback) => {
	return (dispatch) => {
		listCategoryService.getListCategory(categoryId, (err, response) => {
			if (err) {
				if (callback)
					callback(err);
				console.log(err);
			}
			if (!response) {
				if (callback)
					callback({ success: false });
				return;
			}
			dispatch(listCategoryReceived(response.id, response));
		});
	};
};

// Stream all List categories from DB
export const streamListCategories = () => {
	return (dispatch) => {
		listCategoryService.streamAll((err, response) => {
			if (err) console.log(err);
			if (!response) return;
			switch (response.type) {
				case "remove":
					dispatch(listCategoryRemoved(response.old_val.id));
					break;
				default:
					dispatch(listCategoryReceived(response.new_val.id, response.new_val));
					break;
			}
		});
	};
};

/*
 * Update category data in state
 * @param categoryId: id of category to be updated
 * @param category: updated category data
 */
const listCategoryReceived = (categoryId, category) => {
	return {
		type: t.LIST_CATEGORY_RECEIVED,
		payload: {
			categoryId,
			category
		}
	};
};

/*
 * Create a new category
 * @param category: category data
 */
export const createListCategory = (list) => {
	return (dispatch) => {
		listCategoryService.create(list, (err, response) => {
			if (err) console.log(err);
			if (!response) return;
			dispatch(listCategoryReceived(response.id, response));
		});
	};
};

/*
 * Remove category data from state
 * @param categoryId: id of category to be removed
 */
export const updateListCategory = (categoryId, category) => {
	return () => {
		listCategoryService.update(categoryId, category, (err, response) => {
			if (err) console.log(err);
			if (!response) return;
		});
	};
};

/* Remove category from DB
 * @param categoryId: id of category to be removed
 */
export const deleteListCategory = (categoryId) => {
	return (dispatch) => {
		listCategoryService.delete(categoryId, (err, response) => {
			if (err) console.log(err);
			if (!response) return;
			dispatch(listCategoryRemoved(categoryId));
		});
	};
};
