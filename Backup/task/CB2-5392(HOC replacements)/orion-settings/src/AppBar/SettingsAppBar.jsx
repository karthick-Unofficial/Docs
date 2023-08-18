import React, { useEffect } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";

import { AppMenu } from "orion-components/AppMenu";
import { Dock } from "orion-components/Dock";

// material-ui
import AppBar from "material-ui/AppBar";

//i18n Translator
import { Translate } from "orion-components/i18n/I18nContainer";
import { logOut } from "orion-components/AppMenu";
import { getDir } from "orion-components/i18n/Config/selector";

const SettingsAppBar = ({ location }) => {
	const store = useStore();
	const dispatch = useDispatch();

	let title = "Settings";
	useSelector(state => {
		if (location.state && location.state.name) {
			title = location.state.name;
		}
		else if (state.application && state.application.name) {
			title = state.application.name;
		}
	});
	const notifications = useSelector(state => {
		state.globalData.notifications.activeItems.map((id) => {
			return state.globalData.notifications.activeItemsById[id];
		})
	});
	const globalState = useSelector(state => state.appState.global);
	const user = useSelector(state => state.session.user);
	const dir = useSelector(state => getDir(state));

	const styles = {
		appBar: {
			height: 48,
			lineHeight: "48px",
			backgroundColor: "#41454a",
			position: "relative",
			zIndex: 600,
			paddingRight: 6
		},
		header: {
			whiteSpace: "nowrap",
			overflow: "hidden",
			textOverflow: "ellipsis"
		},
		section: {
			padding: "10px 16px"
		},
		appBarRTL: {
			height: 48,
			lineHeight: "48px",
			backgroundColor: "#41454a",
			position: "relative",
			zIndex: 600,
			paddingLeft: 6,
			paddingRight: 24
		}
	};

	return (
		<div>
			<AppBar
				className="settings-app-bar"
				style={dir == "rtl" ? styles.appBarRTL : styles.appBar}
				title={
					<div className="settings-app-bar-title">
						<h3 style={styles.header}><Translate value="appBar.title" /></h3>
						<div />
					</div>
				}
				showMenuIconButton={false}
				iconStyleLeft={{
					marginTop: 0
				}}
				iconStyleRight={{
					margin: 0
				}}
				titleStyle={{
					lineHeight: "48px"
				}}
				iconElementRight={
					<div className="appBarWrapperRight">
						<Dock
							shouldStreamCameras={true}
							shouldStreamNotifications={true}
						/>
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

export default SettingsAppBar;
