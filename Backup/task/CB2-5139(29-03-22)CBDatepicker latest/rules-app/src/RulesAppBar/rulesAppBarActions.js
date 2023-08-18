export { logOut } from "orion-components/AppMenu";

import * as t from "../actionTypes";

export function toggleAppsMenu() {
	return {
		type: t.TOGGLE_APPS_MENU
	};
}