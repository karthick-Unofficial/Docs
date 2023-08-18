import React, { memo, useEffect, useState } from "react";

// Sortable
import {
	SortableContainer,
	SortableElement,
	arrayMove
} from "react-sortable-hoc";

// Components
import WidgetCard from "./components/WidgetCard";

// Material UI
// Added for popover menu patch: (CB2-904)
import { List, Popover, Button } from "@mui/material";
import isEqual from "lodash/isEqual";
import { getTranslation } from "orion-components/i18n";
import { useDispatch, useSelector } from "react-redux";

//actions
import { setWidgetOrder } from "orion-components/SharedActions/commonActions";

const SortableItem = SortableElement(
	({ value, enable, disable, isExpanded }) => {
		return (
			<WidgetCard
				widget={value}
				enable={(id) => enable(id)}
				disable={(id) => disable(id)}
				isExpanded={isExpanded}
			/>
		);
	}
);

const SortableList = SortableContainer(
	({ items, enable, disable, expandedWidget }) => {
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
	}
);

const LayoutControls = ({
	widgetOrder,
	open,
	anchor,
	close,
	expandedWidget,
	profile
}) => {
	const dispatch = useDispatch();
	const [widgets, setWidgets] = useState([]);
	const appId = useSelector((state) => state.appId);

	useEffect(() => {
		setWidgets(widgetOrder);
	}, [widgetOrder]);

	const onSortEnd = ({ oldIndex, newIndex }) => {
		setWidgets(arrayMove(widgets, oldIndex, newIndex));
	};

	const handleSaveOrder = () => {
		dispatch(setWidgetOrder(appId, profile, widgets));
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
						{getTranslation(
							"global.profiles.widgets.layoutControls.done"
						)}
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
