import React, { Component } from "react";
import { Collection, CollectionItem } from "orion-components/CBComponents";
import { timeConversion } from "client-app-core";
import { Event, ReportProblem } from "@material-ui/icons";
import moment from "moment";
import { getTranslation } from "orion-components/i18n/I18nContainer";
import PropTypes from "prop-types";

const propTypes = {
	locale: PropTypes.string
};

const defaultProps = {
	locale: "en"
};

class EventCard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false
		};
	}

	handleEventClick = () => {
		const { event, loadProfile } = this.props;
		loadProfile(event.id, event.name, "event", "profile");
	};

	loadEntityData = entity => {
		const { loadProfile } = this.props;
		loadProfile(
			entity.id,
			entity.entityData.properties.name,
			entity.entityType,
			"profile"
		);
	};

	render() {
		const { event, pinnedItems, commentCount, profileIconTemplates, timeFormatPreference, dir, locale } = this.props;

		const expired = event.endDate ? moment(event.endDate) < moment() : false;

		const dateTimeFormat = `MMM D, YYYY ${timeFormatPreference === "24-hour" ? "H" : "h"}:mm ${timeFormatPreference === "24-hour" ? "" : "A "}z`;
		const startDate = moment(event.startDate);
		const endDate = event.endDate ? moment(event.endDate) : null;
		const endDisplayDate = endDate
			? getTranslation("global.events.closed") + timeConversion.convertToUserTime(startDate, dateTimeFormat)
			: null;

		const displayDate =
			startDate.format("MDY") === moment().format("MDY") && startDate < moment()
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

		const { name, id, description, isTemplate } = event;
		return (
			<Collection
				key={id}
				primaryText={name}
				secondaryText={isTemplate ? description : expired ? endDisplayDate : displayDate}
				icon={
					endDate ? (
						<Event fontSize="large" />
					) : (
						<ReportProblem fontSize="large" />
					)
				}
				handleSelect={this.handleEventClick}
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
								handleSelect={this.loadEntityData}
								dir={dir}
							/>
						);
					})}
			</Collection>
		);
	}
}

EventCard.propTypes = propTypes;
EventCard.defaultProps = defaultProps;

export default EventCard;
