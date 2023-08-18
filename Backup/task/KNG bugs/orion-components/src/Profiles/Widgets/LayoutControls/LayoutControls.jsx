import React, { Component } from "react";

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

export default class LayoutControls extends Component {
	constructor(props) {
		super(props);

		this.state = {
			widgets: []
		};
	}

	componentDidMount() {
		const { widgetOrder } = this.props;
		this.setState({ widgets: widgetOrder });
	}

	// TODO: Prevent unnecessary rendering from moving features and remove this life-cycle hook
	shouldComponentUpdate(nextProps, nextState) {
		return (
			!isEqual(this.props, nextProps) || !isEqual(this.state, nextState)
		);
	}

	onSortEnd = ({ oldIndex, newIndex }) => {
		const { widgets } = this.state;
		this.setState({
			widgets: arrayMove(widgets, oldIndex, newIndex)
		});
	};

	handleSaveOrder = () => {
		const { profile, setWidgetOrder, close } = this.props;
		const { widgets } = this.state;
		setWidgetOrder(profile, widgets);
		close();
	};

	handleEnableWidget = id => {
		const { widgets } = this.state;
		let newWidgets = [...widgets];

		newWidgets = widgets.map(widget => {
			if (widget.id === id) {
				return { ...widget, enabled: true };
			} else {
				return widget;
			}
		});

		this.setState({
			widgets: newWidgets
		});
	};

	handleDisableWidget = id => {
		const widgets = this.state.widgets.slice();

		const newWidgets = widgets.map(widget => {
			if (widget.id === id) {
				return { ...widget, enabled: false };
			} else {
				return widget;
			}
		});

		this.setState({
			widgets: newWidgets
		});
	};

	// Prevent list sorting when clicking on enable/disable button
	shouldCancelStart = e => {
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

	render() {
		const { open, anchor, close, expandedWidget } = this.props;
		const { widgets } = this.state;

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
							onClick={this.handleSaveOrder}
							primary={true}
							style={{ width: "100%" }}
						/>
					</div>

					<SortableList
						items={widgets}
						onSortEnd={this.onSortEnd}
						enable={id => this.handleEnableWidget(id)}
						disable={id => this.handleDisableWidget(id)}
						shouldCancelStart={this.shouldCancelStart}
						expandedWidget={expandedWidget}
					/>
				</Menu>
			</Popover>
		);
	}
}
