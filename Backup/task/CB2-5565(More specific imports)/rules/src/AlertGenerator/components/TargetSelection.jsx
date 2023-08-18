import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import SearchField from "./SearchField";
import { shapeService } from "client-app-core";
import ErrorBoundary from "orion-components/ErrorBoundary";
import { List, ListItem, ListItemText } from "@mui/material";
import includes from "lodash/includes";
import { Translate } from "orion-components/i18n";

const propTypes = {
	handleAlertTargetClick: PropTypes.func.isRequired,
	selectedTarget: PropTypes.object.isRequired
};
const defaultProps = {
};

const TargetSelection = ({
	handleAlertTargetClick,
	selectedTarget
}) => {
	const [filteredTargets, setFilteredTargets] = useState([]);
	const [targets, setTargets] = useState([]);
	const sortArr = (arr) => {
		return arr.sort((a, b) => {
			const aName = a.entityData ? a.entityData.properties.name.toLowerCase() : a.name.toLowerCase();
			const bName = b.entityData ? b.entityData.properties.name.toLowerCase() : b.name.toLowerCase();
			if (aName < bName)
				return -1;
			if (aName > bName)
				return 1;
			return 0;
		});
	};
	useEffect(() => {
		shapeService.getMyShapes((err, res) => {
			if (err) {
				console.log(err);
			} else {
				sortArr(res);
				setTargets(res);
				setFilteredTargets(res);
			}
		});
	}, []);

	const updateSearchText = textEntry => {
		if (textEntry === "") {
			setFilteredTargets(targets);
			return;
		}
		if (targets.length > 0) {
			const tArray = targets
				.filter(shape => {
					if (includes(shape.entityData.properties.name.toLowerCase(), textEntry.toLowerCase())) return shape;
					else return false;
				});
			console.log("filtered targets: " + JSON.stringify(tArray));
			setFilteredTargets(tArray);
		}
	};

	return (
		<div className="generic-attribute">
			<h4><Translate value="alertGenerator.targetSelection.target" /></h4>
			<div>
				<List className="trigger-attribute-list">
					<ErrorBoundary>
						<SearchField
							width="100%"
							updateSearch={updateSearchText}
							className="typeAheadFilter"
						/>
					</ErrorBoundary>
					<div
						style={{ height: "400px" }}
						className="targetSelectionScroll scrollbar"
					>
						{filteredTargets.map((item, index) => {
							return (
								<ListItem
									className={`${selectedTarget.id === (item.id) ? "selected" : "unselected"}`}
									key={item.id}
									onClick={() => handleAlertTargetClick(item)}
									sx={{ padding: "0px", textAlign: "unset" }}
								>
									<ListItemText
										primary={item.entityData.properties.name}
										primaryTypographyProps={{ style: { fontSize: 16, lineHeight: "48px", padding: "0 16px" } }}
										sx={{ margin: "0px" }}
									/>
								</ListItem>
							);
						})}
					</div>
				</List>
			</div>
		</div>
	);
};

TargetSelection.propTypes = propTypes;
TargetSelection.defaultProps = defaultProps;

export default TargetSelection;