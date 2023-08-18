(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(["exports", "react", "../EditableText", "material-ui", "material-ui-next/Table"], factory);
	} else if (typeof exports !== "undefined") {
		factory(exports, require("react"), require("../EditableText"), require("material-ui"), require("material-ui-next/Table"));
	} else {
		var mod = {
			exports: {}
		};
		factory(mod.exports, global.react, global.EditableText, global.materialUi, global.Table);
		global.TextList = mod.exports;
	}
})(this, function (exports, _react, _EditableText, _materialUi, _Table) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _react2 = _interopRequireDefault(_react);

	var _EditableText2 = _interopRequireDefault(_EditableText);

	var _Table2 = _interopRequireDefault(_Table);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : {
			default: obj
		};
	}

	var TextList = function TextList(_ref) {
		var list = _ref.list,
		    adding = _ref.adding,
		    expanded = _ref.expanded,
		    page = _ref.page,
		    rowsPerPage = _ref.rowsPerPage,
		    textProperties = _ref.textProperties,
		    deleteMode = _ref.deleteMode,
		    editableRow = _ref.editableRow,
		    emptyRows = _ref.emptyRows,
		    canEdit = _ref.canEdit,
		    listStyle = _ref.listStyle,
		    handleChangePage = _ref.handleChangePage,
		    handleChangeRowsPerPage = _ref.handleChangeRowsPerPage,
		    handleSaveUpdatedText = _ref.handleSaveUpdatedText,
		    handlePrepRowForDelete = _ref.handlePrepRowForDelete,
		    rowIndicesToDelete = _ref.rowIndicesToDelete,
		    setNewTextlistText = _ref.setNewTextlistText;

		return _react2.default.createElement(
			"div",
			{ style: { width: "100%" } },
			_react2.default.createElement(
				"div",
				{ className: "list-body-wrapper", style: { overflow: "auto" } },
				_react2.default.createElement(
					_Table2.default,
					{ style: { minWidth: 500 } },
					_react2.default.createElement(
						_Table.TableHead,
						null,
						_react2.default.createElement(
							_Table.TableRow,
							null,
							list.properties.map(function (column, index) {
								return _react2.default.createElement(
									_Table.TableCell,
									{
										key: column.label + index,
										style: {
											color: "#828283",
											fontSize: "14px",
											borderBottomColor: "#41454A"
										}
									},
									canEdit ? _react2.default.createElement(_EditableText2.default, {
										row: column,
										item: "label",
										index: index,
										color: "#828283",
										type: "text-header",
										dataType: column.type // only exists for textlist headers
										, handleSaveUpdatedText: handleSaveUpdatedText,
										expanded: expanded
									}) : _react2.default.createElement(_materialUi.TextField, {
										key: index,
										disabled: true,
										id: "testing",
										underlineDisabledStyle: {
											display: "none"
										},
										inputStyle: {
											color: "#828283",
											whiteSpace: "nowrap",
											overflow: "hidden",
											textOverflow: "ellipsis"
										},
										value: column.label,
										fullWidth: true
									})
								);
							})
						)
					),
					_react2.default.createElement(
						_Table.TableBody,
						null,
						editableRow ? _react2.default.createElement(
							_Table.TableRow,
							null,
							Object.keys(editableRow).map(function (item, index) {
								return _react2.default.createElement(
									_Table.TableCell,
									{
										key: item + index,
										style: { color: "white", borderBottomColor: "#41454A" }
									},
									_react2.default.createElement(_materialUi.TextField, {
										id: "new textlist row",
										key: index,
										value: editableRow.item,
										onChange: function onChange(e) {
											return setNewTextlistText(e, item);
										},
										fullWidth: true
									})
								);
							})
						) : null,
						list.rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(function (row, index) {
							return _react2.default.createElement(
								_Table.TableRow,
								{ key: index },
								textProperties.map(function (item, rowItemIndex) {
									return _react2.default.createElement(
										_Table.TableCell,
										{
											key: item + list.id,
											style: {
												color: "white",
												borderBottomColor: "#41454A"
											}
										},
										_react2.default.createElement(
											"div",
											{ style: listStyle.rowDeleteFlex },
											deleteMode && rowItemIndex === 0 && _react2.default.createElement(_materialUi.Checkbox, {
												onCheck: function onCheck() {
													return handlePrepRowForDelete(index);
												},
												checked: rowIndicesToDelete.includes(index),
												style: rowItemIndex === 0 ? { width: "auto" } : null
											}),
											!adding && canEdit ? _react2.default.createElement(_EditableText2.default, {
												row: row,
												item: item,
												index: index,
												type: "text",
												dataType: null,
												handleSaveUpdatedText: handleSaveUpdatedText,
												expanded: expanded
											}) : _react2.default.createElement(_materialUi.TextField, {
												id: "testing",
												key: index,
												disabled: true,
												value: row[item],
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
								})
							);
						}),
						emptyRows > 0 && _react2.default.createElement(
							_Table.TableRow,
							{ style: { height: 49 * emptyRows } },
							_react2.default.createElement(_Table.TableCell, {
								style: { borderBottomColor: "#41454A" },
								colSpan: 2
							})
						)
					)
				)
			),
			expanded ? _react2.default.createElement(_Table.TablePagination, {
				className: "pagination",
				component: "div",
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
			}) : null
		);
	};

	exports.default = TextList;
});