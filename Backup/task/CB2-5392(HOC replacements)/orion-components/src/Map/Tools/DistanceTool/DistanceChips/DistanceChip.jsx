import React from "react";
import { Avatar, Chip } from "@material-ui/core";
import { TargetingIcon } from "orion-components/SharedComponents";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";

const useStyles = makeStyles(theme => ({
	avatarRTL: {
		marginRight: "5px!important",
		marginLeft: "-6px!important"
	},
	deleteIconRTL: {
		margin: "0 -6px 0 5px"
	}
}));

const DistanceChip = ({ path, activePath, deletePath, setActivePath, dir }) => {
	const dispatch = useDispatch();

	const { id, name, distance, eta, coordinates, unit } = path;
	const active = activePath && id === activePath.id;
	const d = distance
		? distance.toFixed(2) + ` ${unit.display}`
		: 0 + ` ${unit.display}`;
	const e = eta && eta > 0
		? ` | ${eta.toFixed(2)} min`
		: "";
	const geometry = {
		coordinates: coordinates[coordinates.length - 1],
		type: "Point"
	};
	const { avatarRTL, deleteIconRTL } = useStyles();

	return (
		<Chip
			onDelete={active ? null : () => dispatch(deletePath(id))}
			onClick={() => dispatch(setActivePath(path))}
			color={active ? "primary" : "default"}
			style={dir == "rtl" ? { marginRight: 8 } : { marginLeft: 8 }}
			label={`${name}  |  ${d}${e}`}
			avatar={
				<Avatar>
					<TargetingIcon geometry={geometry} />
				</Avatar>
			}
			classes={{ avatar: dir == "rtl" ? avatarRTL : {}, deleteIcon: dir == "rtl" ? deleteIconRTL : {} }}
		/>
	);
};

export default DistanceChip;
