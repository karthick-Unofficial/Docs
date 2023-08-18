import React from "react";
import RespondingUnit from "./components/RespondingUnit";
import { Translate } from "orion-components/i18n";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";
import { loadProfile } from "orion-components/ContextPanel/Actions";

const RespondingUnitsWidget = ({ respondingUnits }) => {
	const dispatch = useDispatch();

	const dir = useSelector((state) => getDir(state));

	const handleLoadEntityDetails = (item) => {
		dispatch(loadProfile(item.id, item.unitId, "track", "profile"));
	};

	return (
		<section className="widget-wrapper cad-details-widget">
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
