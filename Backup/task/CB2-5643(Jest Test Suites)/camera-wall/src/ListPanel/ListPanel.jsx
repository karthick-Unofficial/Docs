import React, { Fragment, useEffect, memo } from "react";
import PropTypes from "prop-types";
import { ContextPanel } from "orion-components/ContextPanel";
import CameraGroup from "./CameraGroup/CameraGroup";
import PinnedItem from "./PinnedItem/PinnedItem";
import SearchField from "./SearchField/SearchField";
import { Fab, List, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import { Translate } from "orion-components/i18n";
import { useDispatch, useSelector } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";
import { stageItem, updateWidgetLaunchData, setNewCameraGroup } from "./listPanelActions";

const propTypes = {
	canManage: PropTypes.bool,
	groups: PropTypes.object,
	pinnedItems: PropTypes.array,
	widgetLaunchData: PropTypes.object,
	dir: PropTypes.string
};

const defaultProps = {
	groups: {},
	pinnedItems: []
};

const ListPanel = () => {
	const { cameraGroups } = useSelector((state) => state.globalData);
	const { user } = useSelector((state) => state.session);
	const { pinnedItems } = useSelector((state) => state.appState.persisted) || [];
	const { widgetLaunchData } = useSelector((state) => state.cameraWall);
	const canManage =
		user.profile.applications &&
		user.profile.applications.find((app) => app.appId === "camera-wall-app") &&
		user.profile.applications.find((app) => app.appId === "camera-wall-app").permissions &&
		user.profile.applications.find((app) => app.appId === "camera-wall-app").permissions.includes("manage");
	const dir = useSelector((state) => getDir(state));
	const groups = cameraGroups;
	const dispatch = useDispatch();

	useEffect(() => {
		if (widgetLaunchData) {
			const { entityId, entityName, entityType, type } = widgetLaunchData;
			if (entityId && entityName && entityType && type) {
				// -- select given entity
				dispatch(
					stageItem({
						entityType,
						id: entityId,
						name: entityName,
						type
					})
				);

				// -- remove all data from widgetLaunchData
				dispatch(updateWidgetLaunchData(null));
			} else {
				// -- not enough data, remove all data from widgetLaunchData
				dispatch(updateWidgetLaunchData(null));
			}
		}
	}, [dispatch, widgetLaunchData]);

	const styles = {
		controls: {
			display: "flex",
			align: "center",
			alignItems: "center",
			padding: "1rem",
			backgroundColor: "#242426"
		},
		contents: {
			padding: "0.5rem 1rem",
			height: "calc(100% - 72px)"
		},
		empty: {
			display: "flex",
			justifyContent: "center",
			textAlign: "center",
			alignItems: "center"
		},
		typography: {
			...(dir === "rtl" && { marginRight: "1rem" }),
			...(dir === "ltr" && { marginLeft: "1rem" })
		}
	};

	const sortByName = (array) => {
		return array.sort((a, b) => {
			const nameA = a.name.toLowerCase();
			const nameB = b.name.toLowerCase();
			if (nameA < nameB) {
				return -1;
			} else if (nameA > nameB) {
				return 1;
			} else {
				return 0;
			}
		});
	};

	return (
		<ContextPanel className="camera-wall-list-panel" dir={dir}>
			<div className="context-panel-wrapper" style={styles.wrapper}>
				<div style={styles.controls}>
					<Fab
						disabled={!canManage}
						onClick={() => dispatch(setNewCameraGroup())}
						color="primary"
						size="small"
					>
						<Add />
					</Fab>
					<Typography variant="body1" style={styles.typography}>
						<Translate value="listPanel.newCamGroup" />
					</Typography>
				</div>
				<div style={styles.contents}>
					<SearchField />
					<div
						style={{
							overflow: "scroll",
							height: "calc(100% - 60px)"
						}}
					>
						{!!Object.values(groups).length && (
							<Fragment>
								<Typography style={{ padding: "16px 0 8px 0" }} variant="h6">
									<Translate value="listPanel.myCamGroups" />
								</Typography>
								<List>
									{sortByName(Object.values(groups)).map((group) => {
										const { id } = group;
										return <CameraGroup group={group} id={id} key={id} />;
									})}
								</List>
							</Fragment>
						)}
						{pinnedItems && !!pinnedItems.length && (
							<Fragment>
								<Typography style={{ padding: "16px 0 8px 0" }} variant="h6">
									<Translate value="listPanel.pinnedItems" />
								</Typography>
								<List>
									{sortByName(pinnedItems).map((item) => {
										const { id } = item;
										return <PinnedItem item={item} id={id} key={id} />;
									})}
								</List>
							</Fragment>
						)}
					</div>
					{pinnedItems && !Object.values(groups).length && !pinnedItems.length && (
						<div style={{ ...styles.empty, ...styles.contents }}>
							<Typography variant="body2">
								<Translate value="listPanel.noGroupText" />
							</Typography>
						</div>
					)}
				</div>
			</div>
		</ContextPanel>
	);
};

ListPanel.propTypes = propTypes;
ListPanel.defaultProps = defaultProps;

export default memo(ListPanel);
