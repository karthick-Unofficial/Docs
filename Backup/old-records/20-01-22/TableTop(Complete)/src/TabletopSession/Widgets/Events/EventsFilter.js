import React from "react";
import PropTypes from "prop-types";
import { FormControlLabel, ListItem, List } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import T2CheckBox from "../../../shared/components/Checkbox";
import * as eventUtilities from "../../../shared/utility/eventUtility";
import _ from "lodash";

const styles = {
	flexContainer: {
	  borderRadius: 5,
	  paddingTop: 10,
	  paddingLeft: 5,
	  display: "flex",
	  background: "transparent"
	},

	dialogActions: {
		display: "flex",
		justifyContent: "flex-end",
		paddingTop: 50,
		paddingBottom: 20,
		paddingRight: 10,
		background: "#414449"
	}
};

const propTypes = {
	classes: PropTypes.object.isRequired,
	eventConf: PropTypes.object.isRequired,
	saveFilters: PropTypes.func.isRequired
};

const EventsFilter = (props) => {
	const {classes, eventConf, saveFilters} = props;
	
	const onChange = (event, teamSelection) =>{
		const currEventConf = eventConf;
		currEventConf[teamSelection][event.target.name].flag = event.target.checked;
		
		saveFilters(createSettingsToSave(currEventConf));
	};

	const allEventTypesSelected = (event, teamSelection ) => {

		const currEventConf = eventConf;
		
		_.map(currEventConf[teamSelection], (value, eventCat) => {
			currEventConf[teamSelection][eventCat].flag = event.target.checked;
		});

		saveFilters(createSettingsToSave(currEventConf));
	};

	const createSettingsToSave = (curEvntConfig) =>{
		_.map(curEvntConfig, (value, team) => {
			_.map(curEvntConfig[team], (value, eventCat) => {
				curEvntConfig[team][eventCat] = value.flag;
			});
			delete curEvntConfig[team]["all"];
		});

		return curEvntConfig;
	};

	return (
		<div className={classes.flexContainer} style={{flexDirection: "row", backgroundColor:"#3C4656", marginTop:0}}>
			{
				_.map(eventConf, (teamVal, team) => {
					return (
						<div style={{width: "50%"}} key={"div" + team}>
							<List key={"list" + team}>
								<ListItem style={{paddingTop: 0, paddingRight: 2, paddingBottom: 0, marginTop: 0, marginBottom: 0}} key={`eckey + ${team} + all`}>
									<FormControlLabel key={`${team}-all`}
										style={{width: 170}}
										control={
											<T2CheckBox 
												checked={eventConf[team]["all"].flag} 
												onChange={(e) => allEventTypesSelected(e, team)} 
												name={`${team}-all`}
											/>
										}
										label={`(${eventConf[team]["all"].count}) All`}
									/>
								</ListItem>
								{
									eventUtilities.getEventClassifications().map((ec, index) => {
										if (teamVal.hasOwnProperty(ec.classification)) {
											return (
												<ListItem style={{paddingTop: 0, paddingRight: 10, paddingBottom: 0, marginTop: 0, marginBottom: 0}} key={"eckey"+ team + index}>
													<FormControlLabel
														style={{marginTop: 10}}
														control={
															<T2CheckBox key={team + "_" + ec.classification} name={ec.classification} 
																checked={teamVal[ec.classification].flag} 
																onChange={(e) => onChange(e, team)}/>
														}
														label={`(${teamVal[ec.classification].count}) ${ec.description}`}
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

EventsFilter.propTypes = propTypes;
export default withStyles(styles)(EventsFilter);

