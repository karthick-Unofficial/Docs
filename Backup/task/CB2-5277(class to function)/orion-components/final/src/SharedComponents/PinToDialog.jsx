import React, { useEffect, useState } from "react";
import { eventService, entityCollection } from "client-app-core";

import {
	Dialog,
	FlatButton,
	List,
	ListItem,
	Checkbox,
	Subheader,
	TextField
} from "material-ui";

import _ from "lodash";
import $ from "jquery";
import { Translate, getTranslation } from "orion-components/i18n/I18nContainer";

const PinToDialog = ({
	open,
	addRemoveFromCollections,
	addRemoveFromEvents,
	canManageEvents,
	canPinToCollections,
	close,
	openDialog,
	closeDialog,
	createCollection,
	entity,
	dialog, userId, dir
}) => {
	const [events, setEvents] = useState([]);
	const [pinnedTo, setPinnedTo] = useState([]);
	const [collections, setCollections] = useState([]);
	const [memberships, setMemberships] = useState([]);
	const [collectionUpdates, setCollectionUpdates] = useState({ added: [], removed: [] });
	const [eventUpdates, setEventUpdates] = useState({ added: [], removed: [] });
	const [newCollection, setNewCollection] = useState("");
	const [errorText, setErrorText] = useState("");

	useEffect(() => {

		if (open) {
			eventService.getEventsForPinningEntity(entity.id, (err, response) => {
				if (err) console.log(err);
				if (!response) return;
				const pinnedTo = _.map(
					_.filter(response, event => event.entityPinned),
					event => event.id
				);
				setEvents(response);
				setPinnedTo(pinnedTo);
				setEventUpdates({ ...eventUpdates, added: pinnedTo });
			});
			entityCollection.getCollectionsForPinningEntity(
				entity.id,
				(err, response) => {
					if (err) console.log(err);
					if (!response) return;
					const memberships = _.map(
						_.filter(response, collection => collection.entityPinned),
						collection => collection.id
					);
					setCollections(response);
					setMemberships(memberships);
					setCollectionUpdates({ ...collectionUpdates, added: memberships });
				}
			);
		}
	}, [open]);

	const handleCollectionToggle = (collection, checked) => {
		const added = [...collectionUpdates.added];
		const removed = [...collectionUpdates.removed];

		const member = memberships.includes(collection.id);

		if (checked) {
			const values = removed.filter(value => value.id !== collection.id);
			setCollectionUpdates({ added: [...added, { name: collection.name, id: collection.id }], removed: values });
		} else if (!checked && member) {
			const values = added.filter(value => value !== collection.id);
			setCollectionUpdates({
				added: values,
				removed: [...removed, { name: collection.name, id: collection.id }]
			});
		} else {
			const values = added.filter(value => value.id !== collection.id);
			setCollectionUpdates({
				added: values,
				removed: removed
			});
		}
	};

	const handleEventToggle = (id, checked) => {
		const added = [...eventUpdates.added];
		const removed = [...eventUpdates.removed];
		const member = pinnedTo.includes(id);

		if (checked) {
			const values = removed.filter(value => value !== id);
			setEventUpdates({ added: [...added, id], removed: values });
		} else if (!checked && member) {
			const values = added.filter(value => value !== id);
			setEventUpdates({
				added: values,
				removed: [...removed, id]
			});
		} else {
			const values = added.filter(value => value !== id);
			setEventUpdates({
				added: values,
				removed: removed
			});
		}
	};

	const handleSubmit = () => {
		const removedCollections = [...collectionUpdates.removed];
		const removedEvents = [...eventUpdates.removed];

		// Filter out memberships from added collections
		const addedCollections = collectionUpdates.added.filter(
			value => !memberships.includes(value)
		);

		const addedEvents = eventUpdates.added.filter(
			value => !pinnedTo.includes(value)
		);

		if (addedCollections.length + removedCollections.length > 0) {
			const name = entity.entityData.properties.name
				? entity.entityData.properties.name
				: entity.id;
			const entityType = entity.entityType;
			const feedId = entity.feedId;
			addRemoveFromCollections(
				entity.id,
				addedCollections,
				removedCollections,
				name,
				entityType,
				feedId,
				false
			);
		}

		if (addedEvents.length + removedEvents.length > 0) {
			addRemoveFromEvents(
				entity.id,
				entity.entityType,
				entity.feedId,
				addedEvents,
				removedEvents
			);
		}
		setCollectionUpdates({ added: [], removed: [] });
		setEventUpdates({ added: [], removed: [] });
		handleClose();
	};

	const handleClose = () => {
		setCollectionUpdates({ added: [], removed: [] });
		setEventUpdates({ added: [], removed: [] });
		setNewCollection("");
		close();
	};

	const handleOpenAddNew = () => {
		handleClose();
		openDialog("addToNewCollection");
	};

	const handleCloseAddNew = () => {
		setNewCollection("");
		closeDialog("addToNewCollection");
	};

	const handleNewCollectionChange = event => {
		setNewCollection(event.target.value);
		if (errorText.length > 0) {
			setErrorText("");
		}
	};

	const handleSubmitAddNew = () => {
		if (newCollection.length < 1) {
			setErrorText(getTranslation("global.sharedComponents.pinToDialog.errorText.enterValidName"));
			return;
		}

		createCollection(newCollection, [{
			id: entity.id,
			name: entity.entityData.properties.name
				? entity.entityData.properties.name
				: entity.id.toUpperCase(),
			entityType: entity.entityType,
			feedId: entity.feedId
		}]);

		handleCloseAddNew();
	};

	const addToActions = [
		<FlatButton
			label={getTranslation("global.sharedComponents.pinToDialog.addToColl")}
			disabled={!canPinToCollections}
			onClick={handleOpenAddNew}
			primary={true}
			style={dir == "rtl" ? { marginLeft: "auto" } : { marginRight: "auto" }}
		/>,
		<FlatButton
			label={getTranslation("global.sharedComponents.pinToDialog.cancel")}
			onClick={handleClose}
			style={{ color: "#828283" }}
		/>,
		<FlatButton label={getTranslation("global.sharedComponents.pinToDialog.submit")} onClick={handleSubmit} primary={true} />
	];

	const addNewActions = [
		<FlatButton
			label={getTranslation("global.sharedComponents.pinToDialog.cancel")}
			onClick={handleCloseAddNew}
			style={{ color: "#828283" }}
		/>,
		<FlatButton
			label={getTranslation("global.sharedComponents.pinToDialog.submit")}
			onClick={handleSubmitAddNew}
			primary={true}
		/>
	];

	const mobile = $(window).width() <= 675;

	const addToDialogStyles = {
		content: {
			maxWidth: 600
		},
		body: {
			display: "flex",
			justifyContent: mobile ? "flex-start" : "space-around",
			flexDirection: mobile ? "column" : "row"
		},
		actions: {
			display: "flex",
			flexWrap: "wrap",
			justifyContent: "center"
		}
	};

	const addNewDialogStyles = {
		content: {
			maxWidth: 500
		}
	};

	const listStyles = {
		list: {
			maxHeight: "300px",
			overflow: "auto",
			flexBasis: "45%"
		},
		item: {
			backgroundColor: "#41454a",
			marginBottom: ".5rem"
		},
		primaryText: {
			overflow: "hidden",
			textOverflow: "ellipsis",
			whiteSpace: "nowrap"
		},
		subheader: {
			paddingLeft: 0,
			color: "white"
		},
		subheaderRTL: {
			paddingRight: 0,
			color: "white"
		}
	};
	// All collections the user has permission to pin to
	const filteredCollections = collections;

	const sortedEvents = events.sort((a, b) => {
		if (a.name.toUpperCase() > b.name.toUpperCase()) {
			return 1;
		}
		if (a.name.toUpperCase() < b.name.toUpperCase()) {
			return -1;
		}
		return 0;
	});

	const sortedCollections = filteredCollections.sort((a, b) => {
		if (a.name.toUpperCase() > b.name.toUpperCase()) {
			return 1;
		}
		if (a.name.toUpperCase() < b.name.toUpperCase()) {
			return -1;
		}
		return 0;
	});


	return (
		<div>
			<Dialog
				open={open}
				onRequestClose={handleClose}
				title={getTranslation("global.sharedComponents.pinToDialog.pinItem")}
				actions={addToActions}
				contentStyle={addToDialogStyles.content}
				bodyStyle={addToDialogStyles.body}
				actionsContainerStyle={addToDialogStyles.actions}
				autoScrollBodyContent={true}
			>
				<div style={{ minWidth: "45%", margin: "0 1%" }}>
					<Subheader style={dir == "rtl" ? listStyles.subheaderRTL : listStyles.subheader}><Translate value="global.sharedComponents.pinToDialog.collections" /></Subheader>
					<List style={listStyles.list}>
						{sortedCollections.map(collection => {
							const checkbox = (
								<Checkbox
									disabled={!canPinToCollections && memberships.includes(collection.id)}
									checked={collectionUpdates.added.some(added => added.id ? added.id === collection.id : added === collection.id)}
									onCheck={(e, checked) =>
										handleCollectionToggle(collection, checked)
									}
								/>
							);

							return (
								<ListItem
									key={collection.id}
									primaryText={
										// Prevent inconsistent list item heights with long collection names
										<div style={listStyles.primaryText}>
											{collection.name}
										</div>
									}
									leftCheckbox={checkbox}
									style={listStyles.item}
								/>
							);
						})}
					</List>
				</div>
				<div style={{ minWidth: "45%", margin: "0 1%" }}>
					<Subheader style={dir == "rtl" ? listStyles.subheaderRTL : listStyles.subheader}><Translate value="global.sharedComponents.pinToDialog.events" /></Subheader>
					<List style={listStyles.list}>
						{sortedEvents.map(event => {
							const checkbox = (
								<Checkbox
									disabled={!canManageEvents && pinnedTo.includes(event.id)}
									checked={eventUpdates.added.includes(event.id)}
									onCheck={(e, checked) =>
										handleEventToggle(event.id, checked)
									}
								/>
							);
							return (
								<ListItem
									key={event.id}
									primaryText={
										// Prevent inconsistent list item heights with long collection names
										<div style={listStyles.primaryText}>{event.name}</div>
									}
									leftCheckbox={checkbox}
									style={listStyles.item}
								/>
							);
						})}
					</List>
				</div>
			</Dialog>
			{canPinToCollections && (
				<Dialog
					open={dialog === "addToNewCollection"}
					onRequestClose={handleCloseAddNew}
					title={getTranslation("global.sharedComponents.pinToDialog.addToColl")}
					actions={addNewActions}
					contentStyle={addNewDialogStyles.content}
				>
					<TextField
						id="new-collection-name"
						value={newCollection}
						style={{ backgroundColor: "#2C2D2F" }} // Force correct background color in Map app
						floatingLabelText={getTranslation("global.sharedComponents.pinToDialog.enterName")}
						fullWidth={true}
						onChange={handleNewCollectionChange}
						errorText={errorText}
						floatingLabelStyle={{
							style: {
								transformOrigin: (dir && dir == "rtl" ? "top right" : "top left"), left: "unset"
							}
						}}
					/>
				</Dialog>
			)}
		</div>
	);
};

export default PinToDialog;
