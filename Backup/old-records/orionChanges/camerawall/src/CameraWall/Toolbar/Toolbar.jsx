import React, { Fragment, memo } from "react";
import PropTypes from "prop-types";
import { default as EditGroupDialog } from "./EditGroupDialog/EditGroupDialogContainer";
import { default as NewGroupDialog } from "./NewGroupDialog/NewGroupDialogContainer";
import { default as CopyDialog } from "./CopyDialog/CopyDialogContainer";
import { Button, Toolbar, Typography } from "@material-ui/core";
import { Translate } from "orion-components/i18n/I18nContainer";

const propTypes = {
	addToPinnedItems: PropTypes.func.isRequired,
	cameras: PropTypes.object.isRequired,
	canManage: PropTypes.bool,
	openDialog: PropTypes.func.isRequired,
	pinnedItems: PropTypes.array,
	selectedGroup: PropTypes.shape({
		id: PropTypes.string,
		name: PropTypes.string,
		type: PropTypes.string
	}),
	selectedPinnedItem: PropTypes.shape({
		id: PropTypes.string,
		name: PropTypes.string,
		type: PropTypes.string
	}),
	stagedItem: PropTypes.shape({
		id: PropTypes.string,
		name: PropTypes.string,
		type: PropTypes.string
	})
};
const defaultProps = {
	pinnedItems: [],
	selectedGroup: null,
	selectedPinnedItem: null,
	stagedItem: null
};

const CWToolbar = ({
	addToPinnedItems,
	canManage,
	cameras,
	openDialog,
	pinnedItems,
	stagedItem,
	selectedGroup,
	selectedPinnedItem
}) => {
	const name = selectedGroup
		? selectedGroup.name
		: selectedPinnedItem
			? selectedPinnedItem.name
			: stagedItem
				? stagedItem.name
				: null;
	return (
		<Toolbar disableGutters>
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
						onClick={() => openDialog("edit-group-dialog")}
						style={{ textTransform: "none" }}
					>
						<Translate value="cameraWall.toolBar.edit"/>
					</Button>
					<EditGroupDialog id={selectedGroup.id} />
				</Fragment>
			)}
			{!selectedGroup &&
				!selectedPinnedItem &&
				!stagedItem &&
				!!Object.values(cameras).length && (
				<Fragment>
					<Button
						disabled={!canManage}
						color="primary"
						onClick={() => openDialog("new-group-dialog")}
						style={{ textTransform: "none" }}
					>
						<Translate value="cameraWall.toolBar.save"/>
					</Button>
					<NewGroupDialog />
				</Fragment>
			)}
			{stagedItem && (
				<Fragment>
					{!pinnedItems.find(item => item.id === stagedItem.id) && (
						<Button
							disabled={!canManage}
							color="primary"
							onClick={() => addToPinnedItems(stagedItem)}
							style={{ textTransform: "none" }}
						>
							<Translate value="cameraWall.toolBar.pin"/>
						</Button>
					)}
				</Fragment>
			)}
			{(stagedItem || selectedPinnedItem) && (
				<Fragment>
					<Button
						disabled={!canManage}
						color="primary"
						onClick={() => openDialog("copy-dialog")}
						style={{ textTransform: "none" }}
					>
						<Translate value="cameraWall.toolBar.copy"/>
					</Button>
					<CopyDialog />
				</Fragment>
			)}
		</Toolbar>
	);
};

CWToolbar.propTypes = propTypes;
CWToolbar.defaultProps = defaultProps;

export default memo(CWToolbar);
