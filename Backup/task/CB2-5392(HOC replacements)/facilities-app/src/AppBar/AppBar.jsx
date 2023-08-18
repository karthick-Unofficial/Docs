import React, { memo } from "react";
import { shallowEqual, useDispatch, useSelector, useStore } from "react-redux";
import PropTypes from "prop-types";
import { AppMenu } from "orion-components/AppMenu";
import { Dock } from "orion-components/Dock";
import AppBar from "material-ui/AppBar";
import { IconButton } from "@material-ui/core";
import { Menu } from "@material-ui/icons";
import { getTranslation } from "orion-components/i18n";
import {
	logOut,
	openSettingsMenu,
	selectFloorPlanOn
} from "./appBarActions";
import { getDir } from "orion-components/i18n/Config/selector";

import _ from 'underscore';


const MyAppBar = () => {

	const floorPlansWithFacilityFeed = useSelector(state => state.globalData.floorPlanWithFacilityFeedId.floorPlans, _.isEqual);
	const user = useSelector(state => state.session.user, _.isEqual);
	const dir = useSelector(state => getDir(state), _.isEqual);

	const store = useStore();
	const dispatch = useDispatch();

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

	const handleSelectFloorPlanOn = (floorplan, feedId) => {
		dispatch(selectFloorPlanOn(floorplan, feedId));
	}

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
					<IconButton onClick={() => dispatch(openSettingsMenu())} style={{ color: "#FFF" }}>
						<Menu />
					</IconButton>
				}
				iconElementRight={
					<div className="appBarWrapperRight">
						<Dock shouldStreamCameras={true}
							shouldStreamNotifications={true}
							selectFloorPlanOn={handleSelectFloorPlanOn}
							floorPlansWithFacilityFeed={floorPlansWithFacilityFeed} />
						<AppMenu
							store={store}
							user={user.profile}
							isHydrated={user.isHydrated}
							logOut={() => dispatch(logOut())}
						/>
					</div>
				}
			/>
		</div>
	);
};


export default memo(MyAppBar);
