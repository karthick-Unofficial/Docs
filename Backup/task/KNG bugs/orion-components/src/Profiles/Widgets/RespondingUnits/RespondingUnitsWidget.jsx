import React, { Component } from "react";
import RespondingUnit from "./components/RespondingUnit";
import { Translate } from "orion-components/i18n/I18nContainer";

export class RespondingUnitsWidget extends Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}

	handleLoadEntityDetails = item => {
		const { loadProfile } = this.props;
		loadProfile(
			item.id,
			item.unitId,
			"track",
			"profile"
		);
	};

	render() {
		const { respondingUnits, order, dir } = this.props;

		return (
			<section className={`widget-wrapper cad-details-widget ${"index-" + order}`}>
				<div className="widget-header">
					<div className="cb-font-b2"><Translate value="global.profiles.widgets.respondingUnits.title"/></div>
				</div>
				{respondingUnits && respondingUnits.map((respondingUnit, index) => {
					return (
						<RespondingUnit 
							key={`responding_unit_${index}`}
							entity={respondingUnit}
							handleLoadEntityDetails={this.handleLoadEntityDetails}
							dir={dir}
						/>
					);
				})}
			</section>
		);
	}
}

export default RespondingUnitsWidget;