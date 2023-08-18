import React, { Component } from "react";

// material ui
import AppBar from "material-ui/AppBar";
import { Dock } from "orion-components/Dock";

// orion-components
import { AppMenu } from "orion-components/AppMenu";
import { Translate } from "orion-components/i18n/I18nContainer";

class RulesAppBar extends Component {

	constructor(props) {
		super(props);
		this.state = {
			open: false
		};
	}

	handleTouchTap = (event) => {
		event.preventDefault(); // This prevents ghost click.
	
		this.setState({
			anchorEl: event.currentTarget
		});
	
		this.props.toggleAppsMenu();
	};

	handleRequestClose = () => {
		this.props.toggleAppsMenu();
	};

	render() {
		const { user, logOut, title, dir } = this.props;
		return (
			<div style={{
				height: 48
			}}>
				<AppBar
					style={dir == "rtl" ? {
						height: 48,
						lineHeight: "48px",
						backgroundColor: "#41454a",
						position: "fixed",
						zIndex: 600,
						textDecoration: "none",
						paddingLeft: "6px"
					} : {
						height: 48,
						lineHeight: "48px",
						backgroundColor: "#41454a",
						position: "fixed",
						zIndex: 600,
						textDecoration: "none",
						paddingRight: "6px"
					}}
					className="rulesAppBarTitle"
					iconStyleRight={{
						margin: 0
					}}
					titleStyle={dir == "rtl" ? {
						lineHeight: "48px",
						textDecoration: "none",
						fontSize: "20px",
						marginRight: "48px"
					} : {
						lineHeight: "48px",
						textDecoration: "none",
						fontSize: "20px",
						marginLeft: "48px"
					}}
					title={title == "Rules" ? <Translate value="appBar.title"/> : title}
					showMenuIconButton={false}
					iconElementRight={
						<div className="appBarWrapperRight">
							<Dock 
								shouldStreamCameras={true}
								shouldStreamNotifications={true}
							/>
							<AppMenu
								user={user.profile}
								isHydrated={user.isHydrated}
								logOut={logOut}
							/>
						</div>
					}
				/>
			</div>
		);
	}
}

export default RulesAppBar;