"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.searchForm = void 0;
var searchForm = {
  type: "person",
  person: {
    firstName: "",
    lastName: "",
    dOB: "",
    sex: "all",
    race: "all",
    keyword: ""
  },
  selected: null
};
exports.searchForm = searchForm;