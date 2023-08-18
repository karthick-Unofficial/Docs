import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { IconButton, FlatButton } from "material-ui";
import { Typography } from "@material-ui/core";
import Expand from "material-ui/svg-icons/maps/zoom-out-map";
import _ from "lodash";
import ManageModal from "./components/ManageModal";
import WidgetTable from "./components/WidgetTable";
import { Translate, getTranslation } from "orion-components/i18n/I18nContainer";


const propTypes = {
	expanded: PropTypes.bool.isRequired,
	selectWidget: PropTypes.func,
	selected: PropTypes.bool.isRequired,
	order: PropTypes.number,
	settings: PropTypes.object,
	dir: PropTypes.string
};

const defaultProps = {
	selectWidget: null,
	order: 0,
	settings: null,
	dir: "ltr"
};



const ResourceWidget = ({ selectWidget, expanded, selected, expandable, enabled, order, contextId, settings, dir }) => {
	const [resources, setResources] = useState([]);
	const [openDialog, setOpenDialog] = useState(false);
	const [checkResourceData, setCheckResourceData] = useState(false);

	useEffect(() => {
		if ("resources" in settings) {
			if (settings.resources.length > 0) {
				return {
					checkResourceData: true
				};
			}
			else {
				return {
					checkResourceData: false
				};
			}
		}
		else {
			return {
				checkResourceData: false
			};
		}
	}, [settings]);

	const openHrmsDialog = () => {
		setOpenDialog(true);
	};

	const closeHrmsDialog = () => {
		setOpenDialog(false);
	};


	const handleExpand = () => {
		selectWidget("Resources");
	};

	return selected || !enabled ? (
		<div />
	) :
		(<div className={`widget-wrapper ${expanded ? "expanded" : "collapsed"
		} ${"index-" + order}`}>
			{openDialog && (
				<ManageModal
					open={openDialog}
					close={closeHrmsDialog}
					lookupType="resources"
					contextId={contextId}
					settings={settings}
					assignedData={settings.resources}
					dir={dir}
				/>)}


			<div id="resource-wrapper" className="widget-wrapper">
				<div className="widget-header">
					<div className="cb-font-b2"><Translate value="global.profiles.widgets.hrms.resourcesWidget.resources" /></div>
					<div className="widget-option-button">
						<FlatButton
							label={getTranslation("global.profiles.widgets.hrms.resourcesWidget.manage")}
							primary={true}
							onClick={openHrmsDialog}
						/>
					</div>
					<div className="widget-header-buttons">
						{expandable ? (
							<div className="widget-expand-button">
								<IconButton
									style={dir == "rtl" ? { paddingLeft: 0, width: "auto" } : { paddingRight: 0, width: "auto" }}
									onClick={handleExpand}
								>
									<Expand />
								</IconButton>
							</div>
						) : null}
					</div>
				</div>
				<div className="widget-content">
					{checkResourceData ?
						<WidgetTable WidgetType="resources" tableData={settings.resources} expanded={expanded} dir={dir} />
						:
						<Typography
							style={{ padding: 12 }}
							component="p"
							align="center"
							variant="caption"
						>
							<Translate value="global.profiles.widgets.hrms.resourcesWidget.noResources" />
						</Typography>
					}

				</div>

			</div>

		</div>
		);
};

ResourceWidget.propTypes = propTypes;
ResourceWidget.defaultProps = defaultProps;

export default ResourceWidget;