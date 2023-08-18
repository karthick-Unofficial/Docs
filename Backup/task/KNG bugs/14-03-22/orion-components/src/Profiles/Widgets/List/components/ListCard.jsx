import React, { Component, Fragment } from "react";
import { listService, eventService } from "client-app-core";
import moment from "moment-timezone";
import ListToolbar from "./ListToolbar";
import Drag from "material-ui/svg-icons/action/reorder";
import { Table } from "../../../../CBComponents";
import { RowEdit, AttachmentDialog } from "../../../../SharedComponents";
import _ from "lodash";
import {
	Card,
	CardHeader,
	CardMedia,
	Checkbox,
	FlatButton,
	Dialog,
	CircularProgress,
	TextField
} from "material-ui";
import { Translate, getTranslation } from "orion-components/i18n/I18nContainer";



class ListCard extends Component {
	constructor(props) {
		super(props);
		const { list } = this.props;
		this.state = {
			editableRow: null,
			removing: false,
			removals: [],
			showLoading: false,
			title: list.name,
			editTitle: false,
			selectedRow: null
		};
	}
	componentDidMount() {
		this.handleLookupDataRetrieval();
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.list.columns.length < this.props.list.columns.length) {
			this.handleLookupDataRetrieval();
		}
	}
	deleteList = () => {
		const { list } = this.props;
		this.setState({ showLoading: true });
		this.toggleDialog("deleteList" + list.id);
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

	deleteMode = () => {
		this.setState({
			removing: true
		});
	};

	cancelDeleteMode = () => {
		this.setState({
			removing: false,
			removals: []
		});
	};

	handleLookupDataRetrieval = () => {
		const { list, getLookupValues, lookupData } = this.props;
		const lookingUp = {};
		for (let i = 0; i < list.columns.length; i++) {
			if (list.columns[i].type === "lookup" && !lookupData[list.columns[i].lookupType] && !lookingUp[list.columns[i].lookupType]) {
				lookingUp[list.columns[i].lookupType] = true;
				getLookupValues(list.columns[i].lookupType);
			}
		}
	}

	handleKeyDown = event => {
		const { editTitle } = this.state;
		if (event.key === "Enter" && editTitle) {
			this.handleSaveNewTitle();
		}
	};

	toggleEditTitle = () => {
		const { editTitle } = this.state;
		editTitle
			? document.removeEventListener("keydown", this.handleKeyDown.bind(this))
			: document.addEventListener("keydown", this.handleKeyDown.bind(this));
		this.setState({ editTitle: !editTitle });
	};

	handleRenameList = event => {
		const title = event.target.value;
		this.setState({ title });
	};

	handleCancelRename = () => {
		const { list } = this.props;
		this.setState({
			title: list.name,
			editTitle: false
		});
		this.toggleEditTitle();
	};

	handleSaveNewTitle = () => {
		const { list } = this.props;
		const { title } = this.state;
		if (!list.targetId) {
			listService.updateList(list.id, { name: title }, (err, res) => {
				if (err) console.log(err);
			});
		} else {
			eventService.updatePinnedList(list.targetId, list.id, { name: title }, (err, res) => {
				if (err) console.log(err);
			});
		}

		this.toggleEditTitle();
	};

	handleCheckboxToggle = (order, id) => {
		const { list, user } = this.props;
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

	handleNotesChange = _.debounce((text, row, column) => {
		const { list } = this.props;
		const newRows = [...list.rows];
		_.find(newRows, newRow => newRow.order === row.order).data[column.id] = text;
		if (!list.targetId) {
			listService.updateList(list.id, { rows: newRows }, (err, res) => {
				if (err) console.log(err);
			});
		} else {
			eventService.updatePinnedList(list.targetId, list.id, { rows: newRows }, (err, res) => {
				if (err) console.log(err);
			});
		}
	}, 1000);

	handleToggleRemove = index => {
		const { removals } = this.state;
		const newRemovals = [...removals];
		if (_.includes(newRemovals, index)) {
			_.pull(newRemovals, index);
			this.setState({ removals: newRemovals });
		} else this.setState({ removals: [...newRemovals, index] });
	};

	toggleDialog = dialogRef => {
		const { dialog, openDialog, closeDialog } = this.props;
		dialog === dialogRef ? closeDialog(dialogRef) : openDialog(dialogRef);
	};

	handleConfirmRemove = listId => {
		const { list } = this.props;
		const { removals } = this.state;
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
		this.setState({ removing: false, removals: [] });
	};

	handleRowEdit = (e, row, list) => {
		this.setState({ selectedRow: row });
		this.toggleDialog("rowEdit" + list.id);
	};

	handleSetNowDateTime = (column, row, list) => {
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
	}

	handleViewAttachments = (e, row, list) => {
		this.setState({ selectedRow: row });
		this.toggleDialog("attachmentDialog" + list.id);
	};

	handleUpdateList = (listId, update) => {
		const { list } = this.props;
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

	render() {
		const {
			cardStyles,
			list,
			adding,
			checked,
			handleSelectList,
			expanded,
			updateDialog,
			canEdit,
			canRemove,
			dialog,
			sortable,
			user,
			lookupData,
			secondaryExpanded,
			dir,
			locale
		} = this.props;		
		const {
			editableRow,
			deleteMode,
			showLoading,
			editTitle,
			removals,
			removing,
			selectedRow
		} = this.state;
		const title = this.state.editTitle ? this.state.title : list.name;
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
			},
			body: {
				border: "1px solid #41454A"
			}
		};

		const listDialogActions = [
			<FlatButton
				label={getTranslation("global.profiles.widgets.list.listCard.cancel")}
				primary={true}
				style={cardStyles.addListButtons}
				onClick={() => this.toggleDialog("deleteList" + list.id)}
			/>,
			<FlatButton
				label={getTranslation("global.profiles.widgets.list.listCard.delete")}
				secondary={true}
				style={cardStyles.addListButtons}
				onClick={this.deleteList}
			/>
		];

		// Setting header based on whether or not the list should be rendered as a list template to be added,
		// or as a list that is attached to an event
		let header;
		if (adding) {
			header = (
				<CardHeader
					style={cardStyles.header}
					actAsExpander={false}
					showExpandableButton={true}
					avatar={
						// this is the only place the checkbox will work to get the correct formatting, it seems
						<Checkbox
							label={list.name}
							labelStyle={cardStyles.checkboxLabel}
							style={{ width: "auto" }}
							checked={checked}
							onCheck={handleSelectList}
						/>
					}
				/>
			);
		} else if (editTitle) {
			const textField = (
				<TextField
					id="title-field"
					fullWidth={true}
					onChange={this.handleRenameList}
					value={title}
					autoFocus
					style={{ backgroundColor: "#41454a" }}
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
					style={cardStyles.header}
					titleStyle={{
						overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", maxWidth: secondaryExpanded ? 420 : 205
					}}
					actAsExpander={false}
					showExpandableButton={true}
					title={title}
					{...(sortable ? {
						avatar: <Drag />
					} : {}
					)}
				/>
			);
		}

		const hasAttachments =
			_.size(_.filter(list.rows, row => _.size(row.attachments) > 0)) > 0;
		return list ? (
			<Card
				style={expanded ? cardStyles.cardExpanded : { marginBottom: "1rem" }}
				onExpandChange={adding ? updateDialog : null}
			>
				{header}
				<CardMedia expandable={true} style={listStyle.body}>
					{!adding && (
						<ListToolbar
							listId={list.id}
							expanded={expanded}
							editableRow={editableRow}
							deleteMode={deleteMode}
							canRemove={canRemove}
							canEdit={canEdit}
							cancelAddRow={this.cancelAddRow}
							cancelDeleteMode={this.cancelDeleteMode}
							addRow={this.addRow}
							submitAddRow={this.submitAddRow}
							startDeleteMode={this.deleteMode}
							submitDeleteMode={this.handleConfirmRemove}
							toggleDialog={this.toggleDialog}
							toggleEditTitle={this.toggleEditTitle}
							handleSaveNewTitle={this.handleSaveNewTitle}
							handleCancelRename={this.handleCancelRename}
							listStyle={listStyle}
							editTitle={editTitle}
							removing={removing}
							dir={dir}
						/>
					)}
					<Table
						columns={_.orderBy(list.columns, ["order"])}
						listPaginationOptions={this.props.listPaginationOptions}
						defaultListPagination={this.props.defaultListPagination}
						rows={list.rows}
						noPagination={list.noPagination}
						canViewNotes={canEdit}
						classes={{
							tableWrapper: "list-body-wrapper"
						}}
						removing={removing}
						removals={removals}
						handleChange={this.handleNotesChange}
						toggleRemove={this.handleToggleRemove}
						selectKey={canEdit ? "required" : null}
						selectAction={(e, row) => this.handleRowEdit(e, row, list)}
						setNowAction={(column, row) => this.handleSetNowDateTime(column, row, list)}
						handleCheckboxToggle={this.handleCheckboxToggle}
						hasAttachments={hasAttachments}
						attachmentAction={(e, row) =>
							this.handleViewAttachments(e, row, list)
						}
						disableCheckbox={!canEdit}
					/>
				</CardMedia>
				{dialog && (
					<Fragment>
						<Dialog
							open={dialog === "deleteList" + list.id}
							actions={listDialogActions}
							onRequestClose={() => this.toggleDialog("deleteList" + list.id)}
							contentStyle={{ maxWidth: 500 }}
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
							handleCloseDialog={this.toggleDialog}
							dialog={dialog}
							updateList={this.handleUpdateList}
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
							handleCloseDialog={this.toggleDialog}
							dialog={dialog}
							updateList={this.handleUpdateList}
							dir={dir}
							locale={locale}
						/>
						<AttachmentDialog
							key={list.id + "-attachments"}
							list={list}
							dialogRef={"attachmentDialog" + list.id}
							row={selectedRow}
							handleCloseDialog={this.toggleDialog}
							dialog={dialog}
							dir={dir}
						/>
					</Fragment>
				)}
			</Card>
		) : (
			<div />
		);
	}
}



export default ListCard;
