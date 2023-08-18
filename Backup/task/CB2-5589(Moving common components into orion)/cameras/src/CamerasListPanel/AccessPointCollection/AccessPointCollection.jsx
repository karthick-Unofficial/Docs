import React, { Fragment } from "react";
import { Collection, CollectionItem, MapFilter } from "orion-components/CBComponents";
import { CheckCircle } from "@mui/icons-material";
import { getTranslation } from "orion-components/i18n";
import { useSelector, useDispatch } from "react-redux";
import { loadProfile } from "./accessPointCollectionActions";
import { feedEntitiesByTypeSelector, makeGetCollection, makeGetCollectionMembers } from "orion-components/GlobalData/Selectors";
import { getDir } from "orion-components/i18n/Config/selector";
import * as mapFilterActions from "./MapFilter/mapFilterActions";
import pickBy from "lodash/pickBy";
import size from "lodash/size";
import map from "lodash/map";

const AccessPointCollection = (props) => {
	const { searchValue } = props;
	const dispatch = useDispatch();

	const getCollection = makeGetCollection();
	const getCollectionMember = makeGetCollectionMembers();
	const accessPoints = useSelector(state => props.id === "all_accessPoints" ? feedEntitiesByTypeSelector("accessPoint")(state) : getCollectionMember(state, props));
	const collection = useSelector(state => props.id === "all_accessPoints" ? props.collection : getCollection(state, props));
	const dir = useSelector(state => getDir(state));


	const handleEntityClick = entity => {
		const { id } = entity;
		const member = accessPoints[id];
		dispatch(loadProfile(
			member.id,
			member.entityData.properties.name,
			member.entityType,
			"profile"
		));
	};

	const getCollectionMembers = () => {
		const filteredMembers = pickBy(accessPoints, member => {
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
	const itemCount = `${size(members)} ${size(members) === 1 ? getTranslation("camerasListPanel.cameraCollection.item") : getTranslation("camerasListPanel.cameraCollection.items")
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
							geometry={true}
							dir={dir}
						/>
					);
				})}
			</Collection>
		</Fragment>
	);
};

export default AccessPointCollection;
