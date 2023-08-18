import React, { Fragment, memo, useEffect, useState } from "react";
import { Button, Divider, Typography } from "@mui/material";
import BerthForm from "./BerthForm/BerthForm";
import { Translate } from "orion-components/i18n";
import { useSelector } from "react-redux";


const BerthSettings = () => {
	const berthGroups = useSelector(state => state.berthGroups);
	const user = useSelector(state => state.session.user.profile);

	useEffect(() => {
		setGroupData(berthGroups);
	}, [berthGroups]);
	const [groupData, setGroupData] = useState(berthGroups);
	const handleAddGroup = () => {
		setGroupData([{ name: "", id: groupData.length }, ...groupData]);
	};
	const canManage = user.applications
		&& user.applications.find(app => app.appId === "berth-schedule-app")
		&& user.applications.find(app => app.appId === "berth-schedule-app").permissions
		&& user.applications.find(app => app.appId === "berth-schedule-app").permissions.includes("manage");
	return (
		<Fragment>
			<div style={{ paddingBottom: 12, display: "flex", alignItems: "center" }}>
				<Typography style={{ marginRight: 24 }} variant="h5">
					<Translate value="lookupManager.berthSettings.title" />
				</Typography>
				{canManage ? (
					<Button
						onClick={handleAddGroup}
						color="primary"
						style={{ textTransform: "none" }}
					>
						<Translate value="lookupManager.berthSettings.addBerthGroup" />
					</Button>
				) : (
					null
				)}
			</div>
			<Divider />
			<div>
				{groupData.map(group => {
					const { id } = group;
					return (
						<BerthForm
							key={id}
							groupId={id}
							group={group}
							saved={!!berthGroups.find(group => group.id === id)}
							canManage={canManage}
						/>
					);
				})}
			</div>
		</Fragment>
	);
};

export default memo(BerthSettings);
