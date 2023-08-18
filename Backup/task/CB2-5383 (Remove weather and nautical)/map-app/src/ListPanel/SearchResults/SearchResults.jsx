import React from "react";
import { List, AutoSizer } from "react-virtualized";
import { Typography } from "@material-ui/core";
import { CollectionItem } from "orion-components/CBComponents";
import _ from "lodash";
import { Translate, getTranslation } from "orion-components/i18n/I18nContainer";

const Search = ({
	entities,
	searchTerms,
	profileIconTemplates,
	loadProfile,
	selectedEntity,
	dir
}) => {

	const getSearchResults = () => {
		if (searchTerms === "") {
			return null;
		} else {
			return _.filter(entities, entity => {
				const properties = entity.entityData ? entity.entityData.properties : entity ? entity : null;
				if (!properties) return false;

				// -- set profileIconTemplate to pass to CollectionItem
				properties.profileIconTemplate = profileIconTemplates[entity.feedId];

				const { name, description, type } = properties;
				return entity && _.includes(
					`${name}|${description}|${type}|${entity.id}`.toLowerCase(),
					searchTerms || ""
				);
			});
		}
	};

	const handleEntityClick = entity => {
		loadProfile(
			entity.id,
			(entity.name ? entity.name : entity.entityData.properties.name),
			entity.entityType
		);
	};

	const searchResults = getSearchResults();
	const rowRenderer = ({ key, index, isScrolling, isVisible, style }) => {
		let results = null;
		if (searchResults) {
			const entity = searchResults[index];
			const { properties } = entity.entityData ? entity.entityData : {};
			const { id, name, type, subtype } = properties ? properties : {};
			results = (
				<div key={id} style={style}>
					<CollectionItem
						key={id}
						primaryText={name || id}
						secondaryText={subtype ? subtype : type}
						type={subtype ? subtype : type}
						item={entity}
						handleSelect={handleEntityClick}
						selected={selectedEntity && selectedEntity.id == id}
						geometry={true}
						dir={dir}
					/>
				</div>
			);
		}
		return results;
	};

	return (
		<div className="dock-group-wrapper">
			{searchResults && (
				<div>
					<Typography variant="subtitle1" style={{ color: "#FFF" }}>
						{searchResults.length === 1 ? <Translate value="listPanel.searchResults.matchingResult" count={searchResults.length} /> : <Translate value="listPanel.searchResults.matchingResults" count={searchResults.length} />}
					</Typography>
					<div style={{ paddingTop: 8, paddingBottom: 8 }}>
						{searchResults.length > 10 ? (
							<AutoSizer disableHeight>
								{({ width, isScrolling }) => (
									<List
										rowCount={searchResults.length}
										width={width}
										rowHeight={80}
										height={
											searchResults.length > 8
												? 715
												: searchResults.length * 60
										}
										isScrolling={isScrolling}
										rowRenderer={rowRenderer}
										overscanRowCount={1}
									/>
								)}
							</AutoSizer>
						) : (
							searchResults.map(item => {
								const entity = item;
								const properties = entity.entityData ? entity.entityData.properties : entity;
								const { id, name, type, subtype, entityType } = properties;
								return item ? (
									<CollectionItem
										key={id}
										primaryText={name || id}
										secondaryText={subtype ? subtype : type ? type : entityType ? entityType[0].toUpperCase() + entityType.slice(1) : getTranslation("listPanel.searchResults.unknown")}
										type={subtype ? subtype : type ? type : entityType ? entityType[0].toUpperCase() + entityType.slice(1) : "Unknown"}
										item={entity}
										handleSelect={handleEntityClick}
										selected={selectedEntity && selectedEntity.id == id}
										geometry={true}
										dir={dir}
									/>
								) : null;
							})
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default Search;
