import React, { useState } from "react";
import PropTypes from "prop-types";

import { Dialog } from "orion-components/CBComponents";

import { withStyles, useTheme } from "@mui/styles";
import { useMediaQuery } from "@mui/material";

import { Sorter } from "../../shared/components";
import { getTranslation } from "orion-components/i18n";
import sortBy from "lodash/sortBy";
import filter from "lodash/filter";
import each from "lodash/each";
import keyBy from "lodash/keyBy";

const styles = {};

const ListOrder = ({ dialog, dir, lists, closeDialog, setPinnedLists }) => {

	const [Lists, setLists] = useState(sortBy(filter(lists, list => list.selected), ["order"]));

	const theme = useTheme();
	const isXS = useMediaQuery(theme.breakpoints.only('xs'));

	const handleSortEnd = lists => {
		setLists(lists);
	};

	const handleClose = () => {
		closeDialog("listOrder");
	};

	const handleConfirm = () => {
		const newLists = [...Lists];
		each(newLists, (list, index) => (list.order = index));
		const orderedLists = keyBy(newLists, "id");
		setPinnedLists(orderedLists);
		handleClose();
	};

	return (
		<Dialog
			open={dialog === "listOrder"}
			confirm={{
				label: getTranslation("listView.listOrder.dialog.ok"),
				action: handleConfirm
			}}
			abort={{ label: getTranslation("listView.listOrder.dialog.cancel"), action: handleClose }}
		>
			<div style={{ width: isXS ? "auto" : 350 }}>
				<Sorter
					items={Lists}
					sortKey="order"
					handleSortEnd={handleSortEnd}
					dir={dir}
				/>
			</div>
		</Dialog>
	);
};


ListOrder.propTypes = {
	lists: PropTypes.object.isRequired,
	classes: PropTypes.object.isRequired,
	dialog: PropTypes.string
};

export default withStyles(styles)(ListOrder);
