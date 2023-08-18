import React, { memo, useEffect, useState } from "react";

// Sortable
import { SortableContainer, SortableElement, arrayMove } from "react-sortable-hoc";

// Components
import WidgetCard from "./components/WidgetCard";

// Material UI
// Added for popover menu patch: (CB2-904)
import { List, Popover, Button, Typography, FormControlLabel, Checkbox } from "@mui/material";
import isEqual from "lodash/isEqual";
import { Translate, getTranslation } from "orion-components/i18n";
import { useSelector, useDispatch } from "react-redux";

//actions
import { setWidgetOrder, setWidgetState } from "orion-components/SharedActions/commonActions";
import { getDir } from "orion-components/i18n/Config/selector";

const SortableItem = SortableElement(({ value, enable, disable, isExpanded }) => {
	return (
		<WidgetCard widget={value} enable={(id) => enable(id)} disable={(id) => disable(id)} isExpanded={isExpanded} />
	);
});

const SortableList = SortableContainer(({ items, enable, disable, expandedWidget, disabled = false }) => {
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
					disabled={disabled}
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

const checkboxStyle = {
	"&.Mui-checked": {
		position: "relative",
		"&:after": {
			content: '""',
			left: 13,
			top: 13,
			height: 15,
			width: 15,
			position: "absolute",
			backgroundColor: "#fff",
			zIndex: -1
		}
	}
};

const LayoutControls = ({ widgetOrder, widgetState, close, expandedWidget, profile }) => {
	const dispatch = useDispatch();
	const dir = useSelector((state) => getDir(state));

	const [enabledWidgets, setEnabledWidgets] = useState([]);
	const [disabledWidgets, setDisabledWidgets] = useState([]);
	const [autoExpand, setAutoExpand] = useState(widgetState?.autoExpand);

	const filterWidgets = (widgets) => {
		const enabled = widgets.filter((item) => item.enabled);
		const disabled = widgets.filter((item) => !item.enabled).sort((a, b) => { return a.name > b.name ? 1 : -1; });

		setEnabledWidgets(enabled);
		setDisabledWidgets(disabled);
	};

	useEffect(() => {
		widgetOrder.map((widget) => {
			widget.name = getWidgetName(widget.id);
		});

		filterWidgets(widgetOrder);
	}, [widgetOrder]);

	const onSortEnd = ({ oldIndex, newIndex }) => {
		setEnabledWidgets(arrayMove(enabledWidgets, oldIndex, newIndex));
	};

	const handleSaveOrder = () => {
		const widgets = [...enabledWidgets, ...disabledWidgets];
		dispatch(setWidgetOrder(profile, widgets));
		const updatedWidgetState = widgetState;
		updatedWidgetState.autoExpand = autoExpand;
		dispatch(setWidgetState("layoutControls", updatedWidgetState));
		close();
	};

	const handleEnableWidget = (id) => {
		let newWidgets = [...enabledWidgets, ...disabledWidgets];

		newWidgets = newWidgets.map((widget) => {
			if (widget.id === id) {
				return { ...widget, enabled: true };
			} else {
				return widget;
			}
		});
		filterWidgets(newWidgets);
	};

	const handleDisableWidget = (id) => {
		const widgets = [...enabledWidgets, ...disabledWidgets];
		const widgetsData = widgets.slice();

		const newWidgets = widgetsData.map((widget) => {
			if (widget.id === id) {
				return { ...widget, enabled: false };
			} else {
				return widget;
			}
		});

		filterWidgets(newWidgets);
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

	const toggleAutoExpand = () => {
		setAutoExpand(!autoExpand);
	};

	const styles = {
		layoutButtonWrapper: {
			padding: "0 15px",
			margin: 0,
			direction: dir
		},
		titleWrapper: {
			padding: 5
		},
		title: {
			fontSize: 16
		},
		explanation: {
			fontSize: 11,
			color: "#fff",
			opacity: 0.69,
			letterSpacing: 0
		},
		formControlLabel: {
			color: "#fff",
			...(dir === "ltr" && { margin: "10px 16px 10px -11px" }),
			...(dir === "rtl" && { margin: "10px -11px 10px 16px" }),
			fontSize: 11
		}
	}

	return (
		<div>
			<div className="layout-button-wrapper" style={styles.layoutButtonWrapper}>
				<div style={styles.titleWrapper}>
					<Typography style={styles.title}>
						<Translate value="global.profiles.widgets.layoutControls.title" count={getTranslation(`global.profiles.widgets.layoutControls.${profile}`)} />
					</Typography>

					<div style={styles.explanation}>
						<Translate value="global.profiles.widgets.layoutControls.explanation" /><br />
						<Translate value="global.profiles.widgets.layoutControls.note" count={`"${getTranslation(`global.profiles.widgets.layoutControls.${profile}`)}"`} />
					</div>

					<FormControlLabel
						className="themedCheckBox"
						control={
							<Checkbox
								style={{
									transform: "scale(1.1)"
								}}
								checked={autoExpand}
								onChange={toggleAutoExpand}
								name="autoExpand"
								sx={checkboxStyle}
							/>
						}
						label={getTranslation("global.profiles.widgets.layoutControls.autoExpand")}
						disableTypography={true}
						sx={styles.formControlLabel}
					/>
				</div>
				<div>
					<SortableList
						items={enabledWidgets}
						onSortEnd={onSortEnd}
						enable={(id) => handleEnableWidget(id)}
						disable={(id) => handleDisableWidget(id)}
						shouldCancelStart={shouldCancelStart}
						expandedWidget={expandedWidget}
					/>
					<div style={{ height: 20 }}></div>
					<SortableList
						items={disabledWidgets}
						enable={(id) => handleEnableWidget(id)}
						disable={(id) => handleDisableWidget(id)}
						shouldCancelStart={shouldCancelStart}
						expandedWidget={expandedWidget}
						disabled={true}
					/>
				</div>
				<Button
					onClick={handleSaveOrder}
					variant="contained"
					color="primary"
					style={{
						width: "100%",
						color: "white",
						textTransform: "uppercase",
						borderRadius: "5px",
						fontSize: 13,
						letterSpacing: 0,
						marginTop: 32

					}}
				>
					{getTranslation("global.profiles.widgets.layoutControls.done")}
				</Button>
			</div>
		</div>
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
