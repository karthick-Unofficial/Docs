(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(["exports", "react", "orion-components/CBComponents", "@material-ui/core", "@material-ui/icons/ZoomOutMap", "orion-components/SharedComponents"], factory);
	} else if (typeof exports !== "undefined") {
		factory(exports, require("react"), require("orion-components/CBComponents"), require("@material-ui/core"), require("@material-ui/icons/ZoomOutMap"), require("orion-components/SharedComponents"));
	} else {
		var mod = {
			exports: {}
		};
		factory(mod.exports, global.react, global.CBComponents, global.core, global.ZoomOutMap, global.SharedComponents);
		global.FOVItemsWidget = mod.exports;
	}
})(this, function (exports, _react, _CBComponents, _core, _ZoomOutMap, _SharedComponents) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _react2 = _interopRequireDefault(_react);

	var _ZoomOutMap2 = _interopRequireDefault(_ZoomOutMap);

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

	var FOVItemsWidget = function (_Component) {
		_inherits(FOVItemsWidget, _Component);

		function FOVItemsWidget(props) {
			_classCallCheck(this, FOVItemsWidget);

			var _this = _possibleConstructorReturn(this, (FOVItemsWidget.__proto__ || Object.getPrototypeOf(FOVItemsWidget)).call(this, props));

			_this.handleExpand = function () {
				_this.props.selectWidget("Items in FOV");
			};

			_this.handleLoadDetails = function (item) {
				var loadProfile = _this.props.loadProfile;


				switch (item.feedId) {
					case "cameras":
						// Cameras in another camera's FOV are set as secondary context
						loadProfile(item.id, item.entityData.properties.name, "camera", "profile", "secondary");
						break;

					default:
						loadProfile(item.id, item.entityData.properties.name, item.entityType, "profile", "secondary");

						break;
				}
			};

			_this.getCategories = function () {
				var _this$props = _this.props,
				    items = _this$props.items,
				    feeds = _this$props.feeds;

				var itemIds = items.map(function (item) {
					return item.feedId;
				});
				var categories = feeds.filter(function (feed) {
					return itemIds.includes(feed.feedId);
				}).map(function (feed) {
					return { name: feed.name, id: feed.feedId };
				});
				return categories;
			};

			_this.state = {};
			return _this;
		}

		_createClass(FOVItemsWidget, [{
			key: "componentWillUnmount",
			value: function componentWillUnmount() {
				var _props = this.props,
				    contextId = _props.contextId,
				    unsubscribeFromFeed = _props.unsubscribeFromFeed,
				    subscriberRef = _props.subscriberRef,
				    isPrimary = _props.isPrimary,
				    expanded = _props.expanded;


				if (!isPrimary && !expanded) {
					unsubscribeFromFeed(contextId, "fov", subscriberRef);
					unsubscribeFromFeed(contextId, "fovItems", subscriberRef);
					unsubscribeFromFeed(contextId, "linkedEntities", subscriberRef);
				}
			}
		}, {
			key: "render",
			value: function render() {
				var _this2 = this;

				var _props2 = this.props,
				    selected = _props2.selected,
				    items = _props2.items,
				    entity = _props2.entity,
				    events = _props2.events,
				    expanded = _props2.expanded,
				    openDialog = _props2.openDialog,
				    closeDialog = _props2.closeDialog,
				    linkEntities = _props2.linkEntities,
				    unlinkEntities = _props2.unlinkEntities,
				    dialog = _props2.dialog,
				    order = _props2.order,
				    enabled = _props2.enabled,
				    widgetsExpandable = _props2.widgetsExpandable;

				return selected || !enabled ? _react2.default.createElement("div", null) : _react2.default.createElement(
					"div",
					{
						className: "widget-wrapper " + (expanded ? "expanded" : "collapsed") + " " + ("index-" + order)
					},
					!expanded && _react2.default.createElement(
						"div",
						{ className: "widget-header" },
						_react2.default.createElement(
							"div",
							{ className: "cb-font-b2" },
							"Items in FOV"
						),
						_react2.default.createElement(
							"div",
							{ className: "widget-option-button", style: { marginLeft: "auto" } },
							_react2.default.createElement(
								_core.Button,
								{ onClick: function onClick() {
										return openDialog("link-entity-dialog");
									}, style: {
										textTransform: "none"
									},
									color: "primary" },
								"Link Items"
							)
						),
						widgetsExpandable && _react2.default.createElement(
							"div",
							{ className: "widget-expand-button" },
							_react2.default.createElement(
								_core.IconButton,
								{
									style: { paddingRight: 0, width: "auto" },
									onClick: this.handleExpand
								},
								_react2.default.createElement(_ZoomOutMap2.default, null)
							)
						)
					),
					_react2.default.createElement(
						"div",
						{ className: "widget-content" },
						this.getCategories().map(function (category) {
							var id = category.id,
							    name = category.name;

							return _react2.default.createElement(
								_CBComponents.CollectionCard,
								{ key: id, name: name },
								items.filter(function (item) {
									return item.feedId === category.id;
								}).map(function (item) {
									var entityData = item.entityData,
									    feedId = item.feedId,
									    id = item.id,
									    isDeleted = item.isDeleted;
									var _entityData$propertie = entityData.properties,
									    name = _entityData$propertie.name,
									    type = _entityData$propertie.type,
									    subtype = _entityData$propertie.subtype;

									return _react2.default.createElement(_CBComponents.CollectionCardItem, {
										disabled: isDeleted,
										feedId: feedId,
										handleClick: function handleClick() {
											return _this2.handleLoadDetails(item);
										},
										handleRemove: function handleRemove() {
											return unlinkEntities([{ id: id, type: item.entityType }, { id: entity.id, type: "camera" }]);
										},
										canRemove: item.linkedWith ? true : false,
										id: id,
										key: id,
										name: name,
										type: expanded ? subtype ? subtype : type : ""
									});
								})
							);
						}),
						!!events.length && _react2.default.createElement(
							_CBComponents.CollectionCard,
							{ key: "events", name: "Events" },
							events.map(function (item) {
								var entityData = item.entityData,
								    id = item.id,
								    isDeleted = item.isDeleted;
								var _entityData$propertie2 = entityData.properties,
								    name = _entityData$propertie2.name,
								    type = _entityData$propertie2.type,
								    subtype = _entityData$propertie2.subtype;

								return _react2.default.createElement(_CBComponents.CollectionCardItem, {
									disabled: isDeleted,
									geometry: entityData.geometry,
									handleClick: function handleClick() {
										return _this2.handleLoadDetails(item);
									},
									id: id,
									key: id,
									name: name,
									type: expanded ? subtype ? subtype : type : ""
								});
							})
						)
					),
					_react2.default.createElement(_SharedComponents.LinkDialog, {
						dialog: dialog || "",
						title: "Link Item",
						closeDialog: closeDialog,
						entity: entity,
						linkEntities: linkEntities
					})
				);
			}
		}]);

		return FOVItemsWidget;
	}(_react.Component);

	exports.default = FOVItemsWidget;
});