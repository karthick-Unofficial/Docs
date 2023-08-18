import React, { memo } from "react";
import PropTypes from "prop-types";
import { AppMenu } from "orion-components/AppMenu";
import { Dock } from "orion-components/Dock";
import AppBar from "material-ui/AppBar";
import IconButton from "material-ui/IconButton";
import { Translate } from "orion-components/i18n/I18nContainer";

const propTypes = {
	title: PropTypes.string,
	logOut: PropTypes.func.isRequired,
	user: PropTypes.shape({
		profile: PropTypes.object.isRequired,
		isHydrated: PropTypes.bool.isRequired
	})
};

const MyAppBar = ({ user, logOut, title }) => {
	const styles = {
		height: 48,
		lineHeight: "48px",
		backgroundColor: "#41454a",
		position: "relative",
		zIndex: 600,
		paddingRight: 6
	};

	return (
		<div>
			<AppBar
				style={styles}
				title={title == "Law Enforcement Search" ? <Translate value="appBar.title" /> : title}
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
						<Dock shouldStreamCameras={true} shouldStreamNotifications={true} />
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
};

MyAppBar.propTypes = propTypes;

export default memo(MyAppBar);
