# New Window

The NewWindow component is a class that allows you to spawn new windows and communicate back and forth with them via messaging.

## Usage

The following code should be in the app you'd like to open the window from:

```
import { NewWindow } from "orion-components/NewWindow";

// Create a window and save the reference
const windowReference = new NewWindow({
        url: "https://cb2-dev.commandbridge.com/events-app",
        id: "my-new-window",
        data: {
            someKey: "Some data",
            someArray: [1, 2, 3]
        }
        properties: "width=600,height=600,left=0,top=0"
    });

// Listen for messages from the window
windowReference.listen(window, window.location.origin, (err, message) => {
    if (err) {
        // handle error
    }
    else {
        // handle message
        const data = message.payload;
    }
})

// Send a message to the window
windowReference.sendMessage("This is a message to send!", `${window.location.origin}/#/some-url`);
```

The following code should be used for the window you've opened:

```
// Wrapper usage
import React from "react";
import { NewWindowWrapper } from "orion-components/NewWindow";
import MyCoolWindowComponent from "./MyCoolWindowComponent";

const CoolWindow = () => {
	return (
		<NewWindowWrapper>
			<Spotlight />
		</NewWindowWrapper>
	);
};

export default CoolWindow;

// Inside of MyCoolWindowComponent
// The wrapped component will get two props: addMessageHandler and sendMessage

// Connect message handler
const messageHandler = (message) => {
    console.log("We received a message:", message);
};

useEffect(() => {
    addMessageHandler(messageHandler);
}, []);

// Send a message
sendMessage({stuff: "thing"});

// Utilize passed in data
console.log(window.cbProps.someKey);
console.log(window.cbProps.someArray);
```

## Options

When instantiating a new window, you must provide the constructor with a config object. This object consists of three properties:

-   `url` - The URL of the page you'd like to open in a new window.
-   `id` - The unique ID of your new window.
-   `data` - Data you'd like your new window to have access to.
-   `properties` - Specific styling used by the browser window for placement and sizing. Info about this can be found [here](https://developer.mozilla.org/en-US/docs/Web/API/Window/open#Position_and_size_features).

## Important Information

When sending and receiving messages, it is very important to ensure the messages are originating from a specific, trusted URI. This will ensure you do not receive any unwanted messages from malicious sites and prevents code-injection security vulnerabilities. More information can be found [here](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage#Security_concerns).
