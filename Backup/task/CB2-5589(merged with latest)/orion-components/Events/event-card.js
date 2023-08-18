(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(["exports", "react", "moment", "../SharedComponents", "../Dock", "material-ui", "./components/PinnedItem"], factory);
	} else if (typeof exports !== "undefined") {
		factory(exports, require("react"), require("moment"), require("../SharedComponents"), require("../Dock"), require("material-ui"), require("./components/PinnedItem"));
	} else {
		var mod = {
			exports: {}
		};
		factory(mod.exports, global.react, global.moment, global.SharedComponents, global.Dock, global.materialUi, global.PinnedItem);
		global.eventCard = mod.exports;
	}
})(this, function (exports, _react, _moment, _SharedComponents, _Dock, _materialUi, _PinnedItem) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _react2 = _interopRequireDefault(_react);

	var _moment2 = _interopRequireDefault(_moment);

	var _PinnedItem2 = _interopRequireDefault(_PinnedItem);

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

	var EventCard = function (_Component) {
		_inherits(EventCard, _Component);

		function EventCard(props) {
			_classCallCheck(this, EventCard);

			var _this = _possibleConstructorReturn(this, (EventCard.__proto__ || Object.getPrototypeOf(EventCard)).call(this, props));

			_this.handleEventClick = function (event) {
				var _this$props = _this.props,
				    context = _this$props.context,
				    contextualData = _this$props.contextualData;

				// If not context, load context. If in context, don't load again.
				if (!context) {
					// this.props.loadEventData(event);
					_this.props.loadProfile(event.id, event.name, "event", "profile");
				} else if (!Object.keys(contextualData).includes(event.id)) {
					// this.props.loadEventData(event);
					_this.props.loadProfile(event.id, event.name, "event", "profile");
				}
			};

			_this.loadEntityData = function (event, entity) {
				event.stopPropagation();

				switch (entity.entityType) {
					case "track":
					case "shapes":
						_this.props.loadProfile(entity.id, entity.entityData.properties.name, entity.entityType, "profile");
						break;
					case "camera":
						_this.props.loadProfile(entity.id, entity.entityData.properties.name, "camera", "profile");
						break;
					default:
						break;
				}
			};

			_this.onToggleOpen = function (e) {
				e.preventDefault();
				e.stopPropagation();
				_this.setState({ open: !_this.state.open });
			};

			_this.checkTargetStatus = function (item) {
				var mapStatus = _this.props.mapStatus;


				return mapStatus.visible && mapStatus.entities.includes(item);
			};

			_this.targetIcon = function (entity) {
				if (_this.checkTargetStatus(entity.id)) {
					return _react2.default.createElement(_SharedComponents.DockItemTarget, {
						onClick: function onClick() {
							(0, _Dock.flyToTarget)(entity.entityData.geometry, _this.props.map, _this.props.userAppState);
							_this.props.mouseEnter(_this.state.x, _this.state.y, entity.entityData.geometry, entity.id);
						},
						onMouseEnter: function onMouseEnter(x, y) {
							return _this.props.mouseEnter(x, y, entity.entityData.geometry, entity.id);
						},
						onMouseExit: function onMouseExit(x, y) {
							return _this.props.mouseLeave();
						}
					});
				} else {
					return null;
				}
			};

			_this.state = {
				open: false
			};
			return _this;
		}

		_createClass(EventCard, [{
			key: "render",
			value: function render() {
				var _this2 = this;

				var _props = this.props,
				    event = _props.event,
				    commentCount = _props.commentCount;


				var cardStyles = {
					card: {
						backgroundColor: "#1F1F21",
						marginBottom: ".75rem"
					},
					header: {
						backgroundColor: "#41454A",
						display: "flex",
						alignItems: "center"
					},
					title: {
						paddingRight: 0
					},
					subtitle: {
						fontSize: ".75rem",
						width: "100%",
						whiteSpace: "nowrap"
					},
					float: {
						float: "left"
					}
				};

				var listStyles = {
					padding: 0
				};

				var startDate = (0, _moment2.default)(event.startDate);

				var dayCount = (0, _moment2.default)().format("YYYY") === startDate.format("YYYY") ? (0, _moment2.default)().dayOfYear() - startDate.dayOfYear() + 1 : -startDate.diff((0, _moment2.default)(), "days");

				var displayDate = startDate.format("MDY") === (0, _moment2.default)().format("MDY") && startDate < (0, _moment2.default)() ? "Started " + startDate.format("h:mm A") + " Today" : startDate.format("MDY") !== (0, _moment2.default)().format("MDY") && startDate < (0, _moment2.default)() && (0, _moment2.default)().format("YYYY") !== startDate.format("YYYY") ? "Started " + startDate.format("MMM D YYYY h:mm A") : startDate < (0, _moment2.default)() ? "Started " + startDate.format("MMM D h:mm A") : "Starts " + startDate.format("MMM D h:mm A");

				_materialUi.ListItem.defaultProps.disableTouchRipple = true;
				return _react2.default.createElement(
					_materialUi.ListItem,
					{
						innerDivStyle: listStyles,
						onClick: function onClick() {
							return _this2.handleEventClick(event);
						},
						hoverColor: "none"
					},
					_react2.default.createElement(
						_materialUi.Card,
						{ id: "event-card", style: cardStyles.card },
						_react2.default.createElement(
							_materialUi.CardHeader,
							{
								title: event.name,
								subtitle: displayDate,
								subtitleStyle: cardStyles.subtitle,
								style: cardStyles.header,
								id: "event-card-header",
								className: !event.endDate ? "emergent" : startDate > (0, _moment2.default)() ? "future" : "planned",
								avatar: event.endDate ? _react2.default.createElement(
									"div",
									null,
									this.props.expandable ? _react2.default.createElement(
										"div",
										{ className: "target", onClick: function onClick(e) {
												return _this2.onToggleOpen(e);
											} },
										this.state.open ? _react2.default.createElement(
											"i",
											{ className: "material-icons", style: cardStyles.float },
											"keyboard_arrow_down"
										) : _react2.default.createElement(
											"i",
											{ className: "material-icons", style: cardStyles.float },
											"keyboard_arrow_right"
										)
									) : null,
									_react2.default.createElement(
										"i",
										{
											className: "material-icons",
											style: this.props.expandable ? { marginRight: "20px", marginLeft: "5px" } : null
										},
										"event"
									)
								) : _react2.default.createElement(
									"div",
									null,
									this.props.expandable ? _react2.default.createElement(
										"div",
										{ className: "target", onClick: function onClick(e) {
												return _this2.onToggleOpen(e);
											} },
										this.state.open ? _react2.default.createElement(
											"i",
											{ className: "material-icons", style: cardStyles.float },
											"keyboard_arrow_down"
										) : _react2.default.createElement(
											"i",
											{ className: "material-icons", style: cardStyles.float },
											"keyboard_arrow_right"
										)
									) : null,
									_react2.default.createElement(
										"i",
										{
											className: "material-icons",
											style: this.props.expandable ? { marginRight: "20px", marginLeft: "5px" } : null
										},
										"report_problem"
									)
								)
							},
							commentCount > 0 && _react2.default.createElement(
								"div",
								{ id: "comment-count" },
								_react2.default.createElement(
									"i",
									{ className: "material-icons" },
									"chat_bubble"
								),
								_react2.default.createElement(
									"span",
									null,
									commentCount
								)
							)
						),
						event.endDate && startDate < (0, _moment2.default)() && _react2.default.createElement(
							"div",
							{ id: "day-count" },
							_react2.default.createElement(
								"p",
								null,
								"Day"
							),
							_react2.default.createElement(
								"p",
								null,
								dayCount
							)
						)
					),
					this.props.expandable && this.state.open ? this.props.pinnedItems.map(function (entity) {
						// Pass down either a react component, or null, 
						// to check if the PinnedItem should rerender
						var targetIcon = _this2.targetIcon(entity);

						return _react2.default.createElement(_PinnedItem2.default, {
							entity: entity,
							targetIcon: targetIcon
						});
					}) : null
				);
			}
		}]);

		return EventCard;
	}(_react.Component);

	exports.default = EventCard;
});