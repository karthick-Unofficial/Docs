import React, { useState, Fragment } from "react";
import ListCard from "./ListCard/ListCard";
import ColumnDelete from "./ColumnDelete/ColumnDelete";
import CreateList from "../ListPanel/CreateList/CreateList";
import ColumnAdd from "./ColumnAdd/ColumnAdd";
import EditList from "./EditList/EditList";
import { RowEdit, AttachmentDialog } from "orion-components/SharedComponents";
import ListOrder from "./ListOrder/ListOrder";
import ColumnOrder from "./ColumnOrder/ColumnOrder";

import { Canvas, Dialog } from "orion-components/CBComponents";
import PropTypes from "prop-types";
import { Button } from "@mui/material";
import { withStyles } from "@mui/styles";
import { Translate, getTranslation } from "orion-components/i18n";

import _ from "lodash";
import $ from "jquery";
import { useDispatch, useSelector } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";

import { setPinnedLists } from "./listViewActions";
import { openDialog, closeDialog } from "./listViewActions";
import {
	deleteList,
	updateList,
	getLookupValues
} from "./listViewActions";
import {
	userFeedsSelector,
	feedDataSelector
} from "orion-components/GlobalData/Selectors";

const styles = {
	text: {
		textTransform: "none",
		color: "#35b7f3"
	}
};

