import {
	createSelector,
	createSelectorCreator,
	defaultMemoize
} from "reselect";
import {
	eventSearchSelector,
	eventTemplateSearchSelector
} from "../../ContextPanel/Selectors";
import { eventFiltersSelector } from "../../AppState/Selectors";
import moment from "moment";
import { feedEntitiesSelector } from "orion-components/GlobalData/Selectors";
import isEqual from "react-fast-compare";
import each from "lodash/each";
import pickBy from "lodash/pickBy";

const createDeepEqualSelector = createSelectorCreator(defaultMemoize, isEqual);

const eventsState = (state) => state.globalData.events.events;
const eventTypesState = (state) => state.globalData.events.types;
const templatesState = (state) => state.globalData.events.templates;
const userIdSelector = (state) => state.session.user.profile.id;
const orgIdSelector = (state) => state.session.user.profile.orgId;

export const eventsSelector = createSelector(eventsState, (events) => {
	return events;
});

export const eventTypesSelector = createSelector(
	eventTypesState,
	(types) => types
);

export const templatesSelector = createSelector(templatesState, (templates) => {
	return templates;
});

export const currentEventsSelector = createSelector(
	eventsSelector,
	(events) => {
		return events
			.map((event) => {
				const startDate = moment(event.startDate);
				const endDate = moment(event.endDate);

				if (
					(endDate > moment() && startDate < moment()) ||
					(event.endDate === undefined && startDate < moment())
				) {
					event.status = "active";
				} else if (endDate < moment()) {
					event.status = "closed";
				} else if (startDate > moment()) {
					event.status = "upcoming";
				}

				return event;
			})
			.sort((a, b) => {
				if (a.startDate < b.startDate) {
					return 1;
				}
				if (a.startDate > b.startDate) {
					return -1;
				}
				return 0;
			});
	}
);

const filterEvent = (event, filters) => {
	const { template, startDate, endDate } = event;
	let eventTemplate = "";
	if (filters.template) {
		filters.template.forEach((id) => {
			if (id === template) {
				eventTemplate = id;
			}
		});
	}
	const eventStart = moment(startDate);
	const eventEnd = moment(endDate);
	const active =
		moment().isBetween(eventStart, eventEnd) ||
		(endDate === undefined && moment().isAfter(eventStart));
	const closed = moment().isAfter(eventEnd);
	const upcoming = moment().isBefore(eventStart);
	const filtered = {};
	each(filters, (filter, key) => {
		const activeFilter = Boolean(filter.length);
		switch (key) {
			case "status":
				if (active) {
					filtered["status"] =
						activeFilter && !filter.includes("active");
				} else if (closed) {
					filtered["status"] =
						activeFilter && !filter.includes("closed");
				} else if (upcoming) {
					filtered["status"] =
						activeFilter && !filter.includes("upcoming");
				}
				break;
			case "template":
				filtered["template"] =
					activeFilter &&
					(!eventTemplate ||
						(eventTemplate && !filter.includes(eventTemplate)));
				break;
			default:
				break;
		}
	});
	return !Object.values(filtered).includes(true);
};

// Select owned events and apply filters for event state, event type, and search value (used in Events-App)
export const currentOwnedEventsSelector = createDeepEqualSelector(
	eventsSelector,
	userIdSelector,
	eventFiltersSelector,
	eventSearchSelector,
	(events, userId, filters, search) => {
		const filteredEvents = pickBy(events, (event) => {
			const { name, owner } = event;
			return (
				owner === userId &&
				name.toLowerCase().includes(search) &&
				filterEvent(event, filters)
			);
		});
		return filteredEvents;
	}
);

// Select owned, active events and apply a filter for search value (used in Map-app)
export const activeOwnedEventsSelector = createDeepEqualSelector(
	eventsSelector,
	userIdSelector,
	eventSearchSelector,
	(events, userId, search) => {
		const filteredEvents = pickBy(events, (event) => {
			const { name, owner, startDate, endDate } = event;

			const eventStart = moment(startDate);
			const eventEnd = moment(endDate);
			const active =
				moment().isBetween(eventStart, eventEnd) ||
				(endDate === undefined && moment().isAfter(eventStart));

			return (
				owner === userId &&
				name.toLowerCase().includes(search ? search : "") &&
				active
			);
		});
		return filteredEvents;
	}
);

export const eventsSharedFromOrgSelector = createDeepEqualSelector(
	eventsSelector,
	userIdSelector,
	orgIdSelector,
	(events, userId, orgId) => {
		const orgEvents = pickBy(events, (event) => {
			const { ownerOrg, owner } = event;
			return ownerOrg === orgId && owner !== userId;
		});
		return orgEvents;
	}
);

