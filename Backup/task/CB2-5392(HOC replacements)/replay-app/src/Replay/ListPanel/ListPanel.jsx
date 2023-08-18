/* eslint react/prop-types: 0 */
import React from "react";
import ErrorBoundary from "orion-components/ErrorBoundary";
import { ContextPanel } from "orion-components/ContextPanel";
// TODO: Update to most recent Material UI Tabs
import { CircularProgress } from "@material-ui/core";
import _ from "lodash";
import { AccessPointProfile, CameraProfile, EntityProfile, EventProfile, FacilityProfile, GISProfile } from "orion-components/Profiles";
import * as accessPointProfileActions from "./AccessPointProfile/AccessPointProfileActions";
import * as cameraProfileActions from "./CameraProfile/cameraProfileActions";
import * as entityProfileActions from "./EntityProfile/entityProfileActions";
import * as eventProfileActions from "./EventProfile/eventProfileActions";
import * as facilityProfileActions from "./FacilityProfile/facilityProfileActions";
import * as gisProfileActions from "./GISProfile/gisProfileActions";
import { appData } from "../../shared/utility/utilities";
import { useSelector } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";
import {
	collectionsSelector,
	activeOwnedEventsSelector,
	activeSharedEventsSelector,
	userExclusionSelector
} from "orion-components/GlobalData/Selectors";
import { listPanelState } from "orion-components/ContextPanel/Selectors";
import {
	selectedContextSelector,
	selectedEntityState
} from "orion-components/ContextPanel/Selectors";



const ListPanel = ({ endDate }) => {

	const user = useSelector(state => state.session.user.profile);
	const collections = useSelector(state => window.api ? [] : collectionsSelector(state));
	// const profileMode = null;
	const selectedEntity = useSelector(state => selectedEntityState(state));
	const profileMode = selectedEntity
		? selectedEntity.type
		: null;
	const profileLoaded = useSelector(state => !state.appState.loading.profileLoading && Boolean(selectedContextSelector(state)));
	const drawingToolsActive = false;
	const ownedEvents = useSelector(state => window.api ? [] : activeOwnedEventsSelector(state));
	const sharedEvents = useSelector(state => window.api ? [] : activeSharedEventsSelector(state));
	const orgRole = useSelector(state => state.session.user.profile.orgRole);
	const exclusions = useSelector(state => window.api ? [] : userExclusionSelector(state));
	const filterCount = useSelector(state => _.size(listPanelState(state).mapFilters));
	const dir = useSelector(state => getDir(state));

	const renderProfile = (mode) => {
		switch (mode) {
			case "camera":
				return (
					<ErrorBoundary>
						<CameraProfile
							forReplay={true}
							readOnly={true}
							endDate={endDate}
							widgetsExpandable={false}
							widgetsLaunchable={false}
							appData={appData}
							{...cameraProfileActions}
						/>
					</ErrorBoundary>
				);
			case "accessPoint":
				return (
					<ErrorBoundary>
						<AccessPointProfile
							forReplay={true}
							readOnly={true}
							endDate={endDate}
							widgetsExpandable={false}
							widgetsLaunchable={true}
							appData={appData}
							{...accessPointProfileActions}
						/>
					</ErrorBoundary>
				);
			case "facility":
				return (
					<ErrorBoundary>
						<FacilityProfile
							forReplay={true}
							readOnly={true}
							endDate={endDate}
							actionOptions={["hide"]}
							widgetsLaunchable={false}
							{...facilityProfileActions}
						/>
					</ErrorBoundary>
				);
			case "shapes":
			case "track":
				return (
					<ErrorBoundary>
						<EntityProfile
							forReplay={true}
							readOnly={true}
							endDate={endDate}
							widgetsLaunchable={true}
							appData={appData}
							{...entityProfileActions}
						/>
					</ErrorBoundary>
				);

			case "gis":
				return (
					<ErrorBoundary>
						<GISProfile
							forReplay={true}
							readOnly={true}
							endDate={endDate}
							{...gisProfileActions}
						/>
					</ErrorBoundary>
				);

			case "event":
				return (
					<ErrorBoundary>
						<EventProfile
							forReplay={true}
							readOnly={true}
							replayEndDate={endDate}
							appData={appData}
							widgetsLaunchable={false}
							{...eventProfileActions}
						/>
					</ErrorBoundary>
				);

			default:
				break;
		}
	};
	const progressStyle = {
		outer: {
			width: "100%",
			height: "100%",
			display: "flex",
			alignItems: "center",
			justifyContent: "center"
		}
	};
	return (
		<ContextPanel
			className="list-panel"
			secondaryClassName="entity-profile"
			hidden={false}
			readOnly={true}
			dir={dir}
		>
			<div></div>
			{profileLoaded ? (
				renderProfile(profileMode)
			) : (
				<div style={progressStyle.outer}>
					<CircularProgress size={200} />
				</div>
			)}
		</ContextPanel>
	);
};

export default ListPanel;
