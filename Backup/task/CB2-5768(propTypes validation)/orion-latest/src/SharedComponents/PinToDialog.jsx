import React, { useEffect, useState } from "react";
import { eventService, entityCollection } from "client-app-core";

import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Typography,
	Button,
	List,
	ListItem,
	Checkbox,
	ListSubheader,
	TextField,
	FormControlLabel
} from "@mui/material";

import $ from "jquery";
import { Translate, getTranslation } from "orion-components/i18n";
import { makeStyles } from "@mui/styles";
import { useSelector, useDispatch } from "react-redux";
import filter from "lodash/filter";
import map from "lodash/map";

const useStyles = makeStyles({
	checkboxPadding: {
		paddingLeft: ({ dir }) => (dir && dir === "rtl" ? "30px" : "")
	},
	label: {
		overflow: "hidden",
		whiteSpace: "nowrap",
		textOverflow: "ellipsis",
		padding: "0 20px"
	},
	disabled: {
		color: "#fff!important",
		opacity: "0.3"
	}
});

const PinToDialog = ({
	addRemoveFromCollections,
	addRemoveFromEvents,
	canManageEvents,
	canPinToCollections,
	close,
	openDialog,
	closeDialog,
	createCollection,
	entity,
	dir
}) => {
	const dispatch = useDispatch();
	const dialog = useSelector((state) => state.appState?.dialog?.openDialog || "");
	const open = dialog === "pinToDialog";

	const [events, setEvents] = useState([]);
	const [pinnedTo, setPinnedTo] = useState([]);
	const [collections, setCollections] = useState([]);
	const [memberships, setMemberships] = useState([]);
	const [collectionUpdates, setCollectionUpdates] = useState({
		added: [],
		removed: []
	});
	const [eventUpdates, setEventUpdates] = useState({
		added: [],
		removed: []
	});
	const [newCollection, setNewCollection] = useState("");
	const [errorText, setErrorText] = useState("");
	const classes = useStyles({ dir });

	useEffect(() => {
		if (open) {
			eventService.getEventsForPinningEntity(entity.id, (err, response) => {
				if (err) console.log(err);
				if (!response) return;
				const pinnedTo = map(
					filter(response, (event) => event.entityPinned),
					(event) => event.id
				);
				setEvents(response);
				setPinnedTo(pinnedTo);
				setEventUpdates({ ...eventUpdates, added: pinnedTo });
			});
			entityCollection.getCollectionsForPinningEntity(entity.id, (err, response) => {
				if (err) console.log(err);
				if (!response) return;
				const memberships = map(
					filter(response, (collection) => collection.entityPinned),
					(collection) => collection.id
				);
				setCollections(response);
				setMemberships(memberships);
				setCollectionUpdates({
					...collectionUpdates,
					added: memberships
				});
			});
		}
	}, [open]);

	const handleCollectionToggle = (collection, checked) => {
		const added = [...collectionUpdates.added];
		const removed = [...collectionUpdates.removed];

		const member = memberships.includes(collection.id);

		if (checked) {
			const values = removed.filter((value) => value.id !== collection.id);
			setCollectionUpdates({
				added: [...added, { name: collection.name, id: collection.id }],
				removed: values
			});
		} else if (!checked && member) {
			const values = added.filter((value) => (value.id ? value.id !== collection.id : value !== collection.id));
			setCollectionUpdates({
				added: values,
				removed: [...removed, { name: collection.name, id: collection.id }]
			});
		} else {
			const values = added.filter((value) => value.id !== collection.id);
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
			const values = removed.filter((value) => value !== id);
			setEventUpdates({ added: [...added, id], removed: values });
		} else if (!checked && member) {
			const values = added.filter((value) => value !== id);
			setEventUpdates({
				added: values,
				removed: [...removed, id]
			});
		} else {
			const values = added.filter((value) => value !== id);
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
		const addedCollections = collectionUpdates.added.filter((value) => !memberships.includes(value));

		const addedEvents = eventUpdates.added.filter((value) => !pinnedTo.includes(value));

		if (addedCollections.length + removedCollections.length > 0) {
			const name = entity.entityData.properties.name ? entity.entityData.properties.name : entity.id;
			const entityType = entity.entityType;
			const feedId = entity.feedId;
			dispatch(
				addRemoveFromCollections(
					entity.id,
					addedCollections,
					removedCollections,
					name,
					entityType,
					feedId,
					false
				)
			);
		}

		if (addedEvents.length + removedEvents.length > 0) {
			dispatch(addRemoveFromEvents(entity.id, entity.entityType, entity.feedId, addedEvents, removedEvents));
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
		dispatch(openDialog("addToNewCollection"));
	};

	const handleCloseAddNew = () => {
		setNewCollection("");
		dispatch(closeDialog("addToNewCollection"));
	};

	const handleNewCollectionChange = (event) => {
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

		dispatch(
			createCollection(newCollection, [
				{
					id: entity.id,
					name: entity.entityData.properties.name
						? entity.entityData.properties.name
						: entity.id.toUpperCase(),
					entityType: entity.entityType,
					feedId: entity.feedId
				}
			])
		);

		handleCloseAddNew();
	};

	const addToActions = [
		<Button
			key="add-to-coll-action-button"
			disabled={!canPinToCollections}
			onClick={handleOpenAddNew}
			variant="text"
			color="primary"
			style={dir == "rtl" ? { marginLeft: "auto" } : { marginRight: "auto" }}
			classes={{ disabled: classes.disabled }}
		>
			{getTranslation("global.sharedComponents.pinToDialog.addToColl")}
		</Button>,
		<Button
			key="add-to-cancel-action-button"
			variant="text"
			color="primary"
			onClick={handleClose}
			style={{ color: "#828283" }}
		>
			{getTranslation("global.sharedComponents.pinToDialog.cancel")}
		</Button>,
		<Button key="add-to-submit-action-button" variant="text" color="primary" onClick={handleSubmit} primary={true}>
			{getTranslation("global.sharedComponents.pinToDialog.submit")}
		</Button>
	];

	const addNewActions = [
		<Button
			key="add-new-cancel-action-button"
			variant="text"
			color="primary"
			onClick={handleCloseAddNew}
			style={{ color: "#828283" }}
		>
			{getTranslation("global.sharedComponents.pinToDialog.cancel")}
		</Button>,
		<Button
			key="add-new-submit-action-button"
			variant="text"
			color="primary"
			onClick={handleSubmitAddNew}
			primary={true}
		>
			{getTranslation("global.sharedComponents.pinToDialog.submit")}
		</Button>
	];

	const mobile = $(window).width() <= 675;

	const addToDialogStyles = {
		content: {
			maxWidth: 600,
			paddingTop: "10px",
			width: "75%"
		},
		body: {
			display: "flex",
			justifyContent: mobile ? "flex-start" : "space-around",
			flexDirection: mobile ? "column" : "row"
		}
	};

	const addNewDialogStyles = {
		content: {
			maxWidth: 500,
			width: "100%"
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
			...(dir === "ltr" && { paddingLeft: 0 }),
			...(dir === "rtl" && { paddingRight: 0 }),
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
				onClose={handleClose}
				PaperProps={{ sx: { ...addToDialogStyles.content } }}
				scroll="paper"
			>
				<DialogTitle>
					<Typography sx={{ fontWeight: "400", fontSize: "22px" }}>
						{getTranslation("global.sharedComponents.pinToDialog.pinItem")}
					</Typography>
				</DialogTitle>

				<DialogContent
					sx={{
						paddingTop: "25px",
						paddingBottom: "25px",
						borderTop: "none",
						borderBottom: "none"
					}}
					style={addToDialogStyles.body}
				>
					<div style={{ minWidth: "45%", margin: "0 1%" }}>
						<ListSubheader style={listStyles.subheader}>
							<Translate value="global.sharedComponents.pinToDialog.collections" />
						</ListSubheader>
						<List style={listStyles.list}>
							{sortedCollections.map((collection) => {
								const checkbox = (
									<FormControlLabel
										className="themedCheckBox"
										control={
											<Checkbox
												className={classes.checkboxPadding}
												disabled={!canPinToCollections && memberships.includes(collection.id)}
												checked={collectionUpdates.added.some((added) =>
													added.id ? added.id === collection.id : added === collection.id
												)}
												onChange={(e, checked) => handleCollectionToggle(collection, checked)}
											/>
										}
										label={collection.name}
										sx={{
											height: "48px",
											width: "100%",
											margin: "0px",
											padding: "7px"
										}}
										classes={{ label: classes.label }}
									/>
								);

								return (
									<ListItem key={collection.id} style={listStyles.item} disablePadding>
										{checkbox}
									</ListItem>
								);
							})}
						</List>
					</div>
					<div style={{ minWidth: "45%", margin: "0 1%" }}>
						<ListSubheader style={dir == "rtl" ? listStyles.subheaderRTL : listStyles.subheader}>
							<Translate value="global.sharedComponents.pinToDialog.events" />
						</ListSubheader>
						<List style={listStyles.list}>
							{sortedEvents.map((event) => {
								const checkbox = (
									<FormControlLabel
										className="themedCheckBox"
										control={
											<Checkbox
												className={classes.checkboxPadding}
												disabled={!canManageEvents && pinnedTo.includes(event.id)}
												checked={eventUpdates.added.includes(event.id)}
												onChange={(e, checked) => handleEventToggle(event.id, checked)}
											/>
										}
										label={event.name}
										sx={{
											height: "48px",
											width: "100%",
											margin: "0px",
											padding: "7px"
										}}
										classes={{ label: classes.label }}
									/>
								);
								return (
									<ListItem disablePadding key={event.id} style={listStyles.item}>
										{checkbox}
									</ListItem>
								);
							})}
						</List>
					</div>
				</DialogContent>

				<DialogActions>{addToActions}</DialogActions>
			</Dialog>
			{canPinToCollections && (
				<Dialog
					open={dialog === "addToNewCollection"}
					onClose={handleCloseAddNew}
					PaperProps={{ sx: { ...addNewDialogStyles.content } }}
				>
					<DialogTitle sx={{ marginBottom: "1.5rem" }}>
						<Typography sx={{ fontWeight: "400", fontSize: "22px" }}>
							{getTranslation("global.sharedComponents.pinToDialog.addToColl")}
						</Typography>
					</DialogTitle>
					<DialogContent
						sx={{
							paddingTop: "25px",
							paddingBottom: "25px",
							borderTop: "none",
							borderBottom: "none"
						}}
					>
						<TextField
							id="new-collection-name"
							value={newCollection}
							variant="standard"
							style={{ backgroundColor: "#2C2D2F" }} // Force correct background color in Map app
							label={getTranslation("global.sharedComponents.pinToDialog.enterName")}
							fullWidth={true}
							onChange={handleNewCollectionChange}
							errorText={errorText}
							InputLabelProps={{
								style: {
									color: "#646465",
									transformOrigin: dir && dir == "rtl" ? "top right" : "top left",
									left: "unset"
								}
							}}
						/>
					</DialogContent>

					<DialogActions>{addNewActions}</DialogActions>
				</Dialog>
			)}
		</div>
	);
};

export default PinToDialog;
