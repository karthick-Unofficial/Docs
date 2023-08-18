import React, {Component} from "react";
const synth = window.speechSynthesis;

class AudioAlert extends Component {
	constructor(props) {
		super(props);
        

		this.state = {
		};
	}
    
	componentDidMount() {
		const { text, id, voice, setAlertPlayed } = this.props;

		const audio = new SpeechSynthesisUtterance(text);
		audio.voice = voice;
        
		synth.speak(audio);

		// End handler
		audio.onend = () => {
			setAlertPlayed(id);
		};
	}

	render() {
		return(
			<React.Fragment/>
		);
	}
}

export default AudioAlert;