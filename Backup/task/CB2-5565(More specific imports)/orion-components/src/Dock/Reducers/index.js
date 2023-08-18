import { default as cameraDock } from "../Cameras/reducer";
import { default as dockData } from "../reducer";

import { combineReducers } from "redux";


const dock = combineReducers({ 
	cameraDock, 
	dockData 
});

export { default as notifications } from "../Notifications/reducer";
export default dock;