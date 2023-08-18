import React, { useState, useEffect, useCallback, memo } from "react";
import PropTypes from "prop-types";
import { BaseWidget } from "../shared";
import {
	SortableContainer,
	SortableElement,
	arrayMove
} from "react-sortable-hoc";
import { List, ListItem, ListItemText, ListItemIcon } from "@mui/material";
import { Reorder, Visibility } from "@mui/icons-material";
import { getTranslation } from "orion-components/i18n";
import { useSelector, useDispatch } from "react-redux";
import { selectedContextSelector } from "../../../ContextPanel/Selectors";
import * as actionCreators from "./floorPlanWidgetActions";
import { floorPlanSelector } from "orion-components/Map/Selectors";
import { getDir } from "orion-components/i18n/Config/selector";

const propTypes = {
	floorPlans: PropTypes.object.isRequired,
	handleSelect: PropTypes.func.isRequired,
	selectedFloor: PropTypes.object,
	setFloorOrder: PropTypes.func.isRequired,
	dir: PropTypes.string
};

const defaultProps = {
	selectedId: null,
	floorPlans: [],
	dir: "rtl"
};

const SortableItem = SortableElement(({ item, selected, onSelect, dir }) => {
	const styles = {
		listItem: {
			zIndex: 999,
			backgroundColor:
				selected && selected.id === item.id ? "#1688bd" : "#494D53",
			marginBottom: 8,
			...(dir === "rtl" && { flexDirection: "row-reverse" })
		},
		listItemIcon: {
			...(dir === "rtl" && { justifyContent: "end" })
		},
		listItemText: {
			overflow: "hidden",
			whiteSpace: "nowrap",
			textOverflow: "ellipsis",
			color: "white",
			textAlign: dir == "rtl" ? "right" : "left"
		}
	};
	return (
		<ListItem button onClick={() => onSelect(item)} style={styles.listItem}>
			<ListItemIcon style={styles.listItemIcon}>
				<Reorder />
			</ListItemIcon>
			<ListItemText
				style={styles.listItemText}
				primary={item.name}
				primaryTypographyProps={{ noWrap: true }}
			/>
			{selected && selected.id === item.id && (
				<ListItemIcon style={styles.listItemIcon}>
					<Visibility />
				</ListItemIcon>
			)}
		</ListItem>
	);
});

const SortableList = SortableContainer(({ items, selected, onSelect, dir }) => {
	return (
		<List>
			{items.map((item, index) => (
				<SortableItem
					key={index}
					index={index}
					item={item}
					selected={selected}
					onSelect={onSelect}
					dir={dir}
				/>
			))}
		</List>
	);
});

