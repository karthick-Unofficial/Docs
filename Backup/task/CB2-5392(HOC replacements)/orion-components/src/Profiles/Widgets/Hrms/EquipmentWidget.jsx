import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { IconButton, FlatButton } from "material-ui";
import { Typography } from "@material-ui/core";
import Expand from "material-ui/svg-icons/maps/zoom-out-map";
import _ from "lodash";
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

const EquipmentWidget = ({
	settings,
	selectWidget,
	expanded,
	selected,
	expandable,
	enabled,
	order,
	contextId,
	dir,
	canManage
}) => {
	const dispatch = useDispatch();

	const [openDialog, setOpenDialog] = useState(false);
	const [checkEquipmentData, setCheckEquipmentData] = useState(false);

	useEffect(() => {
		if ("equipments" in settings) {

			if (settings.equipments.length > 0) {
				setCheckEquipmentData(true);
			}
			else {
				setCheckEquipmentData(false);
			}
		}
		else {
			setCheckEquipmentData(false);
		}

	}, [settings]);


	const openHrmsDialog = () => {
		setOpenDialog(true);
	};

	const closeHrmsDialog = () => {
		setOpenDialog(false);
	};


	const handleExpand = () => {
		dispatch(selectWidget("Equipment"));
	};

	return selected || !enabled ? (
		<div />
	) : (
		<div className={`widget-wrapper ${expanded ? "expanded" : "collapsed"
			} ${"index-" + order}`}>
			{openDialog && (
				<ManageModal
					open={openDialog}
					close={closeHrmsDialog}
					lookupType="equipment"
					contextId={contextId}
					settings={settings}
					assignedData={settings.equipments}
					dir={dir}
				/>)}

			<div id="resource-wrapper">
				<div className="widget-header">
					<div className="cb-font-b2"><Translate value="global.profiles.widgets.hrms.equipmentsWidget.equipments" /></div>
					<div className="widget-option-button">
						{canManage && <FlatButton
							label={getTranslation("global.profiles.widgets.hrms.equipmentsWidget.manage")}
							primary={true}
							onClick={openHrmsDialog}
						/>}
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

					{checkEquipmentData ?
						<WidgetTable WidgetType="equipments" tableData={settings.equipments} expanded={expanded} dir={dir} />
						:
						<Typography
							style={{ padding: 12 }}
							component="p"
							align="center"
							variant="caption"
						>
							<Translate value="global.profiles.widgets.hrms.equipmentsWidget.noEquipment" />
						</Typography>}
				</div>

			</div>

		</div>
	);

};

EquipmentWidget.propTypes = propTypes;
EquipmentWidget.defaultProps = defaultProps;

export default EquipmentWidget;