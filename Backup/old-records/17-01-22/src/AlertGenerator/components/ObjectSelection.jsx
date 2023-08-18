import React, { useState } from "react";
import PropTypes from "prop-types";
import SearchField from "./SearchField";
import { restClient } from "client-app-core";
import ErrorBoundary from "orion-components/ErrorBoundary";
import CircularProgress from "material-ui/CircularProgress";
import List, { ListItem } from "material-ui/List";
import { Translate } from "orion-components/i18n/I18nContainer";

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
			justifyContent: "center"
		}
	};

	return (  
		<div className="generic-attribute">
			<h4><Translate value="alertGenerator.objectSelection.object"/></h4>
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
							<CircularProgress size={100} thickness={5}/>
						</div>
						: objects ? objects.map((object, index) => {
							return (
								<ListItem
									className={`${selectedObject.id === (object.id)? "selected" : "unselected"}`}
									key={object.id}
									primaryText={object.entityData.properties.name}
									onClick={() => handleAlertObjectClick(object)}
								/>
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