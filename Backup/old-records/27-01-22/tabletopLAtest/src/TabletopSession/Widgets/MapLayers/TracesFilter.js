import React from "react";
import PropTypes from "prop-types";
import { FormControlLabel, ListItem, List, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import Switch from "../../../shared/components/Switch";
import * as eventUtilities from "../../../shared/utility/eventUtility";
import { mapTraceConfig } from "../../MapTraces/mapTraceConfig";
import { iconConfig } from "../../../shared/iconConfig";
import TeamIcon from "../../../shared/components/TeamIcon";
import _ from "lodash";

const styles = {
	flexContainer: {
	  paddingTop: 10,
	  paddingLeft: 5,
	  display: "flex",
	  background: "transparent"
	}
};

const propTypes = {
	classes: PropTypes.object.isRequired,
	eventConf: PropTypes.object.isRequired,
	teamsConfig: PropTypes.object.isRequired,
	saveFilters: PropTypes.func.isRequired
};

const TracesFilter = (props) => {
	const {classes, eventConf, teamsConfig, saveFilters} = props;
	
	const onChange = (event, teamSelection) =>{
		const currEventConf = eventConf;
		currEventConf[teamSelection][event.target.name] = event.target.checked;
		
		saveFilters(createSettingsToSave(currEventConf));
	};

	const allEventTypesSelected = (event, teamSelection ) => {

		const currEventConf = eventConf;
		
		_.map(currEventConf[teamSelection], (value, eventCat) => {
			currEventConf[teamSelection][eventCat] = event.target.checked;
		});

		saveFilters(createSettingsToSave(currEventConf));
	};

	const createSettingsToSave = (curEvntConfig) =>{
		_.map(curEvntConfig, (value, team) => {
			_.map(curEvntConfig[team], (value, eventCat) => {
				curEvntConfig[team][eventCat] = value;
			});
			delete curEvntConfig[team]["all"];
		});

		return curEvntConfig;
	};

	return (
		<div className={classes.flexContainer} style={{flexDirection: "row", marginTop:0}}>
			{
				_.map(eventConf, (teamVal, team) => {
					return (
						<div style={{width: "50%"}} key={"div" + team}>
							<List key={"list" + team}>
								
								<ListItem style={{paddingTop: 0, paddingRight: 2, paddingBottom: 0, marginTop: 0, marginBottom: 10}} key={`eckey + ${team} + traces`}>
									<TeamIcon team={team}/> <Typography variant="body1" className="b1-white" style={{marginLeft:10}}>{`${team.charAt(0).toUpperCase()}${team.substring(1).toLowerCase()} Team Traces`}</Typography>
								</ListItem>
								<ListItem style={{paddingTop: 0, paddingRight: 2, paddingBottom: 0, marginTop: 0, marginBottom: 0}} key={`eckey + ${team} + all`}>
									<FormControlLabel key={`${team}-all`}
										style={{width: 170}}
										control={
											<Switch checked={eventConf[team]["all"]}
												onChange={(e) => allEventTypesSelected(e, team)} 
												name={`${team}-all`} />
										}
										label={<Typography variant="body1" className="b1-white" style={{marginLeft:10}}>All</Typography>}
									/>
								</ListItem>
								{
									eventUtilities.getEventClassifications().map((ec, index) => {
										if (teamVal.hasOwnProperty(ec.classification) && ec.traces && ec.teams.includes( team.toUpperCase())) {
											return (
												<ListItem style={{paddingTop: 0, paddingRight: 10, paddingBottom: 0, marginTop: 0, marginBottom: 0}} key={"eckey"+ team + index}>
													<FormControlLabel
														style={{marginTop: 10}}
														control={
															<Switch key={team + "_" + ec.classification} name={ec.classification} 
																checked={teamVal[ec.classification]} 
																onChange={(e) => onChange(e, team)} />
														}
														label={
															<div 
																style={{ 
																	display: "flex", 
																	flexDirection: `${mapTraceConfig[ec.classification].featureType === "Point" ? "row" : "column"}`, 
																	alignItems: `${mapTraceConfig[ec.classification].featureType === "Point" ? "center" : "start"}` 
																}} 
															>
																{mapTraceConfig[ec.classification].featureType === "Point" &&
																	<img style={{marginLeft: 10, height: 17, width: 17}} src={iconConfig[`${team}_${ec.classification}`]} />
																}
																<Typography variant="body1" className="b1-white" style={{marginLeft:10}}>{ec.description}</Typography>
																{mapTraceConfig[ec.classification].featureType === "LineString" &&
																	<svg width={103} height={5} viewBox="0 0 103 5">
																		<line stroke={teamsConfig[team].iconColor} strokeWidth={2} 
																			strokeDasharray={mapTraceConfig[ec.classification].dasharray} 
																			x1={10} y1={4} x2={103} y2={4} />
																	</svg>
																}
															</div>
														}
													/>
												</ListItem>
											);
										} else {
											return null;
										}
									})

								}
							</List>
						</div>
					);
				})
			}
		</div>
	);
};

TracesFilter.propTypes = propTypes;
export default withStyles(styles)(TracesFilter);

