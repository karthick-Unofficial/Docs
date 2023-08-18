import React, { Component } from "react";
import { Dialog } from "orion-components/CBComponents";
import {
	withWidth,
	List,
	ListItem,
	ListItemText,
	Checkbox
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { Translate } from "orion-components/i18n/I18nContainer";

import _ from "lodash";

const styles = {
	container: {
		display: "flex",
		flexDirection: "column"
	},
	root: {
		color: "#fff",
		backgroundColor: "#41454a",
		"&:hover": {
			backgroundColor: "#41454a"
		},
		padding: 0,
		marginBottom: 6
	},
	checked: {}
};

class ColumnDelete extends Component {
	state = {};

	componentDidMount() {
		const { columns } = this.props;

		_.each(columns, column => {
			if (!column.forCheckBox) {
				this.setState({ [column.id]: false });
			}
		});
	}

	handleChange = key => {
		this.setState({ [key]: !this.state[key] });
	};

	handleConfirm = () => {
		const { updateList, list } = this.props;
		const newColumns = [...list.columns];
		const newRows = [...list.rows];
		_.each(list.columns, column => {
			if (this.state[column.id]) {
				if (column.type === "checkbox") {
					_.remove(newColumns, newColumn => newColumn.id === `${column.id}_user-completed` || newColumn.id === `${column.id}_show-time`);
				}
				_.remove(newColumns, newColumn => newColumn.order === column.order);
			}
			_.each(newRows, row => {
				if (this.state[column.id]) {
					delete row.data[column.id];
				}
			});
		});

		updateList(list.id, { columns: newColumns, rows: newRows });
		this.handleClose();
	};
	handleClose = () => {
		const { handleCloseDialog, columns, dialogRef } = this.props;
		handleCloseDialog(dialogRef);
		_.each(columns, column => this.setState({ [column.id]: false }));
	};

	render() {
		const { classes, width, columns, dialog, dialogRef } = this.props;

		const styles = {
			primary: {
				color: "#fff"
			}
		};
		const filteredColumns = columns.filter(column => !column.forCheckBox);
		return (
			<Dialog
				key="column-delete"
				title={<Translate value="listView.columnDelete.dialog.title"/>}
				open={dialog === dialogRef}
				confirm={{
					label: <Translate value="listView.columnDelete.dialog.deleteSelected"/>,
					action: this.handleConfirm
				}}
				abort={{ label: <Translate value="listView.columnDelete.dialog.cancel"/>, action: this.handleClose }}
			>
				<div
					className={classes.container}
					style={{ width: width === "xs" ? "auto" : 350 }}
				>
					<List>
						{_.map(filteredColumns, column => (
							<ListItem key={column.id} className={classes.root}>
								<Checkbox
									onChange={() => this.handleChange(column.id)}
									checked={this.state[column.id]}
									style={{
										color: this.state[column.id] ? "#35b7f3" : "#828283"
									}}
								/>
								<ListItemText
									primary={column.name}
									primaryTypographyProps={{
										style: styles.primary,
										nowrap: "true"
									}}
								/>
							</ListItem>
						))}
					</List>
				</div>
			</Dialog>
		);
	}
}

export default withStyles(styles)(withWidth()(ColumnDelete));
