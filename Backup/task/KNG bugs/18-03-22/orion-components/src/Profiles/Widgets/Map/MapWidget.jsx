import React, { Component } from "react";
import { BaseWidget } from "../shared";
import { Map } from "@material-ui/icons";

class MapWidget extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	handleExpand = () => {
		const { selectWidget, title } = this.props;
		selectWidget("map-view");
	};

	render() {
		const { title, order, enabled, expanded, dir } = this.props;
		return (
			<BaseWidget
				order={order}
				enabled={enabled}
				title={title}
				expanded={expanded}
				expandable={true}
				handleExpand={this.handleExpand}
				icon={<Map fontSize="large" />}
				dir={dir}
			/>
		);
	}
}

export default MapWidget;
