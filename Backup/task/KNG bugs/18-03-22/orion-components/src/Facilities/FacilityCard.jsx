import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { CollectionItem } from "../CBComponents";
const propTypes = {
	facility: PropTypes.object.isRequired,
	loadProfile: PropTypes.func.isRequired,
	dir: PropTypes.string
};

const FacilityCard = ({ facility, loadProfile, dir }) => {
	const { id, entityData } = facility;
	const handleSelect = useCallback(() => {
		if (entityData.properties) {
			loadProfile(id, entityData.properties.name, "facility", "profile");
		}
	}, [entityData, id, loadProfile]);
	return (
		<CollectionItem
			item={{ id, feedId: facility.feedId ? facility.feedId : "facilities" }}
			type="Facility"
			primaryText={entityData.properties.name}
			secondaryText={entityData.properties.description}
			geometry={entityData.geometry}
			handleSelect={handleSelect}
			dir={dir}
		/>
	);
};

FacilityCard.propTypes = propTypes;

export default FacilityCard;
