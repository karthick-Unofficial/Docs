import React from "react";
import RespondingUnit from "./components/RespondingUnit";
import { Translate } from "orion-components/i18n";
import { useDispatch } from "react-redux";

const RespondingUnitsWidget = ({
	loadProfile,
	respondingUnits,
	order,
	dir
}) => {
	const dispatch = useDispatch();

	const handleLoadEntityDetails = (item) => {
		dispatch(loadProfile(item.id, item.unitId, "track", "profile"));
	};

	return (
		<section
			className={`widget-wrapper cad-details-widget ${"index-" + order}`}
		>
			<div className="widget-header">
				<div className="cb-font-b2">
					<Translate value="global.profiles.widgets.respondingUnits.title" />
				</div>
			</div>
			{respondingUnits &&
				respondingUnits.map((respondingUnit, index) => {
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
