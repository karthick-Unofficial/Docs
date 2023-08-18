import React, { useState } from "react";
import PropTypes from "prop-types";
import { Dialog } from "orion-components/CBComponents";
import { Sorter } from "../../shared/components";
import { useMediaQuery } from "@mui/material";
import { withStyles, useTheme } from "@mui/styles";
import { getTranslation } from "orion-components/i18n";
import sortBy from "lodash/sortBy";
import each from "lodash/each";

const styles = {};

const ColumnOrder = ({ dialog, dialogRef, dir, columns, handleCloseDialog, list, updateList }) => {

	const [Columns, setColumns] = useState(sortBy(columns, ["order"]));

	const theme = useTheme();
	const isXS = useMediaQuery(theme.breakpoints.only('xs'));

	const handleSortEnd = columns => {
		setColumns(columns);
	};

	const handleClose = () => {
		handleCloseDialog(dialogRef);
	};

	const handleConfirm = () => {
		const newColumns = [...Columns];
		each(newColumns, (column, index) => (column.order = index));
		updateList(list.id, { columns: newColumns });
		handleClose();
	};

	return (
		<Dialog
			open={dialog === dialogRef}
			confirm={{
				label: getTranslation("listView.columnOrder.dialog.ok"),
				action: handleConfirm
			}}
			abort={{ label: getTranslation("listView.columnOrder.dialog.cancel"), action: handleClose }}
		>
			<div style={{ width: isXS ? "auto" : 350 }}>
				<Sorter
					items={Columns}
					sortKey="order"
					handleSortEnd={handleSortEnd}
					dir={dir}
				/>
			</div>
		</Dialog>
	);
};


ColumnOrder.propTypes = {
	classes: PropTypes.object.isRequired,
	dialog: PropTypes.string,
	dialogRef: PropTypes.string.isRequired
};
export default withStyles(styles)(ColumnOrder);
