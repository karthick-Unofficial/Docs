import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { terminalService } from "client-app-core";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit"; // An addon for xterm.js that enables fitting the terminal's dimensions to a containing element.
//import "xterm/css/xterm.css"; // Its a default styles for xterm.js, just to make it working explictly copied content to scss/terminal-connector.scss

const propTypes = {
	ipAddress: PropTypes.string.isRequired,
	userId: PropTypes.string.isRequired
};

class TerminalConnector extends PureComponent {
	constructor(props) {
		super(props);
		const { ipAddress, userId } = this.props.params;

		this.state = { processId: "", logData: "", ipAddress: ipAddress, userId: userId };
		this.commandToSend = "";
	}

	componentDidMount() {
		/*Steps: 
		1) Create new Terminal Instance which can attach itseft to div element to display terminal message
		2) Get process id of new terminal object spawn at server and persist in state.
		3) Then subscribe to incoming data from terminal for given process id*/

		this.term = this.createNewTerminal(this.termElm);
		this.termElm = this.term;
		this.term.onData(this.sendData.bind(this));
		this.commandToSend = "";

		terminalService.createTerminalSession(this.state.userId, this.state.ipAddress, 0, 0, (err, response) => {
			if (err) { console.log(err); }
			if (!response) { return; }

			if (response) {
				const processIdTmp = response.pid;
				this.setState({ processId: processIdTmp });

				terminalService.subscribeTerminalIncomingData(processIdTmp, (errSub, responseSub) => {
					if (errSub) { console.log(errSub); }
					if (!responseSub) { return; }
					if (responseSub) {
						//console.log(responseSub);
						this.setState({ logData: responseSub.message ? responseSub.message : responseSub });
					}
				});
			}
		});
	}

	componentWillUnmount() {
		//close terminal instance for given process id.
		if (this.state.processId) {
			terminalService.closeTerminal(this.state.processId, (err, res) => {
				if (err) { console.log(err); }
				if (!res) { return; }
				if (res) {
					console.log(res.message);
				}
			});
		}
	}

	componentDidUpdate() {
		if (this.state.processId) {
			this.term.write(this.state.logData);
		}
	}

	createNewTerminal(termElm) {
		const termNew = new Terminal();
		const fitAddon = new FitAddon();

		termNew.setOption("cursorBlink", true);
		termNew.setOption("fontSize", 16);
		termNew.setOption("fontWeight", "normal");
		termNew.setOption("fontFamily", "Consolas");

		// Load Fit Addon
		termNew.loadAddon(fitAddon);

		// Open the terminal in Xterm component div i.e. terminal container.
		termNew.open(termElm); //term.open(document.getElementById("xterm"));

		// Make the terminal's size and geometry fit the size of Xterm component div i.e. terminal container.
		fitAddon.fit(); //todo: we should call fit() on resize of terminal div as well.

		return termNew;
	}

	sendCommand(processId, command) {
		terminalService.sendCommand(processId, command, (err, response) => {
			if (err) { console.log(err); }
			if (!response) { return; }

			if (response) {
				console.log(response.message);
			}
		});
	}

	sendData(data) {
		//console.log(data);
		const char = data;
		if (char === "\r") {
			//for enter character
			this.sendCommand(this.state.processId, this.commandToSend);
			this.commandToSend = "";
			this.term.writeln("");

		} else if (char.codePointAt(0) === 127) {
			//Ascii value for backspace character is 127
			this.commandToSend = this.commandToSend.substring(0, this.commandToSend.length - 1);
			this.term.write("\b \b");
		} else if (char.codePointAt(0) === 22) {
			//xterm is not allowing to paste using keyboard and instead display special character so use mouse to paste.
		} else {
			if (char && char !== undefined) {
				this.commandToSend += char;
			}
			this.term.write(char);
		}
	}

	render() {
		return (
			<div id="xterm"
				ref={ref => (this.termElm = ref)}
				style={{ margin: 10, backgroundColor: "#2c2d2f", height: window.innerHeight - 10, width: window.innerWidth - 10 }}
			/>
		);
	}
}

TerminalConnector.propTypes = propTypes;

export default TerminalConnector;