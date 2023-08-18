import * as t from "./actionTypes";
export { logOut } from "orion-components/AppMenu";

export const openSettingsMenu = () => {
	return {
		type: t.SETTINGS_MENU_OPEN
	};
};
