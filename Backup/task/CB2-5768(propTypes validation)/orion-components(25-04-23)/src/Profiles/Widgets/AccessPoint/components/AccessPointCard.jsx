import React from "react";
import { TargetingIcon } from "orion-components/SharedComponents";
import { Card, ListItem, ListItemText } from "@mui/material";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";

const propTypes = {
	accessPoint: PropTypes.object,
	loadProfile: PropTypes.func,
	canTarget: PropTypes.bool,
	readOnly: PropTypes.bool,
	dir: PropTypes.string
}

const AccessPointCard = ({ accessPoint, loadProfile, canTarget, readOnly, dir }) => {
	const dispatch = useDispatch();

	const handleHeaderClick = (e, accessPoint) => {
		e.stopPropagation();
		const { id, entityData } = accessPoint;
		dispatch(loadProfile(id, entityData.properties.name, "accessPoint", "profile"));
	};

	const { id, feedId, entityData } = accessPoint;
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
				button={loadProfile && !readOnly}
				onClick={(e) => handleHeaderClick(e, accessPoint)}
				style={styles.listItem}
			>
				{canTarget && <TargetingIcon geometry={entityData.geometry} id={id} feedId={feedId} />}
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

AccessPointCard.propTypes = propTypes;
export default AccessPointCard;
