import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { ContextPanel } from "orion-components/ContextPanel";
import { SearchField } from "orion-components/CBComponents";
import { Fab, Typography, List, CircularProgress } from "@mui/material";
import { Add, GetApp } from "@mui/icons-material";
import { FacilityCard } from "orion-components/Facilities";
import { FacilityProfile, CameraProfile, AccessPointProfile } from "orion-components/Profiles";
import { facilityService } from "client-app-core";
import ImportFacilities from "./ImportFacilities/ImportFacilities";
import { Translate, getTranslation } from "orion-components/i18n";

import * as facilityCardActions from "./FacilityCard/facilityCardActions";
import * as facilityProfileActions from "./FacilityProfile/facilityProfileActions";
import * as cameraProfileActions from "./CameraProfile/cameraProfileActions";
import { appData } from "../shared/utility/utilities";

import { useDispatch, useSelector } from "react-redux";

import {
	setMapTools,
	setWidgetLaunchData,
	loadProfile,
	selectFloorPlan,
	clearFloorPlan,
	setPreLoaded,
	closeProfile
} from "./listPanelActions";

import {
	selectedEntityState,
	selectedContextSelector
} from "orion-components/ContextPanel/Selectors";
import {
	layerSourcesSelector,
	userFeedsSelector
} from "orion-components/GlobalData/Selectors";
import { floorPlanSelector } from "orion-components/Map/Selectors";

import { getDir } from "orion-components/i18n/Config/selector";

import map from "lodash/map";
import filter from "lodash/filter";
import merge from "lodash/merge";
import cloneDeep from "lodash/cloneDeep";

const propTypes = {
	WavCamOpen: PropTypes.bool
};

const renderProfile = mode => {
	switch (mode) {
		case "camera":
			return (
				<CameraProfile {...cameraProfileActions} widgetsExpandable={false} widgetsLaunchable={true} />
			);

		case "facility":
			return (
				<FacilityProfile {...facilityProfileActions} actionOptions={["edit", "hide", "delete"]} widgetsLaunchable={false} appData={appData} />
			);
		case "accessPoint":
			return (
				<AccessPointProfile selectFloorPlan={facilityProfileActions.selectFloorPlan} widgetsExpandable={false} widgetsLaunchable={true} />
			);

		default:
			break;
	}
};

