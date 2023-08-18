import React, { useEffect, useState } from "react";
import { withSpan } from "../../../Apm";
import PropTypes from "prop-types";
import { timeConversion } from "client-app-core";
import { SimpleTable } from "../../../CBComponents";
import { BaseWidget } from "../shared";
import VisualDetail from "./components/VisualDetail";
import { Grid, Collapse, Button } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Translate, getTranslation } from "orion-components/i18n";
import map from "lodash/map";
import pickBy from "lodash/pickBy";
import { useSelector } from "react-redux";
import { getWidgetState } from "orion-components/Profiles/Selectors";
import { getDir } from "orion-components/i18n/Config/selector";
import WidgetMenu from "./components/WidgetMenu";
import { getGlobalWidgetState } from "../Selectors";

const propTypes = {
	id: PropTypes.string,
	details: PropTypes.object.isRequired,
	displayProps: PropTypes.array
};

const defaultProps = {
	displayProps: null
};

const widgetName = "detailsWidget";

const DetailsWidget = ({ displayProps, details, id }) => {
	const enabled = useSelector((state) => getWidgetState(state)(id, "enabled"));
	const widgetState = useSelector((state) => getGlobalWidgetState(state)(widgetName)) || {};
	const expandedState = widgetState?.autoExpand;
	const dir = useSelector((state) => getDir(state));

	const timeFormatPreference = useSelector((state) => state?.appState?.global?.timeFormat) || "12-hour";

	const [expanded, setExpanded] = useState(expandedState);
	const [hasVisuals, setHasVisuals] = useState(!!displayProps);

	useEffect(() => {
		if (displayProps) {
			const hasVisuals = displayProps.find((prop) => {
				const { visual, key } = prop;
				return visual && details[key];
			});
			setHasVisuals(!!hasVisuals);
		}
	}, []);

	const getSimpleDetails = () => {
		let rows = [];
		if (displayProps) {
			const simpleProps = displayProps.filter((prop) => {
				const { visual, key } = prop;
				return !visual && (details[key] || typeof details[key] === "number") && details[key] !== "";
			});
			rows = simpleProps.map((prop) => {
				const { key, label, unit } = prop;
				let value = details[key];
				if (unit) {
					switch (unit) {
						case "time":
							value = timeConversion.convertToUserTime(details[key], `full_${timeFormatPreference}`);
							break;
						default:
							value = details[key];
							break;
					}
				}
				return {
					label,
					unit,
					value
				};
			});
		} else {
			rows = map(
				pickBy(details, (detail) => !!detail),
				(value, label) => {
					if (value) {
						return { label, value };
					}
				}
			);
		}

		return <SimpleTable rows={rows} dir={dir} />;
	};

	const getVisualDetails = () => {
		const visualProps = displayProps.filter((prop) => {
			const { visual, key, tooltip } = prop;
			return (
				visual && (details[key] || typeof details[key] === "number" || details[tooltip]) && details[key] !== ""
			);
		});
		const visuals = visualProps.map((prop) => {
			const { key, label, tooltip, unit, visual } = prop;
			return (
				<Grid key={key} item>
					<VisualDetail
						label={label}
						tooltip={details[tooltip]}
						unit={unit}
						value={details[key]}
						visual={visual}
					/>
				</Grid>
			);
		});
		return visuals;
	};

	const handleExpand = () => {
		setExpanded(!expanded);
	};

	const getWidgetMenu = () => {
		return <WidgetMenu
			widgetName={widgetName}
			widgetState={widgetState}
			expandedState={expandedState}
			dir={dir}
		/>
	};

	return (
		<BaseWidget
			enabled={enabled}
			title={getTranslation("global.profiles.widgets.details.title")}
			dir={dir}
			widgetMenu={getWidgetMenu()}
		>
			{hasVisuals && (
				<Grid
					container
					style={{ margin: "10px -12px" }}
					justifyContent="space-around"
					spacing={3}
					alignContent="center"
				>
					{getVisualDetails()}
				</Grid>
			)}
			<Collapse className="list-body-wrapper" style={{ overflowX: "scroll" }} in={expanded || !hasVisuals}>
				{getSimpleDetails()}
			</Collapse>
			{hasVisuals && (
				<Button onClick={handleExpand}>
					{expanded ? (
						<Translate value="global.profiles.widgets.details.showLess" />
					) : (
						<Translate value="global.profiles.widgets.details.showMore" />
					)}
					{expanded ? <ExpandLess /> : <ExpandMore />}
				</Button>
			)}
		</BaseWidget>
	);
};

DetailsWidget.propTypes = propTypes;
DetailsWidget.defaultProps = defaultProps;

export default withSpan("details-widget", "profile-widget")(DetailsWidget);
