import React from "react";
import PropTypes from "prop-types";
import { Menu, MenuItem, Typography } from "@mui/material";
import { withStyles } from "@mui/styles";
import { Translate } from "orion-components/i18n";
import { useDispatch } from "react-redux";
import { openDialog } from "./listMenuActions";


const styles = {
	root: {
		backgroundColor: "#41454a",
		minWidth: 200
	}
};

const ListMenu = ({ handleMenuToggle, handleListSelect, list, classes, anchorEl }) => {

	const dispatch = useDispatch();

	const handleDialogOpen = id => {
		handleListSelect(list);
		handleMenuToggle();
		dispatch(openDialog(id));
	};

	const styles = {
		menuItem: {
			color: "#fff",
			padding: "8px 16px"
		}
	};
	return (
		<Menu
			id="edit-menu"
			MenuListProps={{ className: classes.root }}
			anchorEl={anchorEl}
			open={Boolean(anchorEl)}
			onClose={handleMenuToggle}
			anchorOrigin={{ vertical: "top", horizontal: "left" }}
			transformOrigin={{
				vertical: "top",
				horizontal: "right"
			}}
		>
			<MenuItem
				key={"editList" + list.id}
				onClick={() => handleDialogOpen("editList" + list.id)}
				style={styles.menuItem}
			>
				<Typography variant="body2" color="inherit">
					<Translate value="listView.listMenu.menuItem.editList" />
				</Typography>
			</MenuItem>
			<MenuItem
				key={"columnAdd" + list.id}
				onClick={() => handleDialogOpen("columnAdd" + list.id)}
				style={styles.menuItem}
			>
				<Typography variant="body2" color="inherit">
					<Translate value="listView.listMenu.menuItem.addColumn" />
				</Typography>
			</MenuItem>
			<MenuItem
				key={"columnDelete" + list.id}
				onClick={() => handleDialogOpen("columnDelete" + list.id)}
				style={styles.menuItem}
			>
				<Typography variant="body2" color="inherit">
					<Translate value="listView.listMenu.menuItem.deleteColumns" />
				</Typography>
			</MenuItem>
			<MenuItem
				key={"columnOrder" + list.id}
				onClick={() => handleDialogOpen("columnOrder" + list.id)}
				style={styles.menuItem}
			>
				<Typography variant="body2" color="inherit">
					<Translate value="listView.listMenu.menuItem.columnOrder" />
				</Typography>
			</MenuItem>
			<MenuItem
				key={"duplicateList" + list.id}
				onClick={() => handleDialogOpen("duplicateList" + list.id)}
				style={styles.menuItem}
			>
				<Typography variant="body2" color="inherit">
					<Translate value="listView.listMenu.menuItem.duplicateList" />
				</Typography>
			</MenuItem>
			<MenuItem
				key={"deleteList" + list.id}
				onClick={() => handleDialogOpen("deleteList" + list.id)}
				style={styles.menuItem}
			>
				<Typography variant="body2" color="inherit">
					<Translate value="listView.listMenu.menuItem.deleteList" />
				</Typography>
			</MenuItem>
		</Menu>
	);
};

ListMenu.propTypes = {
	classes: PropTypes.object.isRequired,
	anchorEl: PropTypes.object,
	handleMenuToggle: PropTypes.func.isRequired
};

export default withStyles(styles)(ListMenu);
