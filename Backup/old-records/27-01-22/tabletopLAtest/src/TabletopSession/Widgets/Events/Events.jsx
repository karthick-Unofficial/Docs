import React, { useEffect, useState, memo } from "react"; 
import _ from "lodash";
import PropTypes from "prop-types";
import { ListItem, ListItemText, IconButton, ListItemIcon } from "@material-ui/core"; // 
import { AccountVoice, Eye, EyeOff, Pin, PinOff, SortAscending, SortDescending } from "mdi-material-ui"; //
import ToggleButton from "@material-ui/lab/ToggleButton";
import EventsFilter from "./EventsFilter";
import * as eventUtilities from "../../../shared/utility/eventUtility";
import TargetingIconContainer from "../../Controls/TargetingIcon/TargetingIconContainer";
import { withStyles } from "@material-ui/core/styles";
import T2SelectControl from "../../../shared/components/T2SelectControl";
import { SearchField } from "orion-components/CBComponents";
import EventTextContainer from "../../Controls/EventText/EventTextContainer";
import TeamIcon from "../../../shared/components/TeamIcon";
import T2DialogBox from "../../../shared/components/T2DialogBox";
import EventSharingContainer from "./EventSharingContainer";
import { AutoSizer, List, CellMeasurer, CellMeasurerCache } from "react-virtualized";

const styles = {
	flexContainer:{
		display: "flex",
		justifyContent: "space-between",
		alignItems:"center",
		background: "transparent",
		minHeight: 45,
		paddingLeft: 5,
		paddingRight: 5,
		width:"100%"
	},

	contentContainer:{
		
		flexBasis: "60%",
		flexWrap: "wrap",
		background: "transparent",
		paddingLeft: 5,
		paddingRight: 5
	},

	leftText: {
		flex: "0 0 120px",
		alignItems: "center",
		marginRight: 12,
		paddingTop: 4,
		paddingLeft: 12,
		fontSize: 12,
		color: "#b5b9be",
		"& span" :{
			fontSize: 12,
			color: "#b5b9be"
		}
	},

	rightText: {
		alignItems: "center",
		paddingTop: 4,
		paddingLeft: 12,
  		fontSize: 12,
		color: "#b5b9be",
		"& span" :{
			fontSize: 12,
			color: "#b5b9be"
		}
	},

	listIcon:{
		minWidth: 30
	},

	listItem: {
		backgroundColor:"#3C4656",
		borderRadius: 5, 
		paddingTop: 10, 
		paddingRight: 10, 
		paddingBottom: 10, 
		marginTop: 5, 
		marginBottom: 5, 
		minHeight:80,
		height: "auto"
	},

	listHeight:{
		minHeight:"calc(100vh - 194px)",
		overflowY: "scroll",
		height: "auto"
	}
};

const propTypes = {
	classes:PropTypes.object.isRequired, 
	events: PropTypes.array,
	newEvents: PropTypes.array,
	eventWidgetSettings: PropTypes.object,
	agents: PropTypes.object,
	simulationData: PropTypes.object,
	sessionId:PropTypes.string,
	simId: PropTypes.number,
	userMappings:PropTypes.array,
	userInfo: PropTypes.object,
	userHasCommDevices: PropTypes.bool,
	simTimePrecision: PropTypes.number,
	updatePersistedState: PropTypes.func.isRequired,
	createCommunication: PropTypes.func.isRequired,
	useLocalState: PropTypes.func.isRequired
};
const cache = new CellMeasurerCache({
	fixedWidth: true,
	minHeight:80,
	defaultHeight: "auto",
	fixedHeight: false
});

