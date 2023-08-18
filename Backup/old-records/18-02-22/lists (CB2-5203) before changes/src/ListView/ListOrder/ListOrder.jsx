import React, { Component } from "react";
import PropTypes from "prop-types";

import { Dialog } from "orion-components/CBComponents";
import { withWidth } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

import _ from "lodash";
import { Sorter } from "../../shared/components";
import { Translate } from "orion-components/i18n/I18nContainer";

const styles = {};

class ListOrder extends Component {
	constructor(props) {
		super(props);
		const { lists } = this.props;

		this.state = {
			lists: _.sortBy(_.filter(lists, list => list.selected), ["order"])
		};
	}

	handleSortEnd = lists => {
		this.setState({
			lists: lists
		});
	};

	handleClose = () => {
		const { closeDialog } = this.props;
		closeDialog("listOrder");
	};

	handleConfirm = () => {
		const { setPinnedLists } = this.props;
		const { lists } = this.state;
		const newLists = [...lists];
		_.each(newLists, (list, index) => (list.order = index));
		const orderedLists = _.keyBy(newLists, "id");
		setPinnedLists(orderedLists);

		this.handleClose();
	};

	render() {
		const { width, dialog, dir } = this.props;
		const { lists } = this.state;
		return (
			<Dialog
				open={dialog === "listOrder"}
				confirm={{
					label: <Translate value="listView.listOrder.dialog.ok"/>,
					action: this.handleConfirm
				}}
				abort={{ label: <Translate value="listView.listOrder.dialog.cancel"/>, action: this.handleClose }}
			>
				<div style={{ width: width === "xs" ? "auto" : 350 }}>
					<Sorter
						items={lists}
						sortKey="order"
						handleSortEnd={this.handleSortEnd}
						dir={dir}
					/>
				</div>
			</Dialog>
		);
	}
}

ListOrder.propTypes = {
	lists: PropTypes.object.isRequired,
	classes: PropTypes.object.isRequired,
	width: PropTypes.string.isRequired,
	dialog: PropTypes.string
};

export default withStyles(styles)(withWidth()(ListOrder));
