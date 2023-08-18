import React, { memo } from "react";
import { useSelector, useStore } from "react-redux";
import PropTypes from "prop-types";
import { AppMenu } from "orion-components/AppMenu";
import { Dock } from "orion-components/Dock";
import AppBar from "material-ui/AppBar";
import IconButton from "material-ui/IconButton";
import _ from "lodash";
import { getDir } from "orion-components/i18n/Config/selector";
import { logOut } from "./replayAppBarActions";



const ReplayAppBar = (props) => {

	const application = useSelector(state => state.application);
	let title = "Replay";
	if (props.location.state && props.location.state.name) {
		title = props.location.state.name;
	}
	else if (application && application.name) {
		title = application.name;
	}
	const user = useSelector(state => state.session.user);
	const dir = useSelector(state => getDir(state));

	const styles = {
		appBar: {
			height: 48,
			lineHeight: "48px",
			backgroundColor: "#41454a",
			position: "fixed",
			zIndex: 600,
			paddingRight: 6
		}
	};

	return (
		<div style={{ height: "48px" }}>
			<AppBar
				style={styles.appBar}
				title={
					<div>
						<h3 style={dir == "rtl" ? { paddingRight: "60px" } : { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</h3>
						<div />
					</div>
				}
				iconStyleRight={{
					margin: 0
				}}
				titleStyle={{
					lineHeight: "48px",
					fontFamily: "Roboto",
					fontSize: "20px"
				}}
				showMenuIconButton={false}
				iconStyleLeft={{
					margin: 0
				}}
				iconElementRight={
					<div className="appBarWrapperRight">
						<Dock shouldStreamCameras={true} shouldStreamNotifications={true} readOnly={true} />
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

export default memo(ReplayAppBar, (prevProps, nextProps) => {
	if (!_.isEqual(prevProps, nextProps)) {
		return false;
	}
});
