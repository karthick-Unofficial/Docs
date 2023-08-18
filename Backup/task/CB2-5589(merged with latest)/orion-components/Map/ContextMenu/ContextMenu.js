"use strict";

var _typeof = require("@babel/runtime-corejs3/helpers/typeof");
var _WeakMap = require("@babel/runtime-corejs3/core-js-stable/weak-map");
var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toConsumableArray"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/slicedToArray"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));
var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));
var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));
var _splice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/splice"));
var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));
var _sort = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/sort"));
var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _material = require("@mui/material");
var _styles = require("@mui/styles");
var _mdiMaterialUi = require("mdi-material-ui");
var _NestedMenuItem = _interopRequireDefault(require("./components/NestedMenuItem"));
var _ContextMenuItem = _interopRequireDefault(require("./components/ContextMenuItem"));
var _CopyCoords = _interopRequireDefault(require("./components/CopyCoords"));
var _i18n = require("orion-components/i18n");
var _js = require("@mdi/js");
var _reactRedux = require("react-redux");
var _selector = require("orion-components/i18n/Config/selector");
var _Actions = require("orion-components/ContextPanel/Actions");
var _includes = _interopRequireDefault(require("lodash/includes"));
var _orderBy = _interopRequireDefault(require("lodash/orderBy"));
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = _Object$defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { _Object$defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var propTypes = {
  map: _propTypes["default"].object.isRequired,
  children: _propTypes["default"].array,
  contextMenuOpening: _propTypes["default"].func,
  contextMenuClosing: _propTypes["default"].func,
  close: _propTypes["default"].bool,
  dir: _propTypes["default"].string
};
var hasOwn = function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
};
var useStyle = (0, _styles.makeStyles)({
  paper: {
    boxShadow: "rgb(0,0,0,0.7) -5px 5px 10px 0px"
  }
});
var config = {
  camera: {
    label: "Cameras",
    propertyName: "controls",
    types: [{
      propertyValue: "true",
      icon: _mdiMaterialUi.Cctv
    }, {
      propertyValue: "false",
      icon: _mdiMaterialUi.Video
    }]
  },
  accessPoint: {
    label: "AccessPoints",
    propertyName: "entityType",
    types: [{
      propertyValue: "accessPoint",
      icon: _js.mdiAccessPoint
    }]
  },
  shapes: {
    label: "Shapes",
    propertyName: "type",
    types: [{
      propertyValue: "Point",
      icon: _mdiMaterialUi.MapMarker
    }, {
      propertyValue: "Line",
      icon: _mdiMaterialUi.VectorLine
    }, {
      propertyValue: "Polygon",
      icon: _mdiMaterialUi.MapMarkerPath
    }]
  },
  track: {
    label: "Tracks",
    propertyName: "type",
    types: [{
      propertyValue: "track",
      icon: _mdiMaterialUi.Ferry
    }, {
      propertyValue: "vehicle",
      icon: _mdiMaterialUi.Car
    }, {
      propertyValue: "aircraft",
      icon: _mdiMaterialUi.Airplane
    }, {
      propertyValue: "Person",
      icon: _mdiMaterialUi.Account
    }]
  }
};
var ContextMenu = function ContextMenu(_ref) {
  var _context7;
  var map = (0, _map["default"])(_ref),
    children = _ref.children,
    contextMenuOpening = _ref.contextMenuOpening,
    contextMenuClosing = _ref.contextMenuClosing,
    close = _ref.close;
  var dispatch = (0, _reactRedux.useDispatch)();
  var dir = (0, _reactRedux.useSelector)(function (state) {
    return (0, _selector.getDir)(state);
  });
  var _useState = (0, _react.useState)(null),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    anchorPosition = _useState2[0],
    setAnchorPosition = _useState2[1];

  // entities = { entityType1 : [Array of entities], entityType2: [Array of entities] }
  var _useState3 = (0, _react.useState)({}),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    entities = _useState4[0],
    setEntities = _useState4[1];
  var _useState5 = (0, _react.useState)(null),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    lngLat = _useState6[0],
    setLngLat = _useState6[1];
  var classes = useStyle();
  var currentEntities;
  if (close && anchorPosition !== null) setAnchorPosition(null);
  var handleContextMenu = function handleContextMenu(e) {
    var _context;
    setLngLat(e.lngLat);
    var features = (0, _filter["default"])(_context = map.queryRenderedFeatures(e.point)).call(_context, function (feature) {
      return feature.source !== "composite";
    });
    if (contextMenuOpening) contextMenuOpening(features, e.lngLat);
    e.preventDefault();
    setupEntities(features);
    var _e$point = e.point,
      x = _e$point.x,
      y = _e$point.y;
    setAnchorPosition({
      top: y + 48,
      left: x
    });
  };
  var handleClose = (0, _react.useCallback)(function () {
    setAnchorPosition(null);
    setEntities({});
    setLngLat(null);
    if (contextMenuClosing) contextMenuClosing();
  }, []);
  (0, _react.useEffect)(function () {
    map.on("contextmenu", handleContextMenu);
    return function () {
      map.off("contextmenu", handleContextMenu);
      handleClose();
    };
  }, []);
  var setupEntities = function setupEntities(features) {
    currentEntities = {};
    var clusters = [];
    (0, _forEach["default"])(features).call(features, function (feature) {
      if (!(0, _includes["default"])(feature.layer.id, "-cluster-count")) {
        if ((0, _includes["default"])(feature.layer.id, "-clusters")) clusters.push(feature);else addEntity(feature.properties);
      }
    });
    (0, _forEach["default"])(clusters).call(clusters, function (cluster) {
      var clusterId = cluster.properties.cluster_id,
        point_count = cluster.properties.point_count,
        clusterSource = map.getSource(cluster.layer.source);
      clusterSource.getClusterLeaves(clusterId, point_count, 0, function (err, clusterFeatures) {
        if (!err && clusterFeatures) (0, _map["default"])(clusterFeatures).call(clusterFeatures, function (f) {
          return addEntity(f.properties);
        });
        (0, _splice["default"])(clusters).call(clusters, (0, _indexOf["default"])(clusters).call(clusters, cluster), 1);
        if (!clusters.length) setEntities(currentEntities);
      });
    });
    if (!clusters.length) setEntities(currentEntities);
  };
  var addEntity = function addEntity(entity) {
    var entityType = entity.entityType;
    if (!entityType && entity.type) {
      var type = entity.type.toLowerCase();
      if (type === "point" || type === "line" || type === "polygon") entityType = "shapes";
    }
    if (entityType && config[entityType] && entity.type !== "FOV") {
      var _context2;
      if (!currentEntities[entityType]) currentEntities[entityType] = [];
      // Have seen duplicate entities at time, hence checking to avoid duplication
      if ((0, _filter["default"])(_context2 = currentEntities[entityType]).call(_context2, function (e) {
        return e.id === entity.id;
      }).length === 0) currentEntities[entityType].push(entity);
    }
  };
  var loadProfileForEntity = function loadProfileForEntity(entity) {
    setAnchorPosition(null);
    dispatch((0, _Actions.loadProfile)(entity.id, entity.name ? entity.name : entity.id, entity.entityType || "shapes", "profile", "primary"));
  };
  var getProfileItems = function getProfileItems() {
    var _context3, _context4;
    return (0, _map["default"])(_context3 = (0, _sort["default"])(_context4 = (0, _toConsumableArray2["default"])((0, _keys["default"])(entities))).call(_context4)).call(_context3, function (entityType) {
      var _context5;
      return /*#__PURE__*/_react["default"].createElement(_NestedMenuItem["default"], {
        key: entityType,
        label:
        // eslint-disable-next-line no-constant-condition
        config[entityType].label == "Shapes" || "Tracks" || "Cameras" || "AccessPoints" ? (0, _i18n.getTranslation)("global.map.contextMenu.main.".concat(config[entityType].label)) : config[entityType].label,
        parentMenuOpen: !!anchorPosition,
        dir: dir
      }, (0, _map["default"])(_context5 = (0, _orderBy["default"])(entities[entityType], ["name"], ["asc"])).call(_context5, function (entity) {
        return /*#__PURE__*/_react["default"].createElement(_ContextMenuItem["default"], {
          key: entity.id,
          onClick: function onClick() {
            return loadProfileForEntity(entity);
          }
        }, /*#__PURE__*/_react["default"].createElement(_material.ListItemIcon, {
          style: {
            color: "#ffffff",
            minWidth: 42
          }
        }, getIcon(entity, entityType)), /*#__PURE__*/_react["default"].createElement(_material.ListItemText, {
          primary: entity.name,
          style: dir == "rtl" ? {
            textAlign: "right"
          } : {}
        }));
      }));
    });
  };
  var getIcon = function getIcon(entity, entityType) {
    var propertyName = config[entityType].propertyName;
    var Icon = null;
    if (hasOwn(entity, propertyName)) {
      var _context6;
      var propertyValue = entity[propertyName];
      (0, _forEach["default"])(_context6 = config[entityType].types).call(_context6, function (t) {
        if (t.propertyValue.toString().toLowerCase() === propertyValue.toString().toLowerCase()) Icon = t.icon;
      });
    }
    if (Icon) {
      if (entityType == "accessPoint") {
        return /*#__PURE__*/_react["default"].createElement(_material.SvgIcon, {
          style: {
            width: 34,
            height: 34,
            color: "#fff"
          }
        }, /*#__PURE__*/_react["default"].createElement("path", {
          d: Icon
        }));
      }
      return /*#__PURE__*/_react["default"].createElement(Icon, null);
    }
    return null;
  };
  var entitiesExist = (0, _keys["default"])(entities).length > 0;
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_material.Popover, {
    open: !!anchorPosition,
    anchorReference: "anchorPosition",
    anchorPosition: anchorPosition,
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "right"
    },
    transformOrigin: {
      vertical: "top",
      horizontal: "left"
    },
    onClose: handleClose,
    classes: {
      paper: classes.paper
    }
  }, (0, _map["default"])(_context7 = _react["default"].Children).call(_context7, children, function (child) {
    return child && child !== null ? /*#__PURE__*/_react["default"].cloneElement(child, {
      anchorPosition: anchorPosition,
      closeContextMenu: handleClose
    }) : null;
  }), lngLat && /*#__PURE__*/_react["default"].createElement(_CopyCoords["default"], {
    lngLat: lngLat,
    coordsCopied: handleClose
  }), children && entitiesExist && /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      height: 1,
      width: "100%",
      backgroundColor: "#8b8d91"
    }
  }), getProfileItems(), !children && !entitiesExist && /*#__PURE__*/_react["default"].createElement(_material.Typography, {
    variant: "body2",
    style: {
      padding: "12px 16px"
    }
  }, /*#__PURE__*/_react["default"].createElement(_i18n.Translate, {
    value: "global.map.contextMenu.main.noActions"
  }))));
};
ContextMenu.propTypes = propTypes;
var _default = ContextMenu;
exports["default"] = _default;