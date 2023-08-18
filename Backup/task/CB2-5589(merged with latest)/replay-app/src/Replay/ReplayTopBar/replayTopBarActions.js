import * as t from "./actionTypes";
export { toggleOpen } from "orion-components/Dock/actions";
export const openSettingsMenu = () => {
	return {
		type: t.SETTINGS_MENU_OPEN
	};
};
