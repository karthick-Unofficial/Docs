import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import {
	MenuItem,
	Popover,
	ListItemIcon,
	ListItemText,
	Fab
} from "@mui/material";
import {
	Add,
	EditLocation as Edit,
	Videocam,
	SelectAll
} from "@mui/icons-material";
import { FloorPlan } from "mdi-material-ui";
import { getTranslation } from "orion-components/i18n";
import { SvgIcon } from "@mui/material";
import { mdiAccessPoint } from "@mdi/js";
import { useDispatch, useSelector } from "react-redux";

import {
	addImage,
	clearFloorPlan,
	toggleCreate,
	setMapTools
} from "./facilityMenuActions";
import { selectedContextSelector } from "orion-components/ContextPanel/Selectors";
import {
	userFeedsSelector
} from "orion-components/GlobalData/Selectors";


const propTypes = {
	type: PropTypes.string
};

const defaultProps = {
	type: null
};

const FacilityMenu = ({ type }) => {

	const context = useSelector(state => selectedContextSelector(state));
	const floorPlan = useSelector(state => state.floorPlan);
	const globalData = useSelector(state => state.globalData);
	const session = useSelector(state => state.session);
	const State = useSelector(state => state);
	const canCreate = userFeedsSelector(State).some(feed => {
		return feed && feed.canView && feed.entityType === "facility" && feed.ownerOrg === session.user.profile.orgId
			&& session.user.profile.integrations.find(int => int.intId === feed.feedId)
			&& session.user.profile.integrations.find(int => int.intId === feed.feedId).permissions
			&& session.user.profile.integrations.find(int => int.intId === feed.feedId).permissions.includes("manage");
	});
	const floorPlans = globalData.floorPlans;
	const { selectedFloor } = floorPlan;
	// TODO: Move to a selector
	const { entity } = context || {};
	const selectedFloorPlan = floorPlans[selectedFloor ? selectedFloor.id : ""];
	const canEdit = entity ? session.user.profile.integrations.find(int => int.intId === entity.feedId)
		&& session.user.profile.integrations.find(int => int.intId === entity.feedId).permissions
		&& session.user.profile.integrations.find(int => int.intId === entity.feedId).permissions.includes("manage") : false;


	const [anchorEl, setAnchorEl] = useState(null);
	const dispatch = useDispatch();
	const handleClick = e => {
		setAnchorEl(e.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	const handleCreate = () => {
		dispatch(setMapTools({ type: "facility", mode: "draw_point" }));
		handleClose();
	};
	const handleAddCamera = () => {
		dispatch(setMapTools({
			type: "camera",
			mode: "draw_point"
		}));
		handleClose();
	};
	const handleAddAccessPoint = () => {
		dispatch(setMapTools({
			type: "accessPoint",
			mode: "draw_point"
		}));
		handleClose();
	};
	const handleEdit = () => {
		if (context && context.entity && context.entity.entityData) {
			const { geometry, properties } = context.entity.entityData;
			dispatch(clearFloorPlan());
			dispatch(setMapTools({
				type: "facility",
				mode: "simple_select",
				feature: { id: properties.id, geometry, properties }
			}));
			handleClose();
		}
	};
	const handleAddFloorPlan = () => {
		dispatch(toggleCreate());
		dispatch(setMapTools({ type: "floor-plan", mode: "floor_plan_mode" }));
		handleClose();
	};
	const handleEditFloorPlan = () => {
		const { handle } = selectedFloorPlan;
		dispatch(addImage(`/_download?handle=${handle}`));
		dispatch(setMapTools({ type: "floor-plan", mode: "floor_plan_mode" }));
		handleClose();
	};


	const menuOptions = [];
	if (!context && canCreate) {
		menuOptions.push(
			<MenuItem onClick={handleCreate}>
				<ListItemIcon>
					<Edit />
				</ListItemIcon>
				<ListItemText primary={getTranslation("facilityMap.mapControls.facilityMenu.addNewFac")} />
			</MenuItem>
		);
	}
	if (canEdit) {
		if (context) {
			menuOptions.push(
				<Fragment>
					<MenuItem onClick={handleEdit}>
						<ListItemIcon>
							<Edit />
						</ListItemIcon>
						<ListItemText primary={getTranslation("facilityMap.mapControls.facilityMenu.editFacLocation")} />
					</MenuItem>
					<MenuItem onClick={handleAddFloorPlan}>
						<ListItemIcon>
							<FloorPlan />
						</ListItemIcon>
						<ListItemText primary={getTranslation("facilityMap.mapControls.facilityMenu.addFloorPlan")} />
					</MenuItem>
				</Fragment>
			);
		}
		if (selectedFloorPlan) {
			menuOptions.push(
				<Fragment>
					<MenuItem onClick={handleEditFloorPlan}>
						<ListItemIcon>
							<SelectAll />
						</ListItemIcon>
						<ListItemText primary={getTranslation("facilityMap.mapControls.facilityMenu.editFloorPlan")} />
					</MenuItem>
					<MenuItem onClick={handleAddCamera}>
						<ListItemIcon>
							<Videocam />
						</ListItemIcon>
						<ListItemText primary={getTranslation("facilityMap.mapControls.facilityMenu.addCamToFloor")} />
					</MenuItem>
					<MenuItem onClick={handleAddAccessPoint}>
						<ListItemIcon>
							<SvgIcon style={{ width: 24, height: 24 }}>
								<path d={mdiAccessPoint} />
							</SvgIcon>
						</ListItemIcon>
						<ListItemText primary={getTranslation("facilityMap.mapControls.facilityMenu.addAccessPointToFloor")} />
					</MenuItem>
				</Fragment>);
		}
	}
	return !type ? (
		<Fragment>
			<Fab disabled={!!type || (!context && !canCreate) || !menuOptions.length} onClick={handleClick} color="primary">
				<Add />
			</Fab>
			<Popover
				open={!!anchorEl}
				anchorEl={anchorEl}
				onClose={handleClose}
				anchorOrigin={{
					vertical: "top",
					horizontal: "right"
				}}
				transformOrigin={{
					vertical: "bottom",
					horizontal: "right"
				}}
			>
				{menuOptions}
			</Popover>
		</Fragment>
	) : null;
};

FacilityMenu.propTypes = propTypes;
FacilityMenu.defaultProps = defaultProps;

export default FacilityMenu;
