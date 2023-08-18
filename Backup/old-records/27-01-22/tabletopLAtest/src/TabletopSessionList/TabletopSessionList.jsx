import React, { useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { Container } from "@material-ui/core";
import ErrorBoundary from "../shared/components/ErrorBoundary";
import CreateSessionContainer from "./CreateSession/CreateSessionContainer";
import JoinActiveSessionContainer from "./JoinActiveSession/JoinActiveSessionContainer";
import SessionLoadProgressContainer from "./SessionLoadProgress/SessionLoadProgressContainer";
import SessionLibraryContainer from "./SessionLibrary/SessionLibraryContainer";
import UserMappingsContainer from "./UserMappings/UserMappingsContainer";
import * as utilities from "../shared/utility/utilities";

const propTypes = {
	isHydrated: PropTypes.bool.isRequired,
	user: PropTypes.object.isRequired,
	subscribeSessions: PropTypes.func.isRequired,
	showUserMappings: PropTypes.bool.isRequired,
	activeSession: PropTypes.object,
	allSessionsLoaded: PropTypes.bool.isRequired,
	dir: PropTypes.string
};

const TabletopSessionList = ( { isHydrated, user, subscribeSessions, showUserMappings, activeSession, allSessionsLoaded, dir } ) => {
	
	useEffect(() => {
		if (isHydrated) {
			subscribeSessions();
		}
	}, [isHydrated, subscribeSessions]);

	const canManage = utilities.canManage(user.profile);

	const flexBasisCreate = canManage && activeSession ? "50%" : (canManage ? "100%" : "0%");
	const flexBasisJoin = canManage && activeSession ? "50%" : (!canManage ? "100%" : "0%");
	const margin = canManage && activeSession ? "15px" : "0px";

	return isHydrated ? (
		<ErrorBoundary componentName="tabletopSessionList">
			{!showUserMappings && 
				<div>
					<Container>
						<div style={{width: "100%", display: "flex", flexDirection: "row"}}>
							{
								canManage && 
									<div style={dir == "rtl" ? {marginLeft: `${margin}`, flexBasis: `${flexBasisCreate}`} : {marginRight: `${margin}`, flexBasis: `${flexBasisCreate}`}}>
										<CreateSessionContainer /> 
									</div>
							}
							<div style={dir == "rtl" ? {marginRight: `${margin}`, flexBasis: `${flexBasisJoin}`} : {marginLeft: `${margin}`, flexBasis: `${flexBasisJoin}`}}>
								<JoinActiveSessionContainer user={user.profile} activeSession={activeSession} dir={dir}/>
							</div>
						</div>
					</Container>
					{
						canManage && allSessionsLoaded &&
							<SessionLibraryContainer canManage={canManage} /> 
					}
					<SessionLoadProgressContainer />
				</div>
			}
			{showUserMappings &&
				<UserMappingsContainer />
			}	
		</ErrorBoundary>
	) : (
		<Fragment />
	);	
};

TabletopSessionList.propTypes = propTypes;
export default TabletopSessionList;