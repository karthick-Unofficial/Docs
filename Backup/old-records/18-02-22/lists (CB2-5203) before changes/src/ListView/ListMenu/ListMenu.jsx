import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { Menu, MenuItem, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { Translate } from "orion-components/i18n/I18nContainer";

const styles = {
	root: {
		backgroundColor: "#41454a",
		minWidth: 200
	}
};

class ListMenu extends Component {
state = {};

handleDialogOpen = id => {
	const { openDialog, handleMenuToggle, handleListSelect, list } = this.props;
	handleListSelect(list);
	handleMenuToggle();
	openDialog(id);
};

render() {
	const {
		classes,
		anchorEl,
		handleMenuToggle,
		list
	} = this.props;
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
				onClick={() => this.handleDialogOpen("editList" + list.id)}
				style={styles.menuItem}
			>
				<Typography variant="body2" color="inherit">
					<Translate value="listView.listMenu.menuItem.editList"/>
				</Typography>
			</MenuItem>
			<MenuItem
				key={"columnAdd" + list.id}
				onClick={() => this.handleDialogOpen("columnAdd" + list.id)}
				style={styles.menuItem}
			>
				<Typography variant="body2" color="inherit">
					<Translate value="listView.listMenu.menuItem.addColumn"/>
				</Typography>
			</MenuItem>
			<MenuItem
				key={"columnDelete" + list.id}
				onClick={() => this.handleDialogOpen("columnDelete" + list.id)}
				style={styles.menuItem}
			>
				<Typography variant="body2" color="inherit">
					<Translate value="listView.listMenu.menuItem.deleteColumns"/>
				</Typography>
			</MenuItem>
			<MenuItem
				key={"columnOrder" + list.id}
				onClick={() => this.handleDialogOpen("columnOrder" + list.id)}
				style={styles.menuItem}
			>
				<Typography variant="body2" color="inherit">
					<Translate value="listView.listMenu.menuItem.columnOrder"/>
				</Typography>
			</MenuItem>
			<MenuItem
				key={"duplicateList" + list.id}
				onClick={() => this.handleDialogOpen("duplicateList" + list.id)}
				style={styles.menuItem}
			>
				<Typography variant="body2" color="inherit">
					<Translate value="listView.listMenu.menuItem.duplicateList"/>
				</Typography>
			</MenuItem>
			<MenuItem
				key={"deleteList" + list.id}
				onClick={() => this.handleDialogOpen("deleteList" + list.id)}
				style={styles.menuItem}
			>
				<Typography variant="body2" color="inherit">
					<Translate value="listView.listMenu.menuItem.deleteList"/>
				</Typography>
			</MenuItem>
		</Menu>
	);
}
}

ListMenu.propTypes = {
	classes: PropTypes.object.isRequired,
	anchorEl: PropTypes.object,
	handleMenuToggle: PropTypes.func.isRequired
};

export default withStyles(styles)(ListMenu);
