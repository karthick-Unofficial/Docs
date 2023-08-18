import React, { Component } from "react";
import { AudioAlertPlayer } from "../CBComponents";
import AppMenuContainer from "./AppMenuContainer";

// material-ui
import AppBar from "material-ui/AppBar";
import IconButton from "material-ui/IconButton";
import NavigationApps from "material-ui/svg-icons/navigation/apps";
import Popover from "material-ui/Popover";
// Added for popover menu patch (CB2-904):
import Menu from "material-ui/Menu";

export default class AppMenuWrapper extends Component {

	constructor(props) {
		super(props);

		this.state = {
			isOpen: false
		};

		this.handleTouchTap = this.handleTouchTap.bind(this);
		this.toggle = this.toggle.bind(this);
	}

	toggle() {
		this.setState({
			isOpen: !this.state.isOpen
		});
	}

	handleTouchTap(event) {
		event.preventDefault(); // This prevents ghost click.
		this.setState({
			anchorEl: event.currentTarget
		});
		this.toggle();
	}

	render() {
		return (
			<div>
				<AudioAlertPlayer/>
				<IconButton onClick={this.handleTouchTap}>
					<NavigationApps />
				</IconButton>
				{this.state.isOpen &&
					<Popover
						style={{ backgroundColor: "transparent", boxShadow: "0" }}
						open={this.state.isOpen}
						anchorEl={this.state.anchorEl}
						anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
						targetOrigin={{ horizontal: "right", vertical: "top" }}
						onRequestChange={this.toggle}
						onRequestClose={this.toggle}
						className="apps-menu-container"
					>
						<Menu>

							{this.props.isHydrated &&
								<AppMenuContainer logOut={this.props.logOut}/>
							}
						</Menu>
					</Popover>
				}
			</div>
		);
	}

}