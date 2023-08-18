import React, { useEffect, useState, memo, Fragment } from "react";
import { Typography } from "@mui/material";
import { Translate } from "orion-components/i18n";
import TrackAssociationCard from "./components/TrackAssociationCard";
import { shallowEqual, useSelector } from "react-redux";
import { getFeedEntitiesByProperty } from "orion-components/GlobalData/Selectors";
import filter from "lodash/filter";
import { getWidgetState } from "orion-components/Profiles/Selectors";
import { getSelectedContextData } from "orion-components/Profiles/Selectors";
import { loadProfile } from "orion-components/ContextPanel/Actions";

const DroneAssociation = (props) => {
	const { id, contextId } = props;

	const enabled = useSelector((state) => getWidgetState(state)(id, "enabled"));
	const entity = useSelector((state) => getSelectedContextData(state)(contextId, "entity")) || {};

	const { feedId, entityData } = entity ?? {};
	const { type, flightId } = entityData.properties;
	const [tracks, setTracks] = useState([]);
	const flightTracks = useSelector(
		(state) => getFeedEntitiesByProperty(state, feedId, "flightId", flightId),
		shallowEqual
	);

	useEffect(() => {
		const items = filter(flightTracks, (track) => track && track.entityData.properties.type !== type);
		setTracks(items);
	}, [flightTracks]);

	return enabled ? (
		<div className="widget-wrapper collapsed">
			<div className="widget-header">
				<div className="cb-font-b2">
					<Translate value="global.profiles.widgets.droneTrackAssociation.title" />
				</div>
			</div>

			<div className="widget-content" style={{ display: "flex" }}>
				{tracks && tracks.length > 0 ? (
					tracks.map((associatedTrack, index) => {
						return (
							<TrackAssociationCard
								associatedTrack={associatedTrack}
								key={index}
								loadProfile={loadProfile}
								canTarget={true}
								readOnly={false}
							/>
						);
					})
				) : (
					<Typography style={{ margin: "12px auto" }} align="center" variant="caption">
						<Translate value="global.profiles.widgets.droneTrackAssociation.noAssociatedTracks" />
					</Typography>
				)}
			</div>
		</div>
	) : (
		<Fragment />
	);
};

export default memo(DroneAssociation);
