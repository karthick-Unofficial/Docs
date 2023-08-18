import React, {
	Fragment,
	useState,
	useEffect,
	useCallback,
	useRef
} from "react";
import {
	Checkbox,
	FormControlLabel,
	Grid,
	Typography,
	TextField,
	MenuItem,
	IconButton,
	List,
	ListItem,
	SvgIcon,
	ListItemText,
	Popover,
	Divider
} from "@mui/material";
import { mdiDotsHorizontal, mdiPencil, mdiTrashCan } from "@mdi/js";
import { unitService } from "client-app-core";
import { closeDialog } from "orion-components/AppState/Actions";
import { useDispatch, useSelector } from "react-redux";
import { subscribeUnitMembers } from "orion-components/GlobalData/Actions";
import { unitMemberMemoized } from "../../GlobalData/Selectors";
import isEqual from "lodash/isEqual";
import size from "lodash/size";

import { TargetingIcon } from "orion-components/SharedComponents";
import { Dialog } from "orion-components/CBComponents";
import UnitMemberRows from "./UnitMemberRows";
import RenameUnit from "./Dialog/RenameUnit";
import FocusEntitiesBound from "./FocusEntitiesBound";
import { getTranslation, Translate } from "orion-components/i18n";
import { useContext } from "react";
import { UnitsPanelContext } from "orion-components/Dock/UnitsPanel/UnitsPanel";
import { mapSelector } from "../../AppState/Selectors";

const usePrevious = (value) => {
	const ref = useRef();
	useEffect(() => {
		ref.current = value;
	}, [value]);
	return ref.current;
};

const checkboxStyle = {
	"&.Mui-checked": {
		position: "relative",
		"&:after": {
			content: '""',
			left: 13,
			top: 13,
			height: 15,
			width: 15,
			position: "absolute",
			backgroundColor: "#fff",
			zIndex: -1
		}
	}
};

