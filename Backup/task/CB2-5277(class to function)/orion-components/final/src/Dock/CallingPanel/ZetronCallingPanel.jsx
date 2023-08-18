import _ from "lodash";
import React, { useState } from "react";
import PropTypes from "prop-types";
import { integrationService } from "client-app-core";
import { TextField } from "material-ui";
import { Button } from "@material-ui/core";
import { GroupSharp, PersonSharp, Search, Phone } from "@material-ui/icons";
import { Translate, getTranslation } from "orion-components/i18n/I18nContainer";

const propTypes = {
	dir: PropTypes.string
};


const operationTypes = {
	SEARCH_CONTACTS: "searchContacts",
	CALL_INDIVIDUAL: "callIndividual",
	CALL_TALKGROUP : "callTalkgroup",
	CALL_RADIO : "callRadio"
};

const disabledStyle = {
	button: {
		width: "100%",
		minWidth: 0,
		height: 50,
		backgroundColor: "#6C6C6E"
	},
	buttonBorder: {
		borderRadius: 5,
		backgroundColor: "#6C6C6E"
	},
	buttonLabel: {
		width: "100%",
		paddingLeft: 9,
		paddingRight: 9,
		textTransform: "none",
		color: "#ffffff"
	}
};

const inputStyle = {
	field: {
		width: "80%",
		border: "1px solid #828283",
		padding: 10,
		minHeight: 45,
		height: 45,
		margin: ".75rem 0",
		backgroundColor: "transparent"
	},
	area: {
		marginTop: 0
	},
	hint: {
		top: 12
	},
	button: {
		width: "100%",
		minWidth: 0,
		height: 50
		
	},
	buttonBorder: {
		borderRadius: 5,
		backgroundColor: "#6C6C6E"
	},
	buttonLabel: {
		width: "100%",
		paddingLeft: 9,
		paddingRight: 9,
		textTransform: "none"
	}
};

const zetronStyles = {
	zetronContainer: {
		overflow:"scroll", 
		height: "calc(100% - 80px)", 
		width: "90%", 
		margin: "auto"
	},
	searchBoxLabel: {
		fontFamily: "roboto", 
		marginTop: "15px"
	},
	searchBoxContainer: {
		marginRight:"-12px", 
		marginTop: "-12px",
		display: "flex",
		flexDirection: "row"
	},
	searchBoxContainerRTL: {
		marginLeft:"-12px", 
		marginTop: "-12px",
		display: "flex",
		flexDirection: "row"
	},
	searchContactButtonContainer: {
		marginLeft: "10px", 
		alignSelf: "center", 
		width: "50px"
	},
	searchContactButtonContainerRTL: {
		marginRight: "10px", 
		alignSelf: "center", 
		width: "50px"
	},
	statusContainer: {
		display: "flex",
		flexDirection: "row",
		margin: "0px",
		padding: "0px"
	},
	statusContainerResultStatus: {
		padding: "0px",
		alignSelf: "center",
		minWidth: "20px",
		marginRight: "10px"
	},
	statusContainerResultStatusRTL: {
		padding: "0px",
		alignSelf: "center",
		minWidth: "20px",
		marginLeft: "10px"
	},
	clearResult: {
		color: "#4DB5F4",
		minWidth: "100px",
		marginLeft: "10px",
		marginRight: "10px",
		cursor: "pointer"
	},
	cancelResult: {
		color: "#4DB5F4",
		minWidth: "100px",
		marginLeft: "10px",
		marginRight: "10px",
		cursor: "pointer"
	},
	resultContainer:{
		width: "100%",
		margin: "5px"
	},
	resultContactContainer: {
		width: "100%",
		height: "60px",
		display: "flex",
		flexDirection: "row",
		justifyContent: "flex-start",
		paddingTop: "08px",
		borderBottom: "1px solid #323843"
	},
	resultIconContainer: {
		width: "32px",
		height: "32px",
		marginTop: "-4px",
		alignSelf: "center"
	},
	resultIcon: {
		width: "32px",
		height: "32px",
		color: "#FFFFFF"
	},
	resultContactInfo: {
		width: "65%",
		display: "flex",
		flexDirection: "column",
		justifyContent: "flex-start",
		marginLeft: "10px"
	},
	resultContactInfoRTL: {
		width: "65%",
		display: "flex",
		flexDirection: "column",
		justifyContent: "flex-start",
		marginRight: "10px"
	},
	resultContactName: {
		height: "24px",
		marginTop: "-12px"
	},
	resultContactNo: {
		height: "24px",
		marginTop: "-6px"
	},
	resultCallButtonContainer: {
		alignSelf: "center",
		marginTop: "-4px"
	}
};

