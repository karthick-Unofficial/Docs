(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(["exports", "react", "prop-types", "client-app-core", "orion-components/ContextualData/contextStreaming", "@material-ui/core"], factory);
	} else if (typeof exports !== "undefined") {
		factory(exports, require("react"), require("prop-types"), require("client-app-core"), require("orion-components/ContextualData/contextStreaming"), require("@material-ui/core"));
	} else {
		var mod = {
			exports: {}
		};
		factory(mod.exports, global.react, global.propTypes, global.clientAppCore, global.contextStreaming, global.core);
		global.WavPlayer = mod.exports;
	}
})(this, function (exports, _react, _propTypes, _clientAppCore, _contextStreaming, _core) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _react2 = _interopRequireDefault(_react);

	var _propTypes2 = _interopRequireDefault(_propTypes);

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
		instanceId: _propTypes2.default.string,
		videoProfile: _propTypes2.default.string,
		fullscreen: _propTypes2.default.bool
	};

	var defaultProps = {
		instanceId: "",
		videoProfile: "desktop",
		fullscreen: false
	};

	var WavPlayer = function (_Component) {
		_inherits(WavPlayer, _Component);

		function WavPlayer(props) {
			_classCallCheck(this, WavPlayer);

			var _this = _possibleConstructorReturn(this, (WavPlayer.__proto__ || Object.getPrototypeOf(WavPlayer)).call(this, props));

			_this.play = function (cameraId, videoProfile, instanceId, entityId, entityType) {
				_clientAppCore.cameraService.streamVideo(cameraId, videoProfile, { instanceId: instanceId, entityId: entityId, entityType: entityType }, function (err, response) {
					if (err) console.log(err);
					if (!response) return;
					var code = response.code,
					    Data = response.Data;

					if (code) {
						_this.setState({ error: true });
					} else if (Data) {
						_this.setState({ videoData: Data });
					}
				}).then(function (sub) {
					_this.setState({ subscription: sub });
				});
			};

			_this.state = {
				videoData: null,
				subscription: null,
				error: null
			};
			return _this;
		}
		// Try to start video on mount


		_createClass(WavPlayer, [{
			key: "componentDidMount",
			value: function componentDidMount() {
				var _props = this.props,
				    cameraId = _props.cameraId,
				    videoProfile = _props.videoProfile,
				    instanceId = _props.instanceId,
				    entityId = _props.entityId,
				    entityType = _props.entityType;

				this.play(cameraId, videoProfile, instanceId, entityId, entityType);
			}
		}, {
			key: "componentWillUnmount",
			value: function componentWillUnmount() {
				var subscription = this.state.subscription;

				if (subscription) {
					(0, _contextStreaming.simpleUnsub)(subscription.channel);
				}
			}
		}, {
			key: "componentDidUpdate",
			value: function componentDidUpdate(prevProps, prevState) {
				var _props2 = this.props,
				    cameraId = _props2.cameraId,
				    videoProfile = _props2.videoProfile,
				    instanceId = _props2.instanceId,
				    entityId = _props2.entityId,
				    entityType = _props2.entityType;
				var subscription = this.state.subscription;

				// If camera is different on prop change
				if (prevProps.cameraId !== cameraId) {
					// If subscription, unsub
					if (subscription) {
						(0, _contextStreaming.simpleUnsub)(subscription.channel);
					}
					// Clear out state
					this.setState({
						videoData: null,
						subscription: null,
						error: null
					});
					// Start new video
					this.play(cameraId, videoProfile, instanceId, entityId, entityType);
				}
			}
		}, {
			key: "render",
			value: function render() {
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
				return _react2.default.createElement(
					"div",
					{ style: styles.wrapper },
					!error && subscription && !videoData && _react2.default.createElement(_core.CircularProgress, null),
					error && _react2.default.createElement(
						_core.Typography,
						{ align: "center", variant: "subtitle1" },
						"The camera has encountered a problem."
					),
					videoData && _react2.default.createElement("img", {
						key: "camera",
						alt: "camera",
						src: "data:image/jpeg;base64," + videoData,
						style: styles.video
					})
				);
			}
		}]);

		return WavPlayer;
	}(_react.Component);

	WavPlayer.propTypes = propTypes;
	WavPlayer.defaultProps = defaultProps;

	exports.default = WavPlayer;
});