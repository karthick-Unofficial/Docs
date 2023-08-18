import React, { useRef } from "react";
import { CollectionCardItem } from "orion-components/CBComponents";
import PropTypes from "prop-types";

const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);
//Entities sort order or categorization order.
const entityOrder = ["facility", "track", "camera", "shapes", "Point", "Polygon", "LineString"];

const SortProximityEntities = ({ entities, radius, loadProfile, handleLoadEntityDetails, widgetExpanded }) => {
	const prevEntitiesLengthRef = useRef(entities?.length || 0);

	// checks if the entities in the radius range.
	const filteredEntities = entities.filter((entity) => entity.proximityId === Number(radius));

	// Performing categorization not based on entity order.
	const categorizedEntities = filteredEntities.reduce((acc, entity) => {
		const entityType = entity.entityType === "shapes" ?
			(entity.entityData.type !== "Feature" ? entity.entityData.type : entity.entityData.geometry.type)
			: entity.entityType;

		if (!acc[entityType]) {
			acc[entityType] = [];
		}

		acc[entityType].push(entity);

		return acc;
	}, {});

	// Performing sorting on categorizedEntities based on entityOrder.
	const sortCategorized = Object.fromEntries(
		entityOrder.filter((key) => hasOwn(categorizedEntities, key)).map((key) => [key, categorizedEntities[key]])
	);

	// Sorting each entity's child or value alphabetically.
	for (const entities of Object.values(sortCategorized)) {
		entities.sort((a, b) => {
			const nameA = a.entityData?.properties?.name?.toUpperCase() || a.id.toUpperCase();
			const nameB = b.entityData?.properties?.name?.toUpperCase() || b.id.toUpperCase();

			if (nameA < nameB) {
				return -1;
			}

			if (nameA > nameB) {
				return 1;
			}

			return 0;
		});
	}

	prevEntitiesLengthRef.current = entities.length;

	const renderedEntities = Object.entries(sortCategorized).map(([entityType, entities]) => {
		return entities.map((entity) => {
			const { entityData, feedId, id, isDeleted } = entity;
			const { name, type, subtype } = entityData.properties;

			return (
				<CollectionCardItem
					canRemove={false}
					disabled={isDeleted}
					feedId={feedId}
					handleClick={loadProfile ? () => handleLoadEntityDetails(entity) : null}
					id={id}
					key={id}
					name={name}
					type={widgetExpanded ? subtype || type : ""}
					showIcon={true}
					entityType={entityType}
				/>
			);
		});
	});

	return <>{renderedEntities}</>;
};

const MemoizedSortProximityEntities = React.memo(SortProximityEntities, (prevProps, nextProps) => {
	// Only re-render if the length of entities has changed
	return prevProps.entities.length === nextProps.entities.length;
});

SortProximityEntities.propTypes = {
	entities: PropTypes.any.isRequired,
	radius: PropTypes.number.isRequired,
	loadProfile: PropTypes.bool.isRequired,
	handleLoadEntityDetails: PropTypes.func.isRequired,
	widgetExpanded: PropTypes.bool.isRequired
};

export default MemoizedSortProximityEntities;
