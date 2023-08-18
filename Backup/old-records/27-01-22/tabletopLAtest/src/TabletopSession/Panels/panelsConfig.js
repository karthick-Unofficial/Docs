import RosterContainer from "./Roster/RosterContainer";
import EventsContainer from "./Events/EventsContainer";
import FacilitiesContainer from "./Facilities/FacilitiesContainer";
import MapLayersContainer from "./MapLayers/MapLayersContainer";
import ModifyExerciseContainer from "./Modifications/ModifyExercise/ModifyExerciseContainer";
import ModificationsHistoryContainer from "./Modifications/ModificationsHistoryContainer";
import ExerciseSettingsContainer from "./ExerciseSettings/ExerciseSettingsContainer";
import UserMappingContainer from "./UserMapping/UserMappingContainer";

import { AccountBoxMultiple, AccountCog, AlertRhombus, CubeScan, History, OfficeBuildingMarker, MapLegend, AccountStar } from "mdi-material-ui";

const panelsConfig = {
	roster: {
		icon: AccountBoxMultiple,
		header: "Team Roster",
		panel: RosterContainer
	},
	events: {
		icon: AlertRhombus,
		header: "Events",
		panel: EventsContainer
	},
	facilities: {
		icon: OfficeBuildingMarker,
		header: "Facilities and Floorplans",
		panel: FacilitiesContainer
	},
	mapLayers: {
		icon: MapLegend,
		header: "Map Layers",
		panel: MapLayersContainer
	},
	exerciseSettings: {
		icon: AccountCog,
		header: "Exercise Settings",
		panel: ExerciseSettingsContainer
	},
	userMappingSettings: {
		icon: AccountStar,
		header: "Player Mappings",
		panel: UserMappingContainer
	},
	modifyExercise: {
		icon: CubeScan,
		header: "Modify Exercise",
		panel: ModifyExerciseContainer
	},
	modificationHistory: {
		icon: History,
		header: "Modification History",
		panel: ModificationsHistoryContainer
	}
};

export default panelsConfig;