import React, { useState, useEffect } from "react";
import { Collection, CollectionItem } from "orion-components/CBComponents";
import { entityCollection, facilityService, timeConversion } from "client-app-core";
import { Event, ReportProblem } from "@material-ui/icons";
import moment from "moment";
import { getTranslation } from "orion-components/i18n/I18nContainer";
import PropTypes from "prop-types";

const propTypes = {
	locale: PropTypes.string,
	selectFloorPlanOn: PropTypes.func,
	floorPlansWithFacilityFeed: PropTypes.object
};

const defaultProps = {
	locale: "en",
	selectFloorPlanOn: () => { },
	floorPlansWithFacilityFeed: null
};

const EventCard = ({
	event,
	loadProfile,
	floorPlansWithFacilityFeed,
	selectFloorPlanOn,
	pinnedItems,
	commentCount,
	profileIconTemplates,
	timeFormatPreference,
	selectedEntity,
	dir,
	locale
}) => {
	const [open, setOpen] = useState(false);

	const handleEventClick = () => {
		loadProfile(event.id, event.name, "event", "profile");
	};

	const loadEntityData = entity => {
		loadProfile(
			entity.id,
			entity.entityData.properties.name,
			entity.entityType,
			"profile"
		);
	};

	const showFloorPlanOnTargetClick = (entity) => {
		const { entityData } = entity;
		if (entityData.displayType === "facility" && floorPlansWithFacilityFeed !== null) {
			const floorPlanData = floorPlansWithFacilityFeed[entityData.displayTargetId];
			if (floorPlanData.id === entityData.displayTargetId) {
				selectFloorPlanOn(floorPlanData, floorPlanData.facilityFeedId);
			}
		}
	};

	const { name, id, description, isTemplate } = event;
	const endDate = event.endDate ? moment(event.endDate) : null;
	let secondaryText = "";

	if (isTemplate) {
		secondaryText = description;
	}
	else {
		const expired = event.endDate ? moment(event.endDate) < moment() : false;
		const dateTimeFormat = `MMM D, YYYY ${timeFormatPreference === "24-hour" ? "H" : "h"}:mm ${timeFormatPreference === "24-hour" ? "" : "A "}z`;
		const startDate = moment(event.startDate);
		const endDisplayDate = endDate
			? getTranslation("global.events.closed") + timeConversion.convertToUserTime(startDate, dateTimeFormat)
			: null;

		if (expired) {
			secondaryText = endDisplayDate;
		}
		else {
			secondaryText = startDate.format("MDY") === moment().format("MDY") && startDate < moment()
				? getTranslation("global.events.started") +
				timeConversion.convertToUserTime(moment(startDate).locale(locale), `time_${timeFormatPreference}`) +
				getTranslation("global.events.today")
				: startDate.format("MDY") !== moment().format("MDY") &&
					startDate < moment() &&
					moment().format("YYYY") !== startDate.format("YYYY")
					? getTranslation("global.events.started") + timeConversion.convertToUserTime(moment(startDate).locale(locale), dateTimeFormat)
					: startDate < moment()
						? getTranslation("global.events.started") + timeConversion.convertToUserTime(moment(startDate).locale(locale), dateTimeFormat)
						: getTranslation("global.events.starts") + timeConversion.convertToUserTime(moment(startDate).locale(locale), dateTimeFormat);
		}
	}

	const childSelected = selectedEntity && pinnedItems && Object.keys(pinnedItems).indexOf(selectedEntity.id) >= 0;

	return (
		<Collection
			key={id}
			primaryText={name}
			secondaryText={secondaryText}
			icon={
				endDate ? (
					<Event fontSize="large" />
				) : (
					<ReportProblem fontSize="large" />
				)
			}
			selected={selectedEntity && event.id === selectedEntity.id}
			childSelected={childSelected}
			handleSelect={handleEventClick}
			commentCount={commentCount}
			dir={dir}
		>
			{pinnedItems &&
				Object.values(pinnedItems).map(item => {
					const { entityData, id } = item;
					const { properties } = entityData;
					const { name, type, subtype } = properties;

					// -- set profileIconTemplate to pass to CollectionItem
					properties.profileIconTemplate = profileIconTemplates[item.feedId];

					return (
						<CollectionItem
							key={id}
							item={item}
							primaryText={name}
							secondaryText={subtype ? subtype : type}
							type={subtype ? subtype : type}
							geometry={true}
							handleSelect={loadEntityData}
							selected={selectedEntity && id === selectedEntity.id}
							dir={dir}
							selectFloor={() => showFloorPlanOnTargetClick(item)}
						/>
					);
				})}
		</Collection>
	);
};

EventCard.propTypes = propTypes;
EventCard.defaultProps = defaultProps;

export default EventCard;
