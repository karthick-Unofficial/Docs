"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
_Object$defineProperty(exports, "Activities", {
  enumerable: true,
  get: function get() {
    return _Activities["default"];
  }
});
_Object$defineProperty(exports, "AlertWidget", {
  enumerable: true,
  get: function get() {
    return _AlertWidget["default"];
  }
});
_Object$defineProperty(exports, "CADDetailsWidget", {
  enumerable: true,
  get: function get() {
    return _CADDetailsWidget["default"];
  }
});
_Object$defineProperty(exports, "CameraWidget", {
  enumerable: true,
  get: function get() {
    return _CamerasWidget["default"];
  }
});
_Object$defineProperty(exports, "DetailsWidget", {
  enumerable: true,
  get: function get() {
    return _DetailsWidget["default"];
  }
});
_Object$defineProperty(exports, "EquipmentWidget", {
  enumerable: true,
  get: function get() {
    return _EquipmentWidget["default"];
  }
});
_Object$defineProperty(exports, "FacilityConditionWidget", {
  enumerable: true,
  get: function get() {
    return _FacilityCondition["default"];
  }
});
_Object$defineProperty(exports, "FileWidget", {
  enumerable: true,
  get: function get() {
    return _FileWidget["default"];
  }
});
_Object$defineProperty(exports, "FloorPlanWidget", {
  enumerable: true,
  get: function get() {
    return _FloorPlanWidget["default"];
  }
});
_Object$defineProperty(exports, "GateRunnerResponseWidget", {
  enumerable: true,
  get: function get() {
    return _GateRunnerResponseWidget["default"];
  }
});
_Object$defineProperty(exports, "LayoutControls", {
  enumerable: true,
  get: function get() {
    return _LayoutControls["default"];
  }
});
_Object$defineProperty(exports, "LinkedItemsWidget", {
  enumerable: true,
  get: function get() {
    return _LinkedItemsWidget["default"];
  }
});
_Object$defineProperty(exports, "ListWidget", {
  enumerable: true,
  get: function get() {
    return _ListWidget["default"];
  }
});
_Object$defineProperty(exports, "LiveCameraWidget", {
  enumerable: true,
  get: function get() {
    return _LiveCameraWidget["default"];
  }
});
_Object$defineProperty(exports, "MapWidget", {
  enumerable: true,
  get: function get() {
    return _MapWidget["default"];
  }
});
_Object$defineProperty(exports, "MarineTrafficParticularsWidget", {
  enumerable: true,
  get: function get() {
    return _MarineTrafficParticularsWidget["default"];
  }
});
_Object$defineProperty(exports, "MissionControlWidget", {
  enumerable: true,
  get: function get() {
    return _MissionControlWidget["default"];
  }
});
_Object$defineProperty(exports, "NotesWidget", {
  enumerable: true,
  get: function get() {
    return _NotesWidget["default"];
  }
});
_Object$defineProperty(exports, "PTZControls", {
  enumerable: true,
  get: function get() {
    return _PTZControls["default"];
  }
});
_Object$defineProperty(exports, "PhoenixDropzone", {
  enumerable: true,
  get: function get() {
    return _PhoenixDropzone["default"];
  }
});
_Object$defineProperty(exports, "PinnedItemsWidget", {
  enumerable: true,
  get: function get() {
    return _PinnedItemsWidget["default"];
  }
});
_Object$defineProperty(exports, "ProximityWidget", {
  enumerable: true,
  get: function get() {
    return _ProximityWidget["default"];
  }
});
_Object$defineProperty(exports, "ResourceWidget", {
  enumerable: true,
  get: function get() {
    return _ResourceWidget["default"];
  }
});
_Object$defineProperty(exports, "RespondingUnitsWidget", {
  enumerable: true,
  get: function get() {
    return _RespondingUnitsWidget["default"];
  }
});
_Object$defineProperty(exports, "RobotCamerasWidget", {
  enumerable: true,
  get: function get() {
    return _RobotCamerasWidget["default"];
  }
});
_Object$defineProperty(exports, "RulesWidget", {
  enumerable: true,
  get: function get() {
    return _RulesWidget["default"];
  }
});
_Object$defineProperty(exports, "SGSettings", {
  enumerable: true,
  get: function get() {
    return _SGSettings["default"];
  }
});
_Object$defineProperty(exports, "SummaryWidget", {
  enumerable: true,
  get: function get() {
    return _SummaryWidget["default"];
  }
});
var _DetailsWidget = _interopRequireDefault(require("./Details/DetailsWidget"));
var _AlertWidget = _interopRequireDefault(require("./Alert/AlertWidget"));
var _FileWidget = _interopRequireDefault(require("./File/FileWidget"));
var _LayoutControls = _interopRequireDefault(require("./LayoutControls/LayoutControls"));
var _MapWidget = _interopRequireDefault(require("./Map/MapWidget"));
var _PinnedItemsWidget = _interopRequireDefault(require("./PinnedItems/PinnedItemsWidget"));
var _SummaryWidget = _interopRequireDefault(require("./Summary/SummaryWidget"));
var _Activities = _interopRequireDefault(require("./Activities/Activities"));
var _ListWidget = _interopRequireDefault(require("./List/ListWidget"));
var _CamerasWidget = _interopRequireDefault(require("./Cameras/CamerasWidget"));
var _PTZControls = _interopRequireDefault(require("./PTZControls/PTZ-controls"));
var _PhoenixDropzone = _interopRequireDefault(require("./File/components/PhoenixDropzone"));
var _LinkedItemsWidget = _interopRequireDefault(require("./LinkedItems/LinkedItemsWidget"));
var _LiveCameraWidget = _interopRequireDefault(require("./LiveCamera/LiveCameraWidget"));
var _NotesWidget = _interopRequireDefault(require("./Notes/NotesWidget"));
var _SGSettings = _interopRequireDefault(require("./ShieldGroup/SGSettings"));
var _CADDetailsWidget = _interopRequireDefault(require("./CADDetails/CADDetailsWidget"));
var _RespondingUnitsWidget = _interopRequireDefault(require("./RespondingUnits/RespondingUnitsWidget"));
var _FloorPlanWidget = _interopRequireDefault(require("./FloorPlanWidget/FloorPlanWidget"));
var _MarineTrafficParticularsWidget = _interopRequireDefault(require("./MarineTrafficParticulars/MarineTrafficParticularsWidget"));
var _ProximityWidget = _interopRequireDefault(require("./Proximity/ProximityWidget"));
var _RobotCamerasWidget = _interopRequireDefault(require("./RobotCameras/RobotCamerasWidget"));
var _MissionControlWidget = _interopRequireDefault(require("./MissionControl/MissionControlWidget"));
var _ResourceWidget = _interopRequireDefault(require("./Hrms/ResourceWidget"));
var _EquipmentWidget = _interopRequireDefault(require("./Hrms/EquipmentWidget"));
var _FacilityCondition = _interopRequireDefault(require("./FacilityCondition/FacilityCondition"));
var _GateRunnerResponseWidget = _interopRequireDefault(require("./GateRunnerResponse/GateRunnerResponseWidget"));
var _RulesWidget = _interopRequireDefault(require("./Rules/RulesWidget"));