import React from "react";
import { Collection, CollectionItem } from "orion-components/CBComponents";
import { timeConversion } from "client-app-core";
import { Event, DashboardCustomize, PriorityHigh, Check, CalendarMonth } from "@mui/icons-material";
import moment from "moment";
import { getTranslation } from "orion-components/i18n";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { loadProfile } from "orion-components/ContextPanel/Actions";
import { getDir } from "orion-components/i18n/Config/selector";
import { selectedEntityState } from "orion-components/ContextPanel/Selectors";
import { userFeedsSelector } from "orion-components/GlobalData/Selectors";

const propTypes = {
	event: PropTypes.object,
	locale: PropTypes.string,
	selectFloorPlanOn: PropTypes.func,
	getPinnedItems: PropTypes.func,
	profileIconTemplate: PropTypes.string,
	filterType: PropTypes.string,
	floorPlansWithFacilityFeed: PropTypes.object,
	targetingEnabled: PropTypes.bool,
	eventIconStyles: PropTypes.obj
};

const defaultProps = {
	locale: "en",
	selectFloorPlanOn: () => {},
	floorPlansWithFacilityFeed: null
};

const EventCard = (props) => {
	const {
		event,
		selectFloorPlanOn,
		getPinnedItems,
		profileIconTemplate,
		filterType,
		targetingEnabled,
		eventIconStyles
	} = props;
	const dispatch = useDispatch();

	const eventStats = useSelector((state) => state.globalData.events.eventStatistics[event.id]);
	const locale = useSelector((state) => state.i18n.locale);
	const selectedEntity = useSelector((state) => selectedEntityState(state));
	const commentCount = eventStats ? eventStats.commentCount : null;
	const timeFormatPreference = useSelector((state) => state.appState.global.timeFormat);
	const dir = useSelector((state) => getDir(state));
	const floorPlansWithFacilityFeed = useSelector((state) =>
		state.globalData && state.globalData.floorPlanWithFacilityFeedId
			? state.globalData.floorPlanWithFacilityFeedId.floorPlans
			: null
	);
	const userFeeds = useSelector((state) => userFeedsSelector(state));
	const pinnedItems = useSelector((state) => getPinnedItems && getPinnedItems(state, props));
	let profileIconTemplates;

	if (profileIconTemplate) {
		profileIconTemplates = {};
		Object.values(userFeeds).forEach((feed) => {
			profileIconTemplates[feed.feedId] = feed.profileIconTemplate;
		});
	}

	const handleEventClick = () => {
		dispatch(loadProfile(event.id, event.name, "event", "profile"));
	};

	const loadEntityData = (entity) => {
		dispatch(loadProfile(entity.id, entity.entityData.properties.name, entity.entityType, "profile"));
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

	const { name, id, description, isTemplate, entityData, feedId, sharedBy } = event;
	const endDate = event.endDate ? moment(event.endDate) : null;
	let secondaryText = "";

	if (isTemplate) {
		secondaryText = description;
	} else {
		const expired = event.endDate ? moment(event.endDate) < moment() : false;
		const dateTimeFormat = `MMM D, YYYY ${timeFormatPreference === "24-hour" ? "H" : "h"}:mm ${
			timeFormatPreference === "24-hour" ? "" : "A "
		}z`;
		const startDate = moment(event.startDate);
		const endDisplayDate = endDate
			? getTranslation("global.events.closed") + timeConversion.convertToUserTime(endDate, dateTimeFormat)
			: null;

		if (expired) {
			secondaryText = endDisplayDate;
		} else {
			secondaryText =
				startDate.format("MDY") === moment().format("MDY") && startDate < moment()
					? getTranslation("global.events.started") +
					  timeConversion.convertToUserTime(
							moment(startDate).locale(locale),
							`time_${timeFormatPreference}`
					  ) +
					  getTranslation("global.events.today")
					: startDate.format("MDY") !== moment().format("MDY") &&
					  startDate < moment() &&
					  moment().format("YYYY") !== startDate.format("YYYY")
					? getTranslation("global.events.started") +
					  timeConversion.convertToUserTime(moment(startDate).locale(locale), dateTimeFormat)
					: startDate < moment()
					? getTranslation("global.events.started") +
					  timeConversion.convertToUserTime(moment(startDate).locale(locale), dateTimeFormat)
					: getTranslation("global.events.starts") +
					  timeConversion.convertToUserTime(moment(startDate).locale(locale), dateTimeFormat);
		}
	}

	const styles = {
		statusIcon: {
			borderRadius: "5px",
			fill: "#fff",
			fontSize: "1.5rem",
			padding: 5
		}
	};

	const childSelected = selectedEntity && pinnedItems && Object.keys(pinnedItems).indexOf(selectedEntity.id) >= 0;

	const collectionIcon = () => {
		switch (filterType) {
			case "active":
				return <PriorityHigh style={{ ...styles.statusIcon, background: "#65ac50" }} />;
			case "scheduled":
				return <CalendarMonth style={{ ...styles.statusIcon, background: "#4885ba" }} />;
			case "closed":
				return <Check style={{ ...styles.statusIcon, background: "#979798" }} />;
			default:
				return endDate ? <Event fontSize="large" /> : <DashboardCustomize style={{ fontSize: "1.5rem" }} />;
		}
	};

	return (
		<Collection
			key={id}
			id={id}
			primaryText={name}
			secondaryText={secondaryText}
			icon={collectionIcon()}
			selected={selectedEntity && event.id === selectedEntity.id}
			childSelected={childSelected}
			handleSelect={handleEventClick}
			commentCount={commentCount}
			dir={dir}
			filterType={filterType}
			geometry={entityData && entityData.geometry}
			feedId={feedId}
			sharedBy={sharedBy}
			targetingEnabled={targetingEnabled}
			iconStyles={eventIconStyles}
		>
			{pinnedItems &&
				Object.values(pinnedItems).map((item) => {
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
