(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["exports", "react", "client-app-core"], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require("react"), require("client-app-core"));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.react, global.clientAppCore);
        global.EscalateEvent = mod.exports;
    }
})(this, function (exports, _react, _clientAppCore) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _react2 = _interopRequireDefault(_react);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var _slicedToArray = function () {
        function sliceIterator(arr, i) {
            var _arr = [];
            var _n = true;
            var _d = false;
            var _e = undefined;

            try {
                for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                    _arr.push(_s.value);

                    if (i && _arr.length === i) break;
                }
            } catch (err) {
                _d = true;
                _e = err;
            } finally {
                try {
                    if (!_n && _i["return"]) _i["return"]();
                } finally {
                    if (_d) throw _e;
                }
            }

            return _arr;
        }

        return function (arr, i) {
            if (Array.isArray(arr)) {
                return arr;
            } else if (Symbol.iterator in Object(arr)) {
                return sliceIterator(arr, i);
            } else {
                throw new TypeError("Invalid attempt to destructure non-iterable instance");
            }
        };
    }();

    var EscalateEvent = function EscalateEvent() {
        var _useState = (0, _react.useState)(),
            _useState2 = _slicedToArray(_useState, 2),
            event = _useState2[0],
            setEvent = _useState2[1];

        return null;
    };

    exports.default = EscalateEvent;
});