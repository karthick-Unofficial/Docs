import React, { Component } from "react";
import AudioAlert from "./AudioAlert";
// import SoundAlert from "./SoundAlert";
const synth = window.speechSynthesis;


class AudioAlertPlayer extends Component {
	constructor(props) {
		super(props);
        
		const voices = synth.getVoices();
		const voice = voices.filter(item => item.lang === "en-US");

		this.state = {
			voice: voice[0],
			initialLoaded: false,
			playedIds: []
		};
	}

	// Add alert to array of played ids
	setAlertPlayed = (id) => {
		const { playedIds } = this.state;

		this.setState({
			playedIds: [...playedIds, id]
		});
	}

	// Render fragment components for each alert that needs to be played
    playAlerts = (alerts, enabled) => {
    	const { isInitialBatch } = this.props;
    	const { initialLoaded } = this.state;
		
    	if (alerts.length) {

    		// Set initial alerts as played
    		if (!initialLoaded && isInitialBatch) {
    			const ids = alerts.map(item => item.id);

    			this.setState({
    				initialLoaded: true,
    				playedIds: ids
    			});
    		}
    		else {
    			// Alerts that have not been marked as played
    			const filteredAlerts = alerts.filter(item => !this.state.playedIds.includes(item.id));
				
    			// If audio alerts are not enabled, mark all incoming alerts as played
    			if (!enabled) {
    				filteredAlerts.forEach(item => {
    					this.setAlertPlayed(item.id);
    				});
    			}
    			// Otherwise, if alerts are to be played, play them
    			else if (filteredAlerts.length) {
    				return this.playVoice(filteredAlerts);
    			}
    		}
    	}
		
    	return null;
    }
	
	playVoice = (filteredAlerts) => {
		const { voice } = this.state;

		const alertText = filteredAlerts.map(alert => {
			let alertStr = "";
			if (alert.audioSettings) {
				if (alert.audioSettings.speakAlertText)
					alertStr += (alert.audioSettings.alertText ? alert.audioSettings.alertText : "Alert, Alert");
				if (alert.audioSettings.speakAlertNotification)
					alertStr += " " + alert.summary;
			} else {
				alertStr = "Alert, Alert " + alert.summary;
			}
			return {
				text: alertStr,
				id: alert.id 
			};
		});

		if (alertText.length) {
			const data = alertText.map(alert => {
				return <AudioAlert
					key={alert.id}
					text={alert.text}
					voice={voice}
					id={alert.id}
					setAlertPlayed={this.setAlertPlayed}
				/>;
			});
				
			return data;
		}
	}

	render() {
    	const { activeAlerts, tts } = this.props;
		
    	const alertsArr = Object.values(activeAlerts);
		
    	return(
    		<React.Fragment>
    			{this.playAlerts(alertsArr, tts.enabled)}
    		</React.Fragment>
    	);
	}
}

export default AudioAlertPlayer;