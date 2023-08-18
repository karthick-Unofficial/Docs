(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(["exports", "react", "prop-types", "orion-components/CBComponents", "@material-ui/core", "@material-ui/icons", "client-app-core", "../../Profiles/Widgets/PTZControls/PTZ-controls"], factory);
	} else if (typeof exports !== "undefined") {
		factory(exports, require("react"), require("prop-types"), require("orion-components/CBComponents"), require("@material-ui/core"), require("@material-ui/icons"), require("client-app-core"), require("../../Profiles/Widgets/PTZControls/PTZ-controls"));
	} else {
		var mod = {
			exports: {}
		};
		factory(mod.exports, global.react, global.propTypes, global.CBComponents, global.core, global.icons, global.clientAppCore, global.PTZControls);
		global.VideoPlayer = mod.exports;
	}
})(this, function (exports, _react, _propTypes, _CBComponents, _core, _icons, _clientAppCore, _PTZControls) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _react2 = _interopRequireDefault(_react);

	var _propTypes2 = _interopRequireDefault(_propTypes);

	var _PTZControls2 = _interopRequireDefault(_PTZControls);

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
		camera: _propTypes2.default.shape({
			id: _propTypes2.default.string.isRequired,
			player: _propTypes2.default.shape({
				type: _propTypes2.default.string.isRequired,
				url: _propTypes2.default.string
			})
		}).isRequired,
		docked: _propTypes2.default.bool,
		modal: _propTypes2.default.bool
	};

	var defaultProps = {
		camera: { player: { url: null } },
		docked: false,
		modal: false
	};

	var VideoPlayer = function (_Component) {
		_inherits(VideoPlayer, _Component);

		function VideoPlayer(props) {
			_classCallCheck(this, VideoPlayer);

			var _this = _possibleConstructorReturn(this, (VideoPlayer.__proto__ || Object.getPrototypeOf(VideoPlayer)).call(this, props));

			_this.getPlayer = function (frame) {
				var camera = _this.props.camera;
				var streamUrl = _this.state.streamUrl;
				var player = camera.player,
				    id = camera.id;
				var type = player.type,
				    url = player.url;

				switch (type) {
					case "flashphoner":
						return _react2.default.createElement(_CBComponents.WebRTCPlayer, { frame: frame, url: url, streamUrl: streamUrl });
					case "ws-jpeg":
						return _react2.default.createElement(_CBComponents.WSImagePlayer, { cameraId: id, videoProfile: "desktop" });
					default:
						return null;
				}
			};

			_this.toggleFullscreen = function () {
				console.log("You attempted to fullscreen the video!");
				_this.setState({ fullscreen: !_this.state.fullscreen });
			};

			_this.state = {
				streamUrl: null,
				fullscreen: false
			};
			_this.frame = _react2.default.createRef();
			return _this;
		}

		_createClass(VideoPlayer, [{
			key: "componentDidMount",
			value: function componentDidMount() {
				var _this2 = this;

				var camera = this.props.camera;
				var id = camera.id;

				_clientAppCore.cameraService.getStreamURL(id, function (err, response) {
					if (err) console.log("ERROR", err);
					if (!response) return;
					var streamUrl = response.streamUrl;

					_this2.setState({ streamUrl: streamUrl });
				});
			}
		}, {
			key: "render",
			value: function render() {
				var _this3 = this;

				var _props = this.props,
				    docked = _props.docked,
				    modal = _props.modal,
				    camera = _props.camera,
				    dialogkey = _props.dialogkey;
				var fullscreen = this.state.fullscreen;

				var frame = this.frame.current;
				var frameWidth = frame ? frame.clientWidth : 320;
				var styles = {
					frame: {
						position: "relative",
						display: "flex",
						alignItems: "center",
						placeContent: "center",
						backgroundColor: "#000",
						minHeight: frameWidth * 0.55,
						width: "100%"
					}
				};

				var renderVideoPlayer = function renderVideoPlayer() {
					return _react2.default.createElement(
						"div",
						{ ref: _this3.frame, style: styles.frame, onClick: _this3.toggleFullscreen },
						docked || modal ? _react2.default.createElement(
							_core.Typography,
							{ style: { position: "absolute" }, variant: "subtitle1" },
							"Camera in " + (docked ? "Dock" : "Modal")
						) : frame ? _this3.getPlayer(frame) : _react2.default.createElement(_core.CircularProgress, null)
					);
				};

				// TODO: SET THESE CORRECTLY
				var canControl = true;
				var width = ""; // check where this was coming from in bitbucket

				console.log("Fullscreen", fullscreen);

				return _react2.default.createElement(
					_react.Fragment,
					null,
					renderVideoPlayer(),
					_react2.default.createElement(
						_CBComponents.Dialog,
						{ key: dialogkey, open: fullscreen, options: { maxWidth: "lg" } },
						_react2.default.createElement(
							"div",
							{
								style: { width: width === "sm" || width === "xs" ? "auto" : 700 }
							},
							_react2.default.createElement(
								"div",
								{ className: "expanded-camera-wrapper" },
								_react2.default.createElement(
									"div",
									{
										style: {
											width: "100%",
											display: "flex",
											justifyContent: "space-between",
											alignItems: "center"
										}
									},
									_react2.default.createElement(
										_core.Typography,
										{ variant: "subtitle1" },
										camera.entityData.properties.name
									),
									_react2.default.createElement(
										_core.IconButton,
										{ onClick: this.toggleFullscreen },
										_react2.default.createElement(_icons.Close, { style: { color: "#FFF" } })
									)
								),
								renderVideoPlayer(),
								_react2.default.createElement(
									"div",
									{ style: { width: "100%", height: 300 } },
									_react2.default.createElement(
										"div",
										{ className: "expanded-camera-ptz-wrapper" },
										canControl && _react2.default.createElement(_PTZControls2.default, { dock: true, camera: camera })
									)
								)
							)
						)
					)
				);
			}
		}]);

		return VideoPlayer;
	}(_react.Component);

	VideoPlayer.propTypes = propTypes;
	VideoPlayer.defaultProps = defaultProps;

	exports.default = VideoPlayer;
});