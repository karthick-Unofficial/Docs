import React, { useState, useRef, useEffect } from "react";

// Material UI
import {
	Dialog,
	DialogActions,
	DialogTitle,
	Button,
	TextField
} from "@mui/material";

import { Dialog as CBDialog } from "orion-components/CBComponents";
// Components
import DockItemLabel from "../../../shared/components/DockItemLabel";
import { EntityAddToCollection } from "orion-components/SharedComponents";

// Virtualize
import { List, AutoSizer } from "react-virtualized";

// Utility
import { getIcon } from "orion-components/SharedComponents";

import find from "lodash/find";
import { Translate, getTranslation } from "orion-components/i18n";
import { useDispatch } from "react-redux";
import { makeStyles } from "@mui/styles";

const styles = {
	paperProps: {
		width: "100%",
		borderRadius: "2px",
		maxWidth: "768px",
		margin: 0
	},
	dialogTitle: {
		padding: "24px 24px 20px",
		color: "rgb(255, 255, 255)",
		fontSize: "22px",
		lineHeight: "32px",
		fontWeight: 400,
		letterSpacing: "unset"
	},
	dialogContent: {
		fontSize: "16px",
		color: "rgba(255, 255, 255, 0.6)",
		padding: "0px 24px 24px",
		border: "none",
		maxHeight: "329px"
	}
};

const useStyles = makeStyles({
	scrollPaper: {
		width: "75%",
		margin: "0px auto",
		maxWidth: "768px"
	}
});

