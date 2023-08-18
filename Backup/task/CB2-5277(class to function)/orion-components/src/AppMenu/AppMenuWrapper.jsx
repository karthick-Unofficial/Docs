import React, { useState } from "react";
import { AudioAlertPlayer } from "../CBComponents";
import AppMenuContainer from "./AppMenuContainer";

// material-ui
import AppBar from "material-ui/AppBar";
import IconButton from "material-ui/IconButton";
import NavigationApps from "material-ui/svg-icons/navigation/apps";
import Popover from "material-ui/Popover";
// Added for popover menu patch (CB2-904):
import Menu from "material-ui/Menu";

const AppMenuWrapper = ({ isHydrated, logOut }) => {

	const [isOpen, setIsOpen] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);

	const toggle = () => {
		setIsOpen(!isOpen);
	};

	const handleTouchTap = (event) => {
		event.preventDefault(); // This prevents ghost click.
		setAnchorEl(event.currentTarget);
		toggle();
	};

	return (
		<div>
			<AudioAlertPlayer />
			<IconButton onClick={handleTouchTap}>
				<NavigationApps />
			</IconButton>
			{isOpen &&
				<Popover
					style={{ backgroundColor: "transparent", boxShadow: "0" }}
					open={isOpen}
					anchorEl={anchorEl}
					anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
					targetOrigin={{ horizontal: "right", vertical: "top" }}
					onRequestChange={toggle}
					onRequestClose={toggle}
					className="apps-menu-container"
				>
					<Menu>
						{isHydrated &&
							<AppMenuContainer logOut={logOut} />
						}
					</Menu>
				</Popover>
			}
		</div>
	);
};

export default AppMenuWrapper;