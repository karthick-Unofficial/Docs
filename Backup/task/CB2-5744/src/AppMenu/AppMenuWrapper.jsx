import React, { useState } from "react";
import { AudioAlertPlayer } from "../CBComponents";
import AppMenu from "./AppMenu";

// material-ui
// Added for popover menu patch (CB2-904):
import { IconButton, Popover } from "@mui/material";

import AppsIcon from "@mui/icons-material/Apps";

import { useSelector, useDispatch } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";

const AppMenuWrapper = ({ isHydrated, logOut }) => {
	const dispatch = useDispatch();

	const user = useSelector((state) => state.session.user.profile);
	const org = useSelector((state) => state.session.organization.profile);
	const emailConfig = useSelector((state) => state.clientConfig.supportEmail);
	const dir = useSelector((state) => getDir(state));

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

	const id = isOpen ? "apps-popover" : undefined;

	return (
		<div style={{ height: 48 }}>
			<AudioAlertPlayer />
			<IconButton
				onClick={handleTouchTap}
				aria-describedby={id}
				sx={{ width: 48, height: 48 }}
			>
				<AppsIcon sx={{ color: "#FFF" }} />
			</IconButton>
			{isOpen && (
				<Popover
					id={id}
					open={isOpen}
					anchorEl={anchorEl}
					anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
					transformOrigin={{ horizontal: "bottom", vertical: "top" }}
					onClose={() => {
						setIsOpen(false);
						setAnchorEl(null);
					}}
					PaperProps={{
						sx: {
							top: "50px !important",
							backgroundColor: "transparent",
							boxShadow: "0"
						}
					}}
					sx={{
						left: "10px"
					}}
				>
					{isHydrated && (
						<AppMenu
							user={user}
							org={org}
							emailConfig={emailConfig}
							dir={dir}
							logOut={logOut}
							dispatch={dispatch}
						/>
					)}
				</Popover>
			)}
		</div>
	);
};

export default AppMenuWrapper;
