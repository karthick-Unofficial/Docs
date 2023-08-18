import React, { Component, Fragment } from "react";
import ListCard from "./ListCard/ListCard";
import { default as ColumnDelete } from "./ColumnDelete/ColumnDeleteContainer";
import { default as CreateList } from "../ListPanel/CreateList/CreateListContainer";
import { default as ColumnAdd } from "./ColumnAdd/ColumnAddContainer";
import { default as EditList } from "./EditList/EditListContainer";
import { RowEdit, AttachmentDialog } from "orion-components/SharedComponents";
import ListOrder from "./ListOrder/ListOrder";
import ColumnOrder from "./ColumnOrder/ColumnOrder";

import { Canvas, Dialog } from "orion-components/CBComponents";
import PropTypes from "prop-types";
import { Button } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { Translate } from "orion-components/i18n/I18nContainer";

import _ from "lodash";
import $ from "jquery";

const styles = {
	text: {
		textTransform: "none",
		color: "#35b7f3"
	}
};

class ListView extends Component {
	state = {
		anchorEl: null,
		removingFrom: null,
		selectedList: null,
		selectedRow: null
	};

	handleClear = id => {
		const { setPinnedLists, pinnedLists } = this.props;
		const newPinnedLists = { ...pinnedLists };
		const list = newPinnedLists[id];
		list.selected = false;
		list.order = null;
		setPinnedLists(newPinnedLists);
	};

	handleClearAll = () => {
		const { pinnedLists } = this.props;
		const newPinnedLists = { ...pinnedLists };
		_.each(newPinnedLists, list => {
			this.handleClear(list.id);
		});
	};

	handleListSelect = list => {
		this.setState({
			selectedList: list
		});
	};

	handleDeleteList = id => {
		const { deleteList } = this.props;
		deleteList(id);
		this.handleCloseDialog("deleteList" + id);
	};

	handleRowEdit = (e, row, list) => {
		const { openDialog } = this.props;
		this.setState({ selectedRow: row, selectedList: list });
		openDialog("rowEdit" + list.id);
	};

	handleCloseDialog = dialogRef => {
		const { closeDialog } = this.props;
		closeDialog(dialogRef);
		this.setState({ selectedList: null, selectedRow: null });
	};

	handleViewAttachments = (e, row, list) => {
		const { openDialog } = this.props;
		this.setState({ selectedRow: row, selectedList: list });
		openDialog("attachmentDialog" + list.id);
	};

