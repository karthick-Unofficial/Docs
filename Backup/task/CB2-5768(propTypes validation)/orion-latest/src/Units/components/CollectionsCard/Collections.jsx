import React from "react";
import { useSelector } from "react-redux";
import { makeGetCollectionMembers, userFeedsSelector } from "../../../GlobalData/Selectors";
import map from "lodash/map";
import pickBy from "lodash/pickBy";
import { TargetingIcon } from "orion-components/SharedComponents";
import { Grid, Typography, Divider } from "@mui/material";
import { FacilityBlueIcon } from "orion-components/CBComponents/Icons";
import { Translate } from "orion-components/i18n";
import filter from "lodash/filter";

const Collections = (props) => {
	const getCollectionMember = makeGetCollectionMembers();
	const entities = useSelector((state) => getCollectionMember(state, props));

	const profileIconTemplates = {};
	const userFeeds = useSelector((state) => userFeedsSelector(state));
	Object.values(userFeeds).forEach((feed) => {
		profileIconTemplates[feed.feedId] = feed.profileIconTemplate;
	});

	const getCollectionMembers = () => {
		const filteredMembers = pickBy(entities, (member) => {
			const { entityData, id } = member;
			if (entityData) {
				const { properties } = entityData;
				const { name, description, type } = properties;
				properties.profileIconTemplate = profileIconTemplates[member.feedId];
				return `${name}|${description}|${type}|${id}`.toLowerCase();
			} else {
				return false;
			}
		});
		return filteredMembers;
	};

	const getCollectionIcons = (icon) => {
		switch (icon) {
			case "shapes":
				return (
					<img
						alt="marker_yellow"
						style={{
							width: 29,
							height: 29
						}}
						src={require("../../../SharedComponents/ShapeEdit/icons/Marker_yellow.png")}
					/>
				);
			case "facility":
				return <FacilityBlueIcon style={{ width: 29, height: 29 }} />;
			default:
				return null;
		}
	};

	const members = getCollectionMembers();

	const { titleId } = props;
	const filteredMembers = filter(
		members,
		(member) =>
			(member.entityType === "shapes" &&
				titleId === "interdictionPointCollection" &&
				member.entityData.type === "Point") ||
			(member.entityType === "facility" && titleId === "targetCollection")
	);

	return (
		<div>
			{filteredMembers.length > 0 ? (
				map(filteredMembers, (member, index) => {
					const { entityData, feedId, entityType } = member;
					const { properties } = entityData;
					const { name, type } = properties;

					const id = member.id ? member.id : properties.id ? properties.id : "";
					return (
						<div>
							<Grid container>
								<Grid item xs={2} sm={2} md={2} lg={2} style={{ paddingTop: "5px" }}>
									<TargetingIcon id={id} feedId={feedId} geometry={true} feedLayerCheck={true} />
								</Grid>
								<Grid item xs={2} sm={2} md={2} lg={2}>
									<div style={{ marginTop: "10px" }}>{getCollectionIcons(entityType)}</div>
								</Grid>
								<Grid item xs={8} sm={8} md={8} lg={8}>
									<div style={{ marginTop: "10px" }}>
										<Typography fontSize="12px">{name}</Typography>
										<Typography fontSize="8px">{type}</Typography>
									</div>
								</Grid>
							</Grid>
							{index !== filteredMembers.length - 1 ? (
								<Divider
									style={{
										background: "#ff",
										marginBottom: "3px",
										padding: "0px 4px"
									}}
								/>
							) : null}
						</div>
					);
				})
			) : (
				<div>
					<Typography fontSize="14px" style={{ textAlign: "center", paddingTop: "20px" }}>
						{titleId === "interdictionPointCollection" ? (
							<Translate value="global.units.components.collections.noInterdictionLocations" />
						) : (
							<Translate value="global.units.components.collections.noTargetLocation" />
						)}
					</Typography>
				</div>
			)}
		</div>
	);
};
export default Collections;
