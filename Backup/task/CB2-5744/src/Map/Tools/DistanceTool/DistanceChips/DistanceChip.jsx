import React from "react";
import { Avatar, Chip } from "@mui/material";
import { TargetingIcon } from "orion-components/SharedComponents";
import { makeStyles } from "@mui/styles";
import { useDispatch } from "react-redux";

const useStyles = makeStyles((theme) => ({
	avatarRTL: {
		marginRight: "5px!important",
		marginLeft: "-6px!important"
	},
	deleteIcon: {
		color: "rgba(255, 255, 255, 0.26)!important",
		"&.MuiChip-deleteIcon:hover": {
			color: "rgba(255, 255, 255, 0.4)!important"
		}
	},
	deleteIconRTL: {
		margin: "0 -6px 0 5px!important",
		color: "rgba(255, 255, 255, 0.26)!important",
		"&.MuiChip-deleteIcon:hover": {
			color: "rgba(255, 255, 255, 0.4)!important"
		}
	}
}));

const DistanceChip = ({ path, activePath, deletePath, setActivePath, dir }) => {
	const dispatch = useDispatch();

	const { id, name, distance, eta, coordinates, unit } = path;
	const active = activePath && id === activePath.id;
	const d = distance
		? distance.toFixed(2) + ` ${unit.display}`
		: 0 + ` ${unit.display}`;
	const e = eta && eta > 0 ? ` | ${eta.toFixed(2)} min` : "";
	const geometry = {
		coordinates: coordinates[coordinates.length - 1],
		type: "Point"
	};
	const { avatarRTL, deleteIcon, deleteIconRTL } = useStyles();

	const chipOverrides = {
		chip: {
			...(dir === "rtl" ? { marginRight: "8px" } : { marginLeft: "8px" }),
			color: "#fff",
			background: "#616161",
			"&.MuiChip-clickable:hover": {
				background: "rgb(109, 109, 109)"
			},
			"&.MuiChip-clickableColorPrimary:focus": {
				background: "rgb(40, 145, 194)"
			}
		}
	};

	return (
		<Chip
			onDelete={active ? null : () => dispatch(deletePath(id))}
			onClick={() => dispatch(setActivePath(path))}
			color={active ? "primary" : "default"}
			sx={chipOverrides.chip}
			label={`${name}  |  ${d}${e}`}
			avatar={
				<Avatar sx={{ background: "#757575" }}>
					<TargetingIcon geometry={geometry} />
				</Avatar>
			}
			classes={{
				avatar: dir == "rtl" ? avatarRTL : {},
				deleteIcon: dir === "rtl" ? deleteIconRTL : deleteIcon
			}}
		/>
	);
};

export default DistanceChip;
