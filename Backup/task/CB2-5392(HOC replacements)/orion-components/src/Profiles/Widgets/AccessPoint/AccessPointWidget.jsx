import React from "react";
import { Typography } from "@material-ui/core";
import { Translate } from "orion-components/i18n";
import PropTypes from "prop-types";

import AccessPointCard from "./components/AccessPointCard";


const propTypes = {
	accessPoints: PropTypes.object
};

const defaultProps = {
	accessPoints: null
};


const AccessPointWidget = (props) => {
	const { accessPoints, order, loadProfile } = props;

	return (
		<div>
			<div className={`widget-wrapper collapsed ${"index-" + order} `}>

				<div className="widget-header">
					<div className="cb-font-b2">
						<Translate value="global.profiles.widgets.accessPoint.accessPointOnFloorPlan.title" />
					</div>
				</div>

				<div className="widget-content" style={{ display: "flex" }}>
					{accessPoints && accessPoints.length > 0 ? (
						accessPoints.map((accessPoint, index) => {
							return (
								<div>
									<AccessPointCard
										accessPoint={accessPoint}
										key={index}
										loadProfile={loadProfile}
										canTarget={true} // this  is true because there is no implementation for disabling an access point.
										readOnly={false}
									/>
								</div>
							);
						})
					) : (
						<Typography style={{ margin: "12px auto" }} align="center" variant="caption">
							<Translate value="global.profiles.widgets.accessPoint.accessPointOnFloorPlan.noAcpAvailable" />
						</Typography>
					)}
				</div>
			</div>
		</div>
	)

};

AccessPointWidget.propTypes = propTypes;
AccessPointWidget.defaultProps = defaultProps;

export default AccessPointWidget;