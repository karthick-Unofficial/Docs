import React, { memo, useEffect, useState } from "react";

// Sortable
import { SortableContainer, SortableElement, arrayMove } from "react-sortable-hoc";

// Components
import WidgetCard from "./components/WidgetCard";

// Material UI
// Added for popover menu patch: (CB2-904)
import { List, Popover, Button } from "@mui/material";
import isEqual from "lodash/isEqual";
import { getTranslation } from "orion-components/i18n";
import { useDispatch } from "react-redux";

//actions
import { setWidgetOrder } from "orion-components/SharedActions/commonActions";

const SortableItem = SortableElement(({ value, enable, disable, isExpanded }) => {
	return (
		<WidgetCard widget={value} enable={(id) => enable(id)} disable={(id) => disable(id)} isExpanded={isExpanded} />
	);
});

const SortableList = SortableContainer(({ items, enable, disable, expandedWidget }) => {
	const isWidgetExpanded = (widget) => {
		if (expandedWidget === "map-view") {
			return widget.id === "map";
		} else {
			return expandedWidget === widget.name;
		}
	};

	return (
		<List className="widget-list">
			{items.map((value, index) => (
				<SortableItem
					key={`widget-${value.id}`}
					index={index}
					value={value}
					enable={(id) => enable(id)}
					disable={(id) => disable(id)}
					isExpanded={isWidgetExpanded(value)}
				/>
			))}
		</List>
	);
});

const getWidgetName = (id) => {
	switch (id) {
		case "linked_items":
			return getTranslation("global.profiles.cameraProfile.linkedItems");
		case "activities":
			return getTranslation("global.profiles.cameraProfile.activities");
		case "live_camera":
			return getTranslation("global.profiles.cameraProfile.liveCam");
		case "files":
			return getTranslation("global.profiles.cameraProfile.files");
		case "map":
			return getTranslation("global.profiles.cameraProfile.map");
		case "floorPlans":
			return getTranslation("global.profiles.facilityProfile.main.floorPlans");
		case "accessPoints":
			return getTranslation("global.profiles.facilityProfile.main.accessPoints");
		case "facility-condition":
			return getTranslation("global.profiles.facilityProfile.main.facilityCondition");
		case "cameras":
			return getTranslation("global.profiles.accessPointProfile.cameras");
		case "access_control":
			return getTranslation("global.profiles.accessPointProfile.accessControlWidget.title");
		case "marineTrafficParticulars":
			return getTranslation("global.profiles.entityProfile.main.marineTraffic");
		case "drone-association":
			return getTranslation("global.profiles.entityProfile.main.droneAssociation");
		case "details":
			return getTranslation("global.profiles.entityProfile.main.details");
		case "rules":
			return getTranslation("global.profiles.entityProfile.main.rules");
		case "alerts":
			return getTranslation("global.profiles.entityProfile.main.alerts");
		case "notes":
			return getTranslation("global.profiles.eventProfile.main.notes");
		case "event_lists":
			return getTranslation("global.profiles.eventProfile.main.eventLists");
		case "pinned_items":
			return getTranslation("global.profiles.eventProfile.main.pinnedItems");
		case "secure_share":
			return getTranslation("global.profiles.eventProfile.main.secureShare");
		case "cad_details":
			return getTranslation("global.profiles.eventProfile.main.cadDetails");
		case "responding_units":
			return getTranslation("global.profiles.eventProfile.main.respondingUnits");
		case "proximity":
			return getTranslation("global.profiles.eventProfile.main.proximity");
		case "resources":
			return getTranslation("global.profiles.eventProfile.main.resources");
		case "equipments":
			return getTranslation("global.profiles.eventProfile.main.equipment");
		case "gate_runner_response":
			return getTranslation("global.profiles.eventProfile.main.gateRunnerResponse");
		case "robotCameras":
			return getTranslation("global.profiles.robotDogProfile.robotCams");
		case "missionControl":
			return getTranslation("global.profiles.robotDogProfile.missionControl");
		default:
			return null;
	}
};

const LayoutControls = ({ widgetOrder, open, anchor, close, expandedWidget, profile }) => {
	const dispatch = useDispatch();
	const [widgets, setWidgets] = useState([]);

	useEffect(() => {
		widgetOrder.map((widget) => {
			widget.name = getWidgetName(widget.id);
		});
		setWidgets(widgetOrder);
	}, [widgetOrder]);

	const onSortEnd = ({ oldIndex, newIndex }) => {
		setWidgets(arrayMove(widgets, oldIndex, newIndex));
	};

	const handleSaveOrder = () => {
		dispatch(setWidgetOrder(profile, widgets));
		close();
	};

	const handleEnableWidget = (id) => {
		let newWidgets = [...widgets];

		newWidgets = widgets.map((widget) => {
			if (widget.id === id) {
				return { ...widget, enabled: true };
			} else {
				return widget;
			}
		});
		setWidgets(newWidgets);
	};

	const handleDisableWidget = (id) => {
		const widgetsData = widgets.slice();

		const newWidgets = widgetsData.map((widget) => {
			if (widget.id === id) {
				return { ...widget, enabled: false };
			} else {
				return widget;
			}
		});
		setWidgets(newWidgets);
	};

	// Prevent list sorting when clicking on enable/disable button
	const shouldCancelStart = (e) => {
		const buttonClick = e.composedPath().filter((tag) => {
			const { tagName } = tag;
			if (tagName) {
				return tagName.toLowerCase() === "button";
			}
		});

		if (buttonClick.length > 0) {
			return true;
		} else {
			return false;
		}
	};

	return (
		<Popover
			open={open}
			onClose={close}
			anchorEl={anchor}
			anchorOrigin={{ vertical: "top", horizontal: "center" }}
			transformOrigin={{ vertical: "top", horizontal: "center" }}
			//zDepth={5}
			PaperProps={{
				sx: {
					left: "100px",
					width: 340,
					backgroundColor: "#41454A"
				}
			}}
		>
			<div>
				<div className="layout-button-wrapper">
					<Button
						onClick={handleSaveOrder}
						variant="contained"
						color="primary"
						style={{
							width: "100%",
							color: "white",
							textTransform: "uppercase",
							borderRadius: "3px"
						}}
					>
						{getTranslation("global.profiles.widgets.layoutControls.done")}
					</Button>
				</div>
				<SortableList
					items={widgets}
					onSortEnd={onSortEnd}
					enable={(id) => handleEnableWidget(id)}
					disable={(id) => handleDisableWidget(id)}
					shouldCancelStart={shouldCancelStart}
					expandedWidget={expandedWidget}
				/>
			</div>
		</Popover>
	);
};

// TODO: Prevent unnecessary rendering from moving features and remove this life-cycle hook
// I believe the CB2-5573 fix has resolved the unwanted re-rendering issues; however, more testing is required to confirm that the fix is working as expected.

const componentUpdate = (prevProps, nextProps) => {
	if (!isEqual(prevProps.widgetOrder, nextProps.widgetOrder)) {
		return false;
	} else if (!isEqual(prevProps.open, nextProps.open)) {
		return false;
	} else {
		return true;
	}
};

export default memo(LayoutControls, componentUpdate);
