(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(["exports", "react", "prop-types", "@material-ui/core/styles", "@material-ui/core"], factory);
	} else if (typeof exports !== "undefined") {
		factory(exports, require("react"), require("prop-types"), require("@material-ui/core/styles"), require("@material-ui/core"));
	} else {
		var mod = {
			exports: {}
		};
		factory(mod.exports, global.react, global.propTypes, global.styles, global.core);
		global.CBDetails = mod.exports;
	}
})(this, function (exports, _react, _propTypes, _styles, _core) {
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

	var propTypes = {
		keyValuePairs: _propTypes2.default.arrayOf(_propTypes2.default.shape({
			key: _propTypes2.default.string,
			value: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.object]),
			classes: _propTypes2.default.object
		}))
	};

	var defaultProps = {
		keyValuePairs: {
			key: "",
			value: ""
		}
	};

	var styles = {
		selected: {
			backgroundColor: "rgba(149, 150, 151, 0.4) !important"
		}
	};

	var CBDetails = function CBDetails(_ref) {
		var keyValuePairs = _ref.keyValuePairs,
		    classes = _ref.classes;

		return _react2.default.createElement(
			_core.Paper,
			null,
			_react2.default.createElement(
				_core.Table,
				null,
				_react2.default.createElement(
					_core.TableBody,
					null,
					keyValuePairs.map(function (pair, index) {
						return _react2.default.createElement(
							_core.TableRow,
							{ key: pair.key + index, classes: { selected: classes.selected }, selected: index % 2 === 0 ? true : false },
							_react2.default.createElement(
								_core.TableCell,
								{ style: { padding: "4px 24px 4px 24px" } },
								pair.key
							),
							_react2.default.createElement(
								_core.TableCell,
								{ style: { padding: "4px 24px 4px 24px" } },
								pair.value
							)
						);
					})
				)
			)
		);
	};

	CBDetails.propTypes = propTypes;
	CBDetails.defaultProps = defaultProps;

	exports.default = (0, _styles.withStyles)(styles)(CBDetails);
});