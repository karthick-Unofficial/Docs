import React, { Fragment, useEffect, useState, useRef } from "react";
import { listService, eventService } from "client-app-core";
import moment from "moment-timezone";
import ListToolbar from "./ListToolbar";
import { Dialog, Table } from "../../../../CBComponents";
import { RowEdit, AttachmentDialog } from "../../../../SharedComponents";
import _ from "lodash";
import {
	Avatar,
	Card,
	CardHeader,
	CardContent,
	Checkbox,
	Collapse,
	CircularProgress,
	TextField,
	IconButton
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { ExpandMore, ExpandLess } from "@material-ui/icons";
import { ViewList, Check } from "mdi-material-ui";
import { Translate, getTranslation } from "orion-components/i18n";
import { useDispatch } from "react-redux";

const styles = {
	cardContentRoot: {
		border: "1px solid #41454A",
		padding: "0!important"
	},
	headerAction: {
		margin: 0
	},
	headerAvatar: {
		margin: "0 16px 0 0"
	},
	headerAvatarRTL: {
		margin: "0 0 0 16px"
	},
	checkboxRoot: {
		color: "#828283",
		"&$checked": {
			color: "#35b7f3!important"
		}
	},
	paddingCheckbox: {
		padding: "0 0 0 4px"
	},
	checkboxChecked: {
		color: "#35b7f3"
	},
	inputRoot: {
		height: "100%"
	}
};

const ListCard = ({
	list,
	getLookupValues,
	lookupData,
	dialog,
	openDialog,
	closeDialog,
	dir,
	cardStyles,
	adding,
	checked,
	handleSelectList,
	expanded,
	canEdit,
	canRemove,
	user,
	secondaryExpanded,
	locale,
	defaultListPagination,
	classes,
	listPaginationOptions
}) => {
	const dispatch = useDispatch();

	const [editableRow, setEditableRow] = useState(null);
	const [removing, setRemoving] = useState(false);
	const [removals, setRemovals] = useState([]);
	const [showLoading, setShowLoading] = useState(false);
	const [title, setTitle] = useState(list.name);
	const [editTitle, setEditTitle] = useState(false);
	const [selectedRow, setSelectedRow] = useState(false);
	const [expandedState, setExpandedState] = useState(false);

	useEffect(() => {
		handleLookupDataRetrieval();
	}, []);

	const usePrevious = (value) => {
		const ref = useRef();
		useEffect(() => {
			ref.current = value;
		}, [value]);
		return ref.current;
	};

	const prevList = usePrevious(list);

	useEffect(() => {
		if (prevList && prevList.columns.length < list.columns.length) {
			handleLookupDataRetrieval();
		}
	}, [list]);


	const deleteList = () => {
		setShowLoading(true);
		toggleDialog("deleteList" + list.id);
		if (!list.targetId) {
			listService.deleteList(list.id, (err, res) => {
				if (err) {
					console.log(err);
				}
			});
		} else {
			eventService.deletePinnedList(list.targetId, list.id, (err, res) => {
				if (err) {
					console.log(err);
				}
			});
		}

	};

	const deleteMode = () => {
		setRemoving(true);
	};

	const cancelDeleteMode = () => {
		setRemoving(false);
		setRemovals([]);
	};

	const handleLookupDataRetrieval = () => {
		const lookingUp = {};
		for (let i = 0; i < list.columns.length; i++) {
			if (list.columns[i].type === "lookup" && !lookupData[list.columns[i].lookupType] && !lookingUp[list.columns[i].lookupType]) {
				lookingUp[list.columns[i].lookupType] = true;
				dispatch(getLookupValues(list.columns[i].lookupType));
			}
		}
	};

	const handleKeyDown = event => {
		if (event.key === "Enter" && editTitle) {
			handleSaveNewTitle();
		}
	};

	const toggleEditTitle = () => {
		editTitle
			? document.removeEventListener("keydown", handleKeyDown())
			: document.addEventListener("keydown", handleKeyDown());
		setEditTitle(!editTitle);
	};

	const handleRenameList = event => {
		const title = event.target.value;
		setTitle(title);
	};

	const handleCancelRename = () => {
		setTitle(list.name);
		setEditTitle(false);
		toggleEditTitle();
	};

	const handleSaveNewTitle = () => {
		if (!list.targetId) {
			listService.updateList(list.id, { name: title }, (err, res) => {
				if (err) console.log(err);
			});
		} else {
			eventService.updatePinnedList(list.targetId, list.id, { name: title }, (err, res) => {
				if (err) console.log(err);
			});
		}
		toggleEditTitle();
	};

	const handleCheckboxToggle = (order, id) => {
		const newRows = [...list.rows];
		const rowData = _.find(newRows, row => row.order === order).data;
		const toggled = _.find(newRows, row => row.order === order).data[id];
		if (`${id}_user-completed` in rowData) {
			if (toggled) {
				_.find(newRows, row => row.order === order).data[id + "_user-completed"] = "";
			} else {
				_.find(newRows, row => row.order === order).data[id + "_user-completed"] = user.name;
			}

		}
		if (`${id}_show-time` in rowData) {
			if (toggled) {
				_.find(newRows, row => row.order === order).data[id + "_show-time"] = "";
			} else {
				_.find(newRows, row => row.order === order).data[id + "_show-time"] = moment();
			}

		}
		_.find(newRows, row => row.order === order).data[id] = !toggled;
		if (!list.targetId) {
			listService.updateList(list.id, { rows: newRows }, (err, res) => {
				if (err) console.log(err);
			});
		} else {
			eventService.updatePinnedList(list.targetId, list.id, { rows: newRows }, (err, res) => {
				if (err) console.log(err);
			});
		}

	};

	// const handleNotesChange = _.debounce((text, row, column) => {
	// 	const newRows = [...list.rows];
	// 	_.find(newRows, newRow => newRow.order === row.order).data[column.id] = text;
	// 	if (!list.targetId) {
	// 		listService.updateList(list.id, { rows: newRows }, (err, res) => {
	// 			if (err) console.log(err);
	// 		});
	// 	} else {
	// 		eventService.updatePinnedList(list.targetId, list.id, { rows: newRows }, (err, res) => {
	// 			if (err) console.log(err);
	// 		});
	// 	}
	// }, 1000);

	const handleNotesChange = () => { };

	const handleToggleRemove = index => {
		const newRemovals = [...removals];
		if (_.includes(newRemovals, index)) {
			_.pull(newRemovals, index);
			setRemovals(newRemovals);
		} else setRemovals([...newRemovals, index]);
	};

	const toggleDialog = dialogRef => {
		dialog === dialogRef ? dispatch(closeDialog(dialogRef)) : dispatch(openDialog(dialogRef));
	};

	const handleConfirmRemove = listId => {
		const newRows = [...list.rows];
		_.remove(newRows, row => _.includes(removals, row.order));
		if (!list.targetId) {
			listService.updateList(listId, { rows: newRows }, (err, res) => {
				if (err) console.log(err);
			});
		} else {
			eventService.updatePinnedList(list.targetId, list.id, { rows: newRows }, (err, res) => {
				if (err) console.log(err);
			});
		}
		setRemoving(false);
		setRemovals([]);
	};

	const handleRowEdit = (e, row, list) => {
		setSelectedRow(row);
		toggleDialog("rowEdit" + list.id);
	};

	const handleSetNowDateTime = (column, row, list) => {
		const newRows = [...list.rows];
		_.find(newRows, newRow => newRow.order === row.order).data[column.id] = moment();
		if (!list.targetId) {
			listService.updateList(list.id, { rows: newRows }, (err, res) => {
				if (err) console.log(err);
			});
		} else {
			eventService.updatePinnedList(list.targetId, list.id, { rows: newRows }, (err, res) => {
				if (err) console.log(err);
			});
		}
	};

	const handleViewAttachments = (e, row, list) => {
		setSelectedRow(row);
		toggleDialog("attachmentDialog" + list.id);
	};

	const handleUpdateList = (listId, update) => {
		if (!list.targetId) {
			listService.updateList(listId, update, (err, res) => {
				if (err) console.log(err);
			});
		} else {
			eventService.updatePinnedList(list.targetId, list.id, update, (err, res) => {
				if (err) console.log(err);
			});
		}
	};

	const handleExpandClick = () => {
		setExpandedState(!expandedState);
	};

	const getAvatar = () => {

		const avatarStyle = {
			backgroundColor: "#677588",
			border: "1px solid #FFFFFF",
			color: "#FFFFFF"
		};

		if (list.columns && list.columns.length > 0 && list.rows && list.rows.length > 0 && list.columns.sort(col => col.order)[0].type === "checkbox") {
			const firstColumn = list.columns.sort(col => col.order)[0];
			if (firstColumn.type === "checkbox") {
				const numberIncomplete = list.rows.filter(row => {
					return row.data && row.data[firstColumn.id] === false;
				}).length;

				if (numberIncomplete > 0) {
					return (
						<Avatar style={avatarStyle}>
							{numberIncomplete}
						</Avatar>
					);
				}
				else {
					avatarStyle.backgroundColor = "#61BE49";
					return (
						<Avatar style={avatarStyle}>
							<Check />
						</Avatar>
					);
				}
			}
		}

		return (
			<Avatar style={avatarStyle}>
				<ViewList />
			</Avatar>
		);
	};

	const Title = editTitle ? title : list.name;
	const subheader = list.categoryRef ? list.categoryRef.name : "";
	const listStyle = {
		spacer: {
			flex: "1 1 100%"
		},
		buttons: {
			flex: "0 0 auto"
		},
		rowDeleteFlex: {
			color: "white",
			display: "flex",
			alignItems: "center",
			maxWidth: "100%",
			minWidth: 70,
			justifyContent: "flex-start"
		}
	};

	// Setting header based on whether or not the list should be rendered as a list template to be added,
	// or as a list that is attached to an event
	let header;
	if (adding) {
		header = (
			<CardHeader
				style={{ ...cardStyles.header }}
				title={
					<p style={{
						fontSize: 14,
						color: "#FFFFFF",
						overflow: "hidden",
						whiteSpace: "nowrap",
						textOverflow: "ellipsis",
						maxWidth: secondaryExpanded ? 420 : 205
					}}>
						{Title}
					</p>
				}
				subheader={
					<p style={{
						overflow: "hidden",
						whiteSpace: "nowrap",
						textOverflow: "ellipsis",
						maxWidth: secondaryExpanded ? 420 : 205
					}}>
						{subheader}
					</p>
				}
				action={
					<IconButton onClick={handleExpandClick} style={{ color: "#FFFFFF" }}>
						{expandedState ? <ExpandLess /> : <ExpandMore />}
					</IconButton>
				}
				classes={{ action: classes.headerAction }}
				avatar={
					<Checkbox
						color="primary"
						classes={{
							root: classes.checkboxRoot,
							checked: classes.checkboxChecked
						}}
						checked={checked}
						onChange={() => { handleSelectList(list.id); }}
					/>
				}
			/>
		);
	} else if (editTitle) {
		const textField = (
			<TextField
				id="title-field"
				fullWidth={true}
				onChange={handleRenameList}
				value={Title}
				autoFocus
				style={{ backgroundColor: "#41454a", height: 40 }}
				InputProps={{
					classes: {
						root: classes.inputRoot
					}
				}}
			/>
		);
		header = (
			<CardHeader
				style={{ ...cardStyles.header, paddingTop: 0, paddingBottom: 0 }}
				actAsExpander={false}
				showExpandableButton={true}
				title={textField}
			/>
		);
	} else {
		header = (
			<CardHeader
				style={{
					...cardStyles.header,
					backgroundColor: expandedState ? "#383D48" : "#41454A",
					direction: dir
				}}
				title={
					<p style={{
						fontSize: 14,
						color: "#FFFFFF",
						overflow: "hidden",
						whiteSpace: "nowrap",
						textOverflow: "ellipsis",
						maxWidth: secondaryExpanded ? 420 : 205
					}}>
						{Title}
					</p>
				}
				subheader={
					<p style={{
						overflow: "hidden",
						whiteSpace: "nowrap",
						textOverflow: "ellipsis",
						maxWidth: secondaryExpanded ? 420 : 205
					}}>
						{subheader}
					</p>
				}
				action={
					<IconButton onClick={handleExpandClick} style={{ color: "#FFFFFF" }}>
						{expandedState ? <ExpandLess /> : <ExpandMore />}
					</IconButton>
				}
				classes={{
					action: classes.headerAction,
					avatar: dir === "rtl" ? classes.headerAvatarRTL : classes.headerAvatar
				}}
				avatar={getAvatar()}
			/>
		);
	}

	const hasAttachments =
		_.size(_.filter(list.rows, row => _.size(row.attachments) > 0)) > 0;
	return list ? (
		<Card
			style={{ marginBottom: ".5rem" }}
			key={`list-card-${list.id}`}
		>
			{header}
			<Collapse in={expandedState} unmountOnExit style={{
				direction: dir
			}}>
				<CardContent classes={{ root: classes.cardContentRoot }}>
					{!adding && (
						<ListToolbar
							listId={list.id}
							expanded={expandedState}
							editableRow={editableRow}
							deleteMode={deleteMode}
							canRemove={canRemove}
							canEdit={canEdit}
							//cancelAddRow={cancelAddRow}
							cancelDeleteMode={cancelDeleteMode}
							//addRow={addRow}
							//submitAddRow={submitAddRow}
							startDeleteMode={deleteMode}
							submitDeleteMode={handleConfirmRemove}
							toggleDialog={toggleDialog}
							toggleEditTitle={toggleEditTitle}
							handleSaveNewTitle={handleSaveNewTitle}
							handleCancelRename={handleCancelRename}
							listStyle={listStyle}
							editTitle={editTitle}
							removing={removing}
							dir={dir}
						/>
					)}
					<Table
						columns={_.orderBy(list.columns, ["order"])}
						listPaginationOptions={listPaginationOptions}
						defaultListPagination={defaultListPagination}
						rows={list.rows}
						noPagination={list.noPagination}
						canViewNotes={canEdit}
						classes={{
							tableWrapper: "list-body-wrapper"
						}}
						removing={removing}
						removals={removals}
						handleChange={handleNotesChange}
						toggleRemove={handleToggleRemove}
						selectKey={canEdit ? "required" : null}
						selectAction={(e, row) => handleRowEdit(e, row, list)}
						setNowAction={(column, row) => handleSetNowDateTime(column, row, list)}
						handleCheckboxToggle={handleCheckboxToggle}
						hasAttachments={hasAttachments}
						attachmentAction={(e, row) =>
							handleViewAttachments(e, row, list)
						}
						disableCheckbox={!canEdit}
						dir={dir}
					/>
				</CardContent>
			</Collapse>
			{dialog && (
				<Fragment>
					<Dialog
						open={dialog === "deleteList" + list.id}
						confirm={{
							label: getTranslation("global.profiles.widgets.list.listCard.delete"),
							action: deleteList
						}}
						abort={{
							label: getTranslation("global.profiles.widgets.list.listCard.cancel"),
							action: () => toggleDialog("deleteList" + list.id)
						}}
						options={{
							onClose: () => toggleDialog("deleteList" + list.id),
							maxWidth: "md"
						}}
						dir={dir}
					>
						<p className="dialog-text">
							<Translate value="global.profiles.widgets.list.listCard.confirmationText" />
						</p>
						{showLoading ? (
							<CircularProgress size={60} thickness={5} />
						) : null}
					</Dialog>
					<RowEdit
						key={list.id + "-add-row"}
						list={list}
						dialogRef={"rowAdd" + list.id}
						adding={true}
						lookupData={lookupData}
						user={user}
						handleCloseDialog={toggleDialog}
						dialog={dialog}
						updateList={handleUpdateList}
						dir={dir}
						locale={locale}
					/>
					<RowEdit
						key={list.id + "-edit-row"}
						list={list}
						lookupData={lookupData}
						user={user}
						dialogRef={"rowEdit" + list.id}
						row={selectedRow}
						adding={false}
						handleCloseDialog={toggleDialog}
						dialog={dialog}
						updateList={handleUpdateList}
						dir={dir}
						locale={locale}
					/>
					<AttachmentDialog
						key={list.id + "-attachments"}
						list={list}
						dialogRef={"attachmentDialog" + list.id}
						row={selectedRow}
						handleCloseDialog={toggleDialog}
						dialog={dialog}
						dir={dir}
					/>
				</Fragment>
			)}
		</Card>
	) : (
		<div />
	);
};

export default withStyles(styles)(ListCard);