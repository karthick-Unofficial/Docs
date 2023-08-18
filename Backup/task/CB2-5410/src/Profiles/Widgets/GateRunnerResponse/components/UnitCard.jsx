import React, { useEffect, useState, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import { unitMemberSelector } from "orion-components/GlobalData/Selectors";
import FocusEntitiesBound from "orion-components/Units/components/FocusEntitiesBound";
import { ListItem, ListItemText, Button, Typography, SvgIcon } from "@mui/material";
import { Translate } from "orion-components/i18n";
import isEqual from "lodash/isEqual";
import { TargetingIcon } from "orion-components/SharedComponents";
import { mdiCheckCircle } from "@mdi/js";

const usePrevious = (value) => {
	const ref = useRef();
	useEffect(() => {
		ref.current = value;
	}, [value]);
	return ref.current;
};

const UnitCard = ({ unit, unitDataId, dir, feedSettings, handleNotify }) => {
	const [unitGeometry, setUnitGeometry] = useState([]);
	const [zoomEntities, setZoomEntities] = useState(false);
	const [targetIds, setTargetIds] = useState([]);

	const unitMembers = useSelector((state) => unitMemberSelector(state, unitDataId, feedSettings));
	const prevUnitMembers = usePrevious(unitMembers);

	const getUnitgeoFromMembers = useCallback(() => {
		const geoArr = [];
		const unitIdArr = [];
		unitMembers.forEach((member) => {
			if (member.geometry && member.geometry.coordinates) {
				const geometry = member.geometry;
				geometry["targetEntityId"] = member.targetEntityId;
				unitIdArr.push(member.targetEntityId);
			}
		});
		setUnitGeometry(geoArr);
		setTargetIds(unitIdArr);
	});

	//zoom entities
	const setFocus = () => {
		setZoomEntities(true);
		setTimeout(() => {
			setZoomEntities(false);
		}, 3000);
	};

	useEffect(() => {
		if (!isEqual(unitMembers, prevUnitMembers)) {
			getUnitgeoFromMembers();
		}
	}, [unitMembers]);

	const styles = {
		unitCard: {
			minHeight: 40,
			...(dir === "rtl" && { direction: "rtl", padding: "0 6px 0 10px" }),
			...(dir === "ltr" && { padding: "0 10px 0 6px" })
		},
		unitListItemText: {
			...(dir === "rtl" && { padding: "0 5px 0 0", textAlign: "right" }),
			...(dir === "ltr" && { padding: "0 0 0 5px" })
		}
	};

	return (
		<>
			<ListItem style={styles.unitCard}>
				{unitGeometry.length > 0 ? (
					<TargetingIcon
						setFocus={setFocus}
						geometry={unitGeometry}
						targetIds={targetIds}
						multipleTargets={true}
					/>
				) : (
					<div style={{ width: 48 }}></div>
				)}
				<ListItemText
					style={styles.unitListItemText}
					primary={
						<>
							<Typography style={{ fontSize: 12, lineHeight: 1.3 }}>{unit.name}</Typography>
							<Typography style={{ fontSize: 11, lineHeight: 1 }}>{unit.locationName}</Typography>
						</>
					}
					primaryTypographyProps={{
						noWrap: true,
						variant: "body1"
					}}
				/>
				{unit.notified ? (
					<SvgIcon style={{ width: "24px", height: "24px", color: "#378ABC" }}>
						<path d={mdiCheckCircle} />
					</SvgIcon>
				) : (
					<Button
						color="primary"
						style={{
							textTransform: "none",
							fontSize: 11,
							minWidth: "unset",
							padding: "6px 5px",
							color: "#4BAEE8"
						}}
						onClick={() => handleNotify([unit.recommendationId])}
					>
						<Translate value={"global.profiles.widgets.gateRunnerWidget.timelineCard.notify"} />
					</Button>
				)}
			</ListItem>
			{zoomEntities && <FocusEntitiesBound items={unitMembers} />}
		</>
	);
};

export default UnitCard;
