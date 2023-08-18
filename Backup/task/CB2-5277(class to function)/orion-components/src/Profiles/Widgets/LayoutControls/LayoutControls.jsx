import React, { Component, memo, useEffect, useState } from "react";

// Sortable
import {
	SortableContainer,
	SortableElement,
	arrayMove
} from "react-sortable-hoc";

// Components
import WidgetCard from "./components/WidgetCard";

// Material UI
import Popover from "material-ui/Popover";
// Added for popover menu patch: (CB2-904)
import Menu from "material-ui/Menu";
import { List } from "material-ui/List";
import RaisedButton from "material-ui/RaisedButton";

import _ from "lodash";
import isEqual from "react-fast-compare";
import { getTranslation } from "orion-components/i18n/I18nContainer";

const SortableItem = SortableElement(({ value, enable, disable, isExpanded }) => {
	return (
		<WidgetCard
			widget={value}
			enable={id => enable(id)}
			disable={id => disable(id)}
			isExpanded={isExpanded}
		/>
	);
});

const SortableList = SortableContainer(({ items, enable, disable, expandedWidget }) => {
	const isWidgetExpanded = (widget) => {
		if (expandedWidget === "map-view") {
			return widget.id === "map";
		}
		else {
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
					enable={id => enable(id)}
					disable={id => disable(id)}
					isExpanded={isWidgetExpanded(value)}
				/>
			))}
		</List>
	);
});

const LayoutControls = ({ widgetOrder, open, anchor, close, expandedWidget, profile, setWidgetOrder }) => {
	const [widgets, setWidgets] = useState([]);

	useEffect(() => {
		setWidgets(widgetOrder);
	}, [widgetOrder]);

	const onSortEnd = ({ oldIndex, newIndex }) => {
		setWidgets(arrayMove(widgets, oldIndex, newIndex));
	};

	const handleSaveOrder = () => {
		setWidgetOrder(profile, widgets);
		close();
	};

	const handleEnableWidget = id => {
		let newWidgets = [...widgets];

		newWidgets = widgets.map(widget => {
			if (widget.id === id) {
				return { ...widget, enabled: true };
			} else {
				return widget;
			}
		});
		setWidgets(newWidgets);
	};

	const handleDisableWidget = id => {
		const widgetsData = widgets.slice();

		const newWidgets = widgetsData.map(widget => {
			if (widget.id === id) {
				return { ...widget, enabled: false };
			} else {
				return widget;
			}
		});
		setWidgets(newWidgets);
	};

	// Prevent list sorting when clicking on enable/disable button
	const shouldCancelStart = e => {
		const buttonClick = e.path.filter(tag => {
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
			onRequestClose={close}
			style={{ width: 340, backgroundColor: "#41454A" }} // <-- width of EntityProfile
			anchorEl={anchor}
			anchorOrigin={{ vertical: "top", horizontal: "middle" }}
			targetOrigin={{ vertical: "top", horizontal: "middle" }}
			zDepth={5}
			className="layout-control-popover"
		>
			<Menu>
				<div className="layout-button-wrapper">
					<RaisedButton
						label={getTranslation("global.profiles.widgets.layoutControls.done")}
						onClick={handleSaveOrder}
						primary={true}
						style={{ width: "100%" }}
					/>
				</div>
				<SortableList
					items={widgets}
					onSortEnd={onSortEnd}
					enable={id => handleEnableWidget(id)}
					disable={id => handleDisableWidget(id)}
					shouldCancelStart={shouldCancelStart}
					expandedWidget={expandedWidget}
				/>
			</Menu>
		</Popover>
	);

};

// TODO: Prevent unnecessary rendering from moving features and remove this life-cycle hook

const componentUpdate = (prevProps, nextProps) => {
	return (
		isEqual(prevProps, nextProps)
	);
};

export default memo(LayoutControls, componentUpdate);
