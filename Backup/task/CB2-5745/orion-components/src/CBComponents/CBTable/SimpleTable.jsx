import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@mui/styles";
import { Table, TableBody, TableCell, TableRow } from "@mui/material";
import { UnitParser } from "../index";
import map from "lodash/map";

const propTypes = {
	rows: PropTypes.array,
	classes: PropTypes.object,
	dir: PropTypes.string
};

const defaultProps = {
	rows: []
};

const styles = {
	root: {
		"&:nth-of-type(odd)": {
			backgroundColor: "rgba(149, 150, 151, 0.4)"
		}
	}
};

const SimpleTable = ({ rows, classes, dir }) => {
	const styles = {
		table: {
			margin: "10px 0"
		},
		cell: {
			border: "none",
			color: "#fff",
			...(dir === "rtl" && { textAlign: "right" })
		}
	};
	return (
		<Table style={styles.table}>
			<TableBody>
				{map(rows, (row) => {
					const { label, unit, value } = row;
					return (
						<TableRow key={label} className={classes.root}>
							<TableCell style={styles.cell}>{label}</TableCell>
							<TableCell style={styles.cell}>
								{value.unit ? (
									<UnitParser
										sourceUnit={value.unit}
										value={value.val}
									/>
								) : unit ? (
									<UnitParser
										sourceUnit={unit}
										value={value}
									/>
								) : (
									value
								)}
							</TableCell>
						</TableRow>
					);
				})}
			</TableBody>
		</Table>
	);
};

SimpleTable.propTypes = propTypes;
SimpleTable.defaultProps = defaultProps;

export default withStyles(styles)(SimpleTable);
