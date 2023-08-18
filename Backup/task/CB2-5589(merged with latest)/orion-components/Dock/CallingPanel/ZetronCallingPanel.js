"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _Object$keys = require("@babel/runtime-corejs3/core-js-stable/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");
var _filterInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/filter");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _forEachInstanceProperty = require("@babel/runtime-corejs3/core-js-stable/instance/for-each");
var _Object$getOwnPropertyDescriptors = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors");
var _Object$defineProperties = require("@babel/runtime-corejs3/core-js-stable/object/define-properties");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _trim = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/trim"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _orderBy = _interopRequireDefault(require("lodash/orderBy"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _clientAppCore = require("client-app-core");
var _material = require("@mui/material");
var _iconsMaterial = require("@mui/icons-material");
var _i18n = require("orion-components/i18n");
var _reactRedux = require("react-redux");
var _selector = require("orion-components/i18n/Config/selector");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context5, _context6; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty(_context5 = ownKeys(Object(source), !0)).call(_context5, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty(_context6 = ownKeys(Object(source))).call(_context6, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var propTypes = {
  dir: _propTypes["default"].string
};
var operationTypes = {
  SEARCH_CONTACTS: "searchContacts",
  CALL_INDIVIDUAL: "callIndividual",
  CALL_TALKGROUP: "callTalkgroup",
  CALL_RADIO: "callRadio"
};
var disabledStyle = {
  button: {
    width: "100%",
    minWidth: 0,
    height: 50,
    backgroundColor: "#6C6C6E"
  },
  buttonBorder: {
    borderRadius: 5,
    backgroundColor: "#6C6C6E"
  },
  buttonLabel: {
    width: "100%",
    paddingLeft: 9,
    paddingRight: 9,
    textTransform: "none",
    color: "#ffffff"
  }
};
var inputStyle = {
  field: {
    width: "80%",
    border: "1px solid #828283",
    padding: 10,
    minHeight: 45,
    height: 45,
    margin: ".75rem 0",
    backgroundColor: "transparent"
  },
  area: {
    marginTop: 0
  },
  hint: {
    top: 12
  },
  button: {
    width: "100%",
    minWidth: 0,
    height: 50
  },
  buttonBorder: {
    borderRadius: 5,
    backgroundColor: "#6C6C6E"
  },
  buttonLabel: {
    width: "100%",
    paddingLeft: 9,
    paddingRight: 9,
    textTransform: "none"
  }
};
var ZetronCallingPanel = function ZetronCallingPanel() {
  var _context2, _context3, _context4;
  var dir = (0, _reactRedux.useSelector)(function (state) {
    return (0, _selector.getDir)(state);
  });
  var _useState = (0, _react.useState)([]),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    contactList = _useState2[0],
    setContactList = _useState2[1];
  var _useState3 = (0, _react.useState)({
      name: "",
      error: ""
    }),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    searchField = _useState4[0],
    setSearchField = _useState4[1];
  var _useState5 = (0, _react.useState)({
      isSearching: false,
      message: "",
      errorMessage: ""
    }),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    statusInfo = _useState6[0],
    setStatusInfo = _useState6[1];
  var _useState7 = (0, _react.useState)(false),
    _useState8 = (0, _slicedToArray2["default"])(_useState7, 2),
    cancelSearch = _useState8[0],
    setCancelSearch = _useState8[1]; // Just don't display the result
  var _useState9 = (0, _react.useState)(),
    _useState10 = (0, _slicedToArray2["default"])(_useState9, 2),
    callButtonVisibleId = _useState10[0],
    setCallButtonVisibleId = _useState10[1];
  var _useState11 = (0, _react.useState)({
      title: (0, _i18n.getTranslation)("global.dock.callingPanel.title"),
      call: (0, _i18n.getTranslation)("global.dock.callingPanel.call"),
      clear: (0, _i18n.getTranslation)("global.dock.callingPanel.clear"),
      cancel: (0, _i18n.getTranslation)("global.dock.callingPanel.cancel"),
      searching: (0, _i18n.getTranslation)("global.dock.callingPanel.status.searching"),
      searchError: (0, _i18n.getTranslation)("global.dock.callingPanel.status.searchError"),
      searchResults: (0, _i18n.getTranslation)("global.dock.callingPanel.status.results"),
      callError: (0, _i18n.getTranslation)("global.dock.callingPanel.status.callError")
    }),
    _useState12 = (0, _slicedToArray2["default"])(_useState11, 1),
    translatedText = _useState12[0];
  var handleSearchContacts = function handleSearchContacts() {
    var name = searchField.name;
    if (name && name.length > 0) {
      //example: https://192.168.66.134/integration-app/api/externalSystem/zetron/lookup/searchContacts?name=dinesh
      var queryParam = "name=".concat(name);
      setStatusInfo({
        isSearching: true,
        errorMessage: "",
        message: translatedText.searching
      }); //Searching...
      setContactList([]);
      _clientAppCore.integrationService.getExternalSystemLookup("zetron", operationTypes.SEARCH_CONTACTS, function (err, response) {
        if (err) {
          setContactList([]);
          setStatusInfo({
            isSearching: false,
            errorMessage: translatedText.searchError,
            // "Error occurred searching..."
            message: "0 ".concat(translatedText.searchResults) // 0 results
          });
        } else {
          if (response.results && !cancelSearch) {
            var _context;
            var orderedResult = (0, _orderBy["default"])(response.results, ["name"], ["asc"]);
            setContactList(orderedResult);
            setStatusInfo({
              isSearching: false,
              errorMessage: "",
              message: (0, _concat["default"])(_context = " ".concat(response.results.length, " ")).call(_context, translatedText.searchResults) // x results
            });
          } else if (!response.success) {
            setContactList([]);
            setStatusInfo({
              isSearching: false,
              errorMessage: translatedText.searchError,
              message: "0 ".concat(translatedText.searchResults)
            });
          }
        }
      }, queryParam);
    }
  };
  var handleInitiateCall = function handleInitiateCall(operationType, numberOrId) {
    var continueExecution = true;
    var dataToPost = {};
    setStatusInfo(_objectSpread(_objectSpread({}, statusInfo), {}, {
      errorMessage: ""
    }));
    switch (operationType) {
      case operationTypes.CALL_INDIVIDUAL:
        dataToPost.number = numberOrId;
        break;
      case operationTypes.CALL_TALKGROUP:
        dataToPost.talkgroupId = numberOrId;
        break;
      case operationTypes.CALL_RADIO:
        dataToPost.radioUnitId = numberOrId;
        break;
      default:
        continueExecution = false;
        break;
    }
    if (continueExecution && numberOrId) {
      //post example: https://192.168.66.134/integration-app/api/externalSystem/zetron/resource/callIndividual

      _clientAppCore.restClient.exec_post("/integration-app/api/externalSystem/zetron/resource/".concat(operationType), dataToPost, function (err, response) {
        //Note : At present we just fire and forget and incase of error display standard error message.
        if (err) {
          setStatusInfo(_objectSpread(_objectSpread({}, statusInfo), {}, {
            errorMessage: translatedText.callError
          })); // "Error occurred initiating call"
        } else {
          if (response.error || !response.success) {
            setStatusInfo(_objectSpread(_objectSpread({}, statusInfo), {}, {
              errorMessage: translatedText.callError
            }));
          }
        }
      });
    }
  };
  var handleTextChange = function handleTextChange(event) {
    if (event.target.value.length > 25) {
      setSearchField({
        name: event.target.value,
        error: "Enter characters less than 25"
      });
      return;
    }
    setSearchField({
      name: event.target.value,
      error: ""
    });
  };
  var handleClear = function handleClear() {
    setContactList([]);
    setStatusInfo({
      isSearching: false,
      errorMessage: "",
      message: ""
    });
  };
  var handleCancel = function handleCancel() {
    setCancelSearch(true);
    handleClear();
  };
  var getContactIcon = function getContactIcon(contact) {
    return contact.isGroup ? /*#__PURE__*/_react["default"].createElement(_iconsMaterial.GroupSharp, {
      style: zetronStyles.resultIcon
    }) : /*#__PURE__*/_react["default"].createElement(_iconsMaterial.PersonSharp, {
      style: zetronStyles.resultIcon
    });
  };
  var zetronStyles = {
    zetronContainer: {
      overflow: "scroll",
      height: "calc(100% - 80px)",
      width: "90%",
      margin: "auto"
    },
    searchBoxLabel: {
      fontFamily: "roboto",
      marginTop: "15px"
    },
    searchBoxContainer: _objectSpread(_objectSpread(_objectSpread({}, dir === "rtl" && {
      marginLeft: "-12px"
    }), dir === "ltr" && {
      marginRight: "-12px"
    }), {}, {
      marginRight: "-12px",
      marginTop: "-12px",
      display: "flex",
      flexDirection: "row"
    }),
    searchContactButtonContainer: _objectSpread(_objectSpread(_objectSpread({}, dir === "ltr" && {
      marginLeft: "10px"
    }), dir === "rtl" && {
      marginRight: "10px"
    }), {}, {
      alignSelf: "center",
      width: "50px"
    }),
    statusContainer: {
      display: "flex",
      flexDirection: "row",
      margin: "0px",
      padding: "0px"
    },
    statusContainerResultStatus: _objectSpread(_objectSpread({
      padding: "0px",
      alignSelf: "center",
      minWidth: "20px",
      marginRight: "10px"
    }, dir === "ltr" && {
      marginRight: "10px"
    }), dir === "rtl" && {
      marginLeft: "10px"
    }),
    clearResult: {
      color: "#4DB5F4",
      minWidth: "100px",
      marginLeft: "10px",
      marginRight: "10px",
      cursor: "pointer"
    },
    cancelResult: {
      color: "#4DB5F4",
      minWidth: "100px",
      marginLeft: "10px",
      marginRight: "10px",
      cursor: "pointer"
    },
    resultContainer: {
      width: "100%",
      margin: "5px"
    },
    resultContactContainer: {
      width: "100%",
      height: "60px",
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-start",
      paddingTop: "08px",
      borderBottom: "1px solid #323843"
    },
    resultIconContainer: {
      width: "32px",
      height: "32px",
      marginTop: "-4px",
      alignSelf: "center"
    },
    resultIcon: {
      width: "32px",
      height: "32px",
      color: "#FFFFFF"
    },
    resultContactInfo: _objectSpread(_objectSpread({
      width: "65%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start"
    }, dir === "ltr" && {
      marginLeft: "10px"
    }), dir === "rtl" && {
      marginRight: "10px"
    }),
    resultContactName: {
      height: "24px",
      marginTop: "-12px"
    },
    resultContactNo: {
      height: "24px",
      marginTop: "-6px"
    },
    resultCallButtonContainer: {
      alignSelf: "center",
      marginTop: "-4px"
    },
    statusInfoErrorMessage: _objectSpread({
      color: "#ff0000"
    }, dir === "rtl" && {
      marginLeft: "10px"
    }),
    phone: _objectSpread({
      marginTop: -2
    }, dir === "rtl" && {
      marginLeft: 10
    })
  };
  return /*#__PURE__*/_react["default"].createElement("div", {
    style: zetronStyles.zetronContainer
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: zetronStyles.searchBoxLabel
  }, translatedText.title), /*#__PURE__*/_react["default"].createElement("div", {
    style: zetronStyles.searchBoxContainer
  }, /*#__PURE__*/_react["default"].createElement(_material.TextField, {
    id: "search-name",
    style: inputStyle.field,
    textareaStyle: inputStyle.area,
    multiLine: false,
    fullWidth: true,
    rows: 1,
    underlineShow: false,
    value: searchField.name,
    onChange: handleTextChange
  }), /*#__PURE__*/_react["default"].createElement("div", {
    id: "search-contact-button",
    style: zetronStyles.searchContactButtonContainer
  }, /*#__PURE__*/_react["default"].createElement(_material.Button, {
    variant: "contained",
    color: "primary",
    startIcon: /*#__PURE__*/_react["default"].createElement(_iconsMaterial.Search, {
      style: {
        width: 24,
        height: 24,
        marginLeft: 10
      }
    }),
    disabled: (0, _trim["default"])(_context2 = searchField.name).call(_context2) ? false : true,
    style: (0, _trim["default"])(_context3 = searchField.name).call(_context3) ? inputStyle.button : disabledStyle.button,
    buttonStyle: (0, _trim["default"])(_context4 = searchField.name).call(_context4) ? inputStyle.buttonBorder : disabledStyle.buttonBorder,
    onClick: handleSearchContacts
  }))), /*#__PURE__*/_react["default"].createElement("div", {
    style: zetronStyles.statusContainer
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "b2-bright-gray",
    style: zetronStyles.statusContainerResultStatus
  }, statusInfo.message), contactList.length > 0 && /*#__PURE__*/_react["default"].createElement("div", {
    className: "b2-bright-gray",
    style: zetronStyles.clearResult,
    onClick: handleClear
  }, translatedText.clear), contactList.length < 1 && statusInfo.isSearching && /*#__PURE__*/_react["default"].createElement("div", {
    className: "b2-bright-gray",
    style: zetronStyles.cancelResult,
    onClick: handleCancel
  }, translatedText.cancel)), statusInfo.errorMessage.length > 2 && /*#__PURE__*/_react["default"].createElement("div", {
    style: zetronStyles.statusInfoErrorMessage
  }, statusInfo.errorMessage), /*#__PURE__*/_react["default"].createElement("div", {
    style: zetronStyles.resultContainer
  }, (0, _map["default"])(contactList).call(contactList, function (contact, contactIndex) {
    return /*#__PURE__*/_react["default"].createElement("div", {
      key: contactIndex,
      className: "b2-bright-gray",
      style: zetronStyles.resultContactContainer,
      onMouseEnter: function onMouseEnter() {
        return setCallButtonVisibleId(contactIndex);
      },
      onMouseLeave: function onMouseLeave() {
        return setCallButtonVisibleId("");
      }
    }, /*#__PURE__*/_react["default"].createElement("div", {
      style: zetronStyles.resultIconContainer
    }, getContactIcon(contact)), /*#__PURE__*/_react["default"].createElement("div", {
      style: zetronStyles.resultContactInfo
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: "b1-bright-gray",
      style: zetronStyles.resultContactName
    }, contact.name), /*#__PURE__*/_react["default"].createElement("div", {
      className: "b2-dark-gray",
      style: zetronStyles.resultContactNo
    }, contact.contactNo)), /*#__PURE__*/_react["default"].createElement("div", {
      style: {
        alignSelf: "center",
        marginTop: -4,
        marginLeft: dir === "rtl" ? 5 : 2,
        visibility: "".concat(callButtonVisibleId === contactIndex ? "visible" : "hidden")
      }
    }, /*#__PURE__*/_react["default"].createElement(_material.Button, {
      variant: "contained",
      color: "primary",
      startIcon: /*#__PURE__*/_react["default"].createElement(_iconsMaterial.Phone, {
        style: zetronStyles.phone
      }),
      onClick: function onClick() {
        return handleInitiateCall(contact.isGroup ? operationTypes.CALL_TALKGROUP : operationTypes.CALL_INDIVIDUAL, contact.contactNo);
      }
    }, translatedText.call)));
  })));
};
ZetronCallingPanel.propTypes = propTypes;
var _default = ZetronCallingPanel;
exports["default"] = _default;