const EntityCollectionEdit = ({
	shared,
	collectionMembers,
	label,
	groupId,
	createUserFeedback,
	renameCollection,
	removeFromMyItems,
	removeFromCollection,
	close,
	deleteCollection,
	isOwner,
	createCollection,
	canRemoveFromThisCollection,
	user,
	dir,
	open
}) => {
	const dispatch = useDispatch();
	const classes = useStyles();

	const [removalArray, setRemovalArray] = useState([]);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [collectionDialogOpen, setCollectionDialogOpen] = useState(false);
	const [Shared, setShared] = useState(shared);
	const [sharedStatusChanged, setSharedStatusChanged] = useState(false);
	const [updatedName, setUpdatedName] = useState("");

	const virtualList = useRef();

	// Enter to submit
	const _handleKeyDown = (event) => {
		if (event.key === "Enter" && deleteDialogOpen) {
			handleSave();
		}
	};

	useEffect(() => {
		document.removeEventListener("keydown", _handleKeyDown);
		return () => {
			document.addEventListener("keydown", _handleKeyDown);
		};
	}, [_handleKeyDown]);
	const handleCollectionDialogOpen = () => {
		if (Object.keys(collectionMembers).length) {
			setCollectionDialogOpen(true);
		}
	};

	const handleCollectionDialogClose = () => {
		setCollectionDialogOpen(false);
	};

	const handleRemoveMember = (id) => {
		const collectionMemberLength = Object.keys(collectionMembers).length;
		if (removalArray.includes(id)) {
			const removeItems = removalArray;
			removeItems.splice(removeItems.indexOf(id), 1);
			setRemovalArray(removeItems);
			// force virtualized list to update showing item pending removal
			if (collectionMemberLength > 10) {
				virtualList.forceUpdate();
				virtualList.forceUpdateGrid();
			}
		} else {
			const removeItems = [...removalArray, id];
			setRemovalArray(removeItems);
			// // force virtualized list to update showing item pending removal
			if (collectionMemberLength > 10) {
				virtualList.forceUpdateGrid();
			}
		}
	};

	const handleSave = () => {
		let undoFunc;
		if (label !== updatedName && updatedName !== "") {
			dispatch(renameCollection(groupId, updatedName));

			// Not in action because it uses itself to undo itself
			undoFunc = () => {
				dispatch(renameCollection(groupId, label));
			};

			dispatch(
				createUserFeedback(
					label + " renamed to " + updatedName + ".",
					undoFunc
				)
			);
		}

		if (groupId === "my-entities") {
			dispatch(removeFromMyItems(removalArray));
		} else if (removalArray.length > 0) {
			dispatch(removeFromCollection(label, groupId, removalArray));
		}
		close();
		setRemovalArray([]);
		setUpdatedName("");
	};

	const handleClose = () => {
		close();
		setRemovalArray([]);
		setShared(shared);
		setSharedStatusChanged(false);
	};

	const handleDeleteOpen = () => {
		setDeleteDialogOpen(true);
	};

	const handleDeleteClose = () => {
		setDeleteDialogOpen(false);
	};

	const handleConfirmDelete = (id) => {
		dispatch(deleteCollection(id, label));
		handleDeleteClose();
		close();
	};

	const handleShareClick = () => {
		setShared(!Shared);
		setSharedStatusChanged(!Shared);
	};

	const handleUpdateName = (event) => {
		setUpdatedName(event.target.value);
	};

	const handleCopyComplete = () => {
		// Close both dialogs when finished copying collections
		close();
	};

	const rowRenderer = ({ key, index, isScrolling, isVisible, style }) => {
		const collectionMemberArr = Object.values(collectionMembers);
		return (
			<div key={key} style={style}>
				<div>
					<div
						className={`ec-dialog-item dockItem ${
							removalArray.includes(collectionMemberArr[index].id)
								? "ec-remove"
								: "ec-keep"
						}`}
						key={collectionMemberArr[index].id}
					>
						{getIcon(
							collectionMemberArr[index].entityData.properties
								.type
						)}
						<DockItemLabel
							primary={
								collectionMemberArr[index].entityData.properties
									.name
							}
							secondary={
								collectionMemberArr[index].entityData.properties
									.type
							}
						/>
						<i
							className="material-icons"
							onClick={() =>
								handleRemoveMember(
									collectionMemberArr[index].id
								)
							}
						>
							{removalArray.includes(
								collectionMemberArr[index].id
							)
								? "add_circle"
								: "cancel"}
						</i>
					</div>
				</div>
			</div>
		);
	};

	const mapApp = find(
		user ? user.applications : {},
		(app) => app.appId === "map-app"
	);
	const canViewCollections = mapApp && mapApp.config.canView;
	const canEditCollections = mapApp && mapApp.permissions.includes("manage");
	const collectionMembersLength = Object.keys(collectionMembers).length;
	const hasItems = !!collectionMembersLength;
	const actions = isOwner
		? [
				<Button
					className="ec-delete customButton"
					onClick={handleDeleteOpen}
					style={{ color: "#E85858", float: "left" }}
					variant="text"
					key="delete-collection-button"
				>
					{getTranslation(
						"listPanel.entityCollection.entityCollectionEdit.flatButtonLabel.delete"
					)}
				</Button>,
				<Button
					className="customButton"
					onClick={handleClose}
					variant="text"
					key="close-button"
				>
					{getTranslation(
						"listPanel.entityCollection.entityCollectionEdit.flatButtonLabel.cancel"
					)}
				</Button>,
				<Button
					className="customButton"
					onClick={handleSave}
					variant="text"
					key="confirm-button"
				>
					{getTranslation(
						"listPanel.entityCollection.entityCollectionEdit.flatButtonLabel.confirm"
					)}
				</Button>
		  ]
		: [
				<Button
					className="customButton"
					onClick={handleClose}
					variant="text"
					key="close-button"
				>
					{getTranslation(
						"listPanel.entityCollection.entityCollectionEdit.flatButtonLabel.cancel"
					)}
				</Button>,
				<Button
					className="customButton"
					onClick={handleSave}
					variant="text"
					key="confirm-button"
				>
					{getTranslation(
						"listPanel.entityCollection.entityCollectionEdit.flatButtonLabel.confirm"
					)}
				</Button>
		  ];

	const editDialogActions = () => {
		return (
			<DialogActions
				sx={{
					padding: "8px 16px",
					display: "block",
					textAlign: "right"
				}}
			>
				{actions}
			</DialogActions>
		);
	};

	return (
		<CBDialog
			className="ec-edit-dialog"
			paperPropStyles={{
				width: "360px",
				borderRadius: "2px"
			}}
			open={open}
			actions={true}
			DialogActionsFunction={editDialogActions}
		>
			<div className="dock-group-wrapper" style={{ padding: 5 }}>
				<div className="ec-dialog-header">
					{groupId !== "my-entities" ? (
						<TextField
							id="collection-name-text-field"
							defaultValue={label}
							underlineShow={false}
							fullWidth={true}
							disabled={!isOwner && !canEditCollections}
							inputProps={{
								style: { padding: "12px 0 12px 1rem" }
							}}
							onChange={handleUpdateName}
							InputProps={{
								disableUnderline: true,
								style: {
									backgroundColor: "rgb(31, 31, 33)",
									fontSize: 16,
									color: "#fff",
									borderRadius: "unset"
								}
							}}
							variant="standard"
						/>
					) : (
						<div className="ec-dialog-header">
							<DockItemLabel
								primary={getTranslation(
									"listPanel.entityCollection.entityCollectionEdit.dockItemLabel"
								)}
							/>
						</div>
					)}
				</div>
				{(canViewCollections || isOwner) && (
					<div className="ec-edit-controls">
						{hasItems ? (
							<a
								className="cb-font-link"
								onClick={handleCollectionDialogOpen}
							>
								<Translate value="listPanel.entityCollection.entityCollectionEdit.copyToNew" />
							</a>
						) : (
							<Translate
								value="listPanel.entityCollection.entityCollectionEdit.emptyColl"
								style={{ color: "rgba(255, 255, 255, 0.6)" }}
							/>
						)}
					</div>
				)}
				<section>
					{collectionMembersLength > 10 ? (
						<AutoSizer disableHeight>
							{({ width }) => (
								<List
									className="customList"
									rowCount={collectionMembersLength}
									width={width}
									rowHeight={66}
									height={
										collectionMembersLength > 8
											? 500
											: collectionMembersLength * 60
									}
									rowRenderer={rowRenderer}
									overscanRowCount={1} // cSpell:ignore overscan
									ref={virtualList}
								/>
							)}
						</AutoSizer>
					) : (
						Object.values(collectionMembers).map((item) => {
							return (
								<div
									className={`ec-dialog-item dockItem ${
										removalArray.includes(item.id)
											? "ec-remove"
											: "ec-keep"
									}`}
									key={item.id}
								>
									{getIcon(item.entityData.properties.type)}
									<DockItemLabel
										primary={
											item.entityData.properties.name
												? item.entityData.properties
														.name
												: item.id
												? item.id.toUpperCase()
												: ""
										}
										secondary={
											item.entityData.properties.type
										}
									/>
									{canRemoveFromThisCollection && (
										<i
											className="material-icons"
											onClick={() =>
												handleRemoveMember(item.id)
											}
										>
											{removalArray.includes(item.id)
												? "add_circle"
												: "cancel"}
										</i>
									)}
								</div>
							);
						})
					)}
				</section>
			</div>

			<CBDialog
				open={deleteDialogOpen}
				title={getTranslation(
					"listPanel.entityCollection.entityCollectionEdit.deleteDialog.title"
				)}
				confirm={{
					label: getTranslation(
						"listPanel.entityCollection.entityCollectionEdit.flatButtonLabel.confirm"
					),
					action: () => handleConfirmDelete(groupId),
					style: { color: "#E85858" }
				}}
				abort={{
					label: getTranslation(
						"listPanel.entityCollection.entityCollectionEdit.flatButtonLabel.cancel"
					),
					action: handleDeleteClose,
					style: { color: "#4EB4F1" }
				}}
				paperPropStyles={styles.paperProps}
				titlePropStyles={styles.dialogTitle}
			>
				<span style={styles.dialogContent}>
					<Translate value="listPanel.entityCollection.entityCollectionEdit.deleteDialog.confirmText" />
				</span>
			</CBDialog>
			<EntityAddToCollection
				open={collectionDialogOpen}
				dispatch={dispatch}
				close={handleCollectionDialogClose}
				addition={Object.values(collectionMembers).map((item) => {
					return {
						id: item.id,
						name: item.entityData.properties.name
							? item.entityData.properties.name
							: item.id.toUpperCase(),
						entityType: item.entityType,
						feedId: item.feedId
					};
				})}
				createCollection={createCollection}
				handleCopyComplete={handleCopyComplete}
				dir={dir}
			/>
		</CBDialog>
	);
};

export default EntityCollectionEdit;
