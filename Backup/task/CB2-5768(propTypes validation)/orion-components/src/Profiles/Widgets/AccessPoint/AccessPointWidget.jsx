import React from "react";
import { Typography } from "@mui/material";
import { Translate } from "orion-components/i18n";
import PropTypes from "prop-types";
import AccessPointCard from "./components/AccessPointCard";
import { getWidgetState } from "orion-components/Profiles/Selectors";
import { useSelector } from "react-redux";
import { loadProfile } from "orion-components/ContextPanel/Actions";

const propTypes = {
	id: PropTypes.string,
	accessPoints: PropTypes.object
};

const defaultProps = {
	accessPoints: null
};

const AccessPointWidget = (props) => {
	const { accessPoints, id } = props;
	const enabled = useSelector((state) => getWidgetState(state)(id, "enabled"));

	return !enabled ? (
		<div />
	) : (
		<div className="widget-wrapper collapsed">
			<div className="widget-header">
				<div className="cb-font-b2">
					<Translate value="global.profiles.widgets.accessPoint.accessPointOnFloorPlan.title" />
				</div>
			</div>

			<div className="widget-content" style={{ display: "flex" }}>
				{accessPoints && accessPoints.length > 0 ? (
					accessPoints.map((accessPoint, index) => {
						return (
							<AccessPointCard
								accessPoint={accessPoint}
								key={index}
								loadProfile={loadProfile}
								canTarget={true} // this  is true because there is no implementation for disabling an access point.
								readOnly={false}
							/>
						);
					})
				) : (
					<Typography style={{ margin: "12px auto" }} align="center" variant="caption">
						<Translate value="global.profiles.widgets.accessPoint.accessPointOnFloorPlan.noAcpAvailable" />
					</Typography>
				)}
			</div>
		</div>
	);
};

AccessPointWidget.propTypes = propTypes;
AccessPointWidget.defaultProps = defaultProps;

export default AccessPointWidget;
