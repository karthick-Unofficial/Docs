import React, { memo } from "react";
import { useStore } from "react-redux";
import PropTypes from "prop-types";
import { AppMenu } from "orion-components/AppMenu";
import { Dock } from "orion-components/Dock";
import AppBar from "material-ui/AppBar";
import { IconButton } from "@material-ui/core";
import { Menu } from "@material-ui/icons";
import { getTranslation } from "orion-components/i18n/I18nContainer";


const propTypes = {
	logOut: PropTypes.func.isRequired,
	user: PropTypes.shape({
		profile: PropTypes.object.isRequired,
		isHydrated: PropTypes.bool.isRequired
	}),
	openSettingsMenu: PropTypes.func.isRequired,
	dir: PropTypes.string,
	floorPlansWithFacilityFeed: PropTypes.object,
	selectFloorPlanOn: PropTypes.func
};

const defaultProps = {
	selectFloorPlanOn: null,
	floorPlansWithFacilityFeed: null

};

const MyAppBar = ({ user, logOut, openSettingsMenu, dir, floorPlansWithFacilityFeed, selectFloorPlanOn }) => {

	const store = useStore();

	const styles = {
		paddingLeft: 12,
		height: 48,
		lineHeight: "48px",
		backgroundColor: "#41454a",
		position: "relative",
		zIndex: 600,
		paddingRight: 6
	};

	const stylesRTL = {
		paddingRight: 12,
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
				title={getTranslation("appBar.title")}
				iconStyleRight={{
					margin: 0
				}}
				titleStyle={{
					lineHeight: "48px",
					fontFamily: "Roboto",
					fontSize: "20px"
				}}
				iconStyleLeft={dir == "rtl" ? { margin: "0px 0px 0px 12px" } : { margin: "0px 12px 0px 0px" }}
				iconElementLeft={
					<IconButton onClick={openSettingsMenu} style={{ color: "#FFF" }}>
						<Menu />
					</IconButton>
				}
				iconElementRight={
					<div className="appBarWrapperRight">
						<Dock shouldStreamCameras={true}
							shouldStreamNotifications={true}
							selectFloorPlanOn={selectFloorPlanOn}
							floorPlansWithFacilityFeed={floorPlansWithFacilityFeed} />
						<AppMenu
							store={store}
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
MyAppBar.defaultProps = defaultProps;

export default memo(MyAppBar);
