import React, { useState } from "react";
import PropTypes from "prop-types";
import SearchField from "./SearchField";
import { restClient } from "client-app-core";
import ErrorBoundary from "orion-components/ErrorBoundary";
import { List, ListItem, ListItemText, CircularProgress } from "@mui/material";
import { Translate } from "orion-components/i18n";

const propTypes = {
	handleAlertObjectClick: PropTypes.func.isRequired,
	selectedObject: PropTypes.object.isRequired
};
const defaultProps = {};

const ObjectSelection = ({
	handleAlertObjectClick,
	selectedObject
}) => {

	const [isQuerying, setIsQuerying] = useState(false);
	const [objects, setObjects] = useState([]);

	const updateObjectList = textEntry => {
		if (textEntry === "") {
			setObjects([]);
			return;
		}

		setIsQuerying(true);

		restClient.exec_get(`/ecosystem/api/feedEntities?q=${textEntry}`, (err, response) => {
			if (err) {
				console.log(err);
				setIsQuerying(false);
			} else {
				setObjects(Array.isArray(response) ? response.slice(0, 5) : []);
				setIsQuerying(false);
			}
		});
	};

	const progressStyle = {
		outer: {
			width: "100%",
			height: "100%",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			color: "rgb(0, 188, 212)"
		}
	};

	return (
		<div className="generic-attribute">
			<h4><Translate value="alertGenerator.objectSelection.object" /></h4>
			<div>
				<List>
					<ErrorBoundary>
						<SearchField
							width="100%"
							updateSearch={updateObjectList}
							className="typeAheadFilter"
						/>
					</ErrorBoundary>
					{isQuerying ?
						<div style={progressStyle.outer}>
							<CircularProgress size={100} thickness={2} color="inherit" />
						</div>
						: objects ? objects.map((object, index) => {
							return (
								<ListItem
									className={`${selectedObject.id === (object.id) ? "selected" : "unselected"}`}
									key={object.id}
									onClick={() => handleAlertObjectClick(object)}
									sx={{ padding: "0px", textAlign: "unset" }}
								>
									<ListItemText
										primary={object.entityData.properties.name}
										primaryTypographyProps={{ style: { fontSize: 16, lineHeight: "48px", padding: "0 16px" } }}
										sx={{ margin: "0px" }}
									/>
								</ListItem>
							);
						}) : null
					}
				</List>
			</div>
		</div>
	);
};

ObjectSelection.propTypes = propTypes;
ObjectSelection.defaultProps = defaultProps;

export default ObjectSelection;