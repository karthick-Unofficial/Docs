import React from "react";
import PropTypes from "prop-types";
import { LinearProgress } from "@material-ui/core";
import { Dialog } from "orion-components/CBComponents";
import { makeStyles } from "@material-ui/core/styles";
import { Translate } from "orion-components/i18n/I18nContainer";

const styles= {
	progressBarDialog:{
		backgroundColor: "#41454a",
		padding: 15,
		width: 528,
		height: 188,
		minHeight: 188,
		borderRadius: 0
	}
};

const useStyles = makeStyles({
	progressBarContent: {
		marginTop: 30,
		marginLeft: 25,
		width: 399,
		height: 44,
		background: "transparent",
		"& div:first-child": {
			height: 14,
			marginTop:-1,
			marginBottom:5,
			paddingLeft:1,
			paddingRight:1,
			display: "flex",
			justifyContent: "space-between",
			"& span": {
				fontSize: 15,
				color: "#828283"
			}
		}
	},
	progressBarContentBar: {
		padding:0,
		height: 15,
		width: 399,
		background: "#393939",
		"& div": {
			background: "#21B6FA"
		}
	}
});

const propTypes = {
	sessionToLoad: PropTypes.object,
	dir: PropTypes.string
};

const SessionLoadProgress = ( { sessionToLoad, dir } ) => {
	const classes = useStyles();

	return (sessionToLoad && sessionToLoad.initializing && !sessionToLoad.simulationData 
		&& sessionToLoad.avertLoadProgressPct < 100) ? 
		(
			<Dialog 
				open={true} 
				paperPropStyles={styles.progressBarDialog}
				dir={dir}>
				<div className={classes.progressBarContent}>
					<div>
						<span><Translate value="tableopsessionList.loadprogress.loading" /></span> 
						<span>{`${sessionToLoad.avertLoadProgressPct}%`}</span> 
					</div>
					<LinearProgress className={classes.progressBarContentBar} variant="determinate" value={sessionToLoad.avertLoadProgressPct} />	
				</div>
			</Dialog>
		) : null;
};

SessionLoadProgress.propTypes = propTypes;
export default SessionLoadProgress;