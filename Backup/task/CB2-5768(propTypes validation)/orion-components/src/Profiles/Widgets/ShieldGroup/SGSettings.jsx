import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { BaseWidget } from "../shared";
import { withStyles } from "@mui/styles";
import ProfileView from "./components/ProfileView";
import EditView from "./components/EditView";
import { integrationService } from "client-app-core";
import { getTranslation } from "orion-components/i18n";
import { useDispatch } from "react-redux";
import keys from "lodash/keys";
import each from "lodash/each";
import map from "lodash/map";
import filter from "lodash/filter";

const styles = {};

const propTypes = {
	selectWidget: PropTypes.func,
	updateEvent: PropTypes.func,
	selected: PropTypes.bool.isRequired,
	expanded: PropTypes.bool.isRequired,
	order: PropTypes.number,
	contextId: PropTypes.string.isRequired,
	settings: PropTypes.object,
	pinnedItems: PropTypes.array,
	isPublic: PropTypes.bool,
	dir: PropTypes.string
};

const defaultProps = {
	selectWidget: null,
	updateEvent: null,
	order: 0,
	settings: {
		points_of_contact: [],
		location_id: "",
		audience_individuals: [],
		audience_districts: [],
		audience_departments: [],
		audience_groups: [],
		shareToCMS: false,
		limited_to_audience: true,
		recurring_notification: false,
		push_disabled: false,
		shape_id: "",
		shape_points: null,
		threadId: ""
	},
	pinnedItems: [],
	isPublic: false,
	dir: "ltr"
};

const SGSettings = ({
	selectWidget,
	selected,
	expanded,
	order,
	updateEvent,
	canContribute,
	contextId,
	settings,
	pinnedItems,
	expandable,
	isPublic,
	enabled,
	dir
}) => {
	const dispatch = useDispatch();

	const [state, setState] = useState({
		departments: [],
		districts: [],
		groups: [],
		locations: [],
		users: []
	});

	useEffect(() => {
		const lookupTypes = keys(state);
		each(lookupTypes, (type) => {
			integrationService.getExternalSystemLookup("secure-share", type, (err, response) => {
				if (err) console.log("ERROR", err);
				if (!response) return;
				const { data } = response;
				if (data) setState({ ...state, [type]: data });
			});
		});
	}, []);

	const handleExpand = () => {
		dispatch(selectWidget("SecureShare Settings"));
	};

	const { departments, districts, groups, locations, users } = state;

	const zones = map(
		filter(pinnedItems, (item) => {
			const { entityData } = item;
			const { geometry, properties } = entityData;
			return geometry ? geometry.type === "Polygon" : properties.type === "Polygon";
		}),
		(item) => {
			const { properties, geometry } = item.entityData;
			return { id: item.id, ...properties, ...geometry };
		}
	);

	// TODO: Add to config and check for enabled
	const display = (selected && expanded) || (!selected && !expanded);

	return display ? (
		<BaseWidget
			order={order}
			enabled={enabled}
			title={getTranslation("global.profiles.widgets.shieldGroup.main.secureShare")}
			handleExpand={handleExpand}
			expanded={expanded}
			expandable={expandable}
			dir={dir}
		>
			{!expanded || !canContribute ? (
				<ProfileView
					users={users}
					locations={locations}
					groups={groups}
					districts={districts}
					departments={departments}
					settings={settings}
					zones={zones}
				/>
			) : (
				<EditView
					users={users}
					locations={locations}
					groups={groups}
					districts={districts}
					departments={departments}
					updateEvent={updateEvent}
					contextId={contextId}
					settings={settings}
					zones={zones}
					isPublic={isPublic}
					dir={dir}
				/>
			)}
		</BaseWidget>
	) : (
		<Fragment />
	);
};

SGSettings.propTypes = propTypes;
SGSettings.defaultProps = defaultProps;

export default withStyles(styles)(SGSettings);
