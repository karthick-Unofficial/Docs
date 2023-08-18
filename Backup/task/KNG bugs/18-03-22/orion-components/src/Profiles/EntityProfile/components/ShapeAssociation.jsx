import React, { Component } from "react";
import PropTypes from "prop-types";

import { Dialog } from "../../../CBComponents";
import { Translate, getTranslation } from "orion-components/i18n/I18nContainer";


export default class ShapeAssociation extends Component {

    handleClose = () => {
    	const { closeDialog } = this.props;

    	closeDialog("shape-association");
    }

    render() {
    	const {open, dialogData, dir} = this.props;
        
    	let rules;
    	const styles = {
    		body: {
    			textAlign: "left",
    			margin: "15px"
    		},
    		rule: {
    			paddingTop: "12px"
    		},
    		bodyRTL: {
    			textAlign: "right",
    			margin: "15px"
    		}
    	};

    	// Prevent null pointer
    	if (open) {
    		rules = dialogData.rules;
    	}
		
    	return(
    		<Dialog
    			key="shape-association"
    			open={open}
    			confirm={{
    				label: getTranslation("global.profiles.entityProfile.shapeAssoc.ok"),
    				action: this.handleClose
    			}}
    		>
    			{open && dialogData.action === "delete"
    				? <React.Fragment>
                    	<div className="cb-font-b3" style={dir == "rtl" ? styles.bodyRTL : styles.body}>
                    		<p style={{fontWeight: "bold"}}><Translate value="global.profiles.entityProfile.shapeAssoc.cannotDelete" /></p>
    						{rules && rules.map((item, idx) => {
    							return <p style={styles.rule} key={idx}>{item}</p>;
    						})}
                    	</div>
    				</React.Fragment>
    				: <div />
    			}
    			{open && dialogData.action === "hide"
    				? <React.Fragment>
                    	<div className="cb-font-b3" style={dir == "rtl" ? styles.bodyRTL : styles.body}>
                    		<p style={{fontWeight: "bold"}}><Translate value="global.profiles.entityProfile.shapeAssoc.cannotBeHidden" /></p>
    						{rules && rules.map((item, idx) => {
    							return <p style={styles.rule} key={idx}>{item}</p>;
    						})}
                    	</div>
    				</React.Fragment>
    				: <div />
    			}
    		</Dialog>
    	);
    }
}

ShapeAssociation.propTypes = {
	dialog: PropTypes.string,
	dialogData: PropTypes.any
};