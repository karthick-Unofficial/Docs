"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.updateListCategory = exports.streamListCategories = exports.getListCategory = exports.getAllListCategories = exports.deleteListCategory = exports.createListCategory = void 0;
var t = _interopRequireWildcard(require("./actionTypes"));
var _clientAppCore = require("client-app-core");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Add list category data to state
 * @param list categories: an associative array of list categories
 */
var listCategoriesReceived = function listCategoriesReceived(categories) {
  return {
    type: t.LIST_CATEGORIES_RECEIVED,
    payload: {
      categories: categories
    }
  };
};

/*
 * Remove category data from state
 * @param categoryId: id of category to be removed
 */
var listCategoryRemoved = function listCategoryRemoved(categoryId) {
  return {
    type: t.LIST_CATEGORY_REMOVED,
    payload: {
      categoryId: categoryId
    }
  };
};

// Get all List categories from DB
var getAllListCategories = function getAllListCategories() {
  return function (dispatch) {
    _clientAppCore.listCategoryService.getAll(function (err, response) {
      if (err) console.log(err);
      if (!response) return;
      dispatch(listCategoriesReceived(response));
    });
  };
};
exports.getAllListCategories = getAllListCategories;
var getListCategory = function getListCategory(categoryId) {
  return function (dispatch) {
    _clientAppCore.listCategoryService.getListCategory(categoryId, function (err, response) {
      if (err) {
        console.log(err);
      }
      if (!response) {
        return;
      }
      dispatch(listCategoryReceived(response.id, response));
    });
  };
};

// Stream all List categories from DB
exports.getListCategory = getListCategory;
var streamListCategories = function streamListCategories() {
  return function (dispatch) {
    _clientAppCore.listCategoryService.streamAll(function (err, response) {
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
exports.streamListCategories = streamListCategories;
var listCategoryReceived = function listCategoryReceived(categoryId, category) {
  return {
    type: t.LIST_CATEGORY_RECEIVED,
    payload: {
      categoryId: categoryId,
      category: category
    }
  };
};

/*
 * Create a new category
 * @param category: category data
 */
var createListCategory = function createListCategory(list) {
  return function (dispatch) {
    _clientAppCore.listCategoryService.create(list, function (err, response) {
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
exports.createListCategory = createListCategory;
var updateListCategory = function updateListCategory(categoryId, category) {
  return function () {
    _clientAppCore.listCategoryService.update(categoryId, category, function (err, response) {
      if (err) console.log(err);
      if (!response) return;
    });
  };
};

/* Remove category from DB
 * @param categoryId: id of category to be removed
 */
exports.updateListCategory = updateListCategory;
var deleteListCategory = function deleteListCategory(categoryId) {
  return function (dispatch) {
    _clientAppCore.listCategoryService["delete"](categoryId, function (err, response) {
      if (err) console.log(err);
      if (!response) return;
      dispatch(listCategoryRemoved(categoryId));
    });
  };
};
exports.deleteListCategory = deleteListCategory;