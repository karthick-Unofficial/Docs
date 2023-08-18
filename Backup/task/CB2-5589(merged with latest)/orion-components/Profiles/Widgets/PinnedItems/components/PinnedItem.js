(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(["exports", "react", "orion-components/SharedComponents", "@material-ui/core", "@material-ui/icons"], factory);
	} else if (typeof exports !== "undefined") {
		factory(exports, require("react"), require("orion-components/SharedComponents"), require("@material-ui/core"), require("@material-ui/icons"));
	} else {
		var mod = {
			exports: {}
		};
		factory(mod.exports, global.react, global.SharedComponents, global.core, global.icons);
		global.PinnedItem = mod.exports;
	}
})(this, function (exports, _react, _SharedComponents, _core, _icons) {
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

	var PinnedItem = function PinnedItem(_ref) {
		var entity = _ref.entity,
		    handleLoadEntityDetails = _ref.handleLoadEntityDetails,
		    handleUnpin = _ref.handleUnpin,
		    expanded = _ref.expanded,
		    canRemoveItems = _ref.canRemoveItems,
		    eventEnded = _ref.eventEnded,
		    readOnly = _ref.readOnly;
		var isDeleted = entity.isDeleted;
		var id = entity.id,
		    feedId = entity.feedId,
		    entityData = entity.entityData,
		    entityType = entity.entityType;
		var _entityData$propertie = entityData.properties,
		    name = _entityData$propertie.name,
		    type = _entityData$propertie.type;

		var disabled = isDeleted || eventEnded;
		return _react2.default.createElement(
			_core.ListItem,
			{ key: id, disabled: disabled, style: { height: 48, padding: 8 } },
			!disabled && _react2.default.createElement(_SharedComponents.TargetingIcon, { feedId: feedId, id: id }),
			_react2.default.createElement(_core.ListItemText, {
				style: { padding: 0 },
				primary: _react2.default.createElement(
					_core.Button,
					{
						color: "primary",
						style: { textTransform: "none", fontSize: 16 },
						disabled: disabled,
						onClick: function onClick() {
							return handleLoadEntityDetails(entity);
						}
					},
					name
				),
				primaryTypographyProps: {
					noWrap: true
				}
			}),
			expanded && _react2.default.createElement(_core.ListItemText, {
				primary: type,
				primaryTypographyProps: {
					style: { color: "#FFF", flex: "0 0 auto" },
					noWrap: true
				}
			}),
			!eventEnded && canRemoveItems && !readOnly && _react2.default.createElement(
				_core.IconButton,
				{ onClick: function onClick() {
						return handleUnpin(entityType, id);
					} },
				_react2.default.createElement(_icons.Cancel, null)
			)
		);
	};

	exports.default = PinnedItem;
});