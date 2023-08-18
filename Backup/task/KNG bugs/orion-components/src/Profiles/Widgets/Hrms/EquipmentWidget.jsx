import React, { PureComponent } from "react";
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



class EquipmentWidget extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			resources: [],
			openDialog: false,
			checkEquipmentData: false
		};

	}


	static getDerivedStateFromProps(props, state) {
		if ("equipments" in props.settings) {

			if (props.settings.equipments.length > 0) {
				return {
					checkEquipmentData: true
				};

			}
			else {
				return {
					checkEquipmentData: false
				};
			}
		}
		else {
			return {
				checkEquipmentData: false
			};
		}

	}


    openHrmsDialog = () => {
    	this.setState({ openDialog: true });
    }

    closeHrmsDialog = () => {
    	this.setState({ openDialog: false });
    }


    handleExpand = () => {
    	const { selectWidget } = this.props;
    	selectWidget("Equipment");
    };



    render() {
    	const { expanded, selected, expandable, enabled, order, settings, contextId, dir } = this.props;
    	const { openDialog, checkEquipmentData } = this.state;
    	return selected || !enabled ? (
    		<div />
    	) : (
    		<div className={`widget-wrapper ${expanded ? "expanded" : "collapsed"
    		} ${"index-" + order}`}>
    			{openDialog && (
    				<ManageModal
    					open={openDialog}
    					close={this.closeHrmsDialog}
    					lookupType="equipment"
    					contextId={contextId}
    					settings={settings}
    					assignedData={settings.equipments}
    					dir={dir}
    				/>)}

    			<div id="resource-wrapper" className="widget-wrapper">
    				<div className="widget-header">
    					<div className="cb-font-b2"><Translate value="global.profiles.widgets.hrms.equipmentsWidget.equipments"/></div>
    					<div className="widget-option-button">
    						<FlatButton
    							label={getTranslation("global.profiles.widgets.hrms.equipmentsWidget.manage")}
    							primary={true}
    							onClick={this.openHrmsDialog}
    						/>
    					</div>
    					<div className="widget-header-buttons">
    						{expandable ? (
    							<div className="widget-expand-button">
    								<IconButton
    									style={dir == "rtl" ? { paddingLeft: 0, width: "auto" } : { paddingRight: 0, width: "auto" }}
    									onClick={this.handleExpand}
    								>
    									<Expand />
    								</IconButton>
    							</div>
    						) : null}
    					</div>
    				</div>
    				<div className="widget-content">

    					{checkEquipmentData ?
    						<WidgetTable WidgetType="equipments" tableData={settings.equipments} expanded={expanded} dir={dir}/>
    						:
    						<Typography
    							style={{ padding: 12 }}
    							component="p"
    							align="center"
    							variant="caption"
    						>
    							<Translate value="global.profiles.widgets.hrms.equipmentsWidget.noEquipment"/>
    						</Typography>}
    				</div>

    			</div>

    		</div>
    	);
    }
}

EquipmentWidget.propTypes = propTypes;
EquipmentWidget.defaultProps = defaultProps;

export default EquipmentWidget;