export const eventsSharedFromEcoSelector = createDeepEqualSelector(
	eventsSelector,
	userIdSelector,
	orgIdSelector,
	(events, userId, orgId) => {
		const ecoEvents = pickBy(events, (event) => {
			const { ownerOrg, owner } = event;
			return ownerOrg !== orgId && owner !== userId;
		});
		return ecoEvents;
	}
);

// Select shared events and apply filters for event state, event type, and search value (used in Events-App)
export const sharedEventsSelector = createDeepEqualSelector(
	eventsSharedFromEcoSelector,
	eventsSharedFromOrgSelector,
	eventFiltersSelector,
	eventSearchSelector,
	(fromEco, fromOrg, filters, search) => {
		const events = { ...fromOrg, ...fromEco };
		const filteredEvents = pickBy(events, (event) => {
			const { name } = event;
			return (
				name.toLowerCase().includes(search) &&
				filterEvent(event, filters)
			);
		});
		return filteredEvents;
	}
);

// Select shared, active events and apply a filter for search value (used in Map-app)
export const activeSharedEventsSelector = createDeepEqualSelector(
	eventsSharedFromEcoSelector,
	eventsSharedFromOrgSelector,
	eventSearchSelector,
	(fromEco, fromOrg, search) => {
		const events = { ...fromOrg, ...fromEco };
		const filteredEvents = pickBy(events, (event) => {
			const { name, startDate, endDate } = event;

			const eventStart = moment(startDate);
			const eventEnd = moment(endDate);
			const active =
				moment().isBetween(eventStart, eventEnd) ||
				(endDate === undefined && moment().isAfter(eventStart));

			return name.toLowerCase().includes(search) && active;
		});
		return filteredEvents;
	}
);

export const availableEventsSelector = createDeepEqualSelector(
	sharedEventsSelector,
	currentOwnedEventsSelector,
	(shared, owned) => {
		const events = { ...shared, ...owned };
		return events;
	}
);

export const activeEventsSelector = createDeepEqualSelector(
	activeSharedEventsSelector,
	activeOwnedEventsSelector,
	(shared, owned) => {
		const events = { ...shared, ...owned };
		return events;
	}
);
const getEventById = (state, props) => {
	const event = state.globalData.events.events[props.id];
	return event;
};

export const makeGetEvent = () => {
	return createSelector(getEventById, (event) => {
		return event;
	});
};

const getPinnedItems = (state, props) => {
	return props.event.pinnedItems;
};

export const makeGetPinnedItems = () => {
	return createDeepEqualSelector(
		getPinnedItems,
		feedEntitiesSelector,
		(pinnedItems, entities) => {
			const fullItems = pickBy(entities, (entity) =>
				pinnedItems.includes(entity.id)
			);

			return fullItems;
		}
	);
};

export const ownedTemplatesSelector = createDeepEqualSelector(
	templatesSelector,
	userIdSelector,
	eventTemplateSearchSelector,
	(templates, userId, search) => {
		const filteredTemplates = pickBy(templates, (template) => {
			const { name, owner } = template;
			return owner === userId && name.toLowerCase().includes(search);
		});
		return filteredTemplates;
	}
);

export const templatesSharedFromOrgSelector = createDeepEqualSelector(
	templatesSelector,
	userIdSelector,
	orgIdSelector,
	(templates, userId, orgId) => {
		const orgTemplates = pickBy(templates, (template) => {
			const { ownerOrg, owner } = template;
			return ownerOrg === orgId && owner !== userId;
		});
		return orgTemplates;
	}
);

export const templatesSharedFromEcoSelector = createDeepEqualSelector(
	templatesSelector,
	userIdSelector,
	orgIdSelector,
	(templates, userId, orgId) => {
		const ecoTemplates = pickBy(templates, (template) => {
			const { ownerOrg, owner } = template;
			return ownerOrg !== orgId && owner !== userId;
		});
		return ecoTemplates;
	}
);

// Select shared events and apply filters for event state, event type, and search value (used in Events-App)
export const sharedTemplatesSelector = createDeepEqualSelector(
	templatesSharedFromEcoSelector,
	templatesSharedFromOrgSelector,
	eventTemplateSearchSelector,
	(fromEco, fromOrg, search) => {
		const templates = { ...fromOrg, ...fromEco };
		const filteredTemplates = pickBy(templates, (template) => {
			const { name } = template;
			return name.toLowerCase().includes(search);
		});
		return filteredTemplates;
	}
);

export const availableTemplatesSelector = createDeepEqualSelector(
	sharedTemplatesSelector,
	ownedTemplatesSelector,
	(shared, owned) => {
		const templates = { ...shared, ...owned };
		return templates;
	}
);
