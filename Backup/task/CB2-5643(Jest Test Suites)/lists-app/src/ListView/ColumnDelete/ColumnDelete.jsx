import React, { useEffect, useState } from "react";
import { Dialog } from "orion-components/CBComponents";
import {
	useMediaQuery,
	List,
	ListItem,
	ListItemText,
	Checkbox
} from "@mui/material";
import { withStyles, useTheme } from "@mui/styles";
import { getTranslation } from "orion-components/i18n";

import { useDispatch, useSelector } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";
import { updateList } from "./columnDeleteActions";
import each from "lodash/each";
import remove from "lodash/remove";
import map from "lodash/map";

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

const ColumnDelete = ({
	classes,
	columns,
	dialogRef,
	list,
	handleCloseDialog
}) => {
	const dialog = useSelector(state => state.appState.dialog.openDialog);
	const dir = useSelector(state => getDir(state));
	const [state, setState] = useState({});
	const dispatch = useDispatch();

	const theme = useTheme();
	const isXS = useMediaQuery(theme.breakpoints.only('xs'));

	useEffect(() => {
		each(columns, column => {
			if (!column.forCheckBox) {
				setState({ ...state, [column.id]: false });
			}
		});
	}, []);

	const handleClose = () => {
		handleCloseDialog(dialogRef);
		each(columns, column => setState({ ...state, [column.id]: false }));
	};

	const handleChange = key => {
		setState({ ...state, [key]: !state[key] });
	};

	const handleConfirm = () => {
		const newColumns = [...list.columns];
		const newRows = [...list.rows];
		each(list.columns, column => {
			if (state[column.id]) {
				if (column.type === "checkbox") {
					remove(newColumns, newColumn => newColumn.id === `${column.id}_user-completed` || newColumn.id === `${column.id}_show-time`);
				}
				remove(newColumns, newColumn => newColumn.order === column.order);
			}
			each(newRows, row => {
				if (state[column.id]) {
					delete row.data[column.id];
				}
			});
		});

		dispatch(updateList(list.id, { columns: newColumns, rows: newRows }));
		handleClose();
	};


	const styles = {
		primary: {
			color: "#fff"
		}
	};
	const filteredColumns = columns.filter(column => !column.forCheckBox);

	const conditionalStyles = {
		listItemText: {
			...(dir === "rtl" && { paddingLeft: "10px" }),
			...(dir === "ltr" && { paddingRight: "0px" })
		}
	}
	return (
		<Dialog
			key="column-delete"
			title={getTranslation("listView.columnDelete.dialog.title")}
			open={dialog === dialogRef}
			confirm={{
				label: getTranslation("listView.columnDelete.dialog.deleteSelected"),
				action: handleConfirm
			}}
			abort={{ label: getTranslation("listView.columnDelete.dialog.cancel"), action: handleClose }}
		>
			<div
				className={classes.container}
				style={{ width: isXS ? "auto" : 350 }}
			>
				<List>
					{map(filteredColumns, column => (
						<ListItem key={column.id} className={classes.root}>
							<Checkbox
								onChange={() => handleChange(column.id)}
								checked={state[column.id]}
								style={{
									color: state[column.id] ? "#35b7f3" : "#828283"
								}}
							/>
							<ListItemText
								style={conditionalStyles.listItemText}
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
};

export default withStyles(styles)(ColumnDelete);
