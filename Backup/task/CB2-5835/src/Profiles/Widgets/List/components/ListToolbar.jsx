import React, { useState } from "react";

import { Button, IconButton, Toolbar, Menu, MenuItem, Typography } from "@mui/material";
import { default as ActionDelete } from "@mui/icons-material/Delete";
import { default as ActionDone } from "@mui/icons-material/Done";
import { getTranslation, Translate } from "orion-components/i18n";
import { MoreVert } from "@mui/icons-material";
import { withStyles } from "@mui/styles";

const styles = {
	root: {
		backgroundColor: "#2C2D2F",
		minWidth: 200
	},
	menuItem: {
		"&:hover": {
			backgroundColor: "#494551"
		}
	}
};

const DeleteMenu = (props) => {
	const deleteMenuStyles = {
		edit: {
			...(props.dir === "ltr" && { marginLeft: "auto" }),
			...(props.dir === "rtl" && { marginRight: "auto" }),
			color: "#828283"
		}
	};

	const [anchorEl, setAnchorEl] = useState(false);
	const [open, setOpen] = useState(false);

	const handleMenuToggle = (event) => {
		setOpen(!open);
		setAnchorEl(anchorEl ? null : event.currentTarget);
	};

	if (props.removing)
		return (
			<IconButton onClick={() => props.submitDeleteMode(props.listId)} style={{ height: "100%", padding: 0 }}>
				<ActionDelete color={"#6C6C6E"} />
			</IconButton>
		);
	else if (props.editableRow)
		return (
			<IconButton style={{ height: "100%" }}>
				<ActionDone onClick={props.submitAddRow} color={"#6C6C6E"} />
			</IconButton>
		);
	else if (props.canRemove && !props.editTitle) {
		return (
			<div>
				<IconButton onClick={handleMenuToggle} style={deleteMenuStyles.edit}>
					<MoreVert />
				</IconButton>
				<Menu
					anchorEl={anchorEl}
					MenuListProps={{ className: props.classes.root }}
					open={open}
					onClose={handleMenuToggle}
					anchorOrigin={{ vertical: "top", horizontal: "left" }}
					transformOrigin={{
						vertical: "top",
						horizontal: "right"
					}}
				>
					<MenuItem
						onClick={() => {
							setOpen(false);
							setAnchorEl(null);
							props.toggleDialog("deleteList" + props.listId);
						}}
						classes={{
							root: props.classes.menuItem
						}}
					>
						<Typography style={{ fontSize: "16px" }} color="inherit">
							<Translate value="global.profiles.widgets.list.listToolbar.deleteList" />
						</Typography>
					</MenuItem>

					<MenuItem
						onClick={() => {
							setOpen(false);
							setAnchorEl(null);
							props.toggleEditTitle();
						}}
						classes={{
							root: props.classes.menuItem
						}}
					>
						<Typography style={{ fontSize: "16px" }} color="inherit">
							<Translate value="global.profiles.widgets.list.listToolbar.renameList" />
						</Typography>
					</MenuItem>
				</Menu>
			</div>
		);
	} else return <div />;
};

const EditMenu = (props) => {
	if (props.editableRow)
		return (
			<Button variant="text" color="primary" onClick={props.cancelAddRow}>
				{getTranslation("global.profiles.widgets.list.listToolbar.cancel")}
			</Button>
		);
	else if (props.removing)
		return (
			<Button variant="text" color="primary" onClick={props.cancelDeleteMode} style={{ marginTop: 1 }}>
				{getTranslation("global.profiles.widgets.list.listToolbar.cancel")}
			</Button>
		);
	else if (props.editTitle)
		return (
			<React.Fragment>
				<Button
					style={{ width: "30%", minWidth: 0 }}
					variant="text"
					color="primary"
					onClick={props.handleSaveNewTitle}
				>
					{getTranslation("global.profiles.widgets.list.listToolbar.save")}
				</Button>
				<Button
					style={{ width: "70%", minWidth: 0 }}
					variant="text"
					color="primary"
					onClick={props.handleCancelRename}
				>
					{getTranslation("global.profiles.widgets.list.listToolbar.cancel")}
				</Button>
			</React.Fragment>
		);
	else
		return (
			<React.Fragment>
				<Button
					style={{ width: "30%", minWidth: 0 }}
					variant="text"
					color="primary"
					onClick={() => props.toggleDialog("rowAdd" + props.listId)}
				>
					{getTranslation("global.profiles.widgets.list.listToolbar.add")}
				</Button>
				<Button
					style={{ width: "70%", minWidth: 0 }}
					variant="text"
					color="primary"
					onClick={props.startDeleteMode}
				>
					{getTranslation("global.profiles.widgets.list.listToolbar.remove")}
				</Button>
			</React.Fragment>
		);
};

const ListToolbar = ({
	expanded,
	editableRow,
	removing,
	listStyle,
	canRemove,
	canEdit,
	toggleEditTitle,
	editTitle,
	handleCancelRename,
	handleSaveNewTitle,
	listId,
	dir,
	cancelAddRow,
	cancelDeleteMode,
	addRow,
	startDeleteMode,
	toggleDialog,
	submitDeleteMode,
	submitAddRow,
	classes
}) => {
	return canEdit || canRemove ? (
		<div>
			<Toolbar
				style={{
					backgroundColor: expanded ? "#35383c" : "#2c2d2f",
					padding: "none",
					borderBottom: "1px solid #41454A",
					minHeight: 45
				}}
				disableGutters={true}
			>
				<div
					style={{
						...(dir === "rtl" && { paddingRight: 8 }),
						...(dir === "ltr" && { paddingLeft: 8 }),
						...listStyle.buttons
					}}
				>
					<div
						style={{
							height: "100%",
							display: "flex",
							alignItems: "center"
						}}
					>
						<EditMenu
							editableRow={editableRow}
							removing={removing}
							// Methods
							cancelAddRow={cancelAddRow}
							cancelDeleteMode={cancelDeleteMode}
							addRow={addRow}
							startDeleteMode={startDeleteMode}
							editTitle={editTitle}
							handleCancelRename={handleCancelRename}
							handleSaveNewTitle={handleSaveNewTitle}
							toggleDialog={toggleDialog}
							listId={listId}
							dir={dir}
						/>
					</div>
				</div>
				<div style={listStyle.spacer} />
				<div>
					<DeleteMenu
						canRemove={canRemove}
						removing={removing}
						editableRow={editableRow}
						classes={classes}
						// Methods
						submitDeleteMode={submitDeleteMode}
						submitAddRow={submitAddRow}
						toggleDialog={toggleDialog}
						toggleEditTitle={toggleEditTitle}
						editTitle={editTitle}
						listId={listId}
						dir={dir}
					/>
				</div>
			</Toolbar>
		</div>
	) : null;
};

export default withStyles(styles)(ListToolbar);
