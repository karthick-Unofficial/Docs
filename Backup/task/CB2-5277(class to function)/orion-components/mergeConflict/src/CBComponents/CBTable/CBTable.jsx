import React, { useState } from "react";
import PropTypes from "prop-types";

import {
	Table,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
	TablePagination,
	TableFooter,
	Checkbox,
	Button
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { CBCheckbox } from "../index";
import classNames from "classnames";
import _ from "lodash";
import { timeConversion } from "client-app-core";
import { Translate, getTranslation, getLocalize } from "orion-components/i18n/I18nContainer";

const headStyles = {
	head: {
		color: "#828283",
		border: "none",
		lineHeight: 1,
		padding: "8px 16px",
		whiteSpace: "nowrap"
	},
	headRTL: {
		color: "#828283",
		border: "none",
		lineHeight: 1,
		padding: "8px 16px",
		whiteSpace: "nowrap",
		textAlign: "right"
	},
	paddingCheckbox: {
		padding: "0 0 0 4px"
	},
	paddingCheckboxRLT: {
		padding: "0 4px 0 0"
	},
	tableCellRoot: {
		padding: 8
	}
};

const headPropTypes = {
	classes: PropTypes.object.isRequired,
	columns: PropTypes.array.isRequired,
	removing: PropTypes.bool,
	hasAttachments: PropTypes.bool
};

const headDefaultProps = {
	removing: false,
	hasAttachments: false
};

let CBTableHead = ({ classes, columns, removing, hasAttachments, dir }) => {
	return (
		<TableHead>
			<TableRow>
				{removing && (
					<TableCell className={classes.head} variant="head" padding="none" style={dir && dir == "rtl" ? { textAlign: "right" } : {}} />
				)}
				{_.map(columns, column => (
					<TableCell
						variant="head"
						key={column.id}
						classes={{
							head: dir === "rtl" ? classes.headRTL : classes.head,
							paddingCheckbox: dir === "rtl" ? classes.paddingCheckboxRLT : classes.paddingCheckbox
						}}
						padding={column.type === "checkbox" ? "checkbox" : "normal"}
					>
						{column.name}
					</TableCell>
				))}
				{hasAttachments && (
					<TableCell
						variant="head"
						id="attachments"
						classes={{ 
							head: dir === "rtl" ? classes.headRTL : classes.head
						}}
						padding="normal"
					>
						<Translate value="global.CBComponents.CBTable.attachments" />
					</TableCell>
				)}
			</TableRow>
		</TableHead>
	);
};

CBTableHead.propTypes = headPropTypes;
CBTableHead.defaultProps = headDefaultProps;

CBTableHead = withStyles(headStyles)(CBTableHead);

const tableRowStyles = {
	body: {
		color: "#FFFFFF",
		padding: "8px 16px",
		whiteSpace: "nowrap"
	},
	bodyRTL: {
		color: "#FFFFFF",
		padding: "8px 16px",
		whiteSpace: "nowrap",
		textAlign: "right"
	},
	root: {
		color: "#828283",
		"&$checked": {
			color: "#35b7f3"
		}
	},
	checked: {},
	text: {
		textTransform: "none",
		color: "#35b7f3",
		padding: 0,
		textAlign: "left",
		"&:hover": {
			backgroundColor: "transparent"
		}
	},
	label: {
		justifyContent: "flex-start"
	},
	textRTL: {
		textTransform: "none",
		color: "#35b7f3",
		padding: 0,
		textAlign: "right",
		"&:hover": {
			backgroundColor: "transparent"
		}
	},
	paddingCheckbox: {
		padding: "0 0 0 4px"
	},
	paddingCheckboxRTL: {
		padding: "0 4px 0 0"
	}
};

const tableRowPropTypes = {
	classes: PropTypes.object.isRequired,
	columns: PropTypes.array.isRequired,
	row: PropTypes.object.isRequired,
	removing: PropTypes.bool,
	selectKey: PropTypes.string,
	selectAction: PropTypes.func,
	handleCheckboxToggle: PropTypes.func,
	handleLookupQuery: PropTypes.func,
	toggleRemove: PropTypes.func,
	removals: PropTypes.array,
	attachmentAction: PropTypes.func,
	hasAttachments: PropTypes.bool,
	disableCheckbox: PropTypes.bool,
	timeFormatPreference: PropTypes.string
};

const tableRowDefaultProps = {
	removing: false,
	selectKey: "",
	selectAction: () => { },
	handleCheckboxToggle: () => { },
	toggleRemove: () => { },
	removals: [],
	attachmentAction: () => { },
	hasAttachments: false,
	disableCheckbox: false,
	timeFormatPreference: "12-hour"
};

let CBTableRow = ({
	canViewNotes,
	classes,
	columns,
	row,
	handleChange,
	removing,
	selectKey,
	selectAction,
	setNowAction,
	handleCheckboxToggle,
	toggleRemove,
	removals,
	attachmentAction,
	hasAttachments,
	disableCheckbox,
	timeFormatPreference,
	dir
}) => {

	return (
		<TableRow>
			{removing && (
				<TableCell
					className={classes.body}
					padding="none"
					style={{
						padding: 0,
						width: 42,
						textAlign: dir && dir == "rtl" ? "right" : "left"
					}}>
					<Checkbox
						color="primary"
						classes={{
							root: classes.root,
							checked: classes.checked
						}}
						checked={_.includes(removals, row.order)}
						onChange={() => toggleRemove(row.order)}
					/>
				</TableCell>
			)}
			{_.map(columns, column => {
				const selectable = column[selectKey];
				// TODO: Add a time display config or a format prop on column
				let value = null;
				switch (column.type) {
					case "date-time":
						if (!row.data[column.id]) value = "";
						else if (column.includeTime) {
							value = timeConversion.convertToUserTime(row.data[column.id], `full_${timeFormatPreference}`);
							value = getLocalize(`${value.split(" ")[0]} ${value.split(" ")[1]} ${value.split(" ")[2]}`, "global.date.full") + value.split(" ")[3];
						}
						else if (!column.includeTime) {
							value = timeConversion.convertToUserTime(row.data[column.id], "MM/DD/YYYY");
							value = getLocalize(value, "global.date.mid");
						}
						break;
					case "choice":
						{
							const selectedOption = _.find(
								column.options,
								option => option.id === row.data[column.id]
							);
							value = selectedOption ? selectedOption.value : "";
						}
						break;
					case "notes":
						value = row.data[column.id] || "";
						break;
					case "lookup":
						value = row.data[column.id] ? row.data[column.id].name : "";
						break;
					default:
						value = row.data[column.id];
						break;
				}

				const tableCellStyle = {
					textAlign: column.type === "checkbox" ? "center" : dir && dir === "rtl" ? "right" : undefined
				};

				return (
					<TableCell
						variant="body"
						color="primary"
						classes={{
							body: dir === "rtl" ? classes.bodyRTL : classes.body,
							paddingCheckbox: dir === "rtl" ? classes.paddingCheckboxRTL : classes.paddingCheckbox
						}}
						key={column.id}
						padding={_.isBoolean(value) ? "checkbox" : "normal"}
						style={tableCellStyle}
					>
						{_.isBoolean(value) ? (
							<CBCheckbox
								checked={value}
								handleChange={() => handleCheckboxToggle(row.order, column.id)}
								disableCheckbox={disableCheckbox}
							/>
						) : selectable ? (
							<Button
								onClick={e => selectAction(e, row)}
								variant="text"
								className={classNames(dir == "rtl" ? classes.textRTL : classes.text, dir && classes.label)}
								disableFocusRipple={true}
								disableRipple={true}
							>
								{value}
							</Button>
						) : column.type === "notes" ? (
							<Button
								onClick={e => selectAction(e, row)}
								variant="text"
								disabled={!canViewNotes}
								className={classNames(dir == "rtl" ? classes.textRTL : classes.text, dir && classes.label)}
								disableFocusRipple={true}
								disableRipple={true}
							>
								{getTranslation("global.CBComponents.CBTable.viewNotes")}
							</Button>
						) : column.type === "date-time" && !column.forCheckBox && !value ? (
							<Button
								onClick={() => setNowAction(column, row)}
								variant="text"
								disabled={!canViewNotes}
								className={classNames(dir == "rtl" ? classes.textRTL : classes.text, dir && classes.label)}
								disableFocusRipple={true}
								disableRipple={true}
							>
								{getTranslation("global.CBComponents.CBTable.setNow")}
							</Button>
						) : (
							value
						)}
					</TableCell>
				);
			})}
			{_.size(row.attachments) > 0 ? (
				<TableCell
					variant="body"
					color="primary"
					className={classes.body}
					key="attachments"
					padding="normal"
					style={dir && dir == "rtl" ? { textAlign: "right" } : {}}
				>
					<Button
						onClick={e => attachmentAction(e, row)}
						variant="text"
						className={classNames(dir == "rtl" ? classes.textRTL : classes.text, dir && classes.label)}
						disableFocusRipple={true}
						disableRipple={true}
					>
						Attachments
					</Button>
				</TableCell>
			) : hasAttachments && _.size(row.attachments) === 0 ? (
				<TableCell
					variant="body"
					color="primary"
					className={classes.body}
					key="attachments"
					padding="normal"
					style={dir && dir == "rtl" ? { textAlign: "right" } : {}}
				/>
			) : (
				null
			)}
		</TableRow>
	);
};

CBTableRow.propTypes = tableRowPropTypes;
CBTableRow.defaultProps = tableRowDefaultProps;

CBTableRow = withStyles(tableRowStyles)(CBTableRow);

const paginationStyles = {
	root: {
		width: "100%"
	}
};

const paginationPropTypes = {
	classes: PropTypes.object.isRequired,
	count: PropTypes.number.isRequired,
	rowsPerPage: PropTypes.number.isRequired,
	page: PropTypes.number.isRequired,
	handleChangePage: PropTypes.func.isRequired,
	handleChangeRowsPerPage: PropTypes.func.isRequired
};

let CBTablePagination = ({
	classes,
	count,
	rowsPerPage,
	rowsPerPageOptions,
	page,
	handleChangePage,
	handleChangeRowsPerPage
}) => {
	return (
		<TablePagination
			className={classNames(classes.root, "cb-table-pagination")}
			count={count}
			rowsPerPage={rowsPerPage}
			page={page}
			onPageChange={handleChangePage}
			onRowsPerPageChange={handleChangeRowsPerPage}
			{
				...(rowsPerPageOptions && rowsPerPageOptions.length ?
					{
						rowsPerPageOptions
					} :
					{}
				)
			}
			style={{ direction: "ltr" }}
		/>
	);
};

CBTablePagination.propTypes = paginationPropTypes;

CBTablePagination = withStyles(paginationStyles)(CBTablePagination);

const tableStyles = {
	root: {
		width: "100%"
	},
	body: {
		borderBottom: "1px solid #515151"
	},
	tableWrapper: {
		width: "100%",
		overflowX: "scroll",
		borderLeft: "1px solid #515151",
		borderRight: "1px solid #515151"
	}
};

const tablePropTypes = {
	classes: PropTypes.object.isRequired,
	rows: PropTypes.array,
	columns: PropTypes.array.isRequired,
	removing: PropTypes.bool,
	selectKey: PropTypes.string,
	selectAction: PropTypes.func,
	setNowAction: PropTypes.func,
	handleCheckboxToggle: PropTypes.func,
	toggleRemove: PropTypes.func,
	removals: PropTypes.array,
	attachmentAction: PropTypes.func,
	hasAttachments: PropTypes.bool,
	disableCheckbox: PropTypes.bool,
	timeFormatPreference: PropTypes.string
};

const tableDefaultProps = {
	rows: [],
	removing: false,
	selectKey: "",
	selectAction: () => { },
	setNowAction: () => { },
	handleCheckboxToggle: () => { },
	toggleRemove: () => { },
	removals: [],
	attachmentAction: () => { },
	hasAttachments: false,
	disableCheckbox: false,
	timeFormatPreference: "12-hour"
};

const CBTable = ({
	listPaginationOptions,
	defaultListPagination,
	canViewNotes,
	classes,
	rows,
	columns,
	handleChange,
	removing,
	selectKey,
	setNowAction,
	selectAction,
	noPagination,
	handleCheckboxToggle,
	handleLookupQuery,
	toggleRemove,
	removals,
	hasAttachments,
	attachmentAction,
	disableCheckbox,
	timeFormatPreference,
	dir
}) => {
	const [page, setPage] = useState(0);
	const [rowsPerPageOptions, setRowsPerPageOptions] = useState(listPaginationOptions);
	const [rowsPerPage, setRowsPerPage] = useState((defaultListPagination || defaultListPagination === 0) && listPaginationOptions && listPaginationOptions.includes(defaultListPagination) ? defaultListPagination
		: listPaginationOptions && listPaginationOptions.length ? listPaginationOptions[0] : 10);

	const handleChangePage = (event, page) => {
		setPage(page);
	};

	const handleChangeRowsPerPage = event => {
		setRowsPerPage(event.target.value);
	};

	return (
		<div className={classes.tableWrapper}>
			<Table className={classes.root}>
				<CBTableHead
					columns={columns}
					removing={removing}
					hasAttachments={hasAttachments}
					dir={dir}
				/>
				{_.size(rows) ? (
					<TableBody>
						{_.map(
							noPagination ? rows :
								_.slice(
									rows,
									page * rowsPerPage,
									page * rowsPerPage + rowsPerPage
								),
							(row, index) => (
								<CBTableRow
									key={index}
									columns={columns}
									row={row}
									canViewNotes={canViewNotes}
									handleChange={handleChange}
									handleLookupQuery={handleLookupQuery}
									removing={removing}
									selectKey={selectKey}
									setNowAction={setNowAction}
									selectAction={selectAction}
									handleCheckboxToggle={handleCheckboxToggle}
									toggleRemove={toggleRemove}
									removals={removals}
									attachmentAction={attachmentAction}
									hasAttachments={hasAttachments}
									disableCheckbox={disableCheckbox}
									timeFormatPreference={timeFormatPreference}
									dir={dir}
								/>
							)
						)}
					</TableBody>
				) : (
					null
				)}
				{!noPagination && (
					<TableFooter>
						<TableRow>
							<CBTablePagination
								count={rows ? rows.length : 0}
								rowsPerPage={rowsPerPage}
								rowsPerPageOptions={rowsPerPageOptions}
								page={page}
								handleChangePage={handleChangePage}
								handleChangeRowsPerPage={handleChangeRowsPerPage}
							/>
						</TableRow>
					</TableFooter>
				)}
			</Table>
		</div>

	);
};

CBTable.propTypes = tablePropTypes;
CBTable.defaultProps = tableDefaultProps;

export default withStyles(tableStyles)(CBTable);
