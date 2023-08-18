import React, { Component, Fragment } from "react";
import { default as ListMenu } from "../ListMenu/ListMenuContainer";
import moment from "moment-timezone";
import {
	ExpandLess,
	ExpandMore,
	Clear,
	MoreVert,
	Group
} from "@material-ui/icons";
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
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { Table } from "orion-components/CBComponents";
import $ from "jquery";
import _ from "lodash";
import { Translate } from "orion-components/i18n/I18nContainer";

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
		borderRight: "1px solid #828283",
		borderLeft: "1px solid #828283",
		padding: 0
	},
	body1RTL: {
		marginLeft: 8
	}
};

class ListCard extends Component {
	state = { removing: false, anchorEl: null, removals: [] };

	componentDidMount() {
		this.handleLookupDataRetrieval();
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.list.columns.length < this.props.list.columns.length) {
			this.handleLookupDataRetrieval();
		}
	}

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

	handleMenuToggle = event => {
		const { anchorEl } = this.state;

		this.setState({
			anchorEl: anchorEl ? null : event.currentTarget
		});
	};

	handleExpand = id => {
		const { setPinnedLists, pinnedLists } = this.props;
		const newPinnedLists = { ...pinnedLists };
		const list = newPinnedLists[id];
		list.expanded = !list.expanded;
		setPinnedLists(newPinnedLists);
	};

	handleRemoveRows = () => {
		const { removing } = this.state;
		this.setState({ removing: !removing, removals: [] });
	};

	handleToggleRemove = index => {
		const { removals } = this.state;
		const newRemovals = [...removals];
		if (_.includes(newRemovals, index)) {
			_.pull(newRemovals, index);
			this.setState({ removals: newRemovals });
		} else this.setState({ removals: [...newRemovals, index] });
	};

	handleConfirm = listId => {
		const { updateList, list } = this.props;
		const { removals } = this.state;
		const newRows = [...list.rows];
		_.remove(newRows, row => _.includes(removals, row.order));
		updateList(listId, { rows: newRows });
		this.handleRemoveRows();
	};

	handleAddRow = list => {
		const { handleListSelect, openDialog } = this.props;
		openDialog("rowAdd" + list.id);
		handleListSelect(list);
	};

	handleCheckboxToggle = (order, id) => {
		const { list, updateList, user } = this.props;
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

	handleNotesChange = _.debounce((text, row, column) => {
		const { list, updateList } = this.props;
		const newRows = [...list.rows];
		_.find(newRows, newRow => newRow.order === row.order).data[column.id] = text;
		updateList(list.id, { rows: newRows });
	}, 1000);

	handleSetNowDateTime = (column, row) => {
		const { list, updateList } = this.props;
		const newRows = [...list.rows];
		_.find(newRows, newRow => newRow.order === row.order).data[column.id] = moment().format();
		updateList(list.id, { rows: newRows });
	}

	render() {
		const {
			classes,
			list,
			categories,
			handleRowEdit,
			handleClear,
			handleListSelect,
			handleViewAttachments,
			user,
			pinnedLists,
			timeFormatPreference,
			dir
		} = this.props;
		const { removing, anchorEl, removals } = this.state;
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
				marginLeft: "auto"
			},
			edit: {
				marginLeft: "auto",
				color: "#828283"
			},
			clearRTL: {
				marginRight: "auto"
			},
			editRTL: {
				marginRight: "auto",
				color: "#828283"
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
						onClick={() => this.handleExpand(list.id)}
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
						style={dir == "rtl" ? styles.clearRTL : styles.clear}
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
										? () => this.handleRemoveRows(list.id)
										: () => this.handleAddRow(list)
								}
								className={classes.button}
								style={removing ? { color: "#828283" } : {}}
							>
								{removing ? <Translate value="listView.listCard.cancel" /> : <Translate value="listView.listCard.add" />}
							</Button>

							<Button
								onClick={
									removing
										? () => this.handleConfirm(list.id)
										: () => this.handleRemoveRows(list.id)
								}
								className={classes.button}
							>
								<Translate value="listView.listCard.remove" />
							</Button>
							{list.canManage && (
								<Fragment>
									<IconButton onClick={this.handleMenuToggle} style={dir == "rtl" ? styles.editRTL : styles.edit}>
										<MoreVert />
									</IconButton>

									<ListMenu
										anchorEl={anchorEl}
										handleMenuToggle={this.handleMenuToggle}
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
							defaultListPagination={this.props.defaultListPagination}
							listPaginationOptions={this.props.listPaginationOptions}
							handleChange={this.handleNotesChange}
							toggleRemove={this.handleToggleRemove}
							selectKey={"required"}
							selectAction={(e, row) => handleRowEdit(e, row, list)}
							setNowAction={(column, row) => this.handleSetNowDateTime(column, row)}
							handleCheckboxToggle={this.handleCheckboxToggle}
							disableCheckbox={false}
							hasAttachments={hasAttachments}
							attachmentAction={(e, row) => handleViewAttachments(e, row, list)}
							timeFormatPreference={timeFormatPreference}
							dir={dir}
						/>
					</CardContent>
				</Collapse>
			</Card>
		);
	}
}

export default withStyles(styles)(ListCard);
