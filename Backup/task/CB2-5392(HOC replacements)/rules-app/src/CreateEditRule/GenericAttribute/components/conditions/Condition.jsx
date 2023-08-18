import React from "react";
import ConditionsAttributes from "../../../Conditions/ConditionsAttributes";
import { useSelector } from "react-redux";
import * as actionCreators from "./conditionActions";
import { getDir } from "orion-components/i18n/Config/selector";

const Condition = ({
	// Below props passed in
	styles,
	conditions,
	inputOptions,
	addCondition,
	deleteCondition,
	updateCondition
}) => {
	// Props come from container
	const {
		openDialog,
		closeDialog
	} = actionCreators;
	
	const landUnitSystem = useSelector(state => state.appState.global.unitsOfMeasurement.landUnitSystem);
	const timeFormatPreference = useSelector(state => state.appState.global.timeFormat);
	const isOpen = useSelector(state => state.appState.dialog.openDialog);
	const entityCollections = useSelector(state => state.globalData.collections);
	const dir = useSelector(state => getDir(state));
	const locale = useSelector(state => state.i18n.locale);

	return (
		<ConditionsAttributes
			isOpen={isOpen}
			openDialog={openDialog}
			closeDialog={closeDialog}
			styles={styles}
			conditions={conditions}
			availableConditions={inputOptions}
			addCondition={addCondition}
			deleteCondition={deleteCondition}
			updateCondition={updateCondition}
			entityCollections={entityCollections}
			landUnitSystem={landUnitSystem}
			timeFormatPreference={timeFormatPreference}
			dir={dir}
			locale={locale}
		/>
	);
};

export default Condition;