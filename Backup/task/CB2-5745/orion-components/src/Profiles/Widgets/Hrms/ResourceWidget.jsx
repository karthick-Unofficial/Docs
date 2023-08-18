import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { IconButton, Button, Typography } from "@mui/material";
import { default as Expand } from "@mui/icons-material/ZoomOutMap";
import ManageModal from "./components/ManageModal";
import WidgetTable from "./components/WidgetTable";
import { Translate, getTranslation } from "orion-components/i18n";
import { useDispatch } from "react-redux";

const propTypes = {
	expanded: PropTypes.bool.isRequired,
	selectWidget: PropTypes.func,
	selected: PropTypes.bool.isRequired,
	order: PropTypes.number,
	settings: PropTypes.object,
	dir: PropTypes.string,
	forReplay: PropTypes.bool
};

const defaultProps = {
	selectWidget: null,
	order: 0,
	settings: null,
	dir: "ltr",
	forReplay: false
};

const ResourceWidget = ({
	selectWidget,
	expanded,
	selected,
	expandable,
	enabled,
	order,
	contextId,
	settings,
	dir,
	canManage
}) => {
	const dispatch = useDispatch();
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
		<div
			className={`widget-wrapper ${expanded ? "expanded" : "collapsed"} ${
				"index-" + order
			}`}
		>
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
							<Button
								variant="text"
								color="primary"
								onClick={openHrmsDialog}
							>
								{getTranslation(
									"global.profiles.widgets.hrms.resourcesWidget.manage"
								)}
							</Button>
						)}
					</div>
					<div className="widget-header-buttons">
						{expandable ? (
							<div className="widget-expand-button">
								<IconButton
									style={styles.widgetExpandButton}
									onClick={handleExpand}
								>
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
						<Typography
							style={{ padding: 12 }}
							component="p"
							align="center"
							variant="caption"
						>
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
