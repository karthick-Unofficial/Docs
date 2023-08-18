import React, { useState, memo } from "react";
import { cameraService, entityStore } from "client-app-core";
import PropTypes from "prop-types";
import { Dialog, SearchField } from "orion-components/CBComponents/";
import {
	List,
	ListItem,
	FormControlLabel,
	Checkbox,
	CircularProgress
} from "@mui/material";

import _ from "lodash";
import { getTranslation } from "orion-components/i18n";
import { useDispatch } from "react-redux";
import { makeStyles } from "@mui/styles";

const propTypes = {
	dialog: PropTypes.string,
	title: PropTypes.string,
	closeDialog: PropTypes.func,
	entityId: PropTypes.string,
	entityType: PropTypes.string,
	entity: PropTypes.object,
	linkEntities: PropTypes.func,
	autoFocus: PropTypes.bool,
	dir: PropTypes.string
};

const defaultProps = {
	autoFocus: false,
	dir: "ltr"
};

const handleSubmit = (entity, linkType, linkEntities, linkUpdates, linkedTo, dispatch) => {

	// Filter out memberships from added collections
	const linkedEntities = linkUpdates.added.filter(
		value => {
			const linkedIds = linkedTo.map(link => link.id);
			return !linkedIds.includes(value.id);
		}
	);

	if (linkedEntities.length) {
		dispatch(linkEntities(
			entity,
			linkType,
			linkedEntities
		));
	}

};

const handleEntityToggle = (entity, checked, linkUpdates, setLinkUpdates, linkedTo) => {
	const added = [...linkUpdates.added];
	const member = linkedTo.includes(entity.id);
	if (checked) {
		setLinkUpdates({
			added: [...added, {
				type: entity.entityType,
				id: entity.id
			}]
		});
	} else if (!checked && member) {
		const values = added.filter(value => value.id !== entity.id);
		setLinkUpdates({
			added: values
		});
	} else {
		const values = added.filter(value => value.id !== entity.id);
		setLinkUpdates({
			added: values
		});
	}
};

