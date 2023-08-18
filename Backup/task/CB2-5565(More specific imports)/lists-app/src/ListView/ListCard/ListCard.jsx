import React, { Fragment, useState, useEffect, useCallback } from "react";
import ListMenu from "../ListMenu/ListMenu";
import moment from "moment-timezone";
import {
	ExpandLess,
	ExpandMore,
	Clear,
	MoreVert,
	Group
} from "@mui/icons-material";
import {
	Button,
	IconButton,
	Card,
	CardActions,
	CardContent,
	Collapse,
	Typography,
	Toolbar,
	Icon
} from "@mui/material";
import { withStyles } from "@mui/styles";
import { Table } from "orion-components/CBComponents";
import $ from "jquery";
import _ from "lodash";
import { Translate } from "orion-components/i18n";
import { useDispatch } from "react-redux";

const styles = {
	root: {
		backgroundColor: "#2c2d2f",
		padding: 0,
		"&:last-child": {
			paddingBottom: 0
		}
	},
	body1: {
		marginRight: 8
	},
	button: {
		color: "#35b7f3"
	},
	toolbar: {
		borderRight: "1px solid #515151",
		borderLeft: "1px solid #515151",
		borderBottom: "1px solid #515151",
		padding: 0
	},
	body1RTL: {
		marginLeft: 8
	}
};


