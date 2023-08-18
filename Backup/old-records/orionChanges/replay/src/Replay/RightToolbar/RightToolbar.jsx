import React, { memo, useState, useEffect } from "react";
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";
import {Drawer, List, IconButton} from "@material-ui/core";
import { Info, RssFeed, Videocam } from "@material-ui/icons";
import ReplayCameraDock from "./ReplayCameraDock/ReplayCameraDockContainer";

const ToolbarDrawer = withStyles({
	paper: {
		width: 48,
		backgroundColor: "#2C2B2D",
		// -- Force drawer to sit under menu bar
		position: "fixed !important",
		height: "calc(100vh - 148px) !important",
		top: "48px !important",
		overflow: "visible !important"
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

const propTypes = {
	startDate: PropTypes.string,
	endDate: PropTypes.string,
	dockState: PropTypes.string,
	setDockState: PropTypes.func
};

const RightToolbar = ({ startDate, endDate, dockState, setDockState }) => {
	const [dockContent, setDockContent] = useState(null);

	useEffect(() => {
		if (dockState) {
			switch (dockState) {
				case "cameras":
					setDockContent(
						<ReplayCameraDock readOnly={true} closeDrawer={closeDrawer} startDate={startDate} endDate={endDate} />
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
		setDockState(item);
	};

	const closeDrawer = () => {
		setDockState(null);
	};

	return (
		<ToolbarDrawer
			variant="permanent"
			anchor="right"
		>
			{/* List of Icons */}
			<List>
				<IconButton color="inherit" onClick={() => handleClick("cameras")}>
					<Videocam />
				</IconButton>
			</List>
			{/* Content Dock */}
			<DockDrawer
				open={!!dockState}
				variant="persistent"
				anchor="right"
			>
				{!!dockState && (
					<div id="sidebar-inner-wrapper" className="cf">
						{dockContent}
					</div>
				)}
			</DockDrawer>
		</ToolbarDrawer>
	);
};

RightToolbar.propTypes = propTypes;
export default RightToolbar;