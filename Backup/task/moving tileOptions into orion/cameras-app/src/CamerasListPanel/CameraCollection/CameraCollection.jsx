import React, { Fragment } from "react";
import { Collection, CollectionItem, MapFilter } from "orion-components/CBComponents";
import { CheckCircle } from "@mui/icons-material";
import { getTranslation } from "orion-components/i18n";
import { useDispatch, useSelector } from "react-redux";
import { feedEntitiesByTypeSelector, makeGetCollection, makeGetCollectionMembers } from "orion-components/GlobalData/Selectors";
import { selectedEntityState } from "orion-components/ContextPanel/Selectors";
import { getDir, getCultureCode } from "orion-components/i18n/Config/selector";
import { loadProfile } from "./cameraCollectionActions";
import * as mapFilterActions from "./MapFilter/mapFilterActions";
import pickBy from "lodash/pickBy";
import size from "lodash/size";
import map from "lodash/map";

const CameraCollection = (props) => {
	const { searchValue } = props;
	const dispatch = useDispatch();

	const getCollection = makeGetCollection();
	const getCollectionMember = makeGetCollectionMembers();
	const cameras = useSelector(state => props.id === "all_cameras" ? feedEntitiesByTypeSelector("camera")(state) : getCollectionMember(state, props));
	const collection = useSelector(state => props.id === "all_cameras" ? props.collection : getCollection(state, props));
	const selectedEntity = useSelector(state => selectedEntityState(state));
	const dir = useSelector(state => getDir(state));
	const locale = useSelector(state => getCultureCode(state));


	const handleEntityClick = entity => {
		const { id } = entity;
		const member = cameras[id];
		dispatch(loadProfile(
			member.id,
			member.entityData.properties.name,
			member.entityType,
			"profile"
		));
	};

	const getCollectionMembers = () => {
		const filteredMembers = pickBy(cameras, member => {
			const { entityData } = member;
			if (entityData) {
				const { properties } = entityData;
				const { name, description, type } = properties;
				return `${name}|${description}|${type}`
					.toLowerCase()
					.includes(searchValue);
			} else {
				return false;
			}
		});
		return filteredMembers;
	};

	const { name, id } = collection;
	const members = getCollectionMembers();
	const childSelected = selectedEntity && Object.keys(members).indexOf(selectedEntity.id) >= 0;
	const itemCount = `${size(members).toLocaleString(locale)} ${size(members) === 1 ? getTranslation("camerasListPanel.cameraCollection.item") : getTranslation("camerasListPanel.cameraCollection.items")
		}`;

	return !size(members) && !!searchValue ? (
		<div />
	) : (
		<Fragment>
			<Collection
				primaryText={name}
				secondaryText={itemCount}
				filterButton={
					<MapFilter {...mapFilterActions} id={id || collection.members} items={members} />
				}
				childSelected={childSelected}
				dir={dir}
			>
				{map(members, member => {
					const { entityData } = member;
					const { properties } = entityData;
					const { id, name, deviceType } = properties;
					return (
						<CollectionItem
							key={id}
							primaryText={name || id.toUpperCase()}
							secondaryText={
								<span style={{ display: "flex", alignItems: "center" }}>
									<CheckCircle style={{ fontSize: 12 }} />
									{deviceType}
								</span>
							}
							item={member}
							handleSelect={handleEntityClick}
							selected={selectedEntity && id === selectedEntity.id}
							geometry={true}
							dir={dir}
						/>
					);
				})}
			</Collection>
		</Fragment>
	);
};

export default CameraCollection;
