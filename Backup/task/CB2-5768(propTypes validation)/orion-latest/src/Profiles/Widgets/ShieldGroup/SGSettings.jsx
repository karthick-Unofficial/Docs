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
import { getWidgetState, isWidgetLaunchableAndExpandable } from "orion-components/Profiles/Selectors";
import { useSelector } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";
import { updateEvent } from "orion-components/GlobalData/Actions";

const styles = {};

const propTypes = {
	selectWidget: PropTypes.func,
	selected: PropTypes.bool.isRequired,
	expanded: PropTypes.bool.isRequired,
	contextId: PropTypes.string.isRequired,
	settings: PropTypes.object,
	pinnedItems: PropTypes.array,
	isPublic: PropTypes.bool
};

const defaultProps = {
	selectWidget: null,
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
	isPublic: false
};

const SGSettings = ({
	id,
	selectWidget,
	selected,
	expanded,
	canContribute,
	contextId,
	settings,
	pinnedItems,
	isPublic
}) => {
	const dispatch = useDispatch();
	const enabled = useSelector((state) => expanded || getWidgetState(state)(id, "enabled"));
	const dir = useSelector((state) => getDir(state));
	const launchableAndExpandable = useSelector((state) => isWidgetLaunchableAndExpandable(state));
	const { widgetsExpandable: expandable } = launchableAndExpandable;

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
