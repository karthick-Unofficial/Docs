import React, { Component } from "react";

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
import { Translate } from "orion-components/i18n/I18nContainer";

export default class EntityCollectionEdit extends Component {
	constructor(props) {
		super(props);

		this.state = {
			removalArray: [],
			deleteDialogOpen: false,
			collectionDialogOpen: false,
			shared: this.props.shared,
			sharedStatusChanged: false,
			updatedName: ""
		};

		this.rowRenderer = this.rowRenderer.bind(this);
	}

	UNSAFE_componentWillMount() {
		document.addEventListener("keydown", this._handleKeyDown.bind(this));
	}

	componentWillUnmount() {
		document.removeEventListener("keydown", this._handleKeyDown.bind(this));
	}

	// Enter to submit
	_handleKeyDown = event => {
		if (event.key === "Enter" && this.state.deleteDialogOpen) {
			this.handleSave();
		}
	};

	handleCollectionDialogOpen = () => {
		if (Object.keys(this.props.collectionMembers).length) {
			this.setState({ collectionDialogOpen: true });
		}
	};

	handleCollectionDialogClose = () => {
		this.setState({ collectionDialogOpen: false });
	};

	handleRemoveMember = id => {
		const collectionMemberLength = Object.keys(this.props.collectionMembers).length;
		if (this.state.removalArray.includes(id)) {
			const removeItems = this.state.removalArray;
			removeItems.splice(removeItems.indexOf(id), 1);
			this.setState({
				removalArray: removeItems
			});
			// force virtualized list to update showing item pending removal
			if (collectionMemberLength > 10) {
				this.virtualList.forceUpdate();
				this.virtualList.forceUpdateGrid();
			}
		} else {
			const removeItems = [...this.state.removalArray, id];
			this.setState({
				removalArray: removeItems
			});
			// // force virtualized list to update showing item pending removal
			if (collectionMemberLength > 10) {
				this.virtualList.forceUpdateGrid();
			}
		}
	};

	handleSave = () => {
		const { label, groupId, createUserFeedback } = this.props;
		const { removalArray, updatedName } = this.state;

		let undoFunc;

		if (label !== updatedName && updatedName !== "") {
			this.props.renameCollection(groupId, updatedName);

			// Not in action because it uses itself to undo itself
			undoFunc = () => {
				this.props.renameCollection(groupId, label);
			};

			createUserFeedback(label + " renamed to " + updatedName + ".", undoFunc);
		}

		if (groupId === "my-entities") {
			this.props.removeFromMyItems(removalArray);
		} else if (removalArray.length > 0) {
			this.props.removeFromCollection(label, groupId, removalArray);
		}

		this.props.close();
		this.setState({
			removalArray: [],
			updatedName: ""
		});
	};

	handleClose = () => {
		this.props.close();
		this.setState({
			removalArray: [],
			shared: this.props.shared,
			sharedStatusChanged: false
		});
	};

	handleDeleteOpen = () => {
		this.setState({
			deleteDialogOpen: true
		});
	};

	handleDeleteClose = () => {
		this.setState({
			deleteDialogOpen: false
		});
	};

	handleConfirmDelete = id => {
		this.props.deleteCollection(id, this.props.label);

		this.handleDeleteClose();
		this.props.close();
	};

	handleShareClick = () => {
		this.setState({
			shared: !this.state.shared,
			sharedStatusChanged: !this.state.shared
		});
	};

	handleUpdateName = event => {
		this.setState({
			updatedName: event.target.value
		});
	};

	handleCopyComplete = () => {
		// Close both dialogs when finished copying collections
		this.props.close();
	};