const ListPanel = ({ WavCamOpen }) => {
	const mapState = useSelector(state => state.mapState);
	const appState = useSelector(state => state.appState);
	const session = useSelector(state => state.session);
	const context = useSelector(state => selectedContextSelector(state));
	const selectedEntity = useSelector(state => selectedEntityState(state));
	const secondaryOpen = appState.contextPanel.contextPanelData.secondaryOpen;
	const mode = mapState.mapTools.mode;
	const userFeeds = useSelector(state => userFeedsSelector(state));
	const canCreate = userFeeds.some(feed => {
		return feed && feed.canView && feed.entityType === "facility" && feed.ownerOrg === session.user.profile.orgId
			&& session.user.profile.integrations.find(int => int.intId === feed.feedId)
			&& session.user.profile.integrations.find(int => int.intId === feed.feedId).permissions
			&& session.user.profile.integrations.find(int => int.intId === feed.feedId).permissions.includes("manage");
	});
	const facilityFeeds = map(
		filter(
			map(userFeeds),
			feed => {
				return (feed && feed.entityType === "facility");
			}
		), "feedId");
	const { preLoaded } = useSelector(state => floorPlanSelector(state));
	const widgetLaunchData = useSelector(state => state.userAppState.widgetLaunchData);
	const allowImport = useSelector(state => state.clientConfig ? state.clientConfig.allowImport : false);
	const globalData = useSelector(state => state.globalData);
	const globalGeo = useSelector(state => state.globalGeo);
	const hidden = !!mode;
	const profileMode = selectedEntity ? selectedEntity.type : null;
	const profileOpen = context && context.entity ? secondaryOpen : false;
	const dir = useSelector(state => getDir(state));

	let floorPlans;
	let facilities = {};
	let userId;

	useSelector(state => {
		if (globalData && globalGeo) {
			floorPlans = state.globalData.floorPlans;
			facilityFeeds.map(feed => {
				facilities = merge(facilities, (cloneDeep(layerSourcesSelector(state, { feedId: feed })) || {}));
			});

			userId = state.session.user.profile.id;
		}
	});


	const [importFacilities, setImportFacilities] = useState(false);
	const dispatch = useDispatch();

	const styles = {
		controls: {
			display: "flex",
			align: "center",
			alignItems: "center",
			padding: 16,
			backgroundColor: "#242426"
		},
		progress: {
			width: "100%",
			height: "100%",
			display: "flex",
			alignItems: "center",
			justifyContent: "center"
		},
		wrapper: {
			padding: "8px 16px",
			height: `calc(100vh - ${WavCamOpen ? "360px" : "120px"})`
		},
		typography: {
			...(dir === "rtl" ? { marginRight: "1rem" } : { marginLeft: "1rem" })
		}
	};

	useEffect(() => {
		if (widgetLaunchData) {
			const { entityId } = widgetLaunchData;

			if (entityId) {
				const facility = facilities[entityId];
				if (facility) {
					// -- select given entity
					dispatch(loadProfile(facility.id, facility.entityData.properties.name, "facility", "profile"));

					// -- remove all data from widgetLaunchData
					dispatch(setWidgetLaunchData(null));
				}
			}
			else {
				// -- not enough data, remove all data from widgetLaunchData
				dispatch(setWidgetLaunchData(null));
			}
		}
	}, [widgetLaunchData, facilities, loadProfile, setWidgetLaunchData]);

	useEffect(() => {
		if (location.hash.split("?")[1] && !preLoaded) {
			const params = location.hash.split("?")[1].split("&");
			facilityService.getFloorPlan(params[0], (err, res) => {
				if (err) {
					console.log(err);
				} else if (res && res.result) {
					const floorPlan = res.result;
					if (facilities[floorPlan.facilityId] && !preLoaded) {
						dispatch(loadProfile(facilities[floorPlan.facilityId].id, facilities[floorPlan.facilityId].entityData.properties.name, "facility", "profile"));
						dispatch(selectFloorPlan(floorPlan));
						dispatch(setPreLoaded());
					}
				}
			});
		}
	}, [loadProfile, preLoaded, facilities, selectFloorPlan, setPreLoaded]);
	const [search, setSearch] = useState("");

	const handleAddNew = () => {
		dispatch(closeProfile());
		dispatch(setMapTools({ type: "facility", mode: "draw_point" }));
	};
	const handleSearch = useCallback(e => {
		setSearch(e.target.value);
	}, []);

	return (
		<ContextPanel
			className="list-panel"
			secondaryClassName="entity-profile"
			secondaryCloseAction={() => dispatch(clearFloorPlan())}
			hidden={hidden}
			dir={dir}
		>
			<div>
				<div style={styles.controls}>
					<Fab onClick={handleAddNew} disabled={!canCreate} color="primary" size="small">
						<Add />
					</Fab>
					<Typography variant="h6" style={styles.typography}>
						<Translate value="listPanel.main.newFac" />
					</Typography>
				</div>
				{allowImport &&
					<div style={styles.controls}>
						<Fab onClick={() => setImportFacilities(true)} disabled={!canCreate} color="primary" size="small">
							<GetApp />
						</Fab>
						<Typography variant="h6" style={{ marginLeft: "1rem" }}>
							<Translate value="listPanel.main.importFac" />
						</Typography>
					</div>
				}
				{Object.values(facilities).length ? (
					<div style={styles.wrapper}>
						<SearchField
							key="facility-search"
							value={search}
							placeholder={getTranslation("listPanel.main.fieldLabel.searchFac")}
							handleChange={handleSearch}
							handleClear={() => setSearch("")}
							dir={dir}
						/>
						<div
							style={{
								overflowX: "scroll",
								padding: "16px 0px",
								height: "calc(100% - 62px)"
							}}
						>
							<Typography component="p" variant="h6">
								<Translate value="listPanel.main.myFac" />
							</Typography>
							<List>
								{facilities && Object.values(facilities)
									.sort((a, b) => {
										const aName = a.entityData && a.entityData.properties ? a.entityData.properties.name : a.id;
										const bName = b.entityData && b.entityData.properties ? b.entityData.properties.name : b.id;
										if (aName < bName) {
											return -1;
										}
										if (aName > bName) {
											return 1;
										}
										return 0;
									})
									.filter(facility => {
										const facilityName = facility.entityData && facility.entityData.properties ? facility.entityData.properties.name : facility.id;
										const facilityDescription = facility.entityData && facility.entityData.properties ? facility.entityData.properties.description : "";
										return `${facilityName} ${facilityDescription}`
											.toLowerCase()
											.includes(search.toLowerCase());
									})
									.map(facility => {
										return (facility.owner == userId && <FacilityCard
											{...facilityCardActions}
											key={facility.id}
											facility={facility}
										/>);

									})}
							</List>
							<Typography component="p" variant="h6">
								<Translate value="listPanel.main.sharedFac" />
							</Typography>
							<List>
								{facilities && Object.values(facilities)
									.sort((a, b) => {
										const aName = a.entityData && a.entityData.properties ? a.entityData.properties.name : a.id;
										const bName = b.entityData && b.entityData.properties ? b.entityData.properties.name : b.id;
										if (aName < bName) {
											return -1;
										}
										if (aName > bName) {
											return 1;
										}
										return 0;
									})
									.filter(facility => {
										const facilityName = facility.entityData && facility.entityData.properties ? facility.entityData.properties.name : facility.id;
										const facilityDescription = facility.entityData && facility.entityData.properties ? facility.entityData.properties.description : "";
										return `${facilityName} ${facilityDescription}`
											.toLowerCase()
											.includes(search.toLowerCase());
									})
									.map(facility => {
										return (facility.owner != userId && <FacilityCard
											{...facilityCardActions}
											key={facility.id}
											facility={facility}
										/>);

									})}
							</List>
						</div>
					</div>
				) : (
					<div
						style={{
							...styles.wrapper,
							display: "flex",
							alignItems: "center"
						}}
					>
						<Typography variant="caption" color="textSecondary" align="center">
							<Translate value="listPanel.main.noFacAvail" />
						</Typography>
					</div>
				)}
				{importFacilities &&
					<ImportFacilities facilities={facilities} close={() => setImportFacilities(false)} />
				}
			</div>
			{profileOpen ? (renderProfile(profileMode)) :
				(<div style={styles.progress}>
					<CircularProgress color="primary" size={200} />
				</div>)
			}
		</ContextPanel>
	);
};

ListPanel.propTypes = propTypes;

export default ListPanel;