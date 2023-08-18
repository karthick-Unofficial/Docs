import _ from "lodash";
import { createSelector } from "reselect";

const sessionsState = state => state.tabletopSessions ? state.tabletopSessions.sessions : null;
const sessionToLoadState = state=> state.tabletopSessions ? state.tabletopSessions.sessionToLoad : null;

export const librarySessionsSelector = createSelector(
	sessionsState,
	sessionToLoadState,
	(sessions, sessionToLoad )  => {
		const librarySessions = {};

		if (sessions) {
			for (const sessionId in sessions) {
				if (sessions[sessionId].status === "archived" || sessions[sessionId].status === "created") {
					if (!sessionToLoad.sessionId || sessionToLoad.sessionId !== sessionId){
						librarySessions[sessionId] = sessions[sessionId];
					}
				}
			}
		}
		return librarySessions;
	}
);

export const activeSessionSelector = createSelector(
	sessionsState,
	sessions => {
		if (sessions) {
			return _.values(sessions).find(session => session.status === "active");
		}
		return null;
	}
);