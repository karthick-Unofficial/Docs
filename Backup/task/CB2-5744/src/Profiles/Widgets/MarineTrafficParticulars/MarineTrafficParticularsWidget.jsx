import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";
import { Typography } from "@mui/material";
import { SimpleTable } from "../../../CBComponents";
// import { integrationService } from "client-app-core";
import { Translate } from "orion-components/i18n";

const propTypes = {
	order: PropTypes.number,
	entity: PropTypes.object.isRequired,
	vesselData: PropTypes.object.isRequired,
	displayProps: PropTypes.object,
	classes: PropTypes.object,
	dir: PropTypes.string
};

const defaultProps = {
	order: 0,
	displayProps: null,
	dir: "ltr"
};

const MarineTrafficParticularsWidget = ({
	dir,
	selected,
	expanded,
	enabled,
	order,
	data
}) => {
	const [vesselData, setVesselData] = useState();

	const formatData = (data) => {
		const newData = [];
		Object.keys(data).forEach(function (key) {
			const newObject = { label: key, value: data[key] };
			newData.push(newObject);
		});
		return newData;
	};

	const getParticulars = () => {
		const particulars = vesselData;
		if (isEmpty(particulars)) {
			return (
				<Typography
					style={{ margin: "12px auto" }}
					align="center"
					variant="caption"
				>
					<Translate value="global.profiles.widgets.marineTrafficParticulars.noParticulars" />
				</Typography>
			);
		} else {
			return <SimpleTable rows={particulars} dir={dir} />;
		}
	};

	useEffect(() => {
		setVesselData(formatData(data));
	}, [data]);

	return selected || !enabled ? (
		<div />
	) : (
		<section
			className={`marineTrafficParticulars-widget widget-wrapper ${
				"index-" + order
			} ${expanded ? "expanded" : "collapsed"}`}
		>
			{!expanded && (
				<div className="widget-inner">
					<div className="widget-header">
						<div className="cb-font-b2">
							<Translate value="global.profiles.widgets.marineTrafficParticulars.title" />
						</div>
					</div>
					<div className="widget-content">{getParticulars()}</div>
				</div>
			)}
		</section>
	);
};

MarineTrafficParticularsWidget.propTypes = propTypes;
MarineTrafficParticularsWidget.defaultProps = defaultProps;

export default MarineTrafficParticularsWidget;
