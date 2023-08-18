import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { NestedList } from "orion-components/CBComponents";
import { Grid, Typography, Divider } from "@material-ui/core";
import _ from "lodash";
import { Translate, getTranslation } from "orion-components/i18n";

const propTypes = {
	users: PropTypes.array,
	locations: PropTypes.array,
	groups: PropTypes.array,
	departments: PropTypes.array,
	districts: PropTypes.array,
	settings: PropTypes.object.isRequired,
	zones: PropTypes.array
};

const defaultProps = {
	users: [],
	locations: [],
	groups: [],
	departments: [],
	districts: [],
	zones: []
};

const ProfileView = ({
	users,
	locations,
	groups,
	departments,
	districts,
	settings,
	zones
}) => {
	const {
		points_of_contact,
		location_id,
		audience_individuals,
		audience_districts,
		audience_departments,
		audience_groups,
		shareToCMS,
		limited_to_audience,
		recurring_notification,
		push_disabled,
		shape_id,
		threadId
	} = settings;

	// Grab display info from data based on values from settings
	const pOContact = _.filter(users, contact =>
		_.includes(points_of_contact, contact.id)
	);
	const pDLocation = _.find(locations, ["id", location_id]);
	const aInds = _.filter(users, individual =>
		_.includes(audience_individuals, individual.id)
	);
	const aDists = _.filter(districts, district =>
		_.includes(audience_districts, district.id)
	);
	const aDepts = _.filter(departments, department =>
		_.includes(audience_departments, department.id)
	);
	const aGrps = _.filter(groups, group =>
		_.includes(audience_groups, group.id)
	);
	const bZone = _.find(zones, ["id", shape_id]);

	return (
		<Fragment>
			<Grid container justify="space-between" spacing={16}>
				{threadId && (
					<Grid item>
						<Typography variant="caption"><Translate value="global.profiles.widgets.shieldGroup.profileView.threadId" /></Typography>
						<Typography variant="body1">{threadId}</Typography>
					</Grid>
				)}
				<Grid item>
					<Typography variant="caption"><Translate value="global.profiles.widgets.shieldGroup.profileView.sharedToCMS" /></Typography>
					<Typography variant="body1">{shareToCMS ? <Translate value="global.profiles.widgets.shieldGroup.profileView.yes" /> : <Translate value="global.profiles.widgets.shieldGroup.profileView.no" />}</Typography>
				</Grid>
				<Grid item sm={12}>
					<NestedList
						items={pOContact}
						header={getTranslation("global.profiles.widgets.shieldGroup.profileView.pointsOfContact", _.size(pOContact))}
						dense={true}
						inset={false}
						headerStyle={{
							variant: "caption",
							color: "rgba(255,255,255, 0.7)"
						}}
					/>
				</Grid>
				<Grid item sm={6}>
					<Typography variant="caption"><Translate value="global.profiles.widgets.shieldGroup.profileView.predefinedLocation" /></Typography>
					<Typography variant="body1">
						{pDLocation ? pDLocation.name : <Translate value="global.profiles.widgets.shieldGroup.profileView.none" />}
					</Typography>
				</Grid>
				<Grid item sm={6}>
					<Typography variant="caption"><Translate value="global.profiles.widgets.shieldGroup.profileView.bulletinZone" /></Typography>
					<Typography variant="body1">{bZone ? bZone.name : <Translate value="global.profiles.widgets.shieldGroup.profileView.none" />}</Typography>
				</Grid>
				<Grid item sm={6}>
					<Typography variant="caption"><Translate value="global.profiles.widgets.shieldGroup.profileView.visibleToAll" /></Typography>
					<Typography variant="body1">
						{!limited_to_audience ? <Translate value="global.profiles.widgets.shieldGroup.profileView.yes" /> : <Translate value="global.profiles.widgets.shieldGroup.profileView.no" />}
					</Typography>
				</Grid>
				<Grid item sm={6}>
					<Typography variant="caption"><Translate value="global.profiles.widgets.shieldGroup.profileView.notifyOnEntry" /></Typography>
					<Typography variant="body1">
						{recurring_notification ? <Translate value="global.profiles.widgets.shieldGroup.profileView.yes" /> : <Translate value="global.profiles.widgets.shieldGroup.profileView.no" />}
					</Typography>
				</Grid>
				<Grid item sm={6}>
					<Typography variant="caption"><Translate value="global.profiles.widgets.shieldGroup.profileView.disableNotifications" /></Typography>
					<Typography variant="body1">
						{push_disabled ? <Translate value="global.profiles.widgets.shieldGroup.profileView.yes" /> : <Translate value="global.profiles.widgets.shieldGroup.profileView.no" />}
					</Typography>
				</Grid>
			</Grid>
			<Divider style={{ margin: "6px 0" }} />
			<Typography variant="h6" style={{ marginBottom: 12 }}>
				<Translate value="global.profiles.widgets.shieldGroup.profileView.audiences" />
			</Typography>
			<Grid container justify="space-between" spacing={16}>
				<Grid item sm={12}>
					<NestedList
						items={aGrps}
						header={getTranslation("global.profiles.widgets.shieldGroup.profileView.groups", _.size(aGrps))}
						dense={true}
						inset={false}
						headerStyle={{
							variant: "caption",
							color: "rgba(255,255,255, 0.7)"
						}}
					/>
				</Grid>
				<Grid item sm={12}>
					<NestedList
						items={aDists}
						header={getTranslation("global.profiles.widgets.shieldGroup.profileView.districts", _.size(aDists))}
						dense={true}
						inset={false}
						headerStyle={{
							variant: "caption",
							color: "rgba(255,255,255, 0.7)"
						}}
					/>
				</Grid>
				<Grid item sm={12}>
					<NestedList
						items={aDepts}
						header={getTranslation("global.profiles.widgets.shieldGroup.profileView.departments", _.size(aDepts))}
						dense={true}
						inset={false}
						headerStyle={{
							variant: "caption",
							color: "rgba(255,255,255, 0.7)"
						}}
					/>
				</Grid>
				<Grid item sm={12}>
					<NestedList
						items={aInds}
						header={getTranslation("global.profiles.widgets.shieldGroup.profileView.individuals", _.size(aInds))}
						dense={true}
						inset={false}
						headerStyle={{
							variant: "caption",
							color: "rgba(255,255,255, 0.7)"
						}}
					/>
				</Grid>
			</Grid>
		</Fragment>
	);
};

ProfileView.propTypes = propTypes;
ProfileView.defaultProps = defaultProps;

export default ProfileView;
