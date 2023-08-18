import React from "react";
import { makeStyles } from "@material-ui/core/styles";
//import { withStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import PropTypes from "prop-types";

const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
		justifyContent: "flex-start",
		flexWrap: "wrap",
		"& > *": {
			margin: theme.spacing(0.5)
		},
		paddingLeft: 20,
		paddingRight: 10
	},
	rootRTL: {
		display: "flex",
		justifyContent: "flex-start",
		flexWrap: "wrap",
		"& > *": {
			margin: theme.spacing(0.5)
		},
		paddingRight: 20,
		paddingLeft: 10
	}
}));

const propTypes = {
	items: PropTypes.array.isRequired,
	onDelete: PropTypes.func.isRequired,
	dir: PropTypes.string
};

//props
function T2Chips({items, onDelete, dir}) {
	const classes = useStyles();

	const handleDelete = (id) => {
		const agents =  items.filter( u =>{
			return (u.id !== id);
		});
		onDelete(agents);
	};

	return (
		<div className={dir == "rtl" ? classes.rootRTL : classes.root}>
			{items && items.map( item =>{
				// eslint-disable-next-line react/jsx-key
				return <Chip key={item.id} label={item.name} onDelete={() => handleDelete(item.id)}/>;
			})}
		</div>
	);
}

T2Chips.propTypes = propTypes;

//export default withStyles()(T2Chips);
export default T2Chips;