const ZetronCallingPanel = ({dir}) => {
	
	const [contactList, setContactList] = useState([]);
	const [searchField, setsearchField] = useState({name: "", error: ""});
	const [statusInfo, setStatusInfo] = useState({isSearching: false, message:"", errorMessage:""});
	const [cancelSearch, setCancelSearch] = useState(false); // Just dont display the result
	const [callButtonVisibleId, setCallButtonVisibleId] = useState();
	const [translatedText] = useState({
		title: getTranslation("global.dock.callingPanel.title"),
		call: getTranslation("global.dock.callingPanel.call"),
		clear: getTranslation("global.dock.callingPanel.clear"),
		cancel: getTranslation("global.dock.callingPanel.cancel"),
		searching: getTranslation("global.dock.callingPanel.status.searching"),
		searchError: getTranslation("global.dock.callingPanel.status.searchError"),
		searchResults: getTranslation("global.dock.callingPanel.status.results"),
		callError: getTranslation("global.dock.callingPanel.status.callError")
	});
	
	const handleSearchContacts = () => {
		const name = searchField.name;
		if (name && name.length>0){
			//example: https://192.168.66.134/integration-app/api/externalSystem/zetron/lookup/searchContacts?name=dinesh
			const queryParam = `name=${name}`;
			setStatusInfo({ isSearching: true, errorMessage: "", message: translatedText.searching}); //Searching...
			setContactList([]);
			

			integrationService.getExternalSystemLookup("zetron", operationTypes.SEARCH_CONTACTS, function(err, response) {
				if (err) {
					setContactList([]);
					setStatusInfo({ 
						isSearching: false, 
						errorMessage: translatedText.searchError, // "Error occurred searching..."
						message: `0 ${translatedText.searchResults}` // 0 results
					}); 
					
				} else {
					if (response.results && !cancelSearch){
						const orderedResult = _.orderBy(response.results, ["name"], ["asc"]);
						setContactList(orderedResult);
						
						setStatusInfo({ 
							isSearching: false, 
							errorMessage: "",
							message: ` ${response.results.length} ${translatedText.searchResults}` // x results
						}); 
					}
					else if (!response.success){
						setContactList([]);
						
						setStatusInfo({ 
							isSearching: false, 
							errorMessage: translatedText.searchError,
							message: `0 ${translatedText.searchResults}`
						}); 
					} 
				}
			}, queryParam);
			
		}
	};

	const handleInitiateCall = (operationType, numberOrId) => {
		let contiueExecution = true;
		const dataToPost = {};
		setStatusInfo({ ...statusInfo, errorMessage : "" });

		switch (operationType) {
			case operationTypes.CALL_INDIVIDUAL:
				dataToPost.number = numberOrId;
				break;
			case operationTypes.CALL_TALKGROUP:
				dataToPost.talkgroupId = numberOrId;
				break;
			case operationTypes.CALL_RADIO:
				dataToPost.radioUnitId = numberOrId;
				break;
			default:
				contiueExecution = false;
				break;
		}

		if (contiueExecution && numberOrId){
			//post example: https://192.168.66.134/integration-app/api/externalSystem/zetron/resource/callIndividual
			integrationService.postExternalSystemResource("zetron", operationType, dataToPost, function(err, response) {
				//Note : At present we just fire and forget and incase of error display standard error message.
				if (err) {
					setStatusInfo({ ...statusInfo, errorMessage : translatedText.callError }); // "Error occurred initiating call"
				} else {
					if (response.error || !response.success){
						setStatusInfo({ ...statusInfo, errorMessage : translatedText.callError });
					}
				}
			});
		}
	};

	const handleTextChange = (event) => {
		if (event.target.value.length > 25) {
			setsearchField({
				name: event.target.value,
				error: "Enter characters less than 25"
			});
			return;
		}

		setsearchField({
			name: event.target.value,
			error: ""
		});
	};

	const handleClear = () => {
		setContactList([]);
		
		setStatusInfo({ 
			isSearching: false, 
			errorMessage: "",
			message: ""
		}); 
	};

	const handleCancel = () => {
		setCancelSearch(true);
		handleClear();
	};

	const getContactIcon = (contact) =>{
		
		return contact.isGroup ? <GroupSharp style={zetronStyles.resultIcon}/> : <PersonSharp style={zetronStyles.resultIcon}/>;
	};

	return (
		<div style={zetronStyles.zetronContainer}>
			{/* <h1 style={{fontFamily: "roboto", marginBottom: "15px", marginTop: "15px" }}><Translate value="global.dock.systemHealth.title"/></h1> */}
			<div style={zetronStyles.searchBoxLabel}>{translatedText.title}</div>
			
			<div style={dir === "rtl" ? zetronStyles.searchBoxContainerRTL: zetronStyles.searchBoxContainer}>
				
				<TextField id="search-name"
					style={inputStyle.field} textareaStyle={inputStyle.area}  multiLine={false} fullWidth={true}
					rows={1} underlineShow={false} value={searchField.name} onChange={handleTextChange}/>

				<div id="search-contact-button" style={dir === "rtl" ?  zetronStyles.searchContactButtonContainerRTL : zetronStyles.searchContactButtonContainer}>
					<Button variant="contained" color="primary" startIcon={<Search style={{width:24, height: 24, marginLeft:10}} />}
						disabled={searchField.name.trim() ? false : true}
						style={ searchField.name.trim() ? inputStyle.button : disabledStyle.button}
						buttonStyle={searchField.name.trim() ? inputStyle.buttonBorder : disabledStyle.buttonBorder}
						onClick={handleSearchContacts}
					></Button>
					
				</div>
			</div>
			
			<div style={zetronStyles.statusContainer}>
				<div className="b2-bright-gray" style={dir === "rtl" ? zetronStyles.statusContainerResultStatusRTL : zetronStyles.statusContainerResultStatus} >{statusInfo.message}</div>
				{(contactList.length> 0) && <div className="b2-bright-gray" style={zetronStyles.clearResult} onClick={handleClear}>{translatedText.clear}</div>}
				{(contactList.length < 1) && statusInfo.isSearching && <div className="b2-bright-gray" style={zetronStyles.cancelResult} onClick={handleCancel}>{translatedText.cancel}</div>}
			</div>

			{ (statusInfo.errorMessage.length > 2) && <div style={dir === "rtl" ? {color: "#ff0000", marginLeft: 10} : {color: "#ff0000"}}>{statusInfo.errorMessage}</div>}

			<div style={zetronStyles.resultContainer}>
				{
					contactList.map((contact, contactIndex) =>{
						return (
							<div key={contactIndex} className="b2-bright-gray" style={zetronStyles.resultContactContainer}
								onMouseEnter={() => setCallButtonVisibleId(contactIndex)}
								onMouseLeave={() => setCallButtonVisibleId("")}
							>
								<div style={zetronStyles.resultIconContainer}>{getContactIcon(contact)}</div>
								<div style={dir === "rtl" ? zetronStyles.resultContactInfoRTL : zetronStyles.resultContactInfo}>
									<div className="b1-bright-gray" style={zetronStyles.resultContactName}>{contact.name}</div>
									<div className="b2-dark-gray" style={zetronStyles.resultContactNo}>{contact.contactNo}</div>
								</div>
								<div style={{alignSelf:"center", marginTop:-4, marginLeft: (dir === "rtl" ? 5: 2), visibility: `${(callButtonVisibleId === contactIndex) ? "visible" : "hidden"}`}}>
									<Button variant="contained" color="primary" startIcon={<Phone style={dir === "rtl" ? {marginTop: -2, marginLeft: 10} : {marginTop: -2}} />}
										onClick={() => handleInitiateCall(contact.isGroup? operationTypes.CALL_TALKGROUP: operationTypes.CALL_INDIVIDUAL, contact.contactNo )}>
										{translatedText.call}
									</Button>
								</div>
							</div>
						);
					})
				}
			</div>
		</div>
	);
};

ZetronCallingPanel.propTypes = propTypes;
export default ZetronCallingPanel;