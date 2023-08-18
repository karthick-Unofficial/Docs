(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(["exports", "react", "../../../../SharedComponents", "material-ui"], factory);
	} else if (typeof exports !== "undefined") {
		factory(exports, require("react"), require("../../../../SharedComponents"), require("material-ui"));
	} else {
		var mod = {
			exports: {}
		};
		factory(mod.exports, global.react, global.SharedComponents, global.materialUi);
		global.FOVItem = mod.exports;
	}
})(this, function (exports, _react, _SharedComponents, _materialUi) {
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

	var FOVItem = function FOVItem(_ref) {
		var entity = _ref.entity,
		    expanded = _ref.expanded,
		    handleLoadDetails = _ref.handleLoadDetails;

		var listStyles = {
			item: {
				display: "flex",
				alignItems: "center",
				borderBottom: "1px solid #41454A",
				borderLeft: "1px solid #41454A",
				borderRight: "1px solid #41454A",
				fontSize: 15
			},
			close: {
				marginLeft: "auto",
				width: "auto",
				height: "auto",
				padding: 0
			}
		};

		return _react2.default.createElement(
			"div",
			null,
			_react2.default.createElement(
				_materialUi.ListItem,
				{ innerDivStyle: listStyles.item },
				_react2.default.createElement(_SharedComponents.TargetingIcon, { id: entity.id, feedId: entity.feedId }),
				_react2.default.createElement(
					"div",
					{
						id: "pinned-item-name",
						className: "active-item",
						onClick: function onClick() {
							return handleLoadDetails(entity);
						}
					},
					entity.entityData.properties.name
				),
				_react2.default.createElement(
					"div",
					{ id: "pinned-item-type" },
					expanded && entity.entityData.properties.type
				)
			)
		);
	};

	exports.default = FOVItem;
});