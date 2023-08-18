import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { withStyles } from "@mui/styles";
import { Drawer, List, IconButton } from "@mui/material";
import { Videocam } from "@mui/icons-material"; // cSpell:ignore videocam
import ReplayCameraDock from "./ReplayCameraDock/ReplayCameraDock";
import { useDispatch, useSelector } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";
import { cameraDockSelector } from "./ReplayCameraDock/selectors";
import { setDockState } from "./rightToolbarActions";

const ToolbarDrawer = withStyles({
	paper: {
		width: 48,
		backgroundColor: "#2C2B2D",
		// -- Force drawer to sit under menu bar
		position: "fixed !important",
		height: "calc(100vh - 148px) !important",
		top: "48px !important",
		overflow: "visible !important",
		borderLeft: "1px solid rgba(255, 255, 255, 0.12)"
	}
})(Drawer);

const DockDrawer = withStyles({
	paper: {
		width: 420,
		backgroundColor: "#2C2B2D",
		// -- Force drawer to sit under menu bar
		position: "fixed !important",
		height: "calc(100vh - 148px) !important",
		top: "48px !important",
		right: "48px !important",
		overflow: "visible !important"
	}
})(Drawer);

const AnchoredLeftDockDrawer = withStyles({
	paper: {
		width: 420,
		backgroundColor: "#2C2B2D",
		// -- Force drawer to sit under menu bar
		position: "fixed !important",
		height: "calc(100vh - 148px) !important",
		top: "48px !important",
		left: "48px !important",
		overflow: "visible !important"
	}
})(Drawer);

const propTypes = {
	startDate: PropTypes.string,
	endDate: PropTypes.string
};

const RightToolbar = ({ startDate, endDate }) => {
	const dispatch = useDispatch();

	const dockState = useSelector((state) => cameraDockSelector(state).dockState);
	const dir = useSelector((state) => getDir(state));

	const [dockContent, setDockContent] = useState(null);

	useEffect(() => {
		if (dockState) {
			switch (dockState) {
				case "cameras":
					setDockContent(
						<ReplayCameraDock
							readOnly={true}
							closeDrawer={closeDrawer}
							startDate={startDate}
							endDate={endDate}
						/>
					);
					break;
				default:
					setDockContent(null);
			}
		} else {
			setDockContent(null);
		}
	}, [dockState]);

	const handleClick = (item) => {
		dispatch(setDockState(item));
	};

	const closeDrawer = () => {
		dispatch(setDockState(null));
	};

	return (
		<ToolbarDrawer variant="permanent" anchor={dir === "rtl" ? "left" : "right"}>
			{/* List of Icons */}
			<List style={{ textAlign: "center" }}>
				<IconButton style={{ padding: "12px", color: "#fff" }} onClick={() => handleClick("cameras")}>
					<Videocam />
				</IconButton>
			</List>
			{/* Content Dock */}
			{dir === "rtl" ? (
				<AnchoredLeftDockDrawer open={!!dockState} variant="persistent" anchor="left">
					{!!dockState && (
						<div id="sidebar-inner-wrapper" className="cf">
							{dockContent}
						</div>
					)}
				</AnchoredLeftDockDrawer>
			) : (
				<DockDrawer open={!!dockState} variant="persistent" anchor="right">
					{!!dockState && (
						<div id="sidebar-inner-wrapper" className="cf">
							{dockContent}
						</div>
					)}
				</DockDrawer>
			)}
		</ToolbarDrawer>
	);
};

RightToolbar.propTypes = propTypes;
export default RightToolbar;
