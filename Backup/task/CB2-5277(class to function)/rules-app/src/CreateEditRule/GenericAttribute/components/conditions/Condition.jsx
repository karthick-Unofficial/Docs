import React from "react";
import ConditionsAttributes from "../../../Conditions/ConditionsAttributes";

const Condition = ({
	// Props come from container
	isOpen,
	openDialog,
	closeDialog,
	entityCollections,
	landUnitSystem,
	// Below props passed in
	styles,
	conditions,
	inputOptions,
	addCondition,
	deleteCondition,
	updateCondition,
	timeFormatPreference,
	dir,
	locale
}) => {

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