import React from "react";
import PropTypes from "prop-types";
import {
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Typography,
	Grid
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { withStyles } from "@mui/styles";

const propTypes = {
	name: PropTypes.string.isRequired,
	collection: PropTypes.array.isRequired,
	expanded: PropTypes.bool.isRequired,
	handleExpand: PropTypes.func.isRequired,
	handleSelect: PropTypes.func.isRequired,
	search: PropTypes.string
};

const defaultProps = {
	search: ""
};

const styles = {
	expandIconWrapper: {
		color: "#fff",
		opacity: 0.3
	},
	expanded: {
		minHeight: "unset!important",
		margin: "12px 0!important"
	}
};

const SymbolCollection = ({
	name,
	collection,
	expanded,
	handleSelect,
	handleExpand,
	search,
	classes
}) => {
	return (
		<Accordion
			expanded={expanded}
			onChange={handleExpand}
			sx={{ margin: "0 0 8px 0", boxShadow: "none" }}
		>
			<AccordionSummary
				expandIcon={<ExpandMore />}
				sx={{ background: "#41454a", padding: "0px 16px" }}
				classes={{
					expandIconWrapper: classes.expandIconWrapper,
					expanded: classes.expanded
				}}
			>
				<Typography>{name}</Typography>
			</AccordionSummary>
			<AccordionDetails sx={{ padding: "8px 16px 16px" }}>
				<Grid container spacing={2}>
					{collection
						.filter((symbol) => {
							const { name, keywords } = symbol;
							const filtered =
								name.toLowerCase().includes(search) ||
								!!keywords.filter((keyword) =>
									keyword.toLowerCase().includes(search)
								).length > 0;
							return filtered;
						})
						.map((symbol) => {
							const { name, path } = symbol;
							return (
								<Grid
									item
									key={name}
									xs={2.4}
									onClick={() => handleSelect(name)}
								>
									<img
										style={{
											width: 50,
											height: 50,
											marginTop: 7.5,
											cursor: "pointer"
										}}
										alt={name}
										src={require(`../icons${path}`)}
									/>
								</Grid>
							);
						})}
				</Grid>
			</AccordionDetails>
		</Accordion>
	);
};

SymbolCollection.propTypes = propTypes;
SymbolCollection.defaultProps = defaultProps;

export default withStyles(styles)(SymbolCollection);
