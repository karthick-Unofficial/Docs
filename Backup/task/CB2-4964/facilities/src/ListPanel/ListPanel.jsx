import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { ContextPanel } from "orion-components/ContextPanel";
import { SearchField } from "orion-components/CBComponents";
import { Fab, Typography, List, CircularProgress } from "@material-ui/core";
import { Add, GetApp } from "@material-ui/icons";
import FacilityCardContainer from "./FacilityCard/FacilityCardContainer";
import FacilityProfileContainer from "./FacilityProfile/FacilityProfileContainer";
import CameraProfileContainer from "./CameraProfile/CameraProfileContainer";
import { facilityService } from "client-app-core";
import ImportFacilitiesContainer from "./ImportFacilities/ImportFacilitiesContainer";
import { Translate } from "orion-components/i18n/I18nContainer";
import { renderToStaticMarkup } from "react-dom/server";

const propTypes = {
	facilities: PropTypes.object,
	hidden: PropTypes.bool,
	setMapTools: PropTypes.func.isRequired,
	profileOpen: PropTypes.bool.isRequired,
	profileMode: PropTypes.string,
	closeProfile: PropTypes.func,
	canCreate: PropTypes.bool,
	allowImport: PropTypes.bool,
	floorPlans: PropTypes.object,
	loadProfile: PropTypes.func,
	selectFloorPlan: PropTypes.func,
	clearFloorPlan: PropTypes.func,
	setPreLoaded: PropTypes.func,
	preLoaded: PropTypes.bool,
	widgetLaunchData: PropTypes.object,
	setWidgetLaunchData: PropTypes.func.isRequired,
	WavCamOpen: PropTypes.bool,
	dir: PropTypes.string
};

const defaultProps = {
	facilities: {},
	hidden: false
};

const styles = {
	controls: {
		display: "flex",
		align: "center",
		alignItems: "center",
		padding: 16,
		backgroundColor: "#242426"
	}
};

const renderProfile = mode => {
	switch (mode) {
		case "camera":
			return (
				<CameraProfileContainer />
			);

		case "facility":
			return (
				<FacilityProfileContainer />
			);

		default:
			break;
	}
};

const ListPanel = ({ facilities, hidden, setMapTools, profileOpen,
	profileMode, closeProfile, canCreate, allowImport, loadProfile,
	selectFloorPlan, setPreLoaded, preLoaded, clearFloorPlan,
	widgetLaunchData, setWidgetLaunchData, WavCamOpen, dir
}) => {
	const [importFacilities, setImportFacilities] = useState(false);

	styles.wrapper = {
		padding: "8px 16px",
		height: `calc(100vh - ${WavCamOpen ? "360px" : "120px"})`
	};
	useEffect(() => {
		if (widgetLaunchData) {
			const { entityId } = widgetLaunchData;

			if (entityId) {
				const facility = facilities[entityId];
				if (facility) {
					// -- select given entity
					loadProfile(facility.id, facility.entityData.properties.name, "facility", "profile");

					// -- remove all data from widgetLaunchData
					setWidgetLaunchData(null);
				}
			}
			else {
				// -- not enough data, remove all data from widgetLaunchData
				setWidgetLaunchData(null);
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
						loadProfile(facilities[floorPlan.facilityId].id, facilities[floorPlan.facilityId].entityData.properties.name, "facility", "profile");
						selectFloorPlan(floorPlan);
						setPreLoaded();
					}
				}
			});
		}
	}, [loadProfile, preLoaded, facilities, selectFloorPlan, setPreLoaded]);
	const [search, setSearch] = useState("");

	const handleAddNew = () => {
		closeProfile();
		setMapTools({ type: "facility", mode: "draw_point" });
	};
	const handleSearch = useCallback(e => {
		setSearch(e.target.value);
	}, []);

	const placeholderConverter = (value) => {
		const placeholderTxt = renderToStaticMarkup(<Translate value={value} />);
		let placeholderString = placeholderTxt.toString().replace(/<\/?[^>]+(>|$)/g, "");
		return placeholderString;
	};

	return (
		<ContextPanel
			className="list-panel"
			secondaryClassName="entity-profile"
			secondaryCloseAction={clearFloorPlan}
			hidden={hidden}
			dir={dir}
		>
			<div>
				<div style={styles.controls}>
					<Fab onClick={handleAddNew} disabled={!canCreate} color="primary" size="small">
						<Add />
					</Fab>
					<Typography variant="h6" style={{ marginLeft: "1rem", marginRight: dir === "rtl" ? "1rem" : "0 rem" }}>
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
							placeholder={placeholderConverter("listPanel.main.fieldLabel.searchFac")}
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
										return (<FacilityCardContainer
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
					<ImportFacilitiesContainer facilities={facilities} close={() => setImportFacilities(false)} />
				}
			</div>
			{profileOpen ? (renderProfile(profileMode)) :
				(<div>
					<CircularProgress size={200} />
				</div>)
			}
		</ContextPanel>
	);
};

ListPanel.propTypes = propTypes;
ListPanel.defaultProps = defaultProps;

export default ListPanel;
