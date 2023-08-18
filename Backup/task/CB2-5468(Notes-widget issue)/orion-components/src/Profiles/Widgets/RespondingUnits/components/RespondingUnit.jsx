import React, { Fragment } from "react";
import { TargetingIcon } from "../../../../SharedComponents";
import { IconButton, ListItem } from "@mui/material";
import { withStyles } from "@mui/styles";
import { Person } from "@mui/icons-material";

const materialStyles = theme => ({
	entity: {
		paddingTop: 8,
		color: "white",
		display: "flex",
		alignItems: "center",
		borderBottom: "1px solid #41454A",
		borderLeft: "1px solid #41454A",
		borderRight: "1px solid #41454A",
		fontSize: 15,
		backgroundColor: "#41454A",
		paddingRight: 16,
		borderRadius: 15
	},
	entityRTL: {
		paddingTop: 8,
		color: "white",
		display: "flex",
		alignItems: "center",
		borderBottom: "1px solid #41454A",
		borderLeft: "1px solid #41454A",
		borderRight: "1px solid #41454A",
		fontSize: 15,
		backgroundColor: "#41454A",
		paddingLeft: 16,
		borderRadius: 15
	}
});

const listStyles = {
	details: {
		minWidth: "55%"
	},
	unitId: {
		fontSize: 18,
		paddingLeft: 6,
		color: "rgb(53, 183, 243)"
	},
	personnelDiv: {
		display: "flex",
		alignItems: "center"
	},
	personnelName: {
		fontSize: 10
	},
	close: {
		marginLeft: "auto",
		width: "auto",
		height: "auto",
		padding: 0
	},
	unitIdRTL: {
		fontSize: 18,
		paddingRight: 6,
		color: "rgb(53, 183, 243)"
	}
};
const RespondingUnit = ({
	entity,
	handleLoadEntityDetails,
	classes,
	dir
}) => {

	return (
		<div>
			<ListItem
				button={true}
				classes={{
					root: (dir && dir == "rtl" ? classes.entityRTL : classes.entity)
				}}
			>
				<Fragment>
					<TargetingIcon feedId={entity.feedId} id={entity.id} />
					<div
						id="responding-unit-details"
						style={listStyles.details}
						className="active-item"
						onClick={() => handleLoadEntityDetails(entity)}
					>
						<div style={dir == "rtl" ? listStyles.unitIdRTL : listStyles.unitId}>
							{entity.unitId}
						</div>
						<div style={listStyles.personnelName}>
							{entity.personnel.map((personnel, index) => {
								return (
									<div style={listStyles.personnelDiv} key={`responding_unit_personnell_${index}`}>
										<Person />
										<div style={{marginTop: 8}}>
											{personnel.name}
										</div>
									</div>

								);
							})}
						</div>
					</div>
					<div style={dir == "rtl" ? {marginRight: "auto"} : {marginLeft: "auto"}}>
						{entity.status}
					</div>
				</Fragment>
			</ListItem>
		</div>
	);
};

export default withStyles(materialStyles)(RespondingUnit);