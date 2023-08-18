Authenticate is a wrapper for your entire app which will redirect to login if it doesn't find proper authentication. 
It assumes you have an "identity" reducer at the top level of your redux state that looks something like this:

identity: {
    isAuthenticated: localStorage.getItem('access_token'),
    token: localStorage.getItem('access_token'),
    userId: localStorage.getItem('userId')
}

Use it like this:

import requireAuthentication from 'orion-components/Authenticate';
const YourCoolAuthenticatedOrionApp = requireAuthentication(YourCoolOrionApp);