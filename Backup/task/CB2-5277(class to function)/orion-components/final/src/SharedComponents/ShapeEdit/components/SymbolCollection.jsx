import React from "react";
import PropTypes from "prop-types";
import {
	ExpansionPanel,
	ExpansionPanelSummary,
	ExpansionPanelDetails,
	Typography,
	GridList,
	GridListTile
} from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";

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

const SymbolCollection = ({
	name,
	collection,
	expanded,
	handleSelect,
	handleExpand,
	search
}) => {
	return (
		<ExpansionPanel expanded={expanded} onChange={handleExpand}>
			<ExpansionPanelSummary expandIcon={<ExpandMore />}>
				<Typography>{name}</Typography>
			</ExpansionPanelSummary>
			<ExpansionPanelDetails /*style={{ maxHeight: 250 }}*/>
				<GridList cellHeight={65} cols={5}>
					{collection
						.filter(symbol => {
							const { name, keywords } = symbol;
							const filtered =
								name.toLowerCase().includes(search) ||
								!!keywords.filter(keyword =>
									keyword.toLowerCase().includes(search)
								).length > 0;
							return filtered;
						})
						.map(symbol => {
							const { name, path } = symbol;
							return (
								<GridListTile
									key={name}
									cols={1}
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
								</GridListTile>
							);
						})}
				</GridList>
			</ExpansionPanelDetails>
		</ExpansionPanel>
	);
};

SymbolCollection.propTypes = propTypes;
SymbolCollection.defaultProps = defaultProps;

export default SymbolCollection;