const ListCard = ({
	classes,
	list, updateList,
	categories,
	handleRowEdit,
	handleClear,
	handleListSelect,
	handleViewAttachments,
	user,
	pinnedLists, setPinnedLists,
	timeFormatPreference, getLookupValues, lookupData,
	openDialog,
	defaultListPagination,
	listPaginationOptions,
	dir,
	locale
}) => {
	const [removing, setRemoving] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const [removals, setRemovals] = useState([]);

	const dispatch = useDispatch();

	useEffect(() => {
		handleLookupDataRetrieval();
	}, []);


	useCallback(() => handleLookupDataRetrieval(), [
		list.columns.length
	]);

	const handleLookupDataRetrieval = () => {
		const lookingUp = {};
		for (let i = 0; i < list.columns.length; i++) {
			if (list.columns[i].type === "lookup" && !lookupData[list.columns[i].lookupType] && !lookingUp[list.columns[i].lookupType]) {
				lookingUp[list.columns[i].lookupType] = true;
				dispatch(getLookupValues(list.columns[i].lookupType));
			}
		}
	};

	const handleMenuToggle = event => {
		setAnchorEl(anchorEl ? null : event.currentTarget);
	};

	const handleExpand = id => {
		const newPinnedLists = { ...pinnedLists };
		const list = newPinnedLists[id];
		list.expanded = !list.expanded;
		setPinnedLists(newPinnedLists);
	};

	const handleRemoveRows = () => {
		setRemoving(!removing);
		setRemovals([]);
	};

	const handleToggleRemove = index => {
		const newRemovals = [...removals];
		if (_.includes(newRemovals, index)) {
			_.pull(newRemovals, index);
			setRemovals(newRemovals);
		} else setRemovals([...newRemovals, index]);
	};

	const handleConfirm = listId => {
		const newRows = [...list.rows];
		_.remove(newRows, row => _.includes(removals, row.order));
		updateList(listId, { rows: newRows });
		handleRemoveRows();
	};

	const handleAddRow = list => {
		openDialog("rowAdd" + list.id);
		handleListSelect(list);
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
		updateList(list.id, { rows: newRows });
	};

	const handleNotesChange = _.debounce((text, row, column) => {
		const newRows = [...list.rows];
		_.find(newRows, newRow => newRow.order === row.order).data[column.id] = text;
		updateList(list.id, { rows: newRows });
	}, 1000);

	const handleSetNowDateTime = (column, row) => {
		const newRows = [...list.rows];
		_.find(newRows, newRow => newRow.order === row.order).data[column.id] = moment().format();
		updateList(list.id, { rows: newRows });
	};

	const styles = {
		card: {
			margin: "12px 0 36px 0",
			borderRadius: 0
		},
		cardActions: {
			backgroundColor: "#35b7f3",
			color: "#fff",
			padding: 0
		},
		category: {
			fontStyle: "italic"
		},
		clear: {
			...(dir === "rtl" && { marginRight: "auto" }),
			...(dir === "ltr" && { marginLeft: "auto" })
		},
		edit: {
			color: "#828283",
			...(dir === "rtl" && { marginRight: "auto" }),
			...(dir === "ltr" && { marginLeft: "auto" })
		}
	};

	const isMobile = $(window).width() <= 1023;

	const hasAttachments =
		_.size(_.filter(list.rows, row => _.size(row.attachments) > 0)) > 0;

	return (
		<Card key={list.id} style={styles.card}>
			<CardActions style={styles.cardActions}>
				<IconButton
					color="inherit"
					onClick={() => handleExpand(list.id)}
				>
					{pinnedLists[list.id].expanded ? <ExpandLess /> : <ExpandMore />}
				</IconButton>
				{list.owner !== user.id && (
					<Icon style={{ margin: "0 8px" }}>
						<Group />
					</Icon>
				)}
				<Typography
					className={dir == "rtl" ? classes.body1RTL : classes.body1}
					variant="body1"
					color="inherit"
					noWrap
				>
					{list.name}
				</Typography>
				{!isMobile && (
					<Fragment>
						{list.category && categories[list.category] && (
							<Typography
								className={dir == "rtl" ? classes.body1RTL : classes.body1}
								variant="body1"
								color="inherit"
								style={styles.category}
							>
								({categories[list.category].name})
							</Typography>
						)}
						<Typography
							className={dir == "rtl" ? classes.body1RTL : classes.body1}
							variant="body1"
							color="inherit"
						>
							{
								(_.size(list.rows) === 1 ? <Translate value="listView.listCard.item" count={_.size(list.rows)} /> : <Translate value="listView.listCard.items" count={_.size(list.rows)} />)}
						</Typography>
					</Fragment>
				)}
				<IconButton
					onClick={() => handleClear(list.id)}
					style={styles.clear}
					color="inherit"
				>
					<Clear />
				</IconButton>
			</CardActions>
			<Collapse in={pinnedLists[list.id].expanded}>
				<CardContent className={classes.root}>
					<Toolbar className={classes.toolbar}>
						<Button
							onClick={
								removing
									? () => handleRemoveRows(list.id)
									: () => handleAddRow(list)
							}
							className={classes.button}
							style={removing ? { color: "#828283" } : {}}
						>
							{removing ? <Translate value="listView.listCard.cancel" /> : <Translate value="listView.listCard.add" />}
						</Button>

						<Button
							onClick={
								removing
									? () => handleConfirm(list.id)
									: () => handleRemoveRows(list.id)
							}
							className={classes.button}
						>
							<Translate value="listView.listCard.remove" />
						</Button>

						{list.canManage && (
							<Fragment>
								<IconButton onClick={handleMenuToggle} style={styles.edit}>
									<MoreVert />
								</IconButton>

								<ListMenu
									anchorEl={anchorEl}
									handleMenuToggle={handleMenuToggle}
									list={list}
									handleListSelect={handleListSelect}
								/>
							</Fragment>
						)}
					</Toolbar>
					<Table
						columns={_.orderBy(list.columns, ["order"])}
						rows={list.rows}
						canViewNotes={true}
						noPagination={list.noPagination}
						removing={removing}
						removals={removals}
						defaultListPagination={defaultListPagination}
						listPaginationOptions={listPaginationOptions}
						handleChange={handleNotesChange}
						toggleRemove={handleToggleRemove}
						selectKey={"required"}
						selectAction={(e, row) => handleRowEdit(e, row, list)}
						setNowAction={(column, row) => handleSetNowDateTime(column, row)}
						handleCheckboxToggle={handleCheckboxToggle}
						disableCheckbox={false}
						hasAttachments={hasAttachments}
						attachmentAction={(e, row) => handleViewAttachments(e, row, list)}
						timeFormatPreference={timeFormatPreference}
						dir={dir}
						locale={locale}
					/>
				</CardContent>
			</Collapse>
		</Card>
	);
};

export default withStyles(styles)(ListCard);

