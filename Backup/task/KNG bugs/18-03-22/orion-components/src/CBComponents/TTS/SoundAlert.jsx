// import React, {Component} from "react";
// import sound from "../../audio/cow_moo.mp3";

// class SoundAlert extends Component {
// 	constructor(props) {
// 		super(props);

// 		this.state = {
// 			audio: new Audio(sound),
// 			currentlyPlaying: false
// 		};
// 	}

// 	componentDidMount() {
// 		const { audio } = this.state;

// 		audio.play();
// 	}

// 	play = () => {
// 		const { audio, currentlyPlaying } = this.state;
		
// 		// Do not allow overlapping audio
// 		if (currentlyPlaying) {
// 			return;
// 		}
        
// 		this.setState({ currentlyPlaying: true }, () => { 
// 			audio.play(); 
// 		});

// 		// Wait until audio has ended, then set state correctly and remove interval
// 		const interval = setInterval(() => {
// 			if (audio.ended && this.state.currentlyPlaying) {
// 				this.setState({currentlyPlaying: false}, () => {
// 					clearInterval(interval);
// 				});
// 			}
// 		}, 500);
// 	}

// 	render() {
// 		return(
// 			<React.Fragment />
// 		);
// 	}
// }

// export default SoundAlert;