const ListView = ({ classes }) => {
	const State = useSelector(state => state);
	const user = useSelector(state => state.session.user.profile);
	const clientConfig = useSelector(state => state.clientConfig);
	let lists = {}; //_.pickBy(state.globalData.lists.data, list => list.name);
	let lookupData = {};
	const locale = useSelector(state => state.i18n.locale);
	const PinnedLists = useSelector(state => state.appState.persisted.pinnedLists);
	const primaryOpen = useSelector(state => state.appState.contextPanel.contextPanelData.primaryOpen);
	const xOffset = primaryOpen ? 360 : 60;
	const dialog = useSelector(state => state.appState.dialog.openDialog);
	const manageableListFeeds = userFeedsSelector(State).filter(feed => {
		return feed && feed.canView && feed.entityType === "list" && feed.ownerOrg === user.orgId
			&& user.integrations.find(int => int.intId === feed.feedId)
			&& user.integrations.find(int => int.intId === feed.feedId).permissions
			&& user.integrations.find(int => int.intId === feed.feedId).permissions.includes("manage");
	}).map((feed) => feed.feedId);

	const listFeeds = _.map(
		_.filter(
			_.map(userFeedsSelector(State)),
			feed => {
				return (feed && feed.entityType === "list");
			}
		), "feedId");

	useSelector(state => {
		if (state.globalData) {
			lookupData = state.globalData.listLookupData ?
				state.globalData.listLookupData : {};
			listFeeds.forEach(feed => {
				lists = _.merge(lists, (_.cloneDeep(feedDataSelector(state, { feedId: feed })) || {}));
			});
			lists = _.pickBy(
				lists,
				list => list.name && !list.deleted
			);
		}
	});
	// assign manage permission for each list
	if (lists) {
		Object.keys(lists).forEach(key => {
			const list = lists[key];
			list["canManage"] = manageableListFeeds.includes(list.feedId);
		});
	}

	// Filter out pinnedList state if it doesn't exist in list data
	const activePinned = _.pickBy(
		PinnedLists,
		list =>
			_.includes(_.keys(lists), list.id) &&
			!lists[list.id].deleted &&
			list.selected
	);
	const categories = useSelector(state => state.globalData.listCategories.data);
	const timeFormatPreference = useSelector(state => state.appState.global.timeFormat);
	const defaultListPagination = clientConfig.defaultListPagination;
	const listPaginationOptions = clientConfig.listPaginationOptions;
	const pinnedLists = activePinned || {};
	const dir = useSelector(state => getDir(state));

	const [selectedList, setSelectedList] = useState(null);
	const [selectedRow, setSelectedRow] = useState(null);
	const dispatch = useDispatch();

	const handleClear = id => {
		const newPinnedLists = { ...pinnedLists };
		const list = newPinnedLists[id];
		list.selected = false;
		list.order = null;
		dispatch(setPinnedLists(newPinnedLists));
	};

	const handleClearAll = () => {
		const newPinnedLists = { ...pinnedLists };
		_.each(newPinnedLists, list => {
			handleClear(list.id);
		});
	};

	const handleListSelect = (list) => {
		setSelectedList(list);
	};

	const handleDeleteList = id => {
		dispatch(deleteList(id));
		handleCloseDialog("deleteList" + id);
	};

	const handleRowEdit = (e, row, list) => {
		setSelectedRow(row);
		setSelectedList(list);
		dispatch(openDialog("rowEdit" + list.id));
	};

	const handleCloseDialog = dialogRef => {
		dispatch(closeDialog(dialogRef));
		setSelectedList(null);
		setSelectedRow(null);
	};

	const handleViewAttachments = (e, row, list) => {
		setSelectedRow(row);
		setSelectedList(list);
		dispatch(openDialog("attachmentDialog" + list.id));
	};

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
			...(dir === "rtl" && { left: isMobile ? 0 : 24, padding: "24px 0 0 24px" }),
			...(dir === "ltr" && { right: isMobile ? 0 : 24, padding: "24px 24px 0 0" }),
			backgroundColor: "#2c2d2f",
			width: "100%",
			zIndex: 50
		}
	};

	const UpdateList = (listId, rows) => {
		dispatch(updateList(listId, rows));
	};

	const setPinnedListsHandle = (Lists) => {
		dispatch(setPinnedLists(Lists));
	};

	const handleOpenDialog = (id) => {
		dispatch(openDialog(id));
	};

	const closeDialogHandle = (id) => {
		dispatch(closeDialog(id));
	};

	return (
		<Canvas
			xOffset={xOffset}
			emptyMessage={getTranslation("listView.main.emptyMessage")}
			dir={dir}
		>
			{_.size(pinnedLists) && (
				<div style={styles.buttons}>
					<Button
						onClick={() => dispatch(openDialog("listOrder"))}
						variant="text"
						className={classes.text}
					>
						<Translate value="listView.main.changeOrder" />
					</Button>
					<Button
						onClick={handleClearAll}
						variant="text"
						className={classes.text}
					>
						<Translate value="listView.main.removeAll" />
					</Button>
					{dialog === "listOrder" && (
						<ListOrder
							lists={pinnedLists}
							setPinnedLists={setPinnedListsHandle}
							dialog={dialog}
							closeDialog={closeDialogHandle}
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
								defaultListPagination={defaultListPagination}
								listPaginationOptions={listPaginationOptions}
								noPagination={lists[list.id].noPagination}
								list={lists[list.id]}
								categories={categories}
								openDialog={handleOpenDialog}
								lookupData={lookupData}
								getLookupValues={getLookupValues}
								handleListSelect={handleListSelect}
								handleRowEdit={handleRowEdit}
								handleClear={handleClear}
								pinnedLists={pinnedLists}
								setPinnedLists={setPinnedListsHandle}
								updateList={UpdateList}
								handleViewAttachments={handleViewAttachments}
								user={user}
								timeFormatPreference={timeFormatPreference}
								dir={dir}
								locale={locale}
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
							title={getTranslation("listView.main.dialog.title")}
							textContent={getTranslation("listView.main.dialog.textContent")}
							confirm={{
								label: getTranslation("listView.main.dialog.delete"),
								action: () => handleDeleteList(selectedList.id)
							}}
							abort={{
								label: getTranslation("listView.main.dialog.cancel"),
								action: () =>
									handleCloseDialog("deleteList" + selectedList.id)
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
							handleCloseDialog={handleCloseDialog}
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
							handleCloseDialog={handleCloseDialog}
							list={selectedList}
						/>
						<EditList
							key={selectedList.id + "-edit-list"}
							dialogRef={"editList" + selectedList.id}
							list={selectedList}
							lookupData={lookupData}
							handleCloseDialog={handleCloseDialog}
						/>
						<RowEdit
							key={selectedList.id + "-add-row"}
							list={selectedList}
							lookupData={lookupData}
							dialogRef={"rowAdd" + selectedList.id}
							adding={true}
							user={user}
							handleCloseDialog={handleCloseDialog}
							dialog={dialog}
							updateList={UpdateList}
							timeFormatPreference={timeFormatPreference}
							dir={dir}
							locale={locale}
						/>
						<RowEdit
							key={selectedList.id + "-edit-row"}
							list={selectedList}
							lookupData={lookupData}
							dialogRef={"rowEdit" + selectedList.id}
							row={selectedRow}
							adding={false}
							user={user}
							handleCloseDialog={handleCloseDialog}
							dialog={dialog}
							updateList={UpdateList}
							timeFormatPreference={timeFormatPreference}
							dir={dir}
							locale={locale}
						/>
						<ColumnOrder
							key={selectedList.id + "-column-order"}
							columns={selectedList.columns}
							list={selectedList}
							dialogRef={"columnOrder" + selectedList.id}
							dialog={dialog}
							handleCloseDialog={handleCloseDialog}
							updateList={UpdateList}
							dir={dir}
						/>
						<AttachmentDialog
							key={selectedList.id + "-attachments"}
							list={selectedList}
							dialogRef={"attachmentDialog" + selectedList.id}
							row={selectedRow}
							handleCloseDialog={handleCloseDialog}
							dialog={dialog}
							dir={dir}
						/>
					</Fragment>
				)}
		</Canvas>
	);
};


ListView.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ListView);
