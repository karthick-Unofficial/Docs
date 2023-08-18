import React, { Component } from "react";
import PropTypes from "prop-types";
import { Dialog } from "orion-components/CBComponents";
import { Sorter } from "../../shared/components";
import { withWidth } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import _ from "lodash";
import { Translate } from "orion-components/i18n/I18nContainer";

const styles = {};

class ColumnOrder extends Component {
	constructor(props) {
		super(props);
		const { columns } = this.props;

		this.state = {
			columns: _.sortBy(columns, ["order"])
		};
	}

	handleSortEnd = columns => {
		this.setState({
			columns: columns
		});
	};

	handleClose = () => {
		const { handleCloseDialog, dialogRef } = this.props;
		handleCloseDialog(dialogRef);
	};

	handleConfirm = () => {
		const { list, updateList } = this.props;
		const { columns } = this.state;
		const newColumns = [...columns];
		_.each(newColumns, (column, index) => (column.order = index));
		updateList(list.id, { columns: newColumns });
		this.handleClose();
	};

	render() {
		const { width, dialog, dialogRef, dir } = this.props;
		const { columns } = this.state;
		return (
			<Dialog
				open={dialog === dialogRef}
				confirm={{
					label: <Translate value="listView.columnOrder.dialog.ok"/>,
					action: this.handleConfirm
				}}
				abort={{ label: <Translate value="listView.columnOrder.dialog.cancel"/>, action: this.handleClose }}
			>
				<div style={{ width: width === "xs" ? "auto" : 350 }}>
					<Sorter
						items={columns}
						sortKey="order"
						handleSortEnd={this.handleSortEnd}
						dir={dir}
					/>
				</div>
			</Dialog>
		);
	}
}

ColumnOrder.propTypes = {
	classes: PropTypes.object.isRequired,
	width: PropTypes.string.isRequired,
	dialog: PropTypes.string,
	dialogRef: PropTypes.string.isRequired
};

export default withStyles(styles)(withWidth()(ColumnOrder));
