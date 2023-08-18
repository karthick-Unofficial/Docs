import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import {
	MenuItem,
	Popover,
	ListItemIcon,
	ListItemText,
	Fab
} from "@material-ui/core";
import {
	Add,
	EditLocation as Edit,
	Videocam,
	SelectAll
} from "@material-ui/icons";
import { FloorPlan } from "mdi-material-ui";
import { getTranslation } from "orion-components/i18n/I18nContainer";
import { SvgIcon } from "@material-ui/core";
import { mdiAccessPoint } from "@mdi/js";


const propTypes = {
	context: PropTypes.object,
	setMapTools: PropTypes.func.isRequired,
	type: PropTypes.string,
	addImage: PropTypes.func.isRequired,
	selectedFloorPlan: PropTypes.object,
	clearFloorPlan: PropTypes.func.isRequired,
	toggleCreate: PropTypes.func.isRequired,
	canCreate: PropTypes.bool,
	canEdit: PropTypes.bool
};

const defaultProps = {
	context: null,
	type: null,
	selectedFloorPlan: null
};

const FacilityMenu = ({
	context,
	setMapTools,
	canEdit,
	toggleCreate,
	type,
	addImage,
	selectedFloorPlan,
	clearFloorPlan,
	canCreate
}) => {
	const [anchorEl, setAnchorEl] = useState(null);
	const handleClick = e => {
		setAnchorEl(e.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	const handleCreate = () => {
		setMapTools({ type: "facility", mode: "draw_point" });
		handleClose();
	};
	const handleAddCamera = () => {
		setMapTools({
			type: "camera",
			mode: "draw_point"
		});
		handleClose();
	};
	const handleAddAccessPoint = () => {
		setMapTools({
			type: "accessPoint",
			mode: "draw_point"
		});
		handleClose();
	};
	const handleEdit = () => {
		if (context && context.entity && context.entity.entityData) {
			const { geometry, properties } = context.entity.entityData;
			clearFloorPlan();
			setMapTools({
				type: "facility",
				mode: "simple_select",
				feature: { id: properties.id, geometry, properties }
			});
			handleClose();
		}
	};
	const handleAddFloorPlan = () => {
		toggleCreate();
		setMapTools({ type: "floor-plan", mode: "floor_plan_mode" });
		handleClose();
	};
	const handleEditFloorPlan = () => {
		const { handle } = selectedFloorPlan;
		addImage(`/_download?handle=${handle}`);
		setMapTools({ type: "floor-plan", mode: "floor_plan_mode" });
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
							<SvgIcon style={{ width: 24, height: 24}}>
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
