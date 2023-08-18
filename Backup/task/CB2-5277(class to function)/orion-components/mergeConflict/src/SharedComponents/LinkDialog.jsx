import React, { useState, memo } from "react";
import { cameraService, entityStore } from "client-app-core";
import PropTypes from "prop-types";
import { Dialog, SearchField } from "orion-components/CBComponents/";
import {
	List,
	ListItem,
	Checkbox,
	CircularProgress
} from "material-ui";

import _ from "lodash";
import { getTranslation } from "orion-components/i18n/I18nContainer";

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

const handleSubmit = (entity, linkType, linkEntities, linkUpdates, linkedTo) => {
	// Filter out memberships from added collections
	const linkedEntities = linkUpdates.added.filter(
		value => {
			const linkedIds = linkedTo.map(link => link.id);
			return !linkedIds.includes(value.id);
		}
	);

	if (linkedEntities.length) {
		linkEntities(
			entity,
			linkType,
			linkedEntities
		);
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


const LinkDialog = ({
	dialog,
	title,
	closeDialog,
	entity,
	linkEntities,
	autoFocus,
	dir
}) => {
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
			marginBottom: ".5rem"
		},
		itemRTL: {
			backgroundColor: "#41454a",
			marginBottom: ".5rem",
			direction: "ltr"
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
			padding: "10px"
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
					handleSubmit(entity, "manually-assigned-camera", linkEntities, linkUpdates, linkedTo);
					setLinkUpdates({ added: [] });
					setEntities([]);
					setLinkedTo([]);
					setSearch({ querying: false, error: null });
					closeDialog("link-entity-dialog");
				}
			}}
			abort={{
				label: getTranslation("global.sharedComponents.linkDialog.cancel"), action: () => {
					setLinkUpdates({ added: [] });
					setEntities([]);
					setLinkedTo([]);
					setSearch({ querying: false, error: null });
					closeDialog("link-entity-dialog");
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
							<Checkbox
								checked={linkUpdates.added.some(added => added.id === entity.id)}
								onCheck={(e, checked) =>
									handleEntityToggle(entity, checked, linkUpdates, setLinkUpdates, linkedTo)
								}
							/>
						);

						return (
							<ListItem
								key={entity.id}
								primaryText={
									// Prevent inconsistent list item heights with long collection names
									<div style={listStyles.primaryText}>
										{entity.entityData.properties.name}
									</div>
								}
								leftCheckbox={checkbox}
								style={dir == "rtl" ? listStyles.itemRTL : listStyles.item}
							/>
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