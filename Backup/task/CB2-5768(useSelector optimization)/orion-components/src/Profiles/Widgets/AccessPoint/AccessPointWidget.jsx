import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { Translate } from "orion-components/i18n";
import PropTypes from "prop-types";
import AccessPointCard from "./components/AccessPointCard";

const propTypes = {
	accessPoints: PropTypes.object,
	enabled: PropTypes.bool,
	order: PropTypes.number
};

const defaultProps = {
	accessPoints: null,
	enabled: true
};

const AccessPointWidget = (props) => {
	const { accessPoints, order, loadProfile, enabled } = props;
	const [wrapperClass, setWrapperClass] = useState(`widget-wrapper collapsed index-${order}`);

	useEffect(() => {
		setWrapperClass(`widget-wrapper collapsed index-${order}`);
	}, [order]);

	return !enabled ? (
		<div />
	) : (
		<div className={wrapperClass}>
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
