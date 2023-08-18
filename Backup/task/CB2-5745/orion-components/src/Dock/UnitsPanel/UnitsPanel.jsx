import React, { useEffect, useState, createContext } from "react";
import Units from "orion-components/Units/Units";
import { unitService } from "client-app-core";
import { useSelector } from "react-redux";
import { getUnits } from "orion-components/GlobalData/Selectors";
import { Translate } from "orion-components/i18n";

export const UnitsPanelContext = createContext();

const UnitsPanel = ({ unitSettings, dir }) => {
	const [unitStatusTypes, setUnitStatusTypes] = useState([]);
	const getUnitsData = getUnits();
	const units = useSelector((state) => getUnitsData(state));
	const [memberRoleTypes, setMemberRoleTypes] = useState([]);
	const [countryCodesArray, setCountryCodesArray] = useState([]);

	useEffect(() => {
		getUnitStatusTypes();
		getUnitMemberRoleTypes();
		getCountryCodes();
	}, []);

	const getUnitMemberRoleTypes = () => {
		unitService.getUnitMemberRoleTypes((err, response) => {
			if (err) {
				console.log("ERROR:", err);
			} else {
				setMemberRoleTypes(response);
			}
		});
	};

	const getUnitStatusTypes = () => {
		unitService.getUnitStatusTypes((err, response) => {
			if (err) {
				console.log("ERROR:", err);
			} else {
				setUnitStatusTypes(response);
			}
		});
	};

	const getCountryCodes = () => {
		unitService.getAppSettingsByKey(
			"units-app",
			"countryCodes",
			(err, response) => {
				if (err) {
					console.log("ERROR:", err);
				} else {
					if (response.value) {
						setCountryCodesArray(response.value);
					}
				}
			}
		);
	};

	const styles = {
		container: {
			overflow: "scroll",
			height: "calc(100% - 80px)",
			width: "90%",
			margin: "auto"
		},
		title: {
			fontWeight: 600, // Medium
			fontSize: "14px",
			color: "#fff",
			padding: "4px 6px",
			...(dir === "rtl" && {
				textAlign: "right"
			})
		}
	};

	return (
		<UnitsPanelContext.Provider
			value={{ memberRoleTypes, unitStatusTypes, countryCodesArray }}
		>
			<div style={styles.container}>
				<h3 style={styles.title}>
					<Translate value="global.dock.unitsPanel.title" />
				</h3>
				{unitSettings && unitSettings.length > 0 ? (
					<Units
						feedSettings={unitSettings}
						units={units}
						memberRoleTypes={memberRoleTypes}
					/>
				) : null}
			</div>
		</UnitsPanelContext.Provider>
	);
};

export default UnitsPanel;
