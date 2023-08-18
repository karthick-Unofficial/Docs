import React, { Component } from "react";

// Components
import { Dock } from "orion-components/Dock";
import { AppMenu } from "orion-components/AppMenu";

// Material UI
import AppBar from "material-ui/AppBar"; // Update with CBAppBar component when possible
import { IconButton } from "@material-ui/core";
import { Translate } from "orion-components/i18n/I18nContainer";

class MyAppBar extends Component {
	render() {
		const { user, logOut, title, dir } = this.props;

		const appBarStyles = {
			height: 48,
			lineHeight: "48px",
			backgroundColor: "#41454a",
			position: "relative",
			zIndex: 600,
			paddingRight: 6
		};
		const appBarStylesRTL = {
			height: 48,
			lineHeight: "48px",
			backgroundColor: "#41454a",
			position: "relative",
			zIndex: 600,
			paddingLeft: 6
		};

		return (
			<div>
				<AppBar
					style={dir == "rtl" ? appBarStylesRTL : appBarStyles}
					title={title == "Lists" ? <Translate value="appBar.title"/> : title}
					iconStyleRight={{
						margin: 0
					}}
					titleStyle={{
						lineHeight: "48px",
						fontFamily: "Roboto",
						fontSize: "20px"
					}}
					iconStyleLeft={{ margin: 0 }}
					// preserves AppBar spacing between apps with/without left menu buttons
					iconElementLeft={<IconButton />}
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

export default MyAppBar;
