import React, { Fragment, useEffect, memo } from "react";
import PropTypes from "prop-types";
import { ContextPanel } from "orion-components/ContextPanel";
import { default as CameraGroup } from "./CameraGroup/CameraGroupContainer";
import { default as PinnedItem } from "./PinnedItem/PinnedItemContainer";
import { default as SearchField } from "./SearchField/SearchFieldContainer";
import { Fab, List, Typography } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { Translate } from "orion-components/i18n/I18nContainer";

const propTypes = {
	canManage: PropTypes.bool,
	groups: PropTypes.object,
	pinnedItems: PropTypes.array,
	setNewCameraGroup: PropTypes.func.isRequired,
	widgetLaunchData: PropTypes.object,
	stageItem: PropTypes.func.isRequired,
	updateWidgetLaunchData: PropTypes.func.isRequired,
	dir: PropTypes.string
};

const defaultProps = {
	groups: {},
	pinnedItems: []
};

const ListPanel = ({canManage, groups, pinnedItems, setNewCameraGroup, widgetLaunchData, stageItem, updateWidgetLaunchData, dir }) => {
	useEffect(() => {
		if (widgetLaunchData) {
			const { entityId, entityName, entityType, type } = widgetLaunchData;
			if (entityId && entityName && entityType && type) {

				// -- select given entity
				stageItem({
					entityType,
					id: entityId,
					name: entityName,
					type
				});

				// -- remove all data from widgetLaunchData
				updateWidgetLaunchData(null);
			}
			else {
				// -- not enough data, remove all data from widgetLaunchData
				updateWidgetLaunchData(null);
			}
		}
	}, [stageItem, updateWidgetLaunchData, widgetLaunchData]);

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
		}
	};
	const sortByName = array => {
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
					<Fab disabled={!canManage} onClick={setNewCameraGroup} color="primary" size="small">
						<Add />
					</Fab>
					<Typography variant="body1" style={dir == "rtl" ? { marginRight: "1rem" } : { marginLeft: "1rem" }}>
						<Translate value="listPanel.newCamGroup"/>
					</Typography>
				</div>
				<div style={styles.contents}>
					<SearchField/>
					<div style={{ overflow: "scroll", height: "calc(100% - 60px)" }}>
						{!!Object.values(groups).length && (
							<Fragment>
								<Typography style={{ padding: "16px 0 8px 0" }} variant="h6">
									<Translate value="listPanel.myCamGroups"/>
								</Typography>
								<List>
									{sortByName(Object.values(groups)).map(group => {
										const { id } = group;
										return <CameraGroup group={group} id={id} key={id} />;
									})}
								</List>
							</Fragment>
						)}
						{!!pinnedItems.length && (
							<Fragment>
								<Typography style={{ padding: "16px 0 8px 0" }} variant="h6">
									<Translate value="listPanel.pinnedItems"/>
								</Typography>
								<List>
									{sortByName(pinnedItems).map(item => {
										const { id } = item;
										return <PinnedItem item={item} id={id} key={id} />;
									})}
								</List>
							</Fragment>
						)}
					</div>
					{!Object.values(groups).length && !pinnedItems.length && (
						<div style={{ ...styles.empty, ...styles.contents }}>
							<Typography variant="body2">
								<Translate value="listPanel.noGroupText"/>
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
