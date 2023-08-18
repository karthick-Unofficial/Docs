import React, { useEffect, useState, Fragment } from "react";
import PropTypes from "prop-types";
import { Button, Container } from "@material-ui/core";
import ExerciseContainer from "../../shared/components/ExerciseContainer";
import HeaderContainer from "../../shared/components/HeaderContainer";
import { CubeScan } from "mdi-material-ui";
import { makeStyles } from "@material-ui/core/styles";
import * as utilities from "../../shared/utility/utilities";
import { Translate } from "orion-components/i18n/I18nContainer";


const styles = {
	icons: {
		color: "white",
		marginRight: 15,
		marginTop: 25,
		fontSize: "48px"
	},
	button: {
		minHeight:"41px",
		width:"258px"
	},
	iconsRTL: {
		color: "white",
		marginLeft: 15,
		marginTop: 25,
		fontSize: "48px"
	},
};

const useStyles = makeStyles({
	flexContainer:{
		display: "flex",
		flexDirection: "column",
		flexWrap:"wrap",
		minHeight: "330px"
	},
	flexContainerCenterAlign:{
		display: "flex",
		flexDirection: "column",
		flexWrap:"wrap",
		alignItems:"center",
		justifyContent:"space-between"
	}
});

const propTypes = {
	user: PropTypes.object.isRequired,
	activeSession: PropTypes.object,
	resumeSession: PropTypes.func.isRequired,
	joinSession: PropTypes.func.isRequired,
	dir: PropTypes.string
};

const JoinActiveSession = ( { user, activeSession, resumeSession, joinSession, dir } ) => {
	const [isController, setIsController] = useState(false);
	const [canJoin, setCanJoin] = useState(false);
	const [canManage] = useState(utilities.canManage(user));

	const resumeOrJoinSession = () => {
		if (isController) {
			resumeSession(activeSession);
		} else {
			joinSession(activeSession);
		}
	};

	useEffect(() => {
		if (activeSession) {
			const isControllerUser = activeSession.controller === user.id;
			const isFacilitator = activeSession.facilitator === user.id;
			const isParticipant = !isController && !isFacilitator && Boolean(activeSession.userMappings 
				&& activeSession.userMappings.find(userMapping => userMapping.userId === user.id));
			const canJoinExercise = isControllerUser || isFacilitator || isParticipant;
			setIsController(isControllerUser);
			setCanJoin(canJoinExercise);

			if (!canManage && canJoinExercise) {
				resumeOrJoinSession(activeSession); // Auto-join session
				return;
			} 
		} else {
			setIsController(false);
			setCanJoin(false);
		}
	}, [user, activeSession]);

	const classes = useStyles();

	if (!activeSession){
		if (canManage){
			return null;
		} else {
			return (
				<Fragment>
					<HeaderContainer
						headerTitle={<Translate value="tableopsessionList.joinActive.title" />}
						headerDescription={<Translate value="tableopsessionList.joinActive.desc" />}
						dir={dir}>
					</HeaderContainer>
					<ExerciseContainer 
						headerTitle=""
						headerDescription=""
						dir={dir}>
						<Container className={ classes.flexContainerCenterAlign}>
							<CubeScan style={dir == "rtl" ? styles.iconsRTL : styles.icons}/>
							<Container className={ classes.flexContainerCenterAlign} style={{marginTop:48, marginBottom: 48, paddingTop:22, paddingBottom:22}}>
								<h5 style={{color: "white", fontSize:18}}><Translate value="tableopsessionList.joinActive.alert" /></h5>
							</Container>
						</Container>
					</ExerciseContainer>
				</Fragment>
			);
		}
	}

	return (
		<Fragment>
			<HeaderContainer
				headerTitle={<Translate value="tableopsessionList.joinActive.title" />}
				headerDescription={isController ? <Translate value="tableopsessionList.joinActive.enterLoaded" /> :
				<Translate value="tableopsessionList.joinActive.enterToView" /> }
				dir={dir}>
			</HeaderContainer>
			<ExerciseContainer 
				headerTitle=""
				headerDescription=""
				dir={dir}>
				<Container className={ classes.flexContainerCenterAlign}>
					<CubeScan style={dir == "rtl" ? styles.iconsRTL : styles.icons}/>
					<Container className={ classes.flexContainerCenterAlign} style={{marginTop:48, marginBottom: 48, paddingTop:22, paddingBottom:22}}>
						<div className="b2-bright-gray" style={{fontSize: 14}}><Translate value="tableopsessionList.joinActive.simulation" /></div>
						<div style={{color: "white"}}>{activeSession.baseSimName}</div>
					</Container>
					{canJoin && 
						<Button style={{...styles.button}} variant="contained" color="primary" onClick={resumeOrJoinSession}>
							<Translate value="tableopsessionList.joinActive.exercise" />
						</Button>
					}
					{!canJoin && 
						<div style={{margin: 12}} className="b1-white"><Translate value="tableopsessionList.joinActive.participant" /></div>
					}
				</Container>
			</ExerciseContainer>
		</Fragment>
	);
};

JoinActiveSession.propTypes = propTypes;
export default JoinActiveSession;