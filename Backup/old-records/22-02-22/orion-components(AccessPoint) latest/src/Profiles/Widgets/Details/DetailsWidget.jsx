import React, { PureComponent } from "react";
import { withSpan } from "../../../Apm"; 
import PropTypes from "prop-types";
import { timeConversion } from "client-app-core";
import { SimpleTable } from "../../../CBComponents";
import _ from "lodash";
import { BaseWidget } from "../shared";
import VisualDetail from "./components/VisualDetail";
import { Grid, Collapse, Button } from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import { Translate, getTranslation } from "orion-components/i18n/I18nContainer";

const propTypes = {
	order: PropTypes.number,
	details: PropTypes.object.isRequired,
	displayProps: PropTypes.array,
	dir: PropTypes.string
};

const defaultProps = {
	order: 0,
	displayProps: null,
	dir: "ltr"
};

export class DetailsWidget extends PureComponent {
	constructor(props) {
		super(props);
		const { displayProps } = this.props;
		this.state = {
			expanded: false,
			hasVisuals: !!displayProps
		};
	}

	componentDidMount() {
		const { displayProps, details } = this.props;
		if (displayProps) {
			const hasVisuals = displayProps.find(prop => {
				const { visual, key } = prop;
				return visual && details[key];
			});
			this.setState({ hasVisuals: !!hasVisuals });
		}
	}

	getSimpleDetails = () => {
		const { details, displayProps, timeFormatPreference } = this.props;
		let rows = [];
		if (displayProps) {
			const simpleProps = displayProps.filter(prop => {
				const { visual, key } = prop;
				return !visual && (details[key] || typeof details[key] === "number") && details[key] !== "";
			});
			rows = simpleProps.map(prop => {
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
			rows = _.map(_.pickBy(details, detail => !!detail), (value, label) => {
				if (value) {
					return { label, value };
				}
			});
		}

		return <SimpleTable rows={rows} />;
	};

	getVisualDetails = () => {
		const { details, displayProps } = this.props;
		const visualProps = displayProps.filter(prop => {
			const { visual, key, tooltip } = prop;
			return (
				visual &&
				(details[key] || typeof details[key] === "number" || details[tooltip]) &&
				details[key] !== ""
			);
		});
		const visuals = visualProps.map(prop => {
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

	handleExpand = () => {
		const { expanded } = this.state;
		this.setState({
			expanded: !expanded
		});
	};

	render() {
		const { order, enabled, dir } = this.props;
		const { expanded, hasVisuals } = this.state;
		return (
			<BaseWidget enabled={enabled} order={order} title={getTranslation("global.profiles.widgets.details.title")} dir={dir}>
				{hasVisuals && (
					<Grid
						container
						style={{ margin: "10px -12px" }}
						justify="space-around"
						spacing={3}
						alignContent="center"
					>
						{this.getVisualDetails()}
					</Grid>
				)}
				<Collapse
					className="list-body-wrapper"
					style={{ overflowX: "scroll" }}
					in={expanded || !hasVisuals}
				>
					{this.getSimpleDetails()}
				</Collapse>
				{hasVisuals && (
					<Button onClick={this.handleExpand}>
						{expanded ? <Translate value="global.profiles.widgets.details.showLess"/> : <Translate value="global.profiles.widgets.details.showMore"/>}
						{expanded ? <ExpandLess /> : <ExpandMore />}
					</Button>
				)}
			</BaseWidget>
		);
	}
}

DetailsWidget.propTypes = propTypes;
DetailsWidget.defaultProps = defaultProps;

export default withSpan("details-widget", "profile-widget")(DetailsWidget);