const Events = ({ classes, events, newEvents, eventWidgetSettings, agents, simulationData, sessionId, simId, userMappings, userInfo, userHasCommDevices, simTimePrecision, updatePersistedState, createCommunication, useLocalState}) => {
	//const [openEventFilter, setOpenEventFilter] = useState(true);
	const [filteredEvents, setFilteredEvents] = useState([]);
	const [pinFlag, setPinFlag] = useLocalState("pinFlag", false);
	const [teamSelected, setTeamSelected] = useLocalState("teamSelected", { blueTeam: true, redTeam: true});
	const [searchValue, setSearchValue] = useLocalState("searchValue", "");
	const [hoverFlag, setHoverFlag] = useState(false);
	const [sortAsc, setSortAsc]  =useLocalState("sortAsc", false); // By default, sort by effective time in descending order
	const [openSharing, setOpenSharing] = useState(false);
	const [eventToShare, setEventToShare] = useState(null);

	const selectedEventClassifications = {};

	const getInitialEventSettingsWithCount = () =>{
		
		let eventConfig = _.cloneDeep(eventWidgetSettings);
		if (!eventConfig) {
			eventConfig = eventUtilities.createDefaultObject(true);
		}

		_.keys(eventConfig).forEach(team => {
			eventConfig[team]["all"] = {flag: false, count: 0};
			
			selectedEventClassifications[team]= [];

			let flagTemp = true;
			_.map(eventConfig[team], (val, eventType) => {
				if (eventType !== "all"){
					eventConfig[team][eventType] = {flag: val, count: 0};
					
					if (val){
						selectedEventClassifications[team].push(eventType.toLowerCase());
					} else {
						flagTemp = false;
					}
				}
			});

			eventConfig[team]["all"] = {flag: flagTemp, count: 0};
		});

		return eventConfig;

	};

	const [eventSettingsWithCount, setEventSettingsWithCount] = useState(getInitialEventSettingsWithCount());

	useEffect(() => {
		//Note: for each category compute total count (Search is not taken into consideration)  
		let eventConfig = getInitialEventSettingsWithCount();
		if (events.length>0){
			events.forEach(ev => {
			   if (ev.displayInEventList){
					const team = ev.getTeam(simulationData);
					const valTemp =eventConfig[team][ev.classification];
					valTemp.count = valTemp? valTemp.count + 1:  0;
					eventConfig[team][ev.classification] = valTemp;

					//For all Count
					const allTemp =eventConfig[team]["all"];
					allTemp.count = allTemp? allTemp.count + 1:  0;
					eventConfig[team]["all"] = allTemp;
			   }
			});
			
		}
		
		setEventSettingsWithCount(eventConfig);
	}, [ events, eventWidgetSettings ]);

	//const [eventSettingsWithCount, setEventSettingsWithCount] = useState(getEventSettingsWithCount());

	const getEventSettingForModification = () =>{
		return _.cloneDeep(eventSettingsWithCount);
	}; 

	const getSortByList = ()=> {
		const itemsArray =[];
		itemsArray.push({id: "", name: "Sort by"});
		itemsArray.push({id: "effectiveTime", name: "Time"});
		itemsArray.push({id: "subject", name: "Subject"});
		itemsArray.push({id: "opponent", name: "Opponent"});
		itemsArray.push({id: "cause", name: "Cause"});
		return itemsArray;
	};

	const [sortBy, setSortBy] = useLocalState("sortBy", getSortByList()[1].id);
	
	// useEffect(()=>{
	// 	setEventSettingsWithCount(getEventSettingsWithCount());

	// }, [ eventWidgetSettings, agents, simulationData, events ]);


	const getSortBy = (sortBy, event)=> {
		let valSort = "";
		switch (sortBy) {
			case "effectiveTime":
				valSort = event.effectiveTime;
				break;
			case "subject":
				valSort = event.getSubject(agents, simulationData);
				break;
			case "opponent":
				valSort = event.getOpponent(agents);
				break;
			case "cause":
				valSort = event.cause;
				break;
			default:
				valSort = event.effectiveTime;
				break;
		}
		
		return valSort;
		
	};

	const handleSearch = (event) => {
		const valueSearch = event ? event.target.value : "";
		setSearchValue(valueSearch);
	};
	
	const handleSortIconclick = () => {
		setSortAsc(!sortAsc);
	};

	const handleSortBy = (sortKey) => {
		setSortBy(sortKey);
	};

	const handleOnMouseEnter = () =>{
		if (!pinFlag && !hoverFlag){
			setHoverFlag(true);
		}
	};

	const handleOnMouseLeave = () =>{
		if (!pinFlag && hoverFlag){
			setHoverFlag(false);
		}
	};

	const handleTeamclick = (e) =>{
		if (e.currentTarget.value === "blue"){
			const newValue = {...teamSelected, blueTeam: !teamSelected.blueTeam};
			setTeamSelected(newValue);
		}

		if (e.currentTarget.value === "red"){
			const newValue = {...teamSelected, redTeam: !teamSelected.redTeam};
			setTeamSelected(newValue);
		}
	};
	
	const handlePinclick = () =>{
		setPinFlag(!pinFlag);
	};

	const handleSave = (currentEventSettings)=> {
		updatePersistedState("tabletop-app", "eventWidgetSettings", currentEventSettings);
	};
	
	const isNewEvent =(event) => {
		return (newEvents && newEvents.length> 0) ? newEvents.includes(event) : false;
	};

	const filterBasedonEventClassification = (ev) =>{

		let retFlag = false;
		const team = ev.getTeam(simulationData);
		if (team === "BLUE" && teamSelected.blueTeam && selectedEventClassifications["BLUE"].includes(ev.classification.toLowerCase())){
			retFlag = true;
		} 
		else if (team === "RED" && teamSelected.redTeam && selectedEventClassifications["RED"].includes(ev.classification.toLowerCase())){
			retFlag = true;	
		}

		return retFlag;
	};

	useEffect(() => {
		if (!teamSelected.blueTeam && !teamSelected.redTeam){
			setFilteredEvents([]);
			return;
		}

		let retEvents= [];
		if (events && events.length > 0){
			retEvents = events.filter( ev =>{
				try {
					if (ev.displayInEventList && filterBasedonEventClassification(ev)){
						//Then Filter based on search
						if (!searchValue || !(searchValue.trim())){
							return true;
						} else {
							return ev.getDescription(agents, simulationData, simTimePrecision).toLowerCase().includes(searchValue.toLowerCase());
						}
					}
					return false;
				} catch (error) {
					console.log(error);
				}
			});

			//todo: Please refactor again 
			if (sortBy === "effectiveTime"){
				//retEvents = retEvents && (retEvents.length>0) && _.orderBy(retEvents, "effectiveTime", "desc") || [];
				// For descending sorts, we want equal elements to be reversed in position, so we always sort in 
				// ascending order and then reverse the array if we want descending order.
				retEvents = retEvents.sort((a, b) => (a.effectiveTime - b.effectiveTime));
				if (!sortAsc) {
					retEvents.reverse();
				}
			} 
			else{
				// retEvents = retEvents && (retEvents.length>0) && _.sortBy(retEvents, (e) => {
				// 	return getSortBy(sortBy, e); // todo: Desc or Asc
				// })|| [];
				retEvents = retEvents.sort((a, b) => {
					//return (getSortBy(sortBy, a) - getSortBy(sortBy, b));
					let xVal = getSortBy(sortBy, a);
					if (!xVal) {
						xVal = "";
					}
					let yVal = getSortBy(sortBy, b);
					if (!yVal) {
						yVal = "";
					}
					const x = xVal.toLowerCase();
					const y = yVal.toLowerCase();
					
					if (x < y) {return (sortAsc ? -1: 1);}
					if (x > y) {return (sortAsc ? 1: -1);}
					
					return 0;
				});
			}
		}

		setFilteredEvents(retEvents);
	}, [ events, eventWidgetSettings, teamSelected, sortBy, sortAsc, searchValue ]);

	const canShareEvent = (event) =>{
		if (!event.canShare){
			return false;
		}

		if (userInfo.isFacilitator){
			return true;
		}

		return userHasCommDevices;

		////todo: If event is already shared using all devices then disabled
		// communications.forEach(comm => {
		// 	if (comm.type === "AVERT_EVENT"){
		// 		if (!isFacilitator() && comm.commDevices.includes(id)){
		// 			
		// 		} else if (isFacilitator() && comm.toIds.includes(id)){
		// 			
		// 		}
		// 	}
		// });
	};

	const handleOpenSharing = (event) => {
		setEventToShare(event);
		setOpenSharing(true);
	};

	const handleShareEvent = (shareInfo) =>{
		shareInfo.simId = simId;

		try {
			createCommunication(sessionId, shareInfo);	
		} catch (error) {
			console.log("error occurred submitting equipment communication.");			
		}

		handleClose();
	};

	const handleClose = () => {
		setEventToShare(null);
		setOpenSharing(false);
	};

	let _currSelfAgent = null;
	const getSelfAgent = () =>{
		
		if (_currSelfAgent){
			return _currSelfAgent;
		}
		
		if (userInfo.isFacilitator){
			return null;
			//console.log("uncomment isFacilitator");
		}

		const usermapInfo = userMappings && _.find(userMappings, (u)=> {
			return (u.userId === userInfo.userId);
		});

		let selfAgentId = (usermapInfo && usermapInfo.selfAgentIds[0]) || 0;

		if (selfAgentId === 0){
			return null;

			//todo: comment becoz its was required for testing comm devices
			//_currSelfAgent = (agents)? agents[userMappings[0].selfAgentIds[0]]: null;
		}
		else {
			_currSelfAgent = agents && agents.hasOwnProperty(selfAgentId)? agents[selfAgentId]: null;
		}

		return _currSelfAgent;
	};

	return (
		<div>
			{
				<div className={classes.flexContainer} style={{marginBottom: 20}}>
					<div className={classes.flexContainer} style={{justifyContent: "flex-start", marginLeft: -15, marginTop: -3, marginBottom: 5}}>
						<div style={{marginLeft: -25}}>
							<T2SelectControl labelText="" width="150px" items={getSortByList()} 
								selectedValue={sortBy} handleChange= {handleSortBy}/>
						</div>
						
						<div>
							<ToggleButton value="sort" aria-label="sort" onClick={handleSortIconclick} 
								style={{ marginLeft:-15, marginTop:15, color: "white", border:"none" }}>
								{!sortAsc && <SortAscending style={{width: 22, height: 20}} className="b2-white"/>}
								{sortAsc && <SortDescending style={{width: 22, height: 20}} className="b2-white"/>}
							</ToggleButton>
						</div>
					</div>
					<div style={{width: 275, marginLeft:-40, marginRight:-15}}> <SearchField value={searchValue} placeholder="Search Events.."
						handleChange={handleSearch} handleClear={() => handleSearch("")}/></div>
				</div>
			}
			{	
				<div onMouseEnter={handleOnMouseEnter} onMouseLeave={handleOnMouseLeave} style={{backgroundColor:"#3C4656", borderRadius: 5, marginBottom: 5 }}>
					<div className={classes.flexContainer}>
						<ToggleButton value="blue" aria-label="blue" onClick={handleTeamclick} 
							style={{ marginRight:10, color: teamSelected.blueTeam? "white": "#3C4656", border:"none" }}>
							{teamSelected.blueTeam && <Eye style={{width: 22, height: 20}} className="b2-white"/>}
							{!teamSelected.blueTeam && <EyeOff style={{width: 22, height: 20}} className="b2-white"/>}
							
							<div style={{marginLeft: 10}}>
								<TeamIcon team={"BLUE"}/>
							</div>

							<div className={classes.contentContainer} style={{cursor:"pointer", marginLeft: 5}}>
								<div className="b1-white" style={{textTransform: "none"}}>Blue Team</div>
								<div className="b2-bright-gray" style={{textTransform: "none"}}>{eventSettingsWithCount["BLUE"]["all"].count + " Events"}</div>
							</div>
						</ToggleButton>
						<ToggleButton value="red" aria-label="red" onClick={handleTeamclick}
							style={{ marginLeft:10, color: teamSelected.redTeam? "white": "#3C4656", border:"none"}}>
							{teamSelected.redTeam && <Eye style={{width: 22, height: 20}} className="b2-white"/>}
							{!teamSelected.redTeam && <EyeOff style={{width: 22, height: 20}} className="b2-white"/>}
							
							<div style={{marginLeft: 10}}>
								<TeamIcon team={"RED"}/>
							</div>
							<div className={classes.contentContainer} style={{cursor:"pointer", marginLeft: 10}}>
								<div className="b1-white" style={{textTransform: "none"}}>Red Team</div>
								<div className="b2-bright-gray" style={{textTransform: "none"}}>{eventSettingsWithCount["RED"]["all"].count + " Events"}</div>
							</div>
						</ToggleButton>
						<ToggleButton value="pin" aria-label="pin" onClick={handlePinclick}
							style={{ marginLeft:20, color: "white", border:"none", visibility: (pinFlag || hoverFlag)? "visible": "hidden"}}>
							{pinFlag && <Pin style={{width: 22, height: 20}} className="b2-white"/>}
							{!pinFlag && <PinOff style={{width: 22, height: 20}} className="b2-white"/>}
						</ToggleButton>
					</div>
					{
						(pinFlag || hoverFlag) && <EventsFilter eventConf={getEventSettingForModification()} saveFilters={handleSave}/>
					}
				</div>
			}

			<div style={{overflowY: "scroll", height: pinFlag ? "calc(100vh - 566px)" : "calc(100vh - 194px)", width:"100%"}}>
				<AutoSizer>
					{({height, width}) => (
						<List 
							className="virtualized-notification-list"
							deferredMeasurementCache={cache}
							rowCount={filteredEvents.length}
							width= {width} 
							height={height} 
							rowHeight = {cache.rowHeight}
							overscanRowCount = {6}
							rowRenderer = {({ index, key, parent, style }) => {
								const event = filteredEvents[index];
								return (
									<CellMeasurer
										key={key}
										cache={cache}
										parent={parent}
										columnIndex={0}
										rowIndex={index}
									>
										{agents && events && events.length > 0 && events.includes(event) &&
											<div style={style} id={`event-${filteredEvents[index].event.id}`}>
												<ListItem style={styles.listItem}  key={"fkey" + index}>
													{ 
														// isNewEvent(evtObj.event.id) && <ListItemText primary={<div className="newEventBar" style={{height:"100%"}}></div>}/>
														isNewEvent(event) && <div className="newEventBar"></div>
													}			
													<ListItemIcon>
														<TargetingIconContainer 
															entities={agents && event.getEntityTargets(agents, simulationData) || []} 
															geometries={event.getGeometryTargets() || []}/>
													</ListItemIcon>
													<ListItemText
														primary={<span className="dot" style={{backgroundColor: event.getTeam(simulationData) == "BLUE"? "#2653B2": "#C2342A"}}></span>}
													/>
													<ListItemText style={styles.rightText}
														primary={
															<div className={classes.contentContainer}>
																<div className="b1-white">{
																	<EventTextContainer eventData={event.getData(agents, simulationData)}/>
																}</div>
															</div>
														}/>
													<ListItemIcon style={styles.listIcon}>
														<div>
															<IconButton aria-label="voice" style={{flexBasis:"15%", visibility: canShareEvent(event) ? "visible": "hidden"}} 
																onClick={()=>handleOpenSharing(event)}>
																<AccountVoice style={{width: 22, height: 20, marginTop:5}} className="b2-white"/>
															</IconButton>
														</div>
													</ListItemIcon>
												</ListItem>
											</div>
										}
									</CellMeasurer>
								);
							}}
						/>	
					)}
				</AutoSizer>
			</div>
			{
				eventToShare && <T2DialogBox
					open= {openSharing}
					onClose={handleClose}
					headline="Share Event Information to Team"
					submitlabel={"Notify"}
					handleSubmit={handleShareEvent}
					content={
						<EventSharingContainer eventInfo={eventToShare} selfAgent={getSelfAgent()} onClose={handleClose} shareEvents={handleShareEvent}/>
					}
				/>
			}
		</div>
	);
};

Events.propTypes = propTypes;
export default memo(withStyles(styles)(Events), (prevProps, nextProps) => {
	if (prevProps.events !== nextProps.events || prevProps.eventWidgetSettings !== nextProps.eventWidgetSettings) {
		return false;
	}
	return true;
});