const useStyles = makeStyles({
	label: {
		overflow: "hidden",
		whiteSpace: "nowrap",
		textOverflow: "ellipsis",
		padding: "0 20px"
	}
});
const LinkDialog = ({
	dialog,
	title,
	closeDialog,
	entity,
	linkEntities,
	autoFocus,
	dir
}) => {
	const dispatch = useDispatch();
	const classes = useStyles();

	const [linkedTo, setLinkedTo] = useState([]);
	const [linkUpdates, setLinkUpdates] = useState({ added: [] });
	const [entities, setEntities] = useState([]);
	const [search, setSearch] = useState({ querying: false, error: null });
	const listStyles = {
		list: {
			maxHeight: "300px",
			overflow: "auto",
			flexBasis: "45%"
		},
		item: {
			backgroundColor: "#41454a",
			marginBottom: ".5rem",
			padding: 0
		},
		primaryText: {
			overflow: "hidden",
			textOverflow: "ellipsis",
			whiteSpace: "nowrap"
		},
		subheader: {
			paddingLeft: 0,
			color: "white"
		}
	};
	const searchStyles = {
		error: {
			textAlign: "center",
			padding: "10px",
			color: "#fff"
		},
		progress: {
			textAlign: "center",
			padding: "15px 0"
		}
	};
	const handleQuery = (query) => {

		let queryFinished = false;
		setTimeout(() => {
			if (!queryFinished && query.length) {
				setSearch(...search, { querying: true });
			}
		}, 500);

		if (query.length) {
			const serviceCall = entity.entityType === "camera" ? entityStore.getEntitiesForLinking.bind(entityStore) : cameraService.getCamerasForLinking.bind(cameraService);
			if (serviceCall) {
				serviceCall(entity.id, entity.entityType, query, 5, (err, res) => {
					queryFinished = true;
					if (err) {
						console.log(err);
						setSearch({ error: getTranslation("global.sharedComponents.linkDialog.errorText.errorOccured"), querying: false });
					}
					if (!res || !res.success) {
						setSearch({ error: getTranslation("global.sharedComponents.linkDialog.errorText.errorOccured"), querying: false });
						return;
					} else if (res.result instanceof Array && res.result.length < 1) {
						setSearch({ error: getTranslation("global.sharedComponents.linkDialog.errorText.noItemsFound"), querying: false });
					} else {
						const linkedTo = _.map(
							_.filter(res.result, camera => camera.linkedWith),
							camera => { return { id: camera.id, entityType: "camera" }; }
						);
						const unlinkedEntities = res.result.filter(
							entity => {
								const linkedIds = linkedTo.map(link => link.id);
								return !linkedIds.includes(entity.id);
							}
						);
						setLinkedTo(linkedTo);
						setEntities(unlinkedEntities);
						setLinkUpdates({ added: linkedTo });
						setSearch({ querying: false, error: null });
					}
				});
			}
		} else {
			queryFinished = true;
			setSearch({ querying: false, error: null });
		}
	};

	const sortedEntities = entities.sort((a, b) => {
		if (a.entityData && b.entityData && a.entityData.properties && b.entityData.properties && a.entityData.properties.name && b.entityData.properties.name) {
			if (a.entityData.properties.name.toUpperCase() > b.entityData.properties.name.toUpperCase()) {
				return 1;
			}
			if (a.entityData.properties.name.toUpperCase() < b.entityData.properties.name.toUpperCase()) {
				return -1;
			}
		}
		return 0;
	});
	const handleSearch = _.debounce(e => {
		if (!e.target.value) {
			setLinkUpdates({ added: [] });
			setEntities([]);
			setLinkedTo([]);
			setSearch({ querying: false, error: null });
		} else {
			handleQuery(e.target.value);
		}
	}, 500);

	return (
		<Dialog
			open={dialog === "link-entity-dialog"}
			options={{ maxWidth: "sm" }}
			title={title}
			confirm={{
				label: getTranslation("global.sharedComponents.linkDialog.continue"),
				action: () => {
					handleSubmit(entity, "manually-assigned-camera", linkEntities, linkUpdates, linkedTo, dispatch);
					setLinkUpdates({ added: [] });
					setEntities([]);
					setLinkedTo([]);
					setSearch({ querying: false, error: null });
					dispatch(closeDialog("link-entity-dialog"));
				}
			}}
			abort={{
				label: getTranslation("global.sharedComponents.linkDialog.cancel"), action: () => {
					setLinkUpdates({ added: [] });
					setEntities([]);
					setLinkedTo([]);
					setSearch({ querying: false, error: null });
					dispatch(closeDialog("link-entity-dialog"));
				}
			}}
			dir={dir}
		>
			<SearchField
				handleChange={handleSearch}
				handleClear={() => {
					setLinkUpdates({ added: [] });
					setEntities([]);
					setLinkedTo([]);
					setSearch({ querying: false, error: null });
				}}
				width="320px"
				placeholder={getTranslation("global.sharedComponents.linkDialog.wantToFind")}
				autoFocus={autoFocus}
				dir={dir}
			/>
			<div style={{ minWidth: "45%", margin: "0 1%" }}>
				<List style={listStyles.list}>
					{search.querying ? (
						<div style={searchStyles.progress} >
							<CircularProgress size={60} thickness={5} />
						</div>
					) : search.error ? (
						<div style={searchStyles.error}>
							<p> {search.error}</p>
						</div>
					) : sortedEntities.map(entity => {
						const checkbox = (
							<FormControlLabel
								className="themedCheckBox"
								control={
									<Checkbox
										checked={linkUpdates.added.some(added => added.id === entity.id)}
										onChange={(e, checked) =>
											handleEntityToggle(entity, checked, linkUpdates, setLinkUpdates, linkedTo)
										}
									/>}
								label={
									<div style={listStyles.primaryText}>
										{entity.entityData.properties.name}
									</div>}
								sx={{ height: "48px", width: "100%", margin: "0px", padding: "7px" }}
								classes={{ label: classes.label }}
							/>

						);

						return (
							<ListItem
								key={entity.id}
								style={listStyles.item}
							>
								{checkbox}
							</ListItem>
						);
					})
					}
				</List>
			</div>
		</Dialog>
	);
};

LinkDialog.propTypes = propTypes;
LinkDialog.defaultProps = defaultProps;

export default memo(LinkDialog);