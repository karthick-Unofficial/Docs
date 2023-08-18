import * as t from "./actionTypes";
export { logOut } from "orion-components/AppMenu";

export const openManager = () => {
	return {
		type: t.OPEN_MANAGER
	};
};