	render() {
		const {
			lists,
			pinnedLists,
			categories,
			xOffset,
			classes,
			dialog,
			closeDialog,
			lookupData,
			openDialog,
			setPinnedLists,
			getLookupValues,
			updateList,
			user,
			timeFormatPreference,
			dir
		} = this.props;
		const { selectedRow, selectedList } = this.state;

		const isMobile = $(window).width() <= 1023;

		const styles = {
			lists: {
				position: "relative",
				top: 36
			},
			buttons: {
				display: "flex",
				justifyContent: "flex-end",
				position: "absolute",
				top: 0,
				right: isMobile ? 0 : 24,
				backgroundColor: "#2c2d2f",
				width: "100%",
				padding: "24px 24px 0 0",
				zIndex: 50
			},
			buttonsRTL: {
				display: "flex",
				justifyContent: "flex-end",
				position: "absolute",
				top: 0,
				left: isMobile ? 0 : 24,
				backgroundColor: "#2c2d2f",
				width: "100%",
				padding: "24px 0 0 24px",
				zIndex: 50
			}
		};

		return (
			<Canvas
				xOffset={xOffset}
				emptyMessage={<Translate value="listView.main.emptyMessage"/>}
				dir={dir}
			>
				{_.size(pinnedLists) && (
					<div style={dir == "rtl" ? styles.buttonsRTL : styles.buttons}>
						<Button
							onClick={() => openDialog("listOrder")}
							variant="text"
							className={classes.text}
						>
							<Translate value="listView.main.changeOrder"/>
						</Button>
						<Button
							onClick={this.handleClearAll}
							variant="text"
							className={classes.text}
						>
							<Translate value="listView.main.removeAll"/>
						</Button>
						{dialog === "listOrder" && (
							<ListOrder
								lists={pinnedLists}
								setPinnedLists={setPinnedLists}
								dialog={dialog}
								closeDialog={closeDialog}
								dir={dir}
							/>
						)}
					</div>
				)}
				{_.size(pinnedLists) && (
					<div style={styles.lists}>
						{_.map(_.sortBy(pinnedLists, ["order"]), list => {
							return !list.category ||
								(list.category && categories[list.category]) ? (
									<ListCard
										key={list.id}
										defaultListPagination={this.props.defaultListPagination}
										listPaginationOptions={this.props.listPaginationOptions}
										noPagination={lists[list.id].noPagination}
										list={lists[list.id]}
										categories={categories}
										openDialog={openDialog}
										lookupData={lookupData}
										getLookupValues={getLookupValues}
										handleListSelect={this.handleListSelect}
										handleRowEdit={this.handleRowEdit}
										handleClear={this.handleClear}
										pinnedLists={pinnedLists}
										setPinnedLists={setPinnedLists}
										updateList={updateList}
										handleViewAttachments={this.handleViewAttachments}
										user={user}
										timeFormatPreference={timeFormatPreference}
										dir={dir}
									/>
								) : (
									<div />
								);
						})}
					</div>
				)}

				{_.size(lists) &&
					selectedList && (
					<Fragment>
						<Dialog
							key={selectedList.id + "-delete"}
							open={dialog === "deleteList" + selectedList.id}
							title={<Translate value="listView.main.dialog.title"/>}
							textContent={<Translate value="listView.main.dialog.textContent"/>}
							confirm={{
								label: <Translate value="listView.main.dialog.delete"/>,
								action: () => this.handleDeleteList(selectedList.id)
							}}
							abort={{
								label: <Translate value="listView.main.dialog.cancel"/>,
								action: () =>
									this.handleCloseDialog("deleteList" + selectedList.id)
							}}
						/>
						<ColumnDelete
							key={selectedList.id + "-delete-column"}
							columns={_.filter(
								selectedList.columns,
								column => !column.required
							)}
							list={selectedList}
							dialogRef={"columnDelete" + selectedList.id}
							handleCloseDialog={this.handleCloseDialog}
						/>
						<CreateList
							key={selectedList.id + "-duplicate-list"}
							dialogRef={"duplicateList" + selectedList.id}
							duplicating={true}
							list={selectedList}
							dir={dir}
						/>
						<ColumnAdd
							key={selectedList.id + "-add-column"}
							dialogRef={"columnAdd" + selectedList.id}
							handleCloseDialog={this.handleCloseDialog}
							list={selectedList}
						/>
						<EditList
							key={selectedList.id + "-edit-list"}
							dialogRef={"editList" + selectedList.id}
							list={selectedList}
							lookupData={lookupData}
							handleCloseDialog={this.handleCloseDialog}
						/>
						<RowEdit
							key={selectedList.id + "-add-row"}
							list={selectedList}
							lookupData={lookupData}
							dialogRef={"rowAdd" + selectedList.id}
							adding={true}
							user={user}
							handleCloseDialog={this.handleCloseDialog}
							dialog={dialog}
							updateList={updateList}
							timeFormatPreference={timeFormatPreference}
							dir={dir}
						/>
						<RowEdit
							key={selectedList.id + "-edit-row"}
							list={selectedList}
							lookupData={lookupData}
							dialogRef={"rowEdit" + selectedList.id}
							row={selectedRow}
							adding={false}
							user={user}
							handleCloseDialog={this.handleCloseDialog}
							dialog={dialog}
							updateList={updateList}
							timeFormatPreference={timeFormatPreference}
							dir={dir}
						/>
						<ColumnOrder
							key={selectedList.id + "-column-order"}
							columns={selectedList.columns}
							list={selectedList}
							dialogRef={"columnOrder" + selectedList.id}
							dialog={dialog}
							handleCloseDialog={this.handleCloseDialog}
							updateList={updateList}
							dir={dir}
						/>
						<AttachmentDialog
							key={selectedList.id + "-attachments"}
							list={selectedList}
							dialogRef={"attachmentDialog" + selectedList.id}
							row={selectedRow}
							handleCloseDialog={this.handleCloseDialog}
							dialog={dialog}
							dir={dir}
						/>
					</Fragment>
				)}
			</Canvas>
		);
	}
}

ListView.propTypes = {
	classes: PropTypes.object.isRequired,
	xOffset: PropTypes.number,
	lists: PropTypes.object.isRequired,
	pinnedLists: PropTypes.object.isRequired,
	categories: PropTypes.object,
	dialog: PropTypes.string,
	closeDialog: PropTypes.func.isRequired,
	openDialog: PropTypes.func.isRequired,
	setPinnedLists: PropTypes.func.isRequired
};

export default withStyles(styles)(ListView);
