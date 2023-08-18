import React from "react";
import { TargetingIcon } from "orion-components/SharedComponents";
import {
	Card,
	ListItem,
	ListItemText,
	Button,
} from "@material-ui/core";
import { useDispatch } from "react-redux";

const AccessPointCard = (props) => {
	const dispatch = useDispatch();

	const {
		accessPoint,
		loadProfile,
		canTarget,
		readOnly,
		dir } = props;

	const handleHeaderClick = (e, accessPoint) => {
		e.stopPropagation();
		const { id, entityData } = accessPoint;
		dispatch(loadProfile(id, entityData.properties.name, "accessPoint", "profile"));
	};

	const { id, feedId, entityData } = accessPoint;
	const { name } = entityData.properties;


	return (
		<Card style={{ borderRadius: 0, marginBottom: 12 }}>
			<ListItem
				button={false}
				style={dir == "rtl" ? { padding: "0px 6px", minHeight: 48, direction: "rtl" } : { padding: "0px 6px", minHeight: 48 }}
			>
				{canTarget && <TargetingIcon geometry={accessPoint.entityData.geometry} id={id} feedId={feedId} />}
				<ListItemText
					style={dir == "rtl" ? { textAlign: "right", padding: 0 } : { padding: 0 }}
					primary={
						loadProfile && !readOnly ? (
							<Button
								onClick={e => handleHeaderClick(e, accessPoint)}
								color="primary"
								style={{ textTransform: "none", color: "white" }}
							>
								{name}
							</Button>
						) : (
							<div style={{ padding: "0px 12px" }}>{name}</div>
						)
					}
					primaryTypographyProps={{
						noWrap: true,
						variant: "body1"
					}}
				/>
			</ListItem>
		</Card>
	);
};

export default AccessPointCard;
