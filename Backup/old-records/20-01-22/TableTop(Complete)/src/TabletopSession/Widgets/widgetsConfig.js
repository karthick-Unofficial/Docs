import RosterContainer from "./Roster/RosterContainer";
import EventsContainer from "./Events/EventsContainer";
import FacilitiesContainer from "./Facilities/FacilitiesContainer";
import MapLayersContainer from "./MapLayers/MapLayersContainer";
import ModifyExerciseContainer from "./Modifications/ModifyExercise/ModifyExerciseContainer";
import ModificationsHistoryContainer from "./Modifications/ModificationsHistoryContainer";
import ExerciseSettingsContainer from "./ExerciseSettings/ExerciseSettingsContainer";
import UserMappingContainer from "./UserMapping/UserMappingContainer";

import { AccountBoxMultiple, AccountCog, AlertRhombus, CubeScan, History, OfficeBuildingMarker, MapLegend, AccountStar } from "mdi-material-ui";

const widgetsConfig = {
	roster: {
		icon: AccountBoxMultiple,
		header: "Team Roster",
		widget: RosterContainer
	},
	events: {
		icon: AlertRhombus,
		header: "Events",
		widget: EventsContainer
	},
	facilities: {
		icon: OfficeBuildingMarker,
		header: "Facilities and Floorplans",
		widget: FacilitiesContainer
	},
	mapLayers: {
		icon: MapLegend,
		header: "Map Layers",
		widget: MapLayersContainer
	},
	exerciseSettings: {
		icon: AccountCog,
		header: "Exercise Settings",
		widget: ExerciseSettingsContainer
	},
	userMappingSettings: {
		icon: AccountStar,
		header: "Player Mappings",
		widget: UserMappingContainer
	},
	modifyExercise: {
		icon: CubeScan,
		header: "Modify Exercise",
		widget: ModifyExerciseContainer,
		modifyMode: true
	},
	modificationHistory: {
		icon: History,
		header: "Modification History",
		widget: ModificationsHistoryContainer
	}
};

export default widgetsConfig;