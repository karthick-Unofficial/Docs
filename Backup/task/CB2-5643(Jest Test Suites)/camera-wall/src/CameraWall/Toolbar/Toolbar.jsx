import React, { Fragment, memo } from "react";
import EditGroupDialog from "./EditGroupDialog/EditGroupDialog";
import NewGroupDialog from "./NewGroupDialog/NewGroupDialog";
import CopyDialog from "./CopyDialog/CopyDialog";
import { Button, Toolbar, Typography } from "@mui/material";
import { Translate } from "orion-components/i18n";
import { useDispatch, useSelector } from "react-redux";

import { openDialog, addToPinnedItems } from "./toolbarActions";

import { makeStyles } from "@mui/styles";
import PropTypes from "prop-types";

const useStyles = makeStyles({
	disabled: {
		color: "#fff!important",
		opacity: "0.3"
	}
});

const propTypes = {
	primaryOpen: PropTypes.bool
};

const CWToolbar = ({ primaryOpen }) => {
	const selectedGroup = useSelector((state) => state.appState.persisted.selectedGroup || null);
	const selectedPinnedItem = useSelector((state) => state.appState.persisted.selectedPinnedItem || null);
	const pinnedItems = useSelector((state) => state.appState.persisted.pinnedItems || []);
	const { user } = useSelector((state) => state.session);
	const { cameras, stagedItem } = useSelector((state) => state.cameraWall);
	const canManage =
		user.profile.applications &&
		user.profile.applications.find((app) => app.appId === "camera-wall-app") &&
		user.profile.applications.find((app) => app.appId === "camera-wall-app").permissions &&
		user.profile.applications.find((app) => app.appId === "camera-wall-app").permissions.includes("manage");
	const dispatch = useDispatch();
	const classes = useStyles();

	const name = selectedGroup
		? selectedGroup.name
		: selectedPinnedItem
		? selectedPinnedItem.name
		: stagedItem
		? stagedItem.name
		: null;
	return (
		<Toolbar disableGutters variant="dense" style={{ paddingLeft: primaryOpen ? 40 : 16 }}>
			{name && (
				<Typography position="relative" variant="h6">
					{name}
				</Typography>
			)}
			{selectedGroup && (
				<Fragment>
					<Button
						disabled={!canManage}
						color="primary"
						onClick={() => dispatch(openDialog("edit-group-dialog"))}
						style={{ textTransform: "none" }}
					>
						<Translate value="cameraWall.toolBar.edit" />
					</Button>
					<EditGroupDialog id={selectedGroup.id} />
				</Fragment>
			)}
			{!selectedGroup && !selectedPinnedItem && !stagedItem && !!Object.values(cameras).length && (
				<Fragment>
					<Button
						disabled={!canManage}
						color="primary"
						onClick={() => dispatch(openDialog("new-group-dialog"))}
						style={{ textTransform: "none" }}
					>
						<Translate value="cameraWall.toolBar.save" />
					</Button>
					<NewGroupDialog />
				</Fragment>
			)}
			{stagedItem && (
				<Fragment>
					{!pinnedItems.find((item) => item.id === stagedItem.id) && (
						<Button
							disabled={!canManage}
							color="primary"
							onClick={() => dispatch(addToPinnedItems(stagedItem))}
							style={{ textTransform: "none" }}
							classes={{ disabled: classes.disabled }}
						>
							<Translate value="cameraWall.toolBar.pin" />
						</Button>
					)}
				</Fragment>
			)}
			{(stagedItem || selectedPinnedItem) && (
				<Fragment>
					<Button
						disabled={!canManage}
						color="primary"
						onClick={() => dispatch(openDialog("copy-dialog"))}
						style={{ textTransform: "none" }}
						classes={{ disabled: classes.disabled }}
					>
						<Translate value="cameraWall.toolBar.copy" />
					</Button>
					<CopyDialog />
				</Fragment>
			)}
		</Toolbar>
	);
};

CWToolbar.propTypes = propTypes;

export default memo(CWToolbar);
