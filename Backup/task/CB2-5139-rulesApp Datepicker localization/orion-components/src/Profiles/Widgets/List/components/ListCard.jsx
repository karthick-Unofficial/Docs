import React, { Component, Fragment } from "react";
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
import { Translate, getTranslation } from "orion-components/i18n/I18nContainer";

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
			selectedRow: null,
			expanded: false
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

	handleExpandClick = () => {
		this.setState({ expanded: !this.state.expanded });
	};

	getAvatar = () => {
		const { list, dir } = this.props;

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

	render() {
		const {
			cardStyles,
			list,
			adding,
			checked,
			handleSelectList,
			expanded,
			canEdit,
			canRemove,
			dialog,
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
							{title}
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
						<IconButton onClick={this.handleExpandClick} style={{ color: "#FFFFFF" }}>
							{this.state.expanded ? <ExpandLess /> : <ExpandMore />}
						</IconButton>
					}
					classes={{ action: this.props.classes.headerAction }}
					avatar={
						<Checkbox
							color="primary"
							classes={{
								root: this.props.classes.checkboxRoot,
								checked: this.props.classes.checkboxChecked
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
					onChange={this.handleRenameList}
					value={title}
					autoFocus
					style={{ backgroundColor: "#41454a", height: 40 }}
					InputProps={{
						classes: {
							root: this.props.classes.inputRoot
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
						backgroundColor: this.state.expanded ? "#383D48" : "#41454A",
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
							{title}
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
						<IconButton onClick={this.handleExpandClick} style={{ color: "#FFFFFF" }}>
							{this.state.expanded ? <ExpandLess /> : <ExpandMore />}
						</IconButton>
					}
					classes={{
						action: this.props.classes.headerAction,
						avatar: dir === "rtl" ? this.props.classes.headerAvatarRTL : this.props.classes.headerAvatar
					}}
					avatar={this.getAvatar()}
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
				<Collapse in={this.state.expanded} unmountOnExit style={{
					direction: dir
				}}>
					<CardContent classes={{ root: this.props.classes.cardContentRoot }}>
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
								action: this.deleteList
							}}
							abort={{
								label: getTranslation("global.profiles.widgets.list.listCard.cancel"),
								action: () => this.toggleDialog("deleteList" + list.id)
							}}
							options={{
								onClose: () => this.toggleDialog("deleteList" + list.id),
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

export default withStyles(styles)(ListCard);