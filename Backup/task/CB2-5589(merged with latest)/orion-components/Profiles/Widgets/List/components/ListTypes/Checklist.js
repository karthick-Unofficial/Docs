(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(["exports", "react", "../EditableText", "material-ui", "material-ui-next/Table", "material-ui/svg-icons/toggle/radio-button-unchecked", "material-ui/svg-icons/toggle/radio-button-checked", "material-ui/svg-icons/action/check-circle", "material-ui/svg-icons/image/lens", "material-ui/styles/colors"], factory);
	} else if (typeof exports !== "undefined") {
		factory(exports, require("react"), require("../EditableText"), require("material-ui"), require("material-ui-next/Table"), require("material-ui/svg-icons/toggle/radio-button-unchecked"), require("material-ui/svg-icons/toggle/radio-button-checked"), require("material-ui/svg-icons/action/check-circle"), require("material-ui/svg-icons/image/lens"), require("material-ui/styles/colors"));
	} else {
		var mod = {
			exports: {}
		};
		factory(mod.exports, global.react, global.EditableText, global.materialUi, global.Table, global.radioButtonUnchecked, global.radioButtonChecked, global.checkCircle, global.lens, global.colors);
		global.Checklist = mod.exports;
	}
})(this, function (exports, _react, _EditableText, _materialUi, _Table, _radioButtonUnchecked, _radioButtonChecked, _checkCircle, _lens, _colors) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _react2 = _interopRequireDefault(_react);

	var _EditableText2 = _interopRequireDefault(_EditableText);

	var _Table2 = _interopRequireDefault(_Table);

	var _radioButtonUnchecked2 = _interopRequireDefault(_radioButtonUnchecked);

	var _radioButtonChecked2 = _interopRequireDefault(_radioButtonChecked);

	var _checkCircle2 = _interopRequireDefault(_checkCircle);

	var _lens2 = _interopRequireDefault(_lens);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : {
			default: obj
		};
	}

	var Checklist = function Checklist(_ref) {
		var list = _ref.list,
		    adding = _ref.adding,
		    expanded = _ref.expanded,
		    page = _ref.page,
		    rowsPerPage = _ref.rowsPerPage,
		    deleteMode = _ref.deleteMode,
		    editableRow = _ref.editableRow,
		    emptyRows = _ref.emptyRows,
		    canEdit = _ref.canEdit,
		    setNewChecklistBoxValue = _ref.setNewChecklistBoxValue,
		    setNewChecklistRowText = _ref.setNewChecklistRowText,
		    handlePrepRowForDelete = _ref.handlePrepRowForDelete,
		    rowIndicesToDelete = _ref.rowIndicesToDelete,
		    handleCheckChecklistRow = _ref.handleCheckChecklistRow,
		    handleSaveUpdatedText = _ref.handleSaveUpdatedText,
		    handleChangePage = _ref.handleChangePage,
		    handleChangeRowsPerPage = _ref.handleChangeRowsPerPage;

		/*
  	*	Important: This JSX suffers from a material UI bug. Below, three table cells have been marked with comments.
  	* 	The following must be followed:
  	*		- Table cell 1 must have a paddingRight of 5px or greater
  	*		- Table cells 2 and 3 must have paddingRight of 4px or less
  	*		
  	*	If this is not followed, when adding a new row to this checklist, the bottom border of the newly created row
  	*	will disappear. Clicking on the text field of the row below it will cause it to reappear. I've done some searching
  	*	but haven't been able to find out what causes the issue. -bcarson
  	*/

		return _react2.default.createElement(
			_Table2.default,
			null,
			_react2.default.createElement(
				_Table.TableBody,
				null,
				editableRow ? _react2.default.createElement(
					_Table.TableRow,
					null,
					_react2.default.createElement(
						_Table.TableCell,
						{
							style: { borderBottomColor: "#41454A", paddingRight: "5px" }
						},
						_react2.default.createElement(_materialUi.Checkbox, {
							checked: editableRow.checked ? editableRow.checked : false,
							onCheck: setNewChecklistBoxValue,
							checkedIcon: _react2.default.createElement(_radioButtonChecked2.default, null),
							uncheckedIcon: _react2.default.createElement(_radioButtonUnchecked2.default, null)
						})
					),
					_react2.default.createElement(
						_Table.TableCell,
						{
							padding: "none",
							style: {
								color: "white",
								borderBottomColor: "#41454A",
								paddingLeft: "0"
							}
						},
						_react2.default.createElement(_materialUi.TextField, {
							id: "new checklist row",
							placeholder: "Add text here...",
							value: editableRow.text,
							onChange: setNewChecklistRowText,
							fullWidth: true
						})
					)
				) : null,
				list.rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(function (row, index) {
					return _react2.default.createElement(
						_Table.TableRow,
						{ key: index },
						deleteMode &&
						// Table cell 2
						_react2.default.createElement(
							_Table.TableCell,
							{
								style: {
									paddingRight: "4px",
									borderBottomColor: "#41454A",
									width: "10%"
								}
							},
							_react2.default.createElement(_materialUi.Checkbox, {
								onCheck: function onCheck() {
									return handlePrepRowForDelete(index);
								},
								checked: rowIndicesToDelete.includes(index)
							})
						),
						_react2.default.createElement(
							_Table.TableCell,
							{
								style: {
									paddingRight: "4px",
									paddingLeft: deleteMode ? 0 : "",
									borderBottomColor: "#41454A",
									width: "5%"
								}
							},
							_react2.default.createElement(_materialUi.Checkbox, {
								checked: row.checked,
								iconStyle: { fill: row.checked ? _colors.greenA200 : "#828283" },
								disabled: adding ? true : !canEdit ? true : false,
								onCheck: adding ? null : function () {
									return handleCheckChecklistRow(index);
								},
								checkedIcon: _react2.default.createElement(_checkCircle2.default, null),
								uncheckedIcon: _react2.default.createElement(_lens2.default, null)
							})
						),
						_react2.default.createElement(
							_Table.TableCell,
							{
								padding: "none",
								style: { color: "white", borderBottomColor: "#41454A" }
							},
							canEdit ? _react2.default.createElement(_EditableText2.default, {
								key: index + row.title,
								row: row,
								item: "text" // Checkboxes only have a text and a checked property
								, index: index,
								type: "checklist",
								dataType: null,
								handleSaveUpdatedText: handleSaveUpdatedText,
								expanded: expanded
							}) : _react2.default.createElement(_materialUi.TextField, {
								id: "testing",
								key: index,
								disabled: true,
								value: row["text"],
								underlineDisabledStyle: {
									display: "none"
								},
								inputStyle: {
									color: "white",
									whiteSpace: "nowrap",
									overflow: "hidden",
									textOverflow: "ellipsis"
								},
								fullWidth: true
							})
						)
					);
				}),
				emptyRows > 0 && _react2.default.createElement(
					_Table.TableRow,
					{ style: { height: 49 * emptyRows } },
					_react2.default.createElement(_Table.TableCell, { style: { borderBottomColor: "#41454A" }, colSpan: 2 })
				)
			),
			expanded ? _react2.default.createElement(
				_Table.TableFooter,
				null,
				_react2.default.createElement(
					_Table.TableRow,
					{ style: { color: "white" } },
					_react2.default.createElement(_Table.TablePagination, {
						className: "pagination",
						colSpan: 4,
						count: list.rows.length,
						rowsPerPage: rowsPerPage,
						rowsPerPageOptions: rowsPerPage > 9 ? [10, 25, 50] : [],
						page: page,
						backIconButtonProps: {
							"aria-label": "Previous Page"
						},
						nextIconButtonProps: {
							"aria-label": "Next Page"
						},
						onChangePage: handleChangePage,
						onChangeRowsPerPage: handleChangeRowsPerPage
					})
				)
			) : null
		);
	};

	exports.default = Checklist;
});