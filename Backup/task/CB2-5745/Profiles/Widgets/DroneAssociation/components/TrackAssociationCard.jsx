import React from "react";
import { TargetingIcon } from "orion-components/SharedComponents";
import { Card, ListItem, ListItemText } from "@mui/material";
import { useDispatch } from "react-redux";
import { getIcon } from "orion-components/SharedComponents";

const TrackAssociationCard = (props) => {
	const dispatch = useDispatch();

	const { associatedTrack, loadProfile, canTarget, dir } = props;

	const handleHeaderClick = (e, associatedTrack) => {
		e.stopPropagation();
		const { id, entityData } = associatedTrack;
		dispatch(
			loadProfile(id, entityData.properties.name, "track", "profile")
		);
	};

	const { id, feedId, entityData } = associatedTrack;
	const { name } = entityData.properties;

	const styles = {
		listItem: {
			backgroundColor: "#494D53",
			minHeight: 48,
			padding: "0px 6px",
			...(dir === "rtl" && { direction: "rtl" })
		},
		listItemText: {
			...(dir === "rtl" && { textAlign: "right" }),
			padding: 0
		}
	};

	return (
		<Card style={{ borderRadius: 0, marginBottom: 12 }}>
			<ListItem
				button={loadProfile}
				onClick={(e) => handleHeaderClick(e, associatedTrack)}
				style={styles.listItem}
			>
				{canTarget && (
					<TargetingIcon
						geometry={entityData.geometry}
						id={id}
						feedId={feedId}
					/>
				)}
				<span style={{ color: "#B5B9BE" }}>
					{getIcon(entityData.properties.type)}
				</span>
				<ListItemText
					style={styles.listItemText}
					primary={<div style={{ padding: "0px 12px" }}>{name}</div>}
					primaryTypographyProps={{
						noWrap: true,
						variant: "body1"
					}}
				/>
			</ListItem>
		</Card>
	);
};

export default TrackAssociationCard;
