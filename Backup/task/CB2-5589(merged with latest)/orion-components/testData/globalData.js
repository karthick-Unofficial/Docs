"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports.globalData = void 0;
var globalData = {
  orgs: {},
  cameras: {
    data: {},
    dataById: [],
    dataQueue: {},
    dataByIdQueue: [],
    dataRemoveQueue: [],
    subscription: "b3ac6281-a6f9-11ed-8fcc-61cdf0bd2afd"
  },
  collections: {
    data: {},
    dataById: [],
    dataQueue: {},
    dataByIdQueue: [],
    dataRemoveQueue: [],
    subscription: "b3ac6281-a6f9-11ed-8fcc-61cdf0bd2afd"
  },
  accessPoint: {
    data: {},
    dataById: ["5f8665c3-0542-44cf-85bc-56f8316ba9cc"],
    dataQueue: {},
    dataByIdQueue: [],
    dataRemoveQueue: [],
    subscription: "b3ac6284-a6f9-11ed-8fcc-61cdf0bd2afd"
  },
  users: {}
};
exports.globalData = globalData;