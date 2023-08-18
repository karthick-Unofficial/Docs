import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { IconButton, Button, Typography } from "@mui/material";
import { default as Expand } from "@mui/icons-material/ZoomOutMap";
import ManageModal from "./components/ManageModal";
import WidgetTable from "./components/WidgetTable";
import { Translate, getTranslation } from "orion-components/i18n";
import { useDispatch } from "react-redux";
import { getWidgetState, getSelectedContextData } from "orion-components/Profiles/Selectors";
import { useSelector } from "react-redux";
import { getDir } from "orion-components/i18n/Config/selector";

const propTypes = {
	selectWidget: PropTypes.func,
	selected: PropTypes.bool.isRequired,
	forReplay: PropTypes.bool
};

const defaultProps = {
	selectWidget: null,
	dir: "ltr",
	forReplay: false
};

const ResourceWidget = ({ selectWidget, expanded, selected, contextId, canManage, id, expandable }) => {
	const dispatch = useDispatch();
	const enabled = useSelector((state) => expanded || getWidgetState(state)(id, "enabled"));
	const dir = useSelector((state) => getDir(state));
	const entity = useSelector((state) => getSelectedContextData(state)(contextId, "entity"));
	const settings = entity?.additionalProperties || {};

	const styles = {
		widgetExpandButton: {
			width: "auto",
			...(dir == "rtl" && { paddingLeft: 0 }),
			...(dir == "ltr" && { paddingRight: 0 })
		}
	};

	const [openDialog, setOpenDialog] = useState(false);
	const [checkResourceData, setCheckResourceData] = useState(false);

	useEffect(() => {
		if ("resources" in settings) {
			if (settings.resources.length > 0) {
				setCheckResourceData(true);
			} else {
				setCheckResourceData(false);
			}
		} else {
			setCheckResourceData(false);
		}
	}, [settings]);

	const openHrmsDialog = () => {
		setOpenDialog(true);
	};

	const closeHrmsDialog = () => {
		setOpenDialog(false);
	};

	const handleExpand = () => {
		dispatch(selectWidget("Resources"));
	};

	return selected || !enabled ? (
		<div />
	) : (
		<div className={`widget-wrapper ${expanded ? "expanded" : "collapsed"}`}>
			{openDialog && (
				<ManageModal
					open={openDialog}
					close={closeHrmsDialog}
					lookupType="resources"
					contextId={contextId}
					settings={settings}
					assignedData={settings.resources}
					dir={dir}
				/>
			)}

			<div id="resource-wrapper">
				<div className="widget-header">
					<div className="cb-font-b2">
						<Translate value="global.profiles.widgets.hrms.resourcesWidget.resources" />
					</div>
					<div className="widget-option-button">
						{canManage && (
							<Button variant="text" color="primary" onClick={openHrmsDialog}>
								{getTranslation("global.profiles.widgets.hrms.resourcesWidget.manage")}
							</Button>
						)}
					</div>
					<div className="widget-header-buttons">
						{expandable ? (
							<div className="widget-expand-button">
								<IconButton style={styles.widgetExpandButton} onClick={handleExpand}>
									<Expand />
								</IconButton>
							</div>
						) : null}
					</div>
				</div>
				<div className="widget-content">
					{checkResourceData ? (
						<WidgetTable
							WidgetType="resources"
							tableData={settings.resources}
							expanded={expanded}
							dir={dir}
						/>
					) : (
						<Typography style={{ padding: 12 }} component="p" align="center" variant="caption">
							<Translate value="global.profiles.widgets.hrms.resourcesWidget.noResources" />
						</Typography>
					)}
				</div>
			</div>
		</div>
	);
};

ResourceWidget.propTypes = propTypes;
ResourceWidget.defaultProps = defaultProps;

export default ResourceWidget;
