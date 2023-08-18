# New Window

The NewWindow component is a wrapper that allows you to render components in new browser windows.
Once the NewWindow component is rendered, it will generate a new browser window and utilize React portals to place all child elements into the new window. This newly generated window will inherit all CSS styling from the page that generated it.

## Usage

```
import { NewWindow } from "orion-components/CBComponents";

cleanUpWindowData = () => {
   this.setState({conditionalBool: false})
}

{conditionalBool && {
   <NewWindow
      id="window-one"
      title="I am a new window!"
      windowStyle="width=600,height=400,left=500,top=500"
      onWindowClose={this.cleanupWindowData}
   >
      <h1>I will be the content of a new window!</h1>
   </NewWindow>
}

```

## Options

-   `id` - ID of the window. Must be unique if using multiple windows.
-   `title` - The title of the browser window.
-   `windowStyle` - Specific styling used by the browser window for placement. Info about this can be found [here](https://developer.mozilla.org/en-US/docs/Web/API/Window/open#Position_and_size_features).
-   `onWindowClose` - A function that will be called with the component unmounts (due to conditional rendering) or when the users closes the window via the browser's close button. This will mainly be used to set the conditional rendering boolean to 'false' when the user closes the browser window (if opening via a button or similarly) or cleaning up.
