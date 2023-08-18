[TOC]

## AppMenu

## Overview

AppMenu is a popover menu containing links to other apps, a user avatar/name, and a logout button. Because it is present in each app, it also wraps
the identity and user reducers.

## Structure

```
> AppMenu
	> reducers
	 	-- Dock (from orion-components)
	> utility
		> LayerSources
    > actions.js
    > actionTypes.js
    > AppMenu.jsx
    > AppMenuWrapper.jsx
```

## Usage

5 Easy steps to an AppMenu in your hot new Orion app:

1.  Added the bundled reducers to your combineReducers, if you don't already have them:

    == reducers/index.js ==

            import { user, identity } from 'orion-components/AppMenu';

            const rootReducer = combineReducers({
                user,
                identity,
                someOtherReducersYouPutHereProbably
            });

2.  Export the bundled actions from your actions index:

    == actions/index.js ==

            export { identityInvalidated, logOut, hydrateUser, hydrateUserSuccess } from 'orion-components/AppMenu';

3.  Hydrate the user state when your app loads. This can happen wherever you want, probably wherever you're
    doing the rest of your initial data fetching. Dispatch the hydrateUser action with the userId of
    the logged-in user, made available by the identity reducer from step one. Both of these would be passed
    in to the loading component by a container:

        == containers/AppContainer.js ==
                import { connect } from 'react-redux';
                import App from '../components/App';
                import * as actionCreators from '../actions/actionCreators';

                const mapStateToProps = (state) => {
                    return {
                        identity: state.identity,
                        // etc etc
                    }
                }

                function mapDispatchToProps(dispatch) {
                    return bindActionCreators(actionCreators, dispatch);
                }

                const AppContainer = connect(
                    mapStateToProps,
                    mapDispatchToProps
                )(App)

                export default AppContainer



        == components/App.jsx ==

                class App extends Component {
                    componentDidMount () {
                        this.props.hydrateUser(this.props.identity.userId);
                        // other data fetching
                    }
                }

4.  Add the AppMenu to your certified Material Ui AppBar, as iconElementRight. It will take three props, one of which is the logOut action
    we exported in step 2, the other two are pieces of the user state generated by the reducers we added in step 1.

        == components/YourAppBar.jsx ==

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
                                    // notification widget here probably
                                    <AppMenu
                                        user={user.profile}
                                        isHydrated={user.isHydrated}
                                        logOut={logOut} />
                                </div>
                            }
                        />
                    </div>
                    )

5.  Link to the stylesheet from your index.scss:

    == index.scss ==

            @import '../../node_modules/orion-components/scss/app-menu.scss';

Done!