"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
_Object$defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _parseFloat2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/parse-float"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));
// cSpell:disable
var DEG_TO_RAD = Math.PI / 180.0;
var RAD_TO_DEG = 180.0 / Math.PI;
var DistanceUnit = {
  KILOMETERS: "KILOMETERS",
  MILES: "MILES",
  NAUTICALMILES: "NAUTICALMILES",
  STATUTEMILES: "STATUTEMILES",
  METERS: "METERS"
};
var EarthRadiusUnits = {
  KILOMETERS: 6371.00964,
  MILES: 3958.76186,
  NAUTICALMILES: 3440.07,
  STATUTEMILES: 3958.7618625615,
  METERS: 6371009.64
};
var WavCamHelper = /*#__PURE__*/function () {
  function WavCamHelper(metadata) {
    (0, _classCallCheck2["default"])(this, WavCamHelper);
    this.CAMERA_LAT = (0, _parseFloat2["default"])(metadata["x-wavcam-lat"]);
    this.CAMERA_LON = (0, _parseFloat2["default"])(metadata["x-wavcam-lon"]);
    this.CurrentAz = this.CAMERA_AZ = (0, _parseFloat2["default"])(metadata["x-wavcam-camera-az"]);
    this.CurrentEl = this.CAMERA_EL = (0, _parseFloat2["default"])(metadata["x-wavcam-camera-el"]);
    this.currentVFOV = this.CAMERA_VFOV = (0, _parseFloat2["default"])(metadata["x-wavcam-vfov"]);
    this.currentHFOV = this.CAMERA_HFOV = (0, _parseFloat2["default"])(metadata["x-wavcam-hfov"]);
    this.CAMERA_ALT = (0, _parseFloat2["default"])(metadata["x-wavcam-alt"]);
    this.updateParams(metadata);
  }
  (0, _createClass2["default"])(WavCamHelper, [{
    key: "updateParams",
    value: function updateParams(metadata) {
      // these define the portion of the wav image displayed
      this.VIEWABLE_AREA_HEIGHT = (0, _parseFloat2["default"])(metadata["x-wavcam-viewable-area-height"]);
      this.VIEWABLE_AREA_WIDTH = (0, _parseFloat2["default"])(metadata["x-wavcam-viewable-area-width"]);
      this.VIEWABLE_AREA_X = (0, _parseFloat2["default"])(metadata["x-wavcam-viewable-area-x"]);
      this.VIEWABLE_AREA_Y = (0, _parseFloat2["default"])(metadata["x-wavcam-viewable-area-y"]);
      this.currentHFOV = this.CAMERA_HFOV;
      this.currentVFOV = this.CAMERA_VFOV;
      this.CurrentAz = this.CAMERA_AZ;
      this.CurrentEl = this.CAMERA_EL;
    }
  }, {
    key: "GetHeadingToPoint",
    value: function GetHeadingToPoint(frompoint, topoint) {
      var lat1 = frompoint[0] * DEG_TO_RAD;
      var lat2 = topoint[0] * DEG_TO_RAD;
      var lon1 = frompoint[1] * DEG_TO_RAD;
      var lon2 = topoint[1] * DEG_TO_RAD;
      var heading = Math.atan2(Math.sin(lon2 - lon1) * Math.cos(lat2), Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1)) % (2 * Math.PI) * RAD_TO_DEG;
      return heading < 0 ? heading + 360 : heading;
    }
  }, {
    key: "sphericalDistance",
    value: function sphericalDistance(startLat, startLon, endLat, endLon, unit) {
      var phi1 = startLat * DEG_TO_RAD;
      var lambda0 = startLon * DEG_TO_RAD;
      var phi = endLat * DEG_TO_RAD;
      var lambda = endLon * DEG_TO_RAD;
      var pdiff = Math.sin((phi - phi1) / 2.0);
      var ldiff = Math.sin((lambda - lambda0) / 2.0);
      var rval = Math.sqrt(pdiff * pdiff + Math.cos(phi1) * Math.cos(phi) * (ldiff * ldiff));
      return 2.0 * Math.asin(rval) * EarthRadiusUnits[unit];
    }
  }, {
    key: "convertLatLonToAzEl",
    value: function convertLatLonToAzEl(lat, lng) {
      // Get delta latitude, and ensure that it does not wrap around the equator
      var deltaLat = lat * DEG_TO_RAD - this.CAMERA_LAT * DEG_TO_RAD;
      if (Math.abs(deltaLat) > Math.PI) {
        if (deltaLat > Math.PI) {
          deltaLat -= 2.0 * Math.PI;
        } else {
          deltaLat += 2.0 * Math.PI;
        }
      }

      // Get delta longitude, and ensure that it does not wrap around the prime meridian
      var deltaLon = lng * DEG_TO_RAD - this.CAMERA_LON * DEG_TO_RAD;
      if (Math.abs(deltaLon) > Math.PI) {
        if (deltaLon > Math.PI) {
          deltaLon -= 2.0 * Math.PI;
        } else {
          deltaLon += 2.0 * Math.PI;
        }
      }
      var thetaR = Math.PI / 2.0 - Math.asin(Math.cos(deltaLat) * Math.cos(deltaLon));
      var detEl = Math.atan2(EarthRadiusUnits["METERS"] * Math.sin(thetaR), this.CAMERA_ALT + EarthRadiusUnits["METERS"] * (1.0 - Math.cos(thetaR))) - Math.PI / 2.0;
      var distance = this.sphericalDistance(this.CAMERA_LAT, this.CAMERA_LON, lat, lng, DistanceUnit.METERS);
      return [this.GetHeadingToPoint([this.CAMERA_LAT, this.CAMERA_LON], [lat, lng]), detEl * RAD_TO_DEG, distance];
    }

    // Input in degrees, output in percentage of x/y
  }, {
    key: "convertAzElToPercentXY",
    value: function convertAzElToPercentXY(az, el) {
      // Calculate the left hand side azimuth, and normalize it
      var startAz = this.CurrentAz - this.currentHFOV / 2.0;
      if (startAz < 0.0) {
        startAz += 360.0;
        az += 360.0;
      }

      // Calculate the x position based
      var x = (az - startAz) / this.currentHFOV;
      var adjAz = DEG_TO_RAD * (this.currentHFOV / 2.0 - this.currentHFOV * x + 90.0);
      var xCoord = Math.cos(adjAz);
      var yCoord = Math.cos(Math.abs(DEG_TO_RAD * this.CurrentEl)) * Math.sin(adjAz);
      var zCoord = Math.sqrt(1.0 - xCoord * xCoord - yCoord * yCoord);
      if (this.CurrentEl < 0.0) {
        zCoord = -zCoord;
      }
      var thetaTilt = RAD_TO_DEG * Math.atan(zCoord / Math.sqrt(xCoord * xCoord + yCoord * yCoord));

      // Calculate the elevation of the top of the viewable area
      var startEl = thetaTilt + this.currentVFOV / 2.0;

      // Calculate the y position, and make sure we don't point off the edge of the screen
      var y = (startEl - el) / this.currentVFOV;
      return [x, y];
    }
  }]);
  return WavCamHelper;
}();
var _default = WavCamHelper;
exports["default"] = _default;