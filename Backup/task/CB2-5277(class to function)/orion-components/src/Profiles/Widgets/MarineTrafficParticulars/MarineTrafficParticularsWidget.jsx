import React, { PureComponent, useEffect, useState } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { Typography } from "@material-ui/core";
import { SimpleTable } from "../../../CBComponents";
import { integrationService } from "client-app-core";
import { Translate } from "orion-components/i18n/I18nContainer";


const propTypes = {
	order: PropTypes.number,
	entity: PropTypes.object.isRequired,
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
	entity,
	widgetsExpandable,
	displayProps
}) => {
	
	const [entityState, setEntityState] = useState(entity);
	const [vesselData, setVesselData] = useState([]);

	const formatData = (data) => {
		let newData = [];
		Object.keys(data).forEach(function (key) {
			let newObject = { label: key, value: data[key] };
			newData.push(newObject);
		});
		return newData;
	};

	const getParticulars = () => {
		const particulars = vesselData;
		if (_.isEmpty(particulars)) {
			return <Typography
				style={{ margin: "12px auto" }}
				align="center"
				variant="caption"
			>
				<Translate value="global.profiles.widgets.marineTrafficParticulars.noParticulars" />
			</Typography>;
		}
		else {
			return <SimpleTable rows={particulars} dir={dir} />;
		}
	};

	useEffect(() => {
		const entityData = entityState;

		integrationService.getExternalSystemLookup(
			"marine-traffic",
			entityData.entityType,
			(err, response) => {
				if (err) console.log("ERROR", err);
				if (!response) return;
				const { data } = response;
				if (data) {
					// convert to handy display object array
					const formattedData = formatData(data);
					setVesselData(formattedData);
				}
			},
			`sourceId=${entityData.sourceId}&targetId=${entityData.id}&targetType=${entityData.entityType}`
		);
	}, []);

	const vesselId = entity.sourceId;

	return selected || !enabled ? (
		<div />
	) : (
		<section
			className={`marineTrafficParticulars-widget widget-wrapper ${"index-" + order} ${expanded ? "expanded" : "collapsed"
			}`}
		>
			{!expanded && (
				<div className="widget-inner">
					<div className="widget-header">
						<div className="cb-font-b2"><Translate value="global.profiles.widgets.marineTrafficParticulars.title" /></div>
					</div>
					<div className="widget-content">
						{getParticulars()}
					</div>
				</div>
			)}
		</section>
	);
};

MarineTrafficParticularsWidget.propTypes = propTypes;
MarineTrafficParticularsWidget.defaultProps = defaultProps;

export default MarineTrafficParticularsWidget;
