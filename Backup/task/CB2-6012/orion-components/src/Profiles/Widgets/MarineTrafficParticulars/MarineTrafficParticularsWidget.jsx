import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";
import { Typography } from "@mui/material";
import { SimpleTable } from "../../../CBComponents";
// import { integrationService } from "client-app-core";
import { Translate } from "orion-components/i18n";
import { useSelector } from "react-redux";
import { getWidgetState } from "orion-components/Profiles/Selectors";
import { getDir } from "orion-components/i18n/Config/selector";

const propTypes = {
	id: PropTypes.string,
	selected: PropTypes.bool,
	expanded: PropTypes.bool,
	data: PropTypes.any
};

const MarineTrafficParticularsWidget = (props) => {
	const { selected, expanded, data, id } = props;
	const enabled = useSelector((state) => getWidgetState(state)(id, "enabled") || props.enabled);
	const dir = useSelector((state) => getDir(state));

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
				<Typography style={{ margin: "12px auto" }} align="center" variant="caption">
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
		<section className={`marineTrafficParticulars-widget widget-wrapper ${expanded ? "expanded" : "collapsed"}`}>
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

export default MarineTrafficParticularsWidget;
