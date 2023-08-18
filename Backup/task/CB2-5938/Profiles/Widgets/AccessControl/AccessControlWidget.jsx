import React from "react";
import PropTypes from "prop-types";
import { Translate, getTranslation } from "orion-components/i18n";
import { Button } from "@mui/material";
import { BaseWidget } from "../shared";
import { restClient } from "client-app-core";
import { getWidgetState } from "orion-components/Profiles/Selectors";
import { useSelector } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";
import { getSelectedContextData } from "orion-components/Profiles/Selectors";

const propTypes = {
	id: PropTypes.string,
	contextId: PropTypes.string
};

const AccessControlWidget = ({ id, contextId }) => {
	const enabled = useSelector((state) => getWidgetState(state)(id, "enabled"));
	const dir = useSelector((state) => getDir(state));
	const readOnly = useSelector((state) => {
		return state?.appId === "replay-app" ? true : false;
	});
	const accessPoint = useSelector((state) => getSelectedContextData(state)(contextId, "entity"));
	const status = accessPoint.entityData?.properties?.status;

	const controlClicked = (feature) => {
		restClient.exec_post(feature.command, null, (err, result) => {
			if (err) {
				console.log(`There was an error executing command (${feature.command})`, err, result);
			} else {
				console.log(`Command (${feature.command}) executed successfully.`);
			}
		});
	};

	const styles = {
		status: {
			color: "#FFFFFF",
			fontSize: 14,
			opacity: 0.5,
			margin: "8px 8px 0"
		}
	};

	return (
		<BaseWidget
			enabled={enabled}
			title={getTranslation("global.profiles.accessPointProfile.accessControlWidget.title")}
			dir={dir}
		>
			<p style={styles.status}>
				<Translate value="global.profiles.accessPointProfile.accessControlWidget.statusHeader" count={status} />
			</p>
			{!readOnly &&
				accessPoint.entityData.properties.features.map((feature) => {
					return (
						<Button
							key={`${feature.control}_control-button`}
							variant="contained"
							onClick={() => {
								controlClicked(feature);
							}}
							color="primary"
							style={{
								width: "calc(100% - 16px)",
								margin: "8px 8px 0 8px",
								color: "#fff",
								padding: "10px"
							}}
						>
							{feature.label}
						</Button>
					);
				})}
		</BaseWidget>
	);
};

AccessControlWidget.propTypes = propTypes;
export default AccessControlWidget;
