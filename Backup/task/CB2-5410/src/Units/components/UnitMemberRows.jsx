import React, { useState, useEffect } from "react";
import { TargetingIcon } from "orion-components/SharedComponents";
import { Checkbox, FormControlLabel, Grid, Button, Typography, Divider } from "@mui/material";
import PropTypes from "prop-types";
import Settings from "./Dialog/Settings";
import { unitService } from "client-app-core";
import { Translate } from "orion-components/i18n";
import { useSelector } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";
import { memo } from "react";
import isEqual from "lodash/isEqual";

const propTypes = {
	newUnit: PropTypes.bool,
	getSelectedUnitMembers: PropTypes.func
};

const defaultProps = {
	newUnit: false,
	getSelectedUnitMembers: () => {}
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

const UnitMemberRows = ({ unitMembers, newUnit, getSelectedUnitMembers, includeDividers = false }) => {
	const [unitMembersState, setUnitMembersState] = useState([]);
	const [isUnitsDialogOpen, setUnitsDialogOpen] = useState(false);
	const [unitSelected, setUnitSelected] = useState({});
	const dir = useSelector((state) => getDir(state));

	useEffect(() => {
		setUnitMembersState(unitMembers);
	}, [unitMembers]);

	const toggleSettingsDialog = (id) => {
		if (id) {
			const selected = unitMembers.find((unit) => unit.id === id);
			setUnitSelected(selected);
		}
		setUnitsDialogOpen(!isUnitsDialogOpen);
	};

	const activateUnitMember = (unitMemberId) => {
		unitService.activateUnitMember(unitMemberId, (err, response) => {
			if (err) {
				console.log("ERROR:", err, response);
			}
		});
	};

	const deactivateUnitMember = (unitMemberId) => {
		unitService.deactivateUnitMember(unitMemberId, (err, response) => {
			if (err) {
				console.log("ERROR:", err, response);
			}
		});
	};

	const handleIsActive = (e, i) => {
		unitMembersState[i][`${e.target.name}`] = e.target.checked;
		setUnitMembersState([...unitMembersState]);

		// selected unit  members that are to be assigned to a unit
		if (newUnit) {
			getSelectedUnitMembers(unitMembers[i]);
		} else {
			if (e.target.checked) {
				activateUnitMember(unitMembersState[i].id);
			} else {
				deactivateUnitMember(unitMembersState[i].id);
			}
		}
	};

	const styles = {
		gridContainer: {
			height: 60,
			alignItems: "center"
		},
		unitMemberIconContainer: {
			display: "flex",
			alignItems: "center",
			justifyContent: "center"
		},
		unitMemberIcon: {
			width: 30,
			marginLeft: 10
		},
		unitMemberName: {
			fontSize: "12px",
			fontWeight: "300",
			margin: "0px 12px"
		},
		settingsButton: {
			textTransform: "none",
			color: "#82858A",
			fontSize: "12px",
			fontWeight: "300"
		},
		divider: {
			background: "#626466",
			marginBottom: "3px",
			marginTop: "3px",
			padding: "0px 4px"
		},
		checkboxLabel: {
			marginRight: "0px"
		},
		checkbox: {
			transform: "scale(1.1)"
		},
		targetingIconContainer: {
			...(dir === "ltr" && { marginLeft: "12px" }),
			...(dir === "rtl" && { marginRight: "12px" })
		}
	};

	const renderRows = (unit, index, disableIsActive = false) => {
		return (
			<div>
				<Grid container style={styles.gridContainer}>
					<Grid item xs={1} sm={1} md={1} lg={1}>
						<FormControlLabel
							style={styles.checkboxLabel}
							control={
								<Checkbox
									style={styles.checkbox}
									sx={checkboxStyle}
									checked={newUnit ? unit.selected : unit.isActive}
									name={newUnit ? "selected" : "isActive"}
									onChange={(e) => {
										handleIsActive(e, index);
									}}
									disabled={disableIsActive}
								/>
							}
						/>
					</Grid>
					<Grid item xs={2} sm={2} md={2} lg={2}>
						<div style={styles.targetingIconContainer}>
							{unit.geometry && (
								<TargetingIcon
									feedId={unit.feedId}
									id={unit.targetEntityId}
									geometry={unit.geometry}
									feedLayerCheck={true}
								/>
							)}
						</div>
					</Grid>
					<Grid item xs={2} sm={2} md={2} lg={2} style={styles.unitMemberIconContainer}>
						{unit.memberType === "person" ? (
							<img
								alt="person"
								style={styles.unitMemberIcon}
								src={require("../../SharedComponents/ShapeEdit/icons/Person_blue.png")}
							/>
						) : (
							<img
								alt="police_car"
								style={styles.unitMemberIcon}
								src={require("../../SharedComponents/ShapeEdit/icons/Police_Car_blue.png")}
							/>
						)}
					</Grid>
					<Grid item xs={5} sm={5} md={5} lg={5}>
						<Typography style={styles.unitMemberName}>{unit.name}</Typography>
					</Grid>
					{!newUnit ? (
						<Grid item xs={2} sm={2} md={2} lg={2}>
							<Button
								variant="text"
								style={styles.settingsButton}
								onClick={() => toggleSettingsDialog(unit.id)}
							>
								<Translate value="global.units.components.unitMemberRows.settings" />
							</Button>
						</Grid>
					) : null}
				</Grid>
				{includeDividers && index !== unitMembersState.length - 1 && <Divider style={styles.divider} />}
			</div>
		);
	};

	return (
		<div className="UnitMemberRows">
			{newUnit &&
				unitMembersState &&
				unitMembersState
					.filter((unitMemberData) => {
						if (unitMemberData.isFeed === false) {
							return unitMemberData;
						}
					})
					.map((unit, index) => {
						return renderRows(unit, index);
					})}

			{!newUnit &&
				unitMembersState &&
				unitMembersState.map((unit, index) => {
					let disableIsActive = false;
					if ("isFeed" in unit) {
						if (unit.isFeed === true) {
							disableIsActive = true;
						}
					}
					return renderRows(unit, index, disableIsActive);
				})}
			{isUnitsDialogOpen && (
				<Settings open={isUnitsDialogOpen} closeDialog={toggleSettingsDialog} unitMember={unitSelected} />
			)}
		</div>
	);
};

UnitMemberRows.propTypes = propTypes;
UnitMemberRows.defaultProps = defaultProps;

const compareProps = (props, nextProps) => {
	if (isEqual(props.unitMembers, nextProps.unitMembers)) {
		return true;
	} else {
		return false;
	}
};

export default memo(UnitMemberRows, compareProps);
