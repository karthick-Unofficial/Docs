import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { CollectionItem } from "../CBComponents";
const propTypes = {
	accessPoint: PropTypes.object.isRequired,
	loadProfile: PropTypes.func.isRequired,
	dir: PropTypes.string
};

const AccessPointCard = ({ accessPoint, loadProfile, dir }) => {
	const { id, entityData } = accessPoint;
	const handleSelect = useCallback(() => {
		if (entityData.properties) {
			loadProfile(id, entityData.properties.name, "accessPoint", "profile");
		}
	}, [entityData, id, loadProfile]);
	return (
		<CollectionItem
			item={{ id, feedId: accessPoint.feedId ? accessPoint.feedId : "accessPoints" }}
			type="Access Point"
			primaryText={entityData.properties.name}
			secondaryText={entityData.properties.description}
			geometry={entityData.geometry}
			handleSelect={handleSelect}
			dir={dir}
		/>
	);
};

AccessPointCard.propTypes = propTypes;

export default AccessPointCard;
