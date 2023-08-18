import React, { Component } from "react";

// Material UI
import { ListItem } from "material-ui/List";
import Drag from "material-ui/svg-icons/action/reorder";
import IconButton from "material-ui/IconButton";
import Remove from "material-ui/svg-icons/content/remove-circle";
import Add from "material-ui/svg-icons/content/add-circle";

export class WidgetCard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			widget: this.props.widget
		};
	}

	handleEnableClick = id => {
		this.setState({
			widget: { ...this.state.widget, enabled: true }
		});

		this.props.enable(id);
	};

	handleDisableClick = id => {
		this.setState({
			widget: { ...this.state.widget, enabled: false }
		});

		this.props.disable(id);
	};

	render() {
		const { widget, isExpanded } = this.props;

		const listItemStyles = {
			backgroundColor: "#1F1F21",
			margin: ".25rem .5rem"
		};

		const getRightIconButton = () => {
			if(isExpanded)
				return null;
			else{
				return(
					this.state.widget.enabled ? (
						<IconButton onClick={() => this.handleDisableClick(widget.id)}>
							<Remove color="#E85858" />
						</IconButton>
					) : (
						<IconButton onClick={() => this.handleEnableClick(widget.id)}>
							<Add color="#A4B966" />
						</IconButton>
					)
				); 					
			}
		};

		return (
			<ListItem
				style={listItemStyles}
				primaryText={widget.name}
				leftIcon={<Drag />}
				rightIconButton={
					getRightIconButton()
				}
			/>
		);
	}
}

export default WidgetCard;
