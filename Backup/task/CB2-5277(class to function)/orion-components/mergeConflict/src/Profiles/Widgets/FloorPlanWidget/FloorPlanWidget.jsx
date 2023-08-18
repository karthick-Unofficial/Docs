import React, { useState, useEffect, useCallback, memo } from "react";
import PropTypes from "prop-types";
import { BaseWidget } from "../shared";
import {
	SortableContainer,
	SortableElement,
	arrayMove
} from "react-sortable-hoc";
import { List, ListItem, ListItemText, ListItemIcon } from "@material-ui/core";
import { Reorder, Visibility } from "@material-ui/icons";
import { getTranslation } from "orion-components/i18n/I18nContainer";

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

const SortableItem = SortableElement(({ item, selected, onSelect, dir }) => (
	<ListItem
		button
		onClick={() => onSelect(item)}
		style={{
			zIndex: 999,
			backgroundColor: selected && (selected.id === item.id) ? "#1688bd" : "#494D53",
			marginBottom: 8
		}}
	>
		<ListItemIcon>
			<Reorder />
		</ListItemIcon>
		<ListItemText
			style={{
				overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", color: "white", textAlign: dir == "rtl" ? "right" : "left"
			}}
			primary={item.name}
			primaryTypographyProps={{ noWrap: true }}
		/>
		{selected && (selected.id === item.id) && (
			<ListItemIcon>
				<Visibility />
			</ListItemIcon>
		)}
	</ListItem>
));

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
	subscriptions,
	floorPlans,
	handleSelect,
	selectedFloor,
	removeFloorPlanCameraSub,
	removeFloorPlanAccessPointsSub,
	clearFloorPlan,
	startFloorPlanCameraStream,
	startFloorPlanAccessPointsStream,
	cameras,
	setFloorOrder,
	selectFloorPlan,
	setFloorPlans,
	facilityId,
	facilityFeedId,
	order,
	widgetsLaunchable,
	contextId,
	enabled,
	dir
}) => {
	useEffect(() => {
		if (Object.values(floorPlans).length && facilityId) {
			const defaultFloor = Object.values(floorPlans).find(floor => floor.order === 1);
			if (defaultFloor && (!selectedFloor || selectedFloor.facilityId !== facilityId)) {
				handleSelect(defaultFloor, facilityFeedId);
			}
		}
	}, [facilityId, floorPlans, selectFloorPlan]);
	useEffect(() => {
		if (cameras && facilityId) {
			if (subscriptions && (!selectedFloor || selectedFloor.facilityId !== facilityId)) {
				removeFloorPlanCameraSub(facilityId, "floorPlanCameras");
			}
			if (!subscriptions && selectedFloor && selectedFloor.id && selectedFloor.facilityId === facilityId) {
				startFloorPlanCameraStream(facilityId, selectedFloor.id, "profile");
			}
		}
		if (facilityId && startFloorPlanAccessPointsStream) {
			if (subscriptions && (!selectedFloor || selectedFloor.facilityId !== facilityId)) {
				removeFloorPlanAccessPointsSub(facilityId, "floorPlanAccessPoints");
			}
			if(!subscriptions && selectedFloor && selectedFloor.id && selectedFloor.facilityId === facilityId) {
				startFloorPlanAccessPointsStream(facilityId, selectedFloor.id, "profile");
			}
		}
	}, [selectedFloor, facilityId, removeFloorPlanCameraSub, startFloorPlanCameraStream, removeFloorPlanAccessPointsSub, startFloorPlanAccessPointsStream, subscriptions]);

	useEffect(() => {
		return () => {
			if (facilityId) {
				setFloorPlans([]);
			}
		};
	}, [facilityId, setFloorPlans]);

	const [moving, setMoving] = useState(false);
	const getFloors = floors => {
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
			const newItems = arrayMove(getFloors(floorPlans), oldIndex, newIndex);
			newItems.forEach((floor, index) => (floor.order = index + 1));
			setFloorOrder(newItems);
			setMoving(false);
		},
		[floorPlans, setFloorOrder]
	);
	const handleSelectFloor = useCallback(
		floor => {
			if (selectedFloor) {
				if (selectedFloor.id === floor.id) {
					clearFloorPlan(floor);
				} else {
					removeFloorPlanCameraSub(selectedFloor.facilityId, "floorPlanCameras");
					removeFloorPlanAccessPointsSub(selectedFloor.facilityId, "floorPlanAccessPoints");
					handleSelect(floor, facilityFeedId);
				}
			} else {
				handleSelect(floor, facilityFeedId);
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
			title={getTranslation("global.profiles.widgets.floorPlanWidget.floorPlans")}
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
