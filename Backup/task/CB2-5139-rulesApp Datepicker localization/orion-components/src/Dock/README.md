[TOC]


## Dock

## Overview

Dock is a shared orion UI component encapsulating streaming notifications, news, and a dock for cameras.

## Structure

```
> Dock
	> Actions
        > index.js
    > Cameras
        > components
            > CameraDockModule.jsx
            > DockedCamera.jsx
            > DockedControls.jsx
        > actions.js
        > actionTypes.js
        > CameraDock.jsx
        > CameraDockContainer.js
        > reducer.js
    > middleware
        > optimistMiddleware.js
    > Notifications
        > components
            > DockItemTarget.jsx
            > NotificationItem.jsx
            > TimeNotificationGroup.jsx
        > actions.js
        > actionTypes.js
        > NotificationsTab.jsx
        > notificationsTabContainer.js
        > reducer.js
    > Reducers
        > index.js
    > shared
        > components
            > flyToTarget.js
            > newNotificationItem.jsx
            > TargetingLine.js
    > actions.js
    > actionTypes.js
    > customTheme.js
    > Dock.jsx
    > DockContainer.js
    > DockWrapper.jsx
    > index.js
    > reducer.js
    > readme.MD
```

## Usage

5 Easy steps to an Dock in your hot new Orion app:

1. npm install redux-optimist

2. Added the bundled reducers to your combineReducers, if you don't already have them, and
  wrap your appState combined-reducer in redux-optimist.

    == reducers/index.js ==
```
    /////
    /////
            import optimist from 'redux-optimist';
            import { combineReducers } from 'redux';
            import { default as dock } from "orion-components/Dock/Reducers";

            const rootReducer = optimist(combineReducers({
                appState: combineReducers({
                    dock,
                    ...otherAppStateReducersYouWantHere
                })
            }));

```


3. Add the optimist middleware to your redux store in your app's index: 

    == app-src/src/index.js ==
```
    ////    
    ////

    import {optimist} from 'orion-components/Dock';

    ////
    ////

    const store = createStore(rootReducer,
        composeWithDevTools(
            applyMiddleware(thunk, optimist)
        )
    );

    ////
    ///
```

4. Add the Dock to your certified Material Ui AppBar, in iconElementRight, next to AppMenu probably.

    == components/YourAppBar.jsx ==

```

            return (
                <div>
                    <AppBar
                        style={appBarStyles} 
                        title={title}
                        iconStyleLeft={{
                            marginTop: 0
                        }}
                        iconStyleRight={{
                            margin: 0
                        }}
                        titleStyle={{
                            lineHeight: "48px",
                            fontFamily: 'Roboto',
                            fontSize: '20px'
                        }}
                        onLeftIconButtonClick={onTouchTap}
                        iconElementRight={
                            <div className='appBarWrapperRight'>
                                <Dock />
                                <AppMenu
                                    user={user.profile}
                                    isHydrated={user.isHydrated}
                                    logOut={logOut} />
                            </div>
                        }
                    />
                </div>
                )
        
```
5. Link to the stylesheet from your index.scss:

    == index.scss == 
```
        ////
        ////
            @import 'node_modules/orion-components/scss/alert-sidebar.scss';

```

Done!

IMPORTANT NOTE: When using the TargetingLine with any component that is inside of an animated component (sidebar, drawer, modal, etc) you must pass down the 
renderTargetingLine and removeTargetingLine methods from DockWrapper. You CANNOT use TargetingLine as it will not work.

Note: the calls to stream notifications and dailybriefs are configurable. If you're manually doing things with notifications already, you can disable these requests by
passing shouldStreamNotifications and/or shouldStreamDailyBrief props as false (they default to true).