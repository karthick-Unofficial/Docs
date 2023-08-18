"use strict";

var _typeof3 = require("@babel/runtime-corejs3/helpers/typeof");
var _Object$keys2 = require("@babel/runtime-corejs3/core-js-stable/object/keys");
var _Object$getOwnPropertySymbols = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-symbols");
var _filterInstanceProperty2 = require("@babel/runtime-corejs3/core-js-stable/instance/filter");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _forEachInstanceProperty2 = require("@babel/runtime-corejs3/core-js-stable/instance/for-each");
var _Object$getOwnPropertyDescriptors = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptors");
var _Object$defineProperties = require("@babel/runtime-corejs3/core-js-stable/object/define-properties");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _includes = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/includes"));
var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/values"));
var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));
var _sort = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/sort"));
var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));
var _some = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/some"));
var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));
var _typeof2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/typeof"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toConsumableArray"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));
var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));
var _react = _interopRequireWildcard(require("react"));
var _clientAppCore = require("client-app-core");
var _CBComponents = require("orion-components/CBComponents");
var _material = require("@mui/material");
var _ZoomOutMap = _interopRequireDefault(require("@mui/icons-material/ZoomOutMap"));
var _Launch = _interopRequireDefault(require("@mui/icons-material/Launch"));
var _ListCard = _interopRequireDefault(require("./components/ListCard"));
var _reactSortableHoc = require("react-sortable-hoc");
var _i18n = require("orion-components/i18n");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _reactRedux = require("react-redux");
var _reduce = _interopRequireDefault(require("lodash/reduce"));
var _isEqual = _interopRequireDefault(require("lodash/isEqual"));
var _sortBy = _interopRequireDefault(require("lodash/sortBy"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof3(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = _Object$keys2(object); if (_Object$getOwnPropertySymbols) { var symbols = _Object$getOwnPropertySymbols(object); enumerableOnly && (symbols = _filterInstanceProperty2(symbols).call(symbols, function (sym) { return _Object$getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var _context17, _context18; var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? _forEachInstanceProperty2(_context17 = ownKeys(Object(source), !0)).call(_context17, function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : _Object$getOwnPropertyDescriptors ? _Object$defineProperties(target, _Object$getOwnPropertyDescriptors(source)) : _forEachInstanceProperty2(_context18 = ownKeys(Object(source))).call(_context18, function (key) { _Object$defineProperty(target, key, _Object$getOwnPropertyDescriptor(source, key)); }); } return target; }
var propTypes = {
  locale: _propTypes["default"].string
};
var defaultProps = {
  locale: "en"
};
var hasOwn = function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
};
var SortableItem = (0, _reactSortableHoc.SortableElement)(function (_ref) {
  var passedProps = _ref.passedProps,
    dir = _ref.dir,
    locale = _ref.locale;
  return /*#__PURE__*/_react["default"].createElement(_ListCard["default"], (0, _extends2["default"])({
    sortable: true
  }, passedProps, {
    dir: dir,
    locale: locale
  }));
});
var SortableList = (0, _reactSortableHoc.SortableContainer)(function (_ref2) {
  var key = _ref2.key,
    children = _ref2.children;
  return /*#__PURE__*/_react["default"].createElement("ul", {
    key: key
  }, children);
});
var ListDialogBody = function ListDialogBody(props) {
  if (props.availableLists) {
    var _context, _context3, _context5;
    var filteredLists = props.searchValue ? (0, _filter["default"])(_context = props.availableLists).call(_context, function (list) {
      var _context2;
      return (0, _includes["default"])(_context2 = list.name.toLowerCase()).call(_context2, props.searchValue.toLowerCase());
    }) : props.availableLists;

    //organize available categories by their ids into an object
    var convertedCategories = (0, _reduce["default"])(props.availableLists, function (result, list) {
      result[list.category] = list.categoryRef;
      return result;
    }, {});

    //determine which categories will have lists in them
    var occupiedCategories = {};
    (0, _forEach["default"])(filteredLists).call(filteredLists, function (list) {
      if (list.category && !occupiedCategories[list.category] && convertedCategories[list.category]) {
        occupiedCategories[list.category] = convertedCategories[list.category];
      }
    });
    return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_material.List, {
      key: "add-lists-category-section"
    }, (0, _map["default"])(_context3 = (0, _values["default"])(occupiedCategories)).call(_context3, function (category) {
      var _context4;
      return /*#__PURE__*/_react["default"].createElement(_react.Fragment, {
        key: "add-lists-category-".concat(category.id, "-fragment")
      }, /*#__PURE__*/_react["default"].createElement("p", {
        key: "add-lists-category-".concat(category.id, "-label"),
        style: {
          color: "#fff"
        }
      }, category.name), /*#__PURE__*/_react["default"].createElement(_material.List, {
        key: "add-lists-category-".concat(category.id)
      }, (0, _map["default"])(_context4 = (0, _filter["default"])(filteredLists).call(filteredLists, function (list) {
        return list.category === category.id;
      })).call(_context4, function (list) {
        return /*#__PURE__*/_react["default"].createElement(_ListCard["default"], (0, _extends2["default"])({
          key: "add-lists-list-".concat(list.id)
        }, props.getListCardProps(list, props.cardStyles, true, _objectSpread(_objectSpread({}, props), {}, {
          filteredLists: filteredLists
        }))));
      })));
    }), /*#__PURE__*/_react["default"].createElement("p", {
      key: "add-lists-category-unCategorized-label",
      style: {
        color: "#fff"
      }
    }, (0, _i18n.getTranslation)("global.profiles.widgets.list.main.uncategorizedLists")), /*#__PURE__*/_react["default"].createElement(_material.List, {
      key: "add-lists-category-unCategorized"
    }, (0, _map["default"])(_context5 = (0, _filter["default"])(filteredLists).call(filteredLists, function (list) {
      return !list.category;
    })).call(_context5, function (list) {
      return /*#__PURE__*/_react["default"].createElement(_ListCard["default"], (0, _extends2["default"])({
        key: "add-lists-list-".concat(list.id)
      }, props.getListCardProps(list, props.cardStyles, true, _objectSpread(_objectSpread({}, props), {}, {
        filteredLists: filteredLists
      }))));
    }))));
  } else if (props.availableListsError) {
    return /*#__PURE__*/_react["default"].createElement("p", {
      style: {
        paddingTop: "20px",
        textAlign: "center"
      }
    }, " ", /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
      value: "global.profiles.widgets.list.main.noListsAvail"
    }), " ");
  } else {
    return /*#__PURE__*/_react["default"].createElement("div", {
      style: {
        display: "flex",
        justifyContent: "center"
      }
    }, /*#__PURE__*/_react["default"].createElement(_material.CircularProgress, {
      size: 60,
      thickness: 5
    }));
  }
};
var ListWidget = function ListWidget(props, ref) {
  var lists = props.lists,
    contextId = props.contextId,
    subscriberRef = props.subscriberRef,
    isPrimary = props.isPrimary,
    expanded = props.expanded,
    unsubscribeFromFeed = props.unsubscribeFromFeed,
    selectWidget = props.selectWidget,
    dialog = props.dialog,
    user = props.user,
    lookupData = props.lookupData,
    canAddEditLists = props.canAddEditLists,
    canRemoveLists = props.canRemoveLists,
    getLookupValues = props.getLookupValues,
    updateListCheckbox = props.updateListCheckbox,
    openDialog = props.openDialog,
    closeDialog = props.closeDialog,
    defaultListPagination = props.defaultListPagination,
    listPaginationOptions = props.listPaginationOptions,
    secondaryExpanded = props.secondaryExpanded,
    dir = props.dir,
    locale = props.locale,
    selected = props.selected,
    enabled = props.enabled,
    order = props.order,
    widgetsExpandable = props.widgetsExpandable,
    widgetsLaunchable = props.widgetsLaunchable,
    listAccessAndEventsManage = props.listAccessAndEventsManage;
  var dispatch = (0, _reactRedux.useDispatch)();
  var _useState = (0, _react.useState)([]),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    activeCheckboxes = _useState2[0],
    setActiveCheckboxes = _useState2[1];
  var _useState3 = (0, _react.useState)(""),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    listSearch = _useState4[0],
    setListSearch = _useState4[1];
  var _useState5 = (0, _react.useState)(null),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    availableLists = _useState6[0],
    setAvailableLists = _useState6[1];
  var _useState7 = (0, _react.useState)(false),
    _useState8 = (0, _slicedToArray2["default"])(_useState7, 2),
    availableListsError = _useState8[0],
    setAvailableListsError = _useState8[1];
  var _useState9 = (0, _react.useState)(false),
    _useState10 = (0, _slicedToArray2["default"])(_useState9, 2),
    addListDisabled = _useState10[0],
    setAddListDisabled = _useState10[1];
  var _useState11 = (0, _react.useState)(),
    _useState12 = (0, _slicedToArray2["default"])(_useState11, 2),
    sortedListsState = _useState12[0],
    setSortedListsState = _useState12[1];
  var _useState13 = (0, _react.useState)(false),
    _useState14 = (0, _slicedToArray2["default"])(_useState13, 2),
    Error = _useState14[0],
    setError = _useState14[1];
  (0, _react.useEffect)(function () {
    organizeSortedLists();
    return function () {
      if (!isPrimary && !expanded) {
        dispatch(unsubscribeFromFeed(contextId, "lists", subscriberRef));
      }
    };
  }, []);
  var usePrevious = function usePrevious(value) {
    var ref = (0, _react.useRef)();
    (0, _react.useEffect)(function () {
      ref.current = value;
    }, [value]);
    return ref.current;
  };
  var prevProps = usePrevious(props);
  (0, _react.useEffect)(function () {
    if (prevProps && prevProps.lists) {
      if ((0, _keys["default"])(prevProps.lists).length < (0, _keys["default"])(lists).length || !(0, _isEqual["default"])(prevProps.lists, lists)) {
        organizeSortedLists();
      }
    }
    if (ref) ref.current = {
      openListDialog: openListDialog
    };
  }, [props]);
  var organizeSortedLists = function organizeSortedLists() {
    var _context6, _context7, _context8, _context9, _context10, _context12;
    // get all lists with an index and put in array, then sort array.
    var sortedLists = (0, _sortBy["default"])((0, _filter["default"])(_context6 = (0, _values["default"])(lists)).call(_context6, function (list) {
      return hasOwn(list, "index");
    }), function (list) {
      return list.index;
    });

    // take the rest and group by category
    var occupiedCategories = {};
    var unCategorizedLists = [];
    (0, _forEach["default"])(_context7 = (0, _filter["default"])(_context8 = (0, _values["default"])(lists)).call(_context8, function (list) {
      return !hasOwn(list, "index");
    })).call(_context7, function (list) {
      if (list.category) {
        occupiedCategories[list.category] ? occupiedCategories[list.category].push(list) : occupiedCategories[list.category] = [list];
      } else if (!list.category) {
        unCategorizedLists.push(list);
      }
    });
    //, then add to same array
    (0, _forEach["default"])(_context9 = (0, _sort["default"])(_context10 = (0, _keys["default"])(occupiedCategories)).call(_context10)).call(_context9, function (category) {
      var _context11;
      sortedLists = (0, _concat["default"])(_context11 = []).call(_context11, (0, _toConsumableArray2["default"])(sortedLists), (0, _toConsumableArray2["default"])(occupiedCategories[category]));
    });
    sortedLists = (0, _concat["default"])(_context12 = []).call(_context12, (0, _toConsumableArray2["default"])(sortedLists), unCategorizedLists);

    // Save new order
    (0, _forEach["default"])(sortedLists).call(sortedLists, function (list, index) {
      // For lists with a new sorting index, save them
      if (list.index == null || list.index !== index) {
        _clientAppCore.eventService.updatePinnedList(list.targetId, list.id, {
          index: index
        }, function (err, res) {
          if (err) console.log(err, res);
        });
      }
    });
    setSortedListsState(sortedLists);
  };
  var _onSortEnd = function onSortEnd(oldIndex, newIndex) {
    // Get new sorted list
    var sortedLists = (0, _reactSortableHoc.arrayMove)(sortedListsState, oldIndex, newIndex);

    // Update list indexes
    for (var i = 0; i < sortedLists.length; i++) {
      var list = sortedLists[i];
      //Redundant safeguard so we only update when necessary
      if (i !== list.index) {
        _clientAppCore.eventService.updatePinnedList(list.targetId, list.id, {
          index: i
        }, function (err, res) {
          if (err) console.log(err, res);
        });
      }
    }

    // Set state
    setSortedListsState(sortedLists);
  };
  var handleExpand = function handleExpand() {
    dispatch(selectWidget("Event Lists"));
  };
  var getListCardProps = function getListCardProps(item, cardStyles, forDialog, dialogProps) {
    var _context13;
    return _objectSpread({
      key: item.id,
      cardStyles: cardStyles,
      defaultListPagination: defaultListPagination,
      listPaginationOptions: listPaginationOptions,
      user: user,
      dir: dir,
      locale: locale,
      lookupData: lookupData,
      getLookupValues: getLookupValues,
      canEdit: forDialog ? false : canAddEditLists,
      canRemove: forDialog ? false : item.targetId ? canAddEditLists : canRemoveLists,
      list: item,
      adding: forDialog ? true : false,
      // This property controls what type of header is generated
      expanded: expanded,
      secondaryExpanded: secondaryExpanded
    }, forDialog ? {
      checked: (0, _includes["default"])(_context13 = dialogProps.activeCheckboxes).call(_context13, item.id),
      handleSelectList: function handleSelectList() {
        return dialogProps.handleSelectList(item.id);
      },
      updateDialog: dialogProps.updateDialog
    } : {
      updateListCheckbox: updateListCheckbox,
      openDialog: openDialog,
      closeDialog: closeDialog,
      dialog: dialog
    });
  };
  var handleLaunch = function handleLaunch() {
    window.open("/events-app/#/entity/".concat(contextId, "/widget/event-lists"));
  };
  var openListDialog = function openListDialog() {
    // Set available lists to add
    _clientAppCore.listService.getAll(function (err, response) {
      if (err) {
        setError(true);
      } else if ((0, _typeof2["default"])(response) === "object" && hasOwn(response, "success") && !response.success) {
        setAvailableListsError(true);
      } else {
        setAvailableLists(response);
      }
    });
    setActiveCheckboxes([]);
    setListSearch("");
    dispatch(openDialog("listWidgetDialog"));
  };
  var closeListDialog = function closeListDialog() {
    // Clear error and set lists to null so addable lists will update in real time as permissions are set
    setAvailableListsError(false);
    setAvailableLists(null);
    dispatch(closeDialog("listWidgetDialog"));
  };

  // set controlled inputs
  var handleSelectList = function handleSelectList(listId) {
    var found = (0, _includes["default"])(activeCheckboxes).call(activeCheckboxes, listId);
    if (found) {
      var acBoxes = (0, _filter["default"])(activeCheckboxes).call(activeCheckboxes, function (x) {
        return x !== listId;
      });
      setActiveCheckboxes(acBoxes);
    } else {
      var _context14;
      setActiveCheckboxes((0, _concat["default"])(_context14 = []).call(_context14, (0, _toConsumableArray2["default"])(activeCheckboxes), [listId]));
    }
  };
  var saveAddLists = function saveAddLists() {
    var listIds = activeCheckboxes;
    var type = "Event";
    var eventId = contextId;
    _clientAppCore.eventService.pinListsByTemplates(listIds, type, eventId, function (err, res) {
      if (err) {
        console.log(err, res);
      } else {
        dispatch(closeDialog("listWidgetDialog"));
      }

      // -- enable add button
      setAddListDisabled(false);
    });

    // -- disable add button
    setAddListDisabled(true);
  };

  // FIXME: Hack to make sure dialog repositions on list expansion
  var updateDialog = function updateDialog() {
    // forceUpdate();
  };
  var cardStyles = {
    card: {
      backgroundColor: "#1F1F21",
      marginBottom: ".75rem"
    },
    cardExpanded: {
      backgroundColor: "#35383c",
      marginBottom: "2rem",
      boxShadow: "0px 0px 21px 2px rgba(0, 0, 0, 0.35)"
    },
    cardWrapperExpanded: {
      backgroundColor: "#35383c",
      marginBottom: "5rem",
      margin: "auto",
      width: "90%"
    },
    header: {
      backgroundColor: "#41454A",
      // marginBottom: ".75rem",
      display: "flex",
      padding: 8,
      borderRadius: 4
    },
    checkboxLabel: {
      color: "white",
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      width: 235
    },
    addListButtons: {
      margin: ".75rem"
    },
    input: {
      backgroundColor: "#35383c",
      padding: "5px",
      width: "100%",
      border: "none"
    },
    widgetExpandButton: _objectSpread(_objectSpread({
      width: "auto"
    }, dir === "rtl" && {
      paddingLeft: 0
    }), dir === "ltr" && {
      paddingRight: 0
    })
  };
  return selected || !enabled ? /*#__PURE__*/_react["default"].createElement("div", null) : /*#__PURE__*/_react["default"].createElement("div", {
    className: "widget-wrapper ".concat("index-" + order),
    style: expanded ? cardStyles.cardWrapperExpanded : {}
  }, !expanded ? /*#__PURE__*/_react["default"].createElement("div", {
    className: "widget-header",
    style: {
      marginTop: -8
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "cb-font-b2"
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.profiles.widgets.list.main.eventLists"
  })), listAccessAndEventsManage && /*#__PURE__*/_react["default"].createElement("div", {
    className: "widget-option-button"
  }, /*#__PURE__*/_react["default"].createElement(_material.Button, {
    variant: "text",
    color: "primary",
    onClick: openListDialog
  }, (0, _i18n.getTranslation)("global.profiles.widgets.list.main.addList"))), /*#__PURE__*/_react["default"].createElement("div", {
    className: "widget-header-buttons"
  }, widgetsExpandable ? /*#__PURE__*/_react["default"].createElement("div", {
    className: "widget-expand-button"
  }, /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
    style: cardStyles.widgetExpandButton,
    onClick: handleExpand
  }, /*#__PURE__*/_react["default"].createElement(_ZoomOutMap["default"], null))) : null, widgetsLaunchable ? /*#__PURE__*/_react["default"].createElement("div", {
    className: "widget-expand-button"
  }, /*#__PURE__*/_react["default"].createElement(_material.IconButton, {
    style: cardStyles.widgetExpandButton,
    onClick: handleLaunch
  }, /*#__PURE__*/_react["default"].createElement(_Launch["default"], null))) : null)) : null, /*#__PURE__*/_react["default"].createElement("div", {
    className: "widget-content"
  }, sortedListsState && sortedListsState.length > 0 ? /*#__PURE__*/_react["default"].createElement(SortableList, {
    key: "lists-sortable-list",
    distance: 5,
    lockToContainerEdges: true,
    lockAxis: "y",
    shouldCancelStart: function shouldCancelStart(e) {
      var _context15, _context16;
      // Only let the header be draggable
      var header = (0, _some["default"])(_context15 = (0, _slice["default"])(_context16 = e.path).call(_context16, 0, 5)).call(_context15, function (element) {
        var classNameCheck = element.className.toString().toLowerCase();
        return classNameCheck && (0, _includes["default"])(classNameCheck).call(classNameCheck, "muicardheader");
      });
      if (!header) {
        return true;
      }
      return false;
    },
    onSortEnd: function onSortEnd(_ref3) {
      var oldIndex = _ref3.oldIndex,
        newIndex = _ref3.newIndex;
      return _onSortEnd(oldIndex, newIndex);
    },
    children: (0, _map["default"])(sortedListsState).call(sortedListsState, function (list, index) {
      return /*#__PURE__*/_react["default"].createElement(SortableItem, {
        index: index,
        key: list.id,
        passedProps: _objectSpread({}, getListCardProps(list, cardStyles)),
        dir: dir,
        locale: locale
      });
    })
  }) : null, /*#__PURE__*/_react["default"].createElement(_CBComponents.Dialog, {
    open: dialog === "listWidgetDialog",
    title: (0, _i18n.getTranslation)("global.profiles.widgets.list.main.chooseToAdd"),
    confirm: {
      label: (0, _i18n.getTranslation)("global.profiles.widgets.list.main.addSelected", activeCheckboxes.length ? activeCheckboxes.length : ""),
      action: saveAddLists,
      disabled: !activeCheckboxes.length || addListDisabled
    },
    abort: {
      label: (0, _i18n.getTranslation)("global.profiles.widgets.list.main.cancel"),
      action: closeListDialog
    },
    options: {
      onClose: closeListDialog,
      maxWidth: "md",
      fullWidth: true
    },
    dir: dir
  }, /*#__PURE__*/_react["default"].createElement(_CBComponents.SearchField, {
    id: "list-search",
    handleChange: function handleChange(e) {
      return setListSearch(e.target.value);
    },
    handleClear: function handleClear() {
      return setListSearch("");
    },
    value: listSearch,
    placeholder: (0, _i18n.getTranslation)("global.profiles.widgets.list.main.searchLists"),
    dir: dir
  }), /*#__PURE__*/_react["default"].createElement(ListDialogBody, {
    availableLists: availableLists,
    searchValue: listSearch,
    availableListsError: availableListsError,
    getLookupValues: getLookupValues,
    cardStyles: cardStyles,
    getListCardProps: getListCardProps,
    user: user,
    lookupData: lookupData,
    expanded: expanded,
    activeCheckboxes: activeCheckboxes,
    handleSelectList: handleSelectList,
    updateDialog: updateDialog,
    openDialog: openDialog,
    dir: dir
  }))));
};
var forwardListWidget = /*#__PURE__*/(0, _react.forwardRef)(ListWidget);
forwardListWidget.propTypes = propTypes;
forwardListWidget.defaultProps = defaultProps;
var _default = forwardListWidget;
exports["default"] = _default;