const FloorPlanWidget = ({
	floorPlans,
	handleSelect,
	removeFloorPlanCameraSub,
	removeFloorPlanAccessPointsSub,
	clearFloorPlan,
	startFloorPlanCameraStream,
	startFloorPlanAccessPointsStream,
	cameras,
	selectFloorPlan,
	setFloorPlans,
	facilityId,
	facilityFeedId,
	order,
	widgetsLaunchable,
	contextId,
	enabled,
	getSelectedFloorPlan
}) => {
	const dispatch = useDispatch();

	const { setFloorOrder } = actionCreators;
	const context = useSelector((state) => selectedContextSelector(state));
	const selectedFloor = useSelector(
		(state) => floorPlanSelector(state).selectedFloor || {}
	);
	const subscriptions =
		context && context.subscriptions
			? context.subscriptions.floorPlanCameras
			: null;
	const dir = useSelector((state) => getDir(state));

	useEffect(() => {
		if (Object.values(floorPlans).length && facilityId) {
			const defaultFloor = Object.values(floorPlans).find(
				(floor) => floor.order === 1
			);
			if (
				defaultFloor &&
				(!selectedFloor || selectedFloor.facilityId !== facilityId)
			) {
				dispatch(handleSelect(defaultFloor, facilityFeedId));
			}
		}
	}, [facilityId, floorPlans, selectFloorPlan]);
	useEffect(() => {
		if (cameras && facilityId) {
			if (
				subscriptions &&
				(!selectedFloor || selectedFloor.facilityId !== facilityId)
			) {
				dispatch(
					removeFloorPlanCameraSub(facilityId, "floorPlanCameras")
				);
			}
			if (
				!subscriptions &&
				selectedFloor &&
				selectedFloor.id &&
				selectedFloor.facilityId === facilityId
			) {
				dispatch(
					startFloorPlanCameraStream(
						facilityId,
						selectedFloor.id,
						"profile"
					)
				);
			}
		}
		if (facilityId && startFloorPlanAccessPointsStream) {
			if (
				subscriptions &&
				(!selectedFloor || selectedFloor.facilityId !== facilityId)
			) {
				dispatch(
					removeFloorPlanAccessPointsSub(
						facilityId,
						"floorPlanAccessPoints"
					)
				);
			}
			if (
				!subscriptions &&
				selectedFloor &&
				selectedFloor.id &&
				selectedFloor.facilityId === facilityId
			) {
				dispatch(
					startFloorPlanAccessPointsStream(
						facilityId,
						selectedFloor.id,
						"profile"
					)
				);
			}
		}
		if (selectedFloor) {
			getSelectedFloorPlan(selectedFloor);
		}
	}, [
		selectedFloor,
		facilityId,
		removeFloorPlanCameraSub,
		startFloorPlanCameraStream,
		removeFloorPlanAccessPointsSub,
		startFloorPlanAccessPointsStream,
		subscriptions
	]);

	useEffect(() => {
		return () => {
			if (facilityId) {
				dispatch(setFloorPlans([]));
			}
		};
	}, [facilityId, setFloorPlans]);

	const [moving, setMoving] = useState(false);
	const getFloors = (floors) => {
		return Object.values(floors).sort((a, b) => {
			if (a.order < b.order) {
				return -1;
			}
			if (a.order > b.order) {
				return 1;
			}
			return 0;
		});
	};
	const handleSortEnd = useCallback(
		({ oldIndex, newIndex }) => {
			const newItems = arrayMove(
				getFloors(floorPlans),
				oldIndex,
				newIndex
			);
			newItems.forEach((floor, index) => (floor.order = index + 1));
			dispatch(setFloorOrder(newItems));
			setMoving(false);
		},
		[floorPlans, setFloorOrder]
	);
	const handleSelectFloor = useCallback(
		(floor) => {
			if (selectedFloor) {
				if (selectedFloor.id === floor.id) {
					dispatch(clearFloorPlan(floor));
				} else {
					dispatch(
						removeFloorPlanCameraSub(
							selectedFloor.facilityId,
							"floorPlanCameras"
						)
					);
					dispatch(
						removeFloorPlanAccessPointsSub(
							selectedFloor.facilityId,
							"floorPlanAccessPoints"
						)
					);
					dispatch(handleSelect(floor, facilityFeedId));
				}
			} else {
				dispatch(handleSelect(floor, facilityFeedId));
			}
		},
		[handleSelect, clearFloorPlan, selectedFloor]
	);
	const handleLaunch = () => {
		window.open(`/facilities-app/#/entity/${contextId}`);
	};
	return !enabled ? (
		<div />
	) : (
		<BaseWidget
			title={getTranslation(
				"global.profiles.widgets.floorPlanWidget.floorPlans"
			)}
			order={order}
			launchable={widgetsLaunchable}
			handleLaunch={handleLaunch}
			dir={dir}
		>
			<SortableList
				items={getFloors(floorPlans)}
				onSortEnd={handleSortEnd}
				distance={12}
				selected={moving ? null : selectedFloor}
				onSelect={handleSelectFloor}
				onSortStart={() => setMoving(true)}
				dir={dir}
			/>
		</BaseWidget>
	);
};

FloorPlanWidget.propTypes = propTypes;
FloorPlanWidget.defaultProps = defaultProps;

export default memo(FloorPlanWidget);