const AssignedUnitsCard = ({ dir, id, unitData, feedSettings, lastUnit }) => {
	const [anchorEl, setAnchorEl] = useState(null);
	const [unit, setUnit] = useState({});

	const [isUnitsDialogOpen, setUnitsDialogOpen] = useState(false);
	const [deleteDialog, setDeleteDialog] = useState("");
	const [unitGeometry, setUnitGeometry] = useState([]);
	const [zoomEntities, setZoomEntities] = useState(false);
	const [unitsActive, setUnitsActive] = useState(false);
	const [selectUnitStatusType, setSelectUnitStatusType] = useState(null);

	const unitMemberSelector = unitMemberMemoized();
	const unitMembers = useSelector((state) =>
		unitMemberSelector(state, unitData.id, feedSettings)
	);
	const prevUnitMembers = usePrevious(unitMembers);
	const mapData = mapSelector();
	const map = useSelector((state) => mapData(state));

	const dispatch = useDispatch();

	const unitsPanel = useContext(UnitsPanelContext);
	const { unitStatusTypes } = unitsPanel;

	const getUnitGeoFromMembers = useCallback(() => {
		const geoArr = [];
		const layers = map.getStyle().layers;
		const ac2feedLayers = layers.filter(
			(layer) => layer.source && layer.source.includes("ac2")
		);
		unitMembers.forEach((member) => {
			const layerByFeedId = ac2feedLayers.filter(
				(layer) => layer.source && layer.source.includes(member.feedId)
			);
			if (size(layerByFeedId) && member.geometry && member.geometry.coordinates) geoArr.push(member.geometry);
		});
		setUnitGeometry(geoArr);
	});

	useEffect(() => {
		if (!isEqual(unitMembers, prevUnitMembers)) {
			getUnitGeoFromMembers();
		}
	}, [prevUnitMembers]);

	useEffect(() => {
		if (unitData) {
			setUnit(unitData);
			if (unitData.isActive) {
				setUnitsActive(unitData.isActive);
				if ("status" in unitData) {
					setSelectUnitStatusType(unitData.status);
				}
			}
		}
	}, [unitData]);

	const handleExpandMenu = (e) => {
		e.stopPropagation();
		setAnchorEl(e.currentTarget);
	};

	const handlePopoverClick = (e) => {
		// -- stop propagation outside the popover
		e.stopPropagation();
	};

	const handleCloseMenu = () => {
		setAnchorEl(null);
	};

	const stopPropagation = (e) => {
		e.stopPropagation();
	};

	const toggleNewUnitDialog = () => {
		setUnitsDialogOpen(!isUnitsDialogOpen);
		handleCloseMenu();
	};
	const deleteUnit = () => {
		handleCloseMenu();
		unitService.deleteUnit(unit.id, (err, response) => {
			if (err) {
				console.log("ERROR:", err);
			}
			if (response) {
				dispatch(subscribeUnitMembers());
			}
		});
	};

	const activateUnit = (unitId) => {
		unitService.activateUnit(unitId, (err, response) => {
			if (err) {
				console.log("ERROR:", err, response);
			}
		});
	};

	const deactivateUnit = (unitId) => {
		unitService.deactivateUnit(unitId, (err, response) => {
			if (err) {
				console.log("ERROR:", err, response);
			}
		});
	};

	const handleIsActive = (e) => {
		setUnitsActive(e.target.checked);

		if (e.target.checked) {
			activateUnit(unit.id);
		} else {
			deactivateUnit(unit.id);
		}
	};

	const handleUnitStatusType = (e) => {
		setSelectUnitStatusType(e.target.value);
		const status = e.target.value;
		unitService.setUnitStatus(unit.id, status, (err, response) => {
			if (err) {
				console.log("ERROR:", err, response);
			}
		});
	};

	//zoom entities

	const setFocus = () => {
		setZoomEntities(true);
		setTimeout(() => {
			setZoomEntities(false);
		}, 3000);
	};
	//zoom entities

	const styles = {
		iconButton: {
			...(dir === "rtl" && { float: "left" }),
			...(dir === "ltr" && { float: "right" }),
			color: "#fff",
			marginTop: "10px"
		},
		textAlignRight: {
			margin: "0 20px",
			...(dir === "rtl" && { textAlign: "right" })
		},
		container: {
			backgroundColor: "#43494F",
			padding: "10px 14px",
			marginBottom: lastUnit ? 0 : 29,
			borderRadius: "5px"
		},
		header: {
			height: 72
		},
		active: {
			color: "#B6B9BD",
			fontFamily: "Roboto",
			fontSize: "11px",
			marginBottom: "-10px"
		},
		targetingICon: {
			paddingTop: "10px",
			...(dir === "ltr" && { paddingLeft: "8px" }),
			...(dir === "rtl" && { paddingRight: "8px" })
		},
		statusTypeContainer: {
			...(dir === "ltr" && { paddingRight: "20px" }),
			...(dir === "rtl" && { paddingLeft: "20px" })
		},
		statusType: {
			fontSize: "11px",
			fontWeight: 300
		},
		divider: {
			marginLeft: -10,
			marginRight: -10
		}
	};

	return (
		<div className="unitsCardContainer" style={styles.container}>
			<div className="unitsCardHeader" style={styles.header}>
				<Grid container>
					<Grid item xs={1} sm={1} md={1} lg={1}>
						<Typography fontSize="11px" style={styles.active}>
							<Translate value="global.units.components.assignedUnitsCard.Active" />
						</Typography>
						<FormControlLabel
							style={{
								marginRight: "0px"
							}}
							control={
								<Checkbox
									style={{
										transform: "scale(1.1)"
									}}
									checked={unitsActive}
									onChange={handleIsActive}
									name="isActive"
									sx={checkboxStyle}
								/>
							}
						/>
					</Grid>
					<Grid
						item
						xs={2}
						sm={2}
						md={2}
						lg={2}
						style={styles.targetingICon}
					>
						{unitGeometry.length > 0 && (
							<TargetingIcon
								feedId=""
								id={id}
								setFocus={setFocus}
								geometry={unitGeometry}
								multipleTargets={true}
							/>
						)}
					</Grid>
					<Grid
						item
						xs={8}
						sm={8}
						md={8}
						lg={8}
						style={{ padding: "10px" }}
					>
						<Typography
							fontSize="14px"
							style={{
								margin: "0px 3px",
								color: "#fff",
								fontWeight: 600 // Medium
							}}
						>
							{unit.name}
						</Typography>
						<div style={styles.statusTypeContainer}>
							<TextField
								select
								value={selectUnitStatusType}
								variant="standard"
								fullWidth
								onChange={handleUnitStatusType}
								InputProps={{
									style: styles.statusType
								}}
							>
								{unitStatusTypes.length > 0 &&
									unitStatusTypes.map((type) => {
										return (
											<MenuItem
												value={type.id}
												key={`${type.id}-menu-item`}
											>
												{type.name}
											</MenuItem>
										);
									})}
							</TextField>
						</div>
					</Grid>
					<Grid item xs={1} sm={1} md={1} lg={1}>
						<IconButton
							style={styles.iconButton}
							onClick={handleExpandMenu}
							onMouseDown={stopPropagation}
							onTouchStart={stopPropagation}
						>
							<SvgIcon>
								<path d={mdiDotsHorizontal} />
							</SvgIcon>
						</IconButton>
					</Grid>
				</Grid>
			</div>
			<Divider style={styles.divider} />
			<div
				className="unitsMember"
				style={{ color: "#fff", paddingRight: "16px" }}
			>
				<UnitMemberRows unitMembers={unitMembers} />
			</div>
			<Popover
				open={!!anchorEl}
				anchorEl={anchorEl}
				anchorOrigin={{
					vertical: "top",
					horizontal: dir === "rtl" ? "left" : "right"
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: dir === "rtl" ? "left" : "right"
				}}
				onClose={handleCloseMenu}
				onClick={handlePopoverClick}
				style={{ borderRadius: "0" }}
			>
				<List style={{ background: "#4A4D52" }}>
					<Fragment>
						<ListItem
							button
							style={{
								paddingTop: 8,
								paddingBottom: 8,
								paddingLeft: 16,
								paddingRight: 16
							}}
							onClick={toggleNewUnitDialog}
						>
							<SvgIcon>
								<path d={mdiPencil} />
							</SvgIcon>
							<ListItemText
								primary={getTranslation(
									"global.units.components.assignedUnitsCard.edit"
								)}
								style={styles.textAlignRight}
							/>
						</ListItem>
						<ListItem
							button
							style={{
								paddingTop: 8,
								paddingBottom: 8,
								paddingLeft: 16,
								paddingRight: 16
							}}
							onClick={() => setDeleteDialog("deleteUnitDialog")}
						>
							<SvgIcon>
								<path d={mdiTrashCan} />
							</SvgIcon>
							<ListItemText
								primary={getTranslation(
									"global.units.components.assignedUnitsCard.delete"
								)}
								style={styles.textAlignRight}
							/>
						</ListItem>
					</Fragment>
				</List>
			</Popover>

			{zoomEntities && <FocusEntitiesBound items={unitMembers} id={id} />}
			<RenameUnit
				open={isUnitsDialogOpen}
				closeDialog={toggleNewUnitDialog}
				unit={unit}
			/>

			<Dialog
				open={deleteDialog === "deleteUnitDialog"}
				title={getTranslation(
					"global.units.components.assignedUnitsCard.deleteUnit"
				)}
				textContent={getTranslation(
					"global.units.components.assignedUnitsCard.deleteConfirmationText"
				)}
				confirm={{
					action: () => {
						dispatch(closeDialog("deleteUnitDialog"));
						deleteUnit();
						setDeleteDialog("");
					},
					label: (
						<Translate value="global.units.components.assignedUnitsCard.confirm" />
					)
				}}
				abort={{
					action: () => {
						dispatch(closeDialog("deleteUnitDialog"));
						handleCloseMenu();
						setDeleteDialog("");
					},
					label: (
						<Translate value="global.units.components.assignedUnitsCard.cancel" />
					)
				}}
			/>
		</div>
	);
};
export default AssignedUnitsCard;