	rowRenderer({ key, index, isScrolling, isVisible, style }) {
		const collectionMemberArr = Object.values(this.props.collectionMembers);
		return (
			<div key={key} style={style}>
				<div>
					<div
						className={`ec-dialog-item dockItem ${
							this.state.removalArray.includes(
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
								this.handleRemoveMember(collectionMemberArr[index].id)
							}
						>
							{this.state.removalArray.includes(
								collectionMemberArr[index].id
							)
								? "add_circle"
								: "cancel"}
						</i>
					</div>
				</div>
			</div>
		);
	}

	render() {
		const {
			isOwner,
			createCollection,
			canRemoveFromThisCollection,
			groupId,
			user,
			dir
		} = this.props;

		const mapApp = _.find(
			user.applications,
			app => app.appId === "map-app"
		);
		const canViewCollections = mapApp && mapApp.config.canView;
		const canEditCollections = mapApp && mapApp.permissions.includes("manage");
		const collectionMembersLength = Object.keys(this.props.collectionMembers).length;
		const hasItems = !!collectionMembersLength;
		const actions = isOwner
			? [
				<FlatButton
					className="ec-delete"
					label={<Translate value="listPanel.entityCollection.entityCollectionEdit.flatButtonLabel.delete"/>}
					primary={true}
					onClick={this.handleDeleteOpen}
					style={{ color: "#E85858", float: "left" }}
				/>,
				<FlatButton
					label={<Translate value="listPanel.entityCollection.entityCollectionEdit.flatButtonLabel.cancel"/>}
					primary={true}
					onClick={this.handleClose}
				/>,
				<FlatButton
					label={<Translate value="listPanel.entityCollection.entityCollectionEdit.flatButtonLabel.confirm"/>}
					primary={true}
					keyboardFocused={true}
					onClick={this.handleSave}
				/>
			  ]
			: [
				<FlatButton
					label={<Translate value="listPanel.entityCollection.entityCollectionEdit.flatButtonLabel.cancel"/>}
					primary={true}
					onClick={this.handleClose}
				/>,
				<FlatButton
					label={<Translate value="listPanel.entityCollection.entityCollectionEdit.flatButtonLabel.confirm"/>}
					primary={true}
					keyboardFocused={true}
					onClick={this.handleSave}
				/>
			  ];

		const deleteActions = [
			<FlatButton
				label={<Translate value="listPanel.entityCollection.entityCollectionEdit.flatButtonLabel.cancel"/>}
				primary={true}
				onClick={this.handleDeleteClose}
			/>,
			<FlatButton
				label={<Translate value="listPanel.entityCollection.entityCollectionEdit.flatButtonLabel.confirm"/>}
				primary={true}
				keyboardFocused={true}
				style={{ color: "#E85858" }}
				onClick={() => this.handleConfirmDelete(this.props.groupId)}
			/>
		];

		return (
			<Dialog
				className="ec-edit-dialog"
				contentStyle={{ width: "360px" }}
				open={this.props.open}
				onRequestClose={() => this.props.close()}
				actions={actions}
			>
				<div className="dock-group-wrapper">
					<div className="ec-dialog-header">
						{groupId !== "my-entities" ? (
							<TextField
								id="collection-name-text-field"
								defaultValue={this.props.label}
								underlineShow={false}
								fullWidth={true}
								disabled={!isOwner && !canEditCollections}
								inputStyle={{ paddingLeft: "1rem" }}
								onChange={this.handleUpdateName}
								floatingLabelStyle={{
									style: {
										transformOrigin: (dir && dir == "rtl" ? "top right": "top left"), left: "unset"
									}
								}}
							/>
						) : (
							<div className="ec-dialog-header">
								<DockItemLabel primary={<Translate value="listPanel.entityCollection.entityCollectionEdit.dockItemLabel"/>} />
							</div>
						)}
					</div>
					{(canViewCollections || isOwner) && (
						<div className="ec-edit-controls">
							{hasItems ? (
								<a
									className="cb-font-link"
									onClick={this.handleCollectionDialogOpen}
								>
									<Translate value="listPanel.entityCollection.entityCollectionEdit.copytoNew"/>
								</a>
							) : (
								<Translate value="listPanel.entityCollection.entityCollectionEdit.emptyColl"/>
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
										rowRenderer={this.rowRenderer}
										overscanRowCount={1}
										ref={ref => (this.virtualList = ref)}
									/>
								)}
							</AutoSizer>
						) : (
							Object.values(this.props.collectionMembers).map(item => {
								return (
									<div
										className={`ec-dialog-item dockItem ${
											this.state.removalArray.includes(item.id)
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
												onClick={() => this.handleRemoveMember(item.id)}
											>
												{this.state.removalArray.includes(item.id)
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
					open={this.state.deleteDialogOpen}
					title={<Translate value="listPanel.entityCollection.entityCollectionEdit.deleteDialog.title"/>}
					onRequestClose={this.handleDeleteClose}
					children={
						<p><Translate value="listPanel.entityCollection.entityCollectionEdit.deleteDialog.confirmText"/></p>
					}
					actions={deleteActions}
				/>
				<EntityAddToCollection
					open={this.state.collectionDialogOpen}
					close={this.handleCollectionDialogClose}
					addition={Object.values(this.props.collectionMembers).map(item => {
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
					handleCopyComplete={this.handleCopyComplete}
					dir={dir}
				/>
			</Dialog>
		);
	}
}
