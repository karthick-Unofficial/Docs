import React from "react";
import PropTypes from "prop-types";
import CancelIcon from "@material-ui/icons/Cancel";
import InfoIcon from "@material-ui/icons/Info";
import { Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

const styles = {
	flexContainer: {
	  paddingTop: 10,
	  paddingLeft: 5,
	  display: "flex",
	  background: "transparent"
	}
};

const propTypes ={
	description: PropTypes.string,
	onClose: PropTypes.func.isRequired
};

const PlayerNotification = (props) => {
	const {description, onClose} = props;
	
	return (
		<div className="playerNotificationContainer">
			<div style={{width:25, margin:10, alignSelf: "center"}}>
				<InfoIcon style={{textAlign: "center", width:20, height:20}} />
			</div>
			
			<Typography variant="body1" className="b2-white" style={{margin:10, width: "100%", textAlign:"left"}}>{description}</Typography>
			
			<div style={{width:25, margin:10}}>
				<CancelIcon style={{textAlign:"center", width:20, height:20, cursor:"pointer"}} onClick={onClose}/>
			</div>
		</div>
	);
};

PlayerNotification.propTypes = propTypes;

export default withStyles(styles)(PlayerNotification);




