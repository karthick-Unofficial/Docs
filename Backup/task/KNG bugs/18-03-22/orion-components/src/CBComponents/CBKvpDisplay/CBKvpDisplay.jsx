import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Paper
} from "@material-ui/core";

const propTypes = {
	keyValuePairs: PropTypes.arrayOf(PropTypes.shape({
		key: PropTypes.string,
		value: PropTypes.string
	})),
	classes: PropTypes.object
};

const defaultProps = {
	keyValuePairs: [
		{
			key: "",
			value: ""
		}
	]
};

const styles = {
	selected: {
		backgroundColor: "rgba(149, 150, 151, 0.4) !important"
	}
};

const CBKvpDisplay = ({
	keyValuePairs,
	classes
}) => { 
	return (
		<Paper>
			<Table>
				<TableBody>
					{keyValuePairs.map((pair, index) => {
						return (
							<TableRow key={pair.key + index} classes={{ selected: classes.selected }} selected={index % 2 === 0 ? true : false}>
								<TableCell style={{ padding: "4px 24px 4px 24px" }}>
									{pair.key}
								</TableCell>
								<TableCell style={{ padding: "4px 24px 4px 24px" }}>
									{pair.value}
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</Paper>
	);
};

CBKvpDisplay.propTypes = propTypes;
CBKvpDisplay.defaultProps = defaultProps;

export default withStyles(styles)(CBKvpDisplay);