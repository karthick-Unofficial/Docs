"use strict";
const LIST_CATEGORIES_TABLE = "sys_listCategories";
const LIST_TABLE = "sys_list";

const provider = require("../lib/rethinkdbProvider");
const r = provider.r; // reference to rething connection/db
const userPolicyCache = new (require("../lib/userPolicyCache"));

const _global = require("../app-global.js");

module.exports = listCategoryModel;

function listCategoryModel(options) {
	if (!(this instanceof listCategoryModel)) return new listCategoryModel(options);
	const self = this;
	self.options = options;
}

/**
 * Get all list categories
 */
listCategoryModel.prototype._internalGetAll = async function() {
	try {
		const result = await r
			.table(LIST_CATEGORIES_TABLE)
			.run();
		return result;
	}
	catch (err) {
		throw err;
	}
};

/**
 * Get all list categories
 * @param {string} userId -- User's id
 * @param {string} orgId -- User's organization id
 */
listCategoryModel.prototype.getAll = async function(userId, orgId) {
	try {

		if(!userPolicyCache.authorizeApplication(userId, "lists-app")) {
			throw { message: "User is not authorized to view list categories", code: 403 };
		}

		const result = await r
			.table(LIST_CATEGORIES_TABLE)
			.filter(
				r.or(
					r.row("owner").eq(userId),
					r.row("ownerOrg").eq(orgId)
				)
			)
			.run();
		return result;
	} 
	catch (err) {
		throw err;
	}
};

/**
 * Get list category by id
 * @param {string} userId -- User's id
 * @param {string} orgId -- User's organization id
 */
listCategoryModel.prototype.getById = async function (userId, categoryId) {
	try {

		if(!userPolicyCache.authorizeApplication(userId, "lists-app")) {
			throw { message: "User is not authorized to view list categories", code: 403 };
		}

		const result = await r
			.table(LIST_CATEGORIES_TABLE)
			.get(categoryId)
			.run();
		return result;
	}
	catch (err) {
		throw err;
	}
};

/**
 * Create a new list collection
 * @param {string} userId -- User's id
 * @param {string} orgId -- User's organization id
 * @param {String} name -- Category name (title)
 */
listCategoryModel.prototype.create = async function(userId, orgId, name) {
	try {

		if(!userPolicyCache.authorizeApplication(userId, "lists-app", userPolicyCache.appPermissionTypes.manage)) {
			throw { message: "User is not authorized to create list categories", code: 403 };
		}
		
		const collection = {
			"name": name,
			"owner": userId,
			"ownerOrg": orgId
		};

		const result = await r
			.table(LIST_CATEGORIES_TABLE)
			.insert(collection, {returnChanges: true})
			.run();

		return result.changes[0].new_val;
	} 
	catch (err) {
		return err;
	}
};


/**
 * Update a category's name
 * @param {string} userId -- User's id
 * @param {string} categoryId -- Id of the category being updated
 * @param {string} update -- New name of category
 */
listCategoryModel.prototype.update = async function(userId, categoryId, update) {
	try {

		if(!userPolicyCache.authorizeApplication(userId, "lists-app", userPolicyCache.appPermissionTypes.manage)) {
			throw { message: "User is not authorized to update list categories", code: 403 };
		}

		if (typeof update !== "string") {
			throw {"message": "Category name must be string!", "code": 400};
		}

		const result = await r
			.table(LIST_CATEGORIES_TABLE)
			.get(categoryId)
			.update({name: update})
			.run();

		return result;
	} 
	catch (err) {
		return err;
	}
};

/**	
 * Delete a category
 * @param {string} userId -- User's id
 * @param {string} categoryId -- Category's id
 */
listCategoryModel.prototype.delete = async function(userId, categoryId) {
	try {

		if(!userPolicyCache.authorizeApplication(userId, "lists-app", userPolicyCache.appPermissionTypes.manage)) {
			throw { message: "User is not authorized to delete list categories", code: 403 };
		}

		const deleteCategory = await r
			.table(LIST_CATEGORIES_TABLE)
			.get(categoryId)
			.delete();

		const clearListCategories = await r
			.table(LIST_TABLE)
			.filter({"category": categoryId})
			.update({"category": null}, { returnChanges: true });
		try {
			const result = await r.expr([
				deleteCategory,
				clearListCategories
			]).run();
			// -- publish list category removal changes
			if (_global.globalChangefeed) {
				if (result[1]) {
					const { changes } = result[1];
					if (changes) {
						changes.forEach(change => {
							if (change) {
								_global.globalChangefeed.publish({
									new_val: change.new_val,
									old_val: change.old_val,
									rt: true
								});
							}
						});
					}
				}
			}

			return result;
		} catch (err) {
			throw err;
		}
	}
	catch (err) {
		return err;
	}
};

/**
 * Stream all list categories a user has access to
 * @param {string} userId -- User's id
 * @param {string} orgId -- User's organization id
 * @param {function} handler -- Handle changes fn
 */
listCategoryModel.prototype.streamCategories = async function(userId, orgId, handler) {
	try {

		if(!userPolicyCache.authorizeApplication(userId, "lists-app")) {
			throw { message: "User is not authorized to view list categories", code: 403 };
		}

		const query = r
			.table(LIST_CATEGORIES_TABLE)
			.changes({includeInitial: true, includeTypes: true});

		const onFeedItem = (change) => {
			handler(null, change);
		};
			
		const onError = (err) => {
			console.log("listCategoryModel.streamCategories error: ", err);
			handler(err, null);
		};
		
		const cancelFn = provider.processChangefeed("listCategoryModel.streamCategories", query, onFeedItem, onError);
		return cancelFn;
	} 
	catch (err) {
		return err;
	}
};