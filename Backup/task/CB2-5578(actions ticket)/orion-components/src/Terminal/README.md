[TOC]

## TerminalConnector

## Overview
TerminalConnector is a pseudo terminal control which provides users with fully-featured terminals(at present Linux) based on xterm.js.
Using TerminalConnector user can SSH to any server and troubleshoot the issues using commandline interface.

## Current use case:
In MPO app to troubleshoot robot sensor by connecting to robot ipaddress using SSH and executing command.

## Current Implementation
Contain 2 files: 
    a) Terminal/TerminalConnector.jsx: Its a terminal control which c2 react app can use it.
        https://github.com/xtermjs/xterm.js


    b) terminal-connector.scss: 
        It contain default styles used by xterm.js, i have copied as it is from node_modules/xterm/css.
        Copied because On transpile xterm.js was not able to get its default styles.

This terminal control under the hood connect to terminal-app service which internally spawn linux terminal and provide access to file and folders of server where terminal-app is deployed, therefore only admin user should be allowed to access this control.

## Current Issues:
a) Not prompting for login user name when we SSH only with IP Address. Therefore we need to SSH username@ipAddress.
b) It prompt for password but password are not hidden(or maked as asterisk) as user type in terminal.
b) Paste using keyboard (i.e. Ctrl+V) is not working but user can paste using mouse (right click + paste option) 
c) User can delete the content displayed(output) on terminal by pressing backspace key. 

## Usage
In order to use in any existing app we have to follow these 4 steps:

1)  In Index.js file: define seperate terminal route, below '/' route. 
    Note: Instead of poping up in modal dialog box which dont seems to be a good choice. We took an approach of opening in seperate window.
    This terminal control expect ipAddress and userId to be passed for the first time.
          
    example:
    import TerminalConnector from "orion-components/Terminal/TerminalConnector";
    
    render(
        ...
        <ErrorBoundary>
            <Route path="/"></Route>
			<Route exact path="/terminal/ipAddress/:ipAddress/userId/:userId" component={TerminalConnector} />
        </ErrorBoundary>
        ...
    )

2) In /index.scss file: import orion-component terminal-connector.scss
    example:
    @import 'node_modules/orion-components/scss/terminal-connector.scss';

3)  In scripts/start.js file : define terminal-app api proxy url at the end of proxy object:
    example:
    proxy: {
        ...
        ...
        "/terminal-app/api": {
            target: `https://${targetEnv}`,
            ignorePath: false,
            changeOrigin: true,
            secure: false
        }

    }

4) To open up terminal control in seperate window pls define function and call on click of any element (div, icon etc).
    example:
    
    import { Console } from "mdi-material-ui";

    const handleOpenTerminal = (ipAddr, sshUserId) => {
		if (ipAddr && sshUserId) {
			let optionalSettings = "location=no,scrollbars=yes,resizable=yes,top=200,left=200,width=1000,height=600";
			window.open(
                `/mpo-app/#/terminal/ipAddress/${ipAddr}/userId/${sshUserId}`, 
                "terminal",
                optionalSettings);
		}
	};

    return (
        <div
			onClick={() => handleOpenTerminal(ipAddress, sshUserId)}>
			<Console />
			<div style={{ margin: 5 }}>SSH</div>

		</div>
    )
