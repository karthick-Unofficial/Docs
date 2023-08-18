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
	getSelectedUnitMembers: PropTypes.func,
	memberRoleTypes: PropTypes.object
};

const defaultProps = {
	newUnit: false,
	getSelectedUnitMembers: () => { },
	memberRoleTypes: []
};


const UnitMemberRows = ({
	unitMembers,
	newUnit,
	getSelectedUnitMembers,
	memberRoleTypes }) => {

	const [unitMembersState, setUnitMembersState] = useState([]);
	const [isUnitsDialogOpen, setUnitsDialogOpen] = useState(false);
	const [unitSelected, setUnitSelected] = useState({});
	const dir = useSelector(state => getDir(state));

	useEffect(() => {
		setUnitMembersState(unitMembers);
	}, [unitMembers]);

	const toggleSettingsDialog = (data) => {
		if (data) {
			setUnitSelected(data);
		}
		setUnitsDialogOpen(!isUnitsDialogOpen);
	}

	const activateUnitMember = (unitMemberId) => {
		unitService.activateUnitMember(unitMemberId, (err, response) => {
			if (err) {
				console.log("ERROR:", err);
			}
		});
	}

	const deactivateUnitMember = (unitMemberId) => {
		unitService.deactivateUnitMember(unitMemberId, (err, response) => {
			if (err) {
				console.log("ERROR:", err);
			}
		});
	}


	const handleIsActive = (e, i) => {
		unitMembersState[i][`${e.target.name}`] = e.target.checked;
		setUnitMembersState([...unitMembersState]);

		// selected unit  members that are to be assinged to a unit
		if (newUnit) {
			getSelectedUnitMembers(unitMembers[i]);
		}
		else {
			if (e.target.checked) {
				activateUnitMember(unitMembersState[i].id);
			}
			else {
				deactivateUnitMember(unitMembersState[i].id);
			}
		}
	};



	const renederRows = (unit, index, disableIsactive = false) => {

		return (
			<div>
				<Grid container>
					<Grid item xs={1} sm={1} md={1} lg={1}>
						<FormControlLabel
							control={
								<Checkbox
									style={{
										transform: "scale(1.1)",
									}}
									checked={newUnit ? unit.selected : unit.isActive}
									name={newUnit ? "selected" : "isActive"}
									onChange={(e) => { handleIsActive(e, index) }}
									disabled={disableIsactive}
								/>
							}
						/>
					</Grid>
					<Grid item xs={2} sm={2} md={2} lg={2}>
						<div style={{
							...(dir === "ltr" && { paddingLeft: "12px" }),
							...(dir === "rtl" && { paddingRight: "12px" })
						}}>
							{unit.geometry && <TargetingIcon feedId={unit.feedId} id={index} geometry={unit.geometry} feedLayerCheck={true} />}
						</div>
					</Grid>
					<Grid item xs={2} sm={2} md={2} lg={2}>
						<div>
							{unit.memberType === "person" ? <img
								alt="person"
								style={{
									width: 30,
									margin: "8px 15px"
								}}
								src={require("../../SharedComponents/ShapeEdit/icons/Person_blue.png")}
							/> : <img
								alt="police_car"
								style={{
									width: 30,
									margin: "8px 15px"
								}}
								src={require("../../SharedComponents/ShapeEdit/icons/Police_Car_blue.png")}
							/>}
						</div>
					</Grid>
					<Grid item xs={5} sm={5} md={5} lg={5}>
						<Typography style={{ fontSize: "12px", paddingTop: "16px", fontWeight: "300", margin: "0px 12px" }}>
							{unit.name}
						</Typography>
					</Grid>
					{!newUnit ?
						<Grid item xs={2} sm={2} md={2} lg={2}>
							<Button variant="text"
								style={{ textTransform: "none", color: "#82858A", fontSize: "12px", fontWeight: "300" }}
								onClick={() => toggleSettingsDialog(unit)}
							>
								<Translate value="global.units.components.unitMemberRows.settings" />
							</Button>
						</Grid> : null
					}
				</Grid>
				{
					index === unitMembersState.length - 1 ? null
						:
						<Divider
							style={{
								background: "#626466",
								marginBottom: "3px",
								marginTop: "3px",
								padding: "0px 4px"
							}} />
				}

			</div>)

	}

	return (
		<div className="UnitMemberRows">
			{newUnit && unitMembersState && unitMembersState.filter((unitMemberData) => {
				if (unitMemberData.isFeed === false) {
					return unitMemberData;
				}
			}
			).map((unit, index) => {
				return renederRows(unit, index);
			})
			}

			{!newUnit && unitMembersState && unitMembersState.map((unit, index) => {
				let disableIsactive = false;
				if ('isFeed' in unit) {
					if (unit.isFeed === true) {
						disableIsactive = true;
					}
				}
				return renederRows(unit, index, disableIsactive);
			})}
			{isUnitsDialogOpen &&
				<Settings
					open={isUnitsDialogOpen}
					closeDialog={toggleSettingsDialog}
					unitMember={unitSelected}
					memberRoleTypes={memberRoleTypes}
				/>
			}
		</div>
	)

};

UnitMemberRows.propTypes = propTypes;
UnitMemberRows.defaultProps = defaultProps;

const compareProps = (props, nextProps) => {
	if (isEqual(props.unitMembers, nextProps.unitMembers)) {
		return true;
	}
	else {
		return false;
	}
}


export default memo(UnitMemberRows, compareProps);