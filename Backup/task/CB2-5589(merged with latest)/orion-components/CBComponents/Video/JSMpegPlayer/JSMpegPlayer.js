(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(["exports", "react", "prop-types", "@material-ui/core", "@cycjimmy/jsmpeg-player"], factory);
	} else if (typeof exports !== "undefined") {
		factory(exports, require("react"), require("prop-types"), require("@material-ui/core"), require("@cycjimmy/jsmpeg-player"));
	} else {
		var mod = {
			exports: {}
		};
		factory(mod.exports, global.react, global.propTypes, global.core, global.jsmpegPlayer);
		global.JSMpegPlayer = mod.exports;
	}
})(this, function (exports, _react, _propTypes, _core, _jsmpegPlayer) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _react2 = _interopRequireDefault(_react);

	var _propTypes2 = _interopRequireDefault(_propTypes);

	var _jsmpegPlayer2 = _interopRequireDefault(_jsmpegPlayer);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : {
			default: obj
		};
	}

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	var _createClass = function () {
		function defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];
				descriptor.enumerable = descriptor.enumerable || false;
				descriptor.configurable = true;
				if ("value" in descriptor) descriptor.writable = true;
				Object.defineProperty(target, descriptor.key, descriptor);
			}
		}

		return function (Constructor, protoProps, staticProps) {
			if (protoProps) defineProperties(Constructor.prototype, protoProps);
			if (staticProps) defineProperties(Constructor, staticProps);
			return Constructor;
		};
	}();

	function _possibleConstructorReturn(self, call) {
		if (!self) {
			throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		}

		return call && (typeof call === "object" || typeof call === "function") ? call : self;
	}

	function _inherits(subClass, superClass) {
		if (typeof superClass !== "function" && superClass !== null) {
			throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
		}

		subClass.prototype = Object.create(superClass && superClass.prototype, {
			constructor: {
				value: subClass,
				enumerable: false,
				writable: true,
				configurable: true
			}
		});
		if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	}

	var propTypes = {
		cameraId: _propTypes2.default.string.isRequired,
		videoProfile: _propTypes2.default.string,
		fullscreen: _propTypes2.default.bool,
		streamUrl: _propTypes2.default.string
	};

	var defaultProps = {
		videoProfile: "desktop",
		fullscreen: false
	};

	var JSMpegPlayer = function (_Component) {
		_inherits(JSMpegPlayer, _Component);

		function JSMpegPlayer(props) {
			_classCallCheck(this, JSMpegPlayer);

			var _this = _possibleConstructorReturn(this, (JSMpegPlayer.__proto__ || Object.getPrototypeOf(JSMpegPlayer)).call(this, props));

			_this.state = {
				error: null
			};
			_this.els = {
				videoWrapper: null
			};
			return _this;
		}
		// Try to start video on mount


		_createClass(JSMpegPlayer, [{
			key: "componentDidMount",
			value: function componentDidMount() {
				var streamUrl = this.props.streamUrl;

				// Reference documentation, pay attention to the order of parameters.
				// https://github.com/cycjimmy/jsmpeg-player#usage
				new _jsmpegPlayer2.default.VideoElement(this.els.videoWrapper, streamUrl, this.props.options, this.props.overlayOptions);
			}
		}, {
			key: "render",
			value: function render() {
				var _this2 = this;

				var fullscreen = this.props.fullscreen;
				var _state = this.state,
				    videoData = _state.videoData,
				    subscription = _state.subscription,
				    error = _state.error;

				var styles = {
					wrapper: {
						display: "flex",
						alignItems: "center",
						placeContent: "center",
						justifyContent: "center"
					},
					video: {
						margin: "auto",
						maxWidth: "100%",
						maxHeight: "100%",
						objectFit: "contain"
					}
				};
				return _react2.default.createElement("div", {
					className: "wrapper",
					ref: function ref(videoWrapper) {
						return _this2.els.videoWrapper = videoWrapper;
					} });
			}
		}]);

		return JSMpegPlayer;
	}(_react.Component);

	JSMpegPlayer.propTypes = propTypes;
	JSMpegPlayer.defaultProps = defaultProps;

	exports.default = JSMpegPlayer;
});