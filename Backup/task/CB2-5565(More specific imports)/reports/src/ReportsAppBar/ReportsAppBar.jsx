import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Components
import { AppMenu } from "orion-components/AppMenu";
import { Dock } from "orion-components/Dock";
// Material UI
import { AppBar, IconButton } from "@mui/material"
import ArrowBack from "@mui/icons-material/ArrowBack";
import ArrowForward from "@mui/icons-material/ArrowForward";
import { getTranslation } from "orion-components/i18n";
import { getDir } from "orion-components/i18n/Config/selector";

import { logOut } from "./reportsAppBarActions";
import { useEffect } from "react";
import { useState } from "react";


const ReportsAppBar = (props) => {

	const { location } = props;

	const [title, setTitle] = useState("Reports");

	const navigate = useNavigate();

	const dir = useSelector(state => getDir(state));
	const user = useSelector(state => state.session.user);

	const styles = {
		appBar: {
			height: 48,
			lineHeight: "48px",
			backgroundColor: "#41454a",
			position: "relative",
			zIndex: 600,
			...(dir === "ltr" && { paddingRight: 6 }),
			...(dir === "rtl" && { paddingLeft: 6 }),

		},
		appBarTitle: {
			display: "flex",
			...(dir === "ltr" && { marginLeft: "1%" }),
			...(dir === "rtl" && { marginRight: "1%" }),
		},
		appBarTitleText: {
			paddingLeft: "10px",
			lineHeight: "48px",
			fontFamily: "Roboto",
			fontSize: "20px",

		},
		appBarDockWrapper: {
			...(dir === "ltr" && { marginLeft: "auto" }),
			...(dir === "rtl" && { marginRight: "auto" }),
			display: "flex"
		}
	};

	const handleGoHome = () => {
		navigate("/");
	};

	useEffect(() => {

		if (location.pathname === "/") {
			setTitle("Reports");
		}
		else if (location.state && location.state.name) {
			setTitle(location.state.name);
		}
		else if (location.pathname === "/report-builder/sitrep") {
			setTitle("Event SITREP");
		}
	}, [location]);

	return (
		<div>
			<div>
				<AppBar
					style={styles.appBar}
				>
					<div style={{ display: "flex" }}>
						<div style={styles.appBarTitle}>
							{
								title !== "Reports" ? (
									<IconButton onClick={handleGoHome}>
										{dir === "rtl" ? <ArrowForward style={{ color: "#ffffff" }} /> : <ArrowBack style={{ color: "#ffffff" }} />}
									</IconButton>
								) : (
									<IconButton />
								)
							}
							{getTranslation(title)}
						</div>

						<div style={styles.appBarDockWrapper}>
							<Dock shouldStreamCameras={true} shouldStreamNotifications={true} />
							<AppMenu
								user={user.profile}
								isHydrated={user.isHydrated}
								logOut={logOut}
							/>
						</div>
					</div>

				</AppBar >
			</div>
		</div>
	);
};

export default ReportsAppBar;
