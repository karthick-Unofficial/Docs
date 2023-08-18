import React, { memo } from "react";
import { useStore } from "react-redux";
import PropTypes from "prop-types";
import { AppMenu } from "orion-components/AppMenu";
import { Dock } from "orion-components/Dock";
import AppBar from "material-ui/AppBar";
import IconButton from "material-ui/IconButton";
import _ from "lodash";

const propTypes = {
	title: PropTypes.string,
	logOut: PropTypes.func.isRequired,
	user: PropTypes.shape({
		profile: PropTypes.object.isRequired,
		isHydrated: PropTypes.bool.isRequired
	}),
	dir: PropTypes.string
};



const ReplayAppBar = ({ 
	user,
	logOut,
	title,
	dir
}) => {
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

	const store = useStore();

	return (
		<div style={{height: "48px"}}>
			<AppBar
				style={styles.appBar}
				title={
					<div>
						<h3 style={ dir== "rtl" ? {paddingRight:"60px"} : {whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</h3>
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

ReplayAppBar.propTypes = propTypes;

export default memo(ReplayAppBar, (prevProps, nextProps) => {
	if (!_.isEqual(prevProps, nextProps)) {
		return false;
	}
});
