import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { terminalService } from "client-app-core";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit"; // An addon for xterm.js that enables fitting the terminal's dimensions to a containing element.
//import "xterm/css/xterm.css"; // Its a default styles for xterm.js, just to make it working explictly copied content to scss/terminal-connector.scss

const propTypes = {
	ipAddress: PropTypes.string.isRequired,
	userId: PropTypes.string.isRequired
};

const TerminalConnector = ({ params }) => {
	const { ipAddress, userId } = params;
	const [processId, setProcessId] = useState("");
	const [logData, setLogData] = useState("");
	const [ipAddressState, setIpAddressState] = useState(ipAddress);
	const [userIdState, setUserIdState] = useState(userId);
	const termElmRef = useRef(null);
	let commandToSend = "";
	let term, termElm;

	useEffect(() => {
		/*Steps: 
		1) Create new Terminal Instance which can attach itseft to div element to display terminal message
		2) Get process id of new terminal object spawn at server and persist in state.
		3) Then subscribe to incoming data from terminal for given process id*/
		term = createNewTerminal(termElm);
		termElm = term;
		term.onData(sendData);
		commandToSend = "";

		terminalService.createTerminalSession(userIdState, ipAddressState, 0, 0, (err, response) => {
			if (err) { console.log(err); }
			if (!response) { return; }

			if (response) {
				const processIdTmp = response.pid;
				setProcessId(processIdTmp);

				terminalService.subscribeTerminalIncomingData(processIdTmp, (errSub, responseSub) => {
					if (errSub) { console.log(errSub); }
					if (!responseSub) { return; }
					if (responseSub) {
						//console.log(responseSub);
						setLogData(responseSub.message ? responseSub.message : responseSub);
					}
				});
			}
		});

		return () => {
			//close terminal instance for given process id.
			if (processId) {
				terminalService.closeTerminal(processId, (err, res) => {
					if (err) { console.log(err); }
					if (!res) { return; }
					if (res) {
						console.log(res.message);
					}
				});
			}
		};
	}, []);

	useEffect(() => {
		if (processId) {
			term.write(logData);
		}
	}, [processId]);

	const createNewTerminal = (termElm) => {
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
	};

	const sendCommand = (processId, command) => {
		terminalService.sendCommand(processId, command, (err, response) => {
			if (err) { console.log(err); }
			if (!response) { return; }

			if (response) {
				console.log(response.message);
			}
		});
	};

	const sendData = (data) => {
		//console.log(data);
		const char = data;
		if (char === "\r") {
			//for enter character
			sendCommand(processId, commandToSend);
			commandToSend = "";
			term.writeln("");

		} else if (char.codePointAt(0) === 127) {
			//Ascii value for backspace character is 127
			commandToSend = commandToSend.substring(0, commandToSend.length - 1);
			term.write("\b \b");
		} else if (char.codePointAt(0) === 22) {
			//xterm is not allowing to paste using keyboard and instead display special character so use mouse to paste.
		} else {
			if (char && char !== undefined) {
				commandToSend += char;
			}
			term.write(char);
		}
	};

	return (
		<div id="xterm"
			ref={termElmRef}
			style={{ margin: 10, backgroundColor: "#2c2d2f", height: window.innerHeight - 10, width: window.innerWidth - 10 }}
		/>
	);
};

TerminalConnector.propTypes = propTypes;

export default TerminalConnector;