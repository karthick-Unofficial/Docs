import React, { useState, useRef, useEffect } from "react";

// Material UI
import { IconButton, Dialog, FlatButton, TextField } from "material-ui";
import Share from "material-ui/svg-icons/social/share";

// Components
import DockItemLabel from "../../../shared/components/DockItemLabel";
import { EntityAddToCollection } from "orion-components/SharedComponents";

// Virtualize
import { List, AutoSizer } from "react-virtualized";

// Utility
import { getIcon } from "orion-components/SharedComponents";

import _ from "lodash";
import { Translate, getTranslation } from "orion-components/i18n/I18nContainer";

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
	const [removalArray, setRemovalArray] = useState([]);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [collectionDialogOpen, setCollectionDialogOpen] = useState(false);
	const [Shared, setShared] = useState(shared);
	const [sharedStatusChanged, SetsharedStatusChanged] = useState(false);
	const [updatedName, setUpdatedName] = useState("");

	const virtualList = useRef();

	// Enter to submit
	const _handleKeyDown = event => {
		if (event.key === "Enter" && deleteDialogOpen) {
			handleSave();
		}
	};

	useEffect(() => {
		document.removeEventListener("keydown", _handleKeyDown);
		return (() => {
			document.addEventListener("keydown", _handleKeyDown);
		});
	}, [_handleKeyDown]);
	const handleCollectionDialogOpen = () => {
		if (Object.keys(collectionMembers).length) {
			setCollectionDialogOpen(true);
		}
	};

	const handleCollectionDialogClose = () => {
		setCollectionDialogOpen(false);
	};

	const handleRemoveMember = id => {
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
			renameCollection(groupId, updatedName);

			// Not in action because it uses itself to undo itself
			undoFunc = () => {
				renameCollection(groupId, label);
			};

			createUserFeedback(label + " renamed to " + updatedName + ".", undoFunc);
		}

		if (groupId === "my-entities") {
			removeFromMyItems(removalArray);
		} else if (removalArray.length > 0) {
			removeFromCollection(label, groupId, removalArray);
		}
		close();
		setRemovalArray([]);
		setUpdatedName("");
	};

	const handleClose = () => {
		close();
		setRemovalArray([]);
		setShared(shared);
		SetsharedStatusChanged(false);
	};

	const handleDeleteOpen = () => {
		setDeleteDialogOpen(true);
	};

	const handleDeleteClose = () => {
		setDeleteDialogOpen(false);
	};

	const handleConfirmDelete = id => {
		deleteCollection(id, label);
		handleDeleteClose();
		close();
	};

	const handleShareClick = () => {
		setShared(!Shared);
		SetsharedStatusChanged(!Shared);
	};

	const handleUpdateName = event => {
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
						className={`ec-dialog-item dockItem ${removalArray.includes(
							collectionMemberArr[index].id
						)
							? "ec-remove"
							: "ec-keep"
							}`}
						key={collectionMemberArr[index].id}
					>
						{getIcon(
							collectionMemberArr[index].entityData.properties.type
						)}
						<DockItemLabel
							primary={
								collectionMemberArr[index].entityData.properties.name
							}
							secondary={
								collectionMemberArr[index].entityData.properties.type
							}
						/>
						<i
							className="material-icons"
							onClick={() =>
								handleRemoveMember(collectionMemberArr[index].id)
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

	const mapApp = _.find(
		user.applications,
		app => app.appId === "map-app"
	);
	const canViewCollections = mapApp && mapApp.config.canView;
	const canEditCollections = mapApp && mapApp.permissions.includes("manage");
	const collectionMembersLength = Object.keys(collectionMembers).length;
	const hasItems = !!collectionMembersLength;
	const actions = isOwner
		? [
			<FlatButton
				className="ec-delete"
				label={getTranslation("listPanel.entityCollection.entityCollectionEdit.flatButtonLabel.delete")}
				primary={true}
				onClick={handleDeleteOpen}
				style={{ color: "#E85858", float: "left" }}
			/>,
			<FlatButton
				label={getTranslation("listPanel.entityCollection.entityCollectionEdit.flatButtonLabel.cancel")}
				primary={true}
				onClick={handleClose}
			/>,
			<FlatButton
				label={getTranslation("listPanel.entityCollection.entityCollectionEdit.flatButtonLabel.confirm")}
				primary={true}
				keyboardFocused={true}
				onClick={handleSave}
			/>
		]
		: [
			<FlatButton
				label={getTranslation("listPanel.entityCollection.entityCollectionEdit.flatButtonLabel.cancel")}
				primary={true}
				onClick={handleClose}
			/>,
			<FlatButton
				label={getTranslation("listPanel.entityCollection.entityCollectionEdit.flatButtonLabel.confirm")}
				primary={true}
				keyboardFocused={true}
				onClick={handleSave}
			/>
		];

	const deleteActions = [
		<FlatButton
			label={getTranslation("listPanel.entityCollection.entityCollectionEdit.flatButtonLabel.cancel")}
			primary={true}
			onClick={handleDeleteClose}
		/>,
		<FlatButton
			label={getTranslation("listPanel.entityCollection.entityCollectionEdit.flatButtonLabel.confirm")}
			primary={true}
			keyboardFocused={true}
			style={{ color: "#E85858" }}
			onClick={() => handleConfirmDelete(groupId)}
		/>
	];

	return (
		<Dialog
			className="ec-edit-dialog"
			contentStyle={{ width: "360px" }}
			open={open}
			onRequestClose={() => close()}
			actions={actions}
		>
			<div className="dock-group-wrapper">
				<div className="ec-dialog-header">
					{groupId !== "my-entities" ? (
						<TextField
							id="collection-name-text-field"
							defaultValue={label}
							underlineShow={false}
							fullWidth={true}
							disabled={!isOwner && !canEditCollections}
							inputStyle={{ paddingLeft: "1rem" }}
							onChange={handleUpdateName}
							floatingLabelStyle={{
								style: {
									transformOrigin: (dir && dir == "rtl" ? "top right" : "top left"), left: "unset"
								}
							}}
						/>
					) : (
						<div className="ec-dialog-header">
							<DockItemLabel primary={getTranslation("listPanel.entityCollection.entityCollectionEdit.dockItemLabel")} />
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
								<Translate value="listPanel.entityCollection.entityCollectionEdit.copytoNew" />
							</a>
						) : (
							<Translate value="listPanel.entityCollection.entityCollectionEdit.emptyColl" />
						)}
					</div>
				)}
				<section>
					{collectionMembersLength > 10 ? (
						<AutoSizer disableHeight>
							{({ width }) => (
								<List
									rowCount={collectionMembersLength}
									width={width}
									rowHeight={66}
									height={
										collectionMembersLength > 8
											? 500
											: collectionMembersLength * 60
									}
									rowRenderer={rowRenderer}
									overscanRowCount={1}
									ref={virtualList}
								/>
							)}
						</AutoSizer>
					) : (
						Object.values(collectionMembers).map(item => {
							return (
								<div
									className={`ec-dialog-item dockItem ${removalArray.includes(item.id)
										? "ec-remove"
										: "ec-keep"
										}`}
									key={item.id}
								>
									{getIcon(item.entityData.properties.type)}
									<DockItemLabel
										primary={item.entityData.properties.name ? item.entityData.properties.name : item.id ? item.id.toUpperCase() : ""}
										secondary={item.entityData.properties.type}
									/>
									{canRemoveFromThisCollection && (
										<i
											className="material-icons"
											onClick={() => handleRemoveMember(item.id)}
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
			<Dialog
				className="ec-delete-dialog"
				open={deleteDialogOpen}
				title={getTranslation("listPanel.entityCollection.entityCollectionEdit.deleteDialog.title")}
				onRequestClose={handleDeleteClose}
				children={
					<p><Translate value="listPanel.entityCollection.entityCollectionEdit.deleteDialog.confirmText" /></p>
				}
				actions={deleteActions}
			/>
			<EntityAddToCollection
				open={collectionDialogOpen}
				close={handleCollectionDialogClose}
				addition={Object.values(collectionMembers).map(item => {
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
		</Dialog>
	);
};

export default EntityCollectionEdit;