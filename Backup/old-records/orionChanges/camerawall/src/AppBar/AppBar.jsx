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
	}),
	dir: PropTypes.string
};

const defaultProps = {
	title: "Camera Wall"
};

const CWAppBar = ({ user, logOut, title, dir }) => {
	const styles = {
		height: 48,
		lineHeight: "48px",
		backgroundColor: "#41454a",
		position: "relative",
		zIndex: 600,
		paddingRight: 6
	};
	const stylesRTL = {
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
				style={dir == "rtl" ? stylesRTL : styles}
				title={title == "Camera Wall" ? <Translate value="appBar.title"/> : title}
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
							dir={dir}
						/>
					</div>
				}
			/>
		</div>
	);
};

CWAppBar.propTypes = propTypes;
CWAppBar.defaultProps = defaultProps;

export default memo(CWAppBar);
