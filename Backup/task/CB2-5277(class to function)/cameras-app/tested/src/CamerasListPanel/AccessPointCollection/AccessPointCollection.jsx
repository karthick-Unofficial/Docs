import React, { Fragment } from "react";
import { Collection, CollectionItem } from "orion-components/CBComponents";
import MapFilterContainer from "./MapFilter/MapFilterContainer";
import { CheckCircle } from "@material-ui/icons";
import _ from "lodash";
import { getTranslation } from "orion-components/i18n/I18nContainer";

const AccessPointCollection = ({ collection, searchValue, dir, loadProfile, accessPoints }) => {

	const handleEntityClick = entity => {
		const { id } = entity;
		const member = accessPoints[id];
		loadProfile(
			member.id,
			member.entityData.properties.name,
			member.entityType,
			"profile"
		);
	};

	const getCollectionMembers = () => {
		const filteredMembers = _.pickBy(accessPoints, member => {
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
	const itemCount = `${_.size(members)} ${_.size(members) === 1 ? getTranslation("camerasListPanel.cameraCollection.item") : getTranslation("camerasListPanel.cameraCollection.items")
	}`;

	return !_.size(members) && !!searchValue ? (
		<div />
	) : (
		<Fragment>
			<Collection
				primaryText={name}
				secondaryText={itemCount}
				filterButton={
					<MapFilterContainer id={id || collection.members} items={members} />
				}
				dir={dir}
			>
				{_.map(members, member => {
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
