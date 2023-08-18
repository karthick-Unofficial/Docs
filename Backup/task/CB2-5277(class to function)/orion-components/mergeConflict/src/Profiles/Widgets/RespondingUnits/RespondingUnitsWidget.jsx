import React from "react";
import RespondingUnit from "./components/RespondingUnit";
import { Translate } from "orion-components/i18n/I18nContainer";

const RespondingUnitsWidget = ({
	loadProfile,
	respondingUnits, 
	order, 
	dir
}) => {

	const handleLoadEntityDetails = item => {
		loadProfile(
			item.id,
			item.unitId,
			"track",
			"profile"
		);
	};

	return (
		<section className={`widget-wrapper cad-details-widget ${"index-" + order}`}>
			<div className="widget-header">
				<div className="cb-font-b2"><Translate value="global.profiles.widgets.respondingUnits.title" /></div>
			</div>
			{respondingUnits && respondingUnits.map((respondingUnit, index) => {
				return (
					<RespondingUnit
						key={`responding_unit_${index}`}
						entity={respondingUnit}
						handleLoadEntityDetails={handleLoadEntityDetails}
						dir={dir}
					/>
				);
			})}
		</section>
	);
};

export default RespondingUnitsWidget;