import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "@mui/material";
import { getDir } from "orion-components/i18n/Config/selector";
import UnitMemberRows from "./components/UnitMemberRows";
import AssignedUnitsCard from "./components/AssignedUnitsCard";
import NewUnit from "./components/Dialog/NewUnit";
import theme from "orion-components/theme";
import { ThemeProvider, StyledEngineProvider, createTheme } from "@mui/material/styles";
import { getUnassignedMembers } from "orion-components/GlobalData/Selectors";
import CollectionsCard from "./components/CollectionsCard/CollectionsCard";
import { Translate } from "orion-components/i18n";
import { collectionsSelector } from "orion-components/GlobalData/Selectors";

const Units = ({ feedSettings, units }) => {
	const getUnassignedMembersData = getUnassignedMembers();
	const unAssignedMembers = useSelector((state) => getUnassignedMembersData(state, feedSettings));
	const collectionsData = useSelector((state) => collectionsSelector(state));

	const dir = useSelector((state) => getDir(state));
	const [isUnitsDialogOpen, setUnitsDialogOpen] = useState(false);
	const collectionLocationTypes = [
		{ key: "targetCollection", title: "TARGET LOCATIONS" },
		{ key: "interdictionPointCollection", title: "INTERDICTION LOCATIONS" }
	];

	const toggleNewUnitDialog = () => {
		setUnitsDialogOpen(!isUnitsDialogOpen);
	};

	const styles = {
		container: {
			backgroundColor: "#3D3F42",
			margin: "0px 5px",
			padding: "6px 15px",
			borderRadius: "5px"
		},
		headerContainer: {
			padding: "0px 5px 12px 5px",
			textAlign: "center"
		},
		header1: {
			color: "#fff",
			fontWeight: 600,
			fontSize: "16px",
			...(dir === "ltr" && {
				paddingLeft: "35px"
			}),
			...(dir === "rtl" && {
				paddingRight: "35px"
			})
		},
		unassignedHeader: {
			fontSize: 14
		}
	};

	return (
		<StyledEngineProvider injectFirst>
			{/*This orion custom theme is  injected here because some of the dialog-related themes were missing the theme injected in the dock wrapper container.*/}
			<ThemeProvider theme={createTheme(theme)}>
				<div>
					<div className="unitsContainer" dir={dir} style={styles.container}>
						<div className="unitsHeader" style={styles.headerContainer}>
							<span style={styles.header1}>
								<Translate value="global.units.main.title" />
							</span>
							<span
								style={{
									float: "right"
								}}
							>
								<Button variant="text" style={{ textTransform: "none" }} onClick={toggleNewUnitDialog}>
									<Translate value="global.units.main.newUnit" />
								</Button>
							</span>
						</div>
						<div className="assignedUnits">
							{units &&
								units.length > 0 &&
								units.map((unit, index) => {
									return (
										<AssignedUnitsCard
											key={`assigned-units-card-${index}`}
											dir={dir}
											id="1"
											unitData={unit}
											feedSettings={feedSettings}
											lastUnit={index == units.length - 1}
										/>
									);
								})}
						</div>
						<div className="unitsUnAssigned" style={{ color: "white", paddingTop: 14 }}>
							<span style={styles.unassignedHeader}>
								<Translate value="global.units.main.unassigned" />
							</span>
							<UnitMemberRows unitMembers={unAssignedMembers} includeDividers={true} />
						</div>
					</div>

					<div className="CollectionsCard">
						{collectionLocationTypes.map((collection, index) => {
							return (
								<CollectionsCard
									title={collection.title}
									id={collection.key}
									key={index}
									collectionsData={collectionsData}
								/>
							);
						})}
					</div>

					{isUnitsDialogOpen && (
						<NewUnit
							open={isUnitsDialogOpen}
							closeDialog={toggleNewUnitDialog}
							members={unAssignedMembers}
						/>
					)}
				</div>
			</ThemeProvider>
		</StyledEngineProvider>
	);
};

